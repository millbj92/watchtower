"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Incident, IncidentLocation } from "../data/mockIncidents";
import { ethers, keccak256 } from "ethers";
import { SearchBox } from "@mapbox/search-js-react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}
interface IncidentFormProps {
  addIncident: (incident: Incident) => void;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ addIncident }) => {
  const [formData, setFormData] = useState({
    reporter: "",
    type: "",
    location: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [location, setLocation] = useState<IncidentLocation | null>(null);

  useEffect(() => {
    const initProvider = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          // Initialize the provider
          const tmpProvider = new ethers.BrowserProvider(window.ethereum);

          // Request accounts and get the signer
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const tmpSigner = await tmpProvider.getSigner();

          // Fetch the ABI and contract address
          const abiResponse = await fetch("/WatchtowerLogger-abi.json");
          const WatchtowerLoggerABI = await abiResponse.json();
          const WatchtowerLoggerAddress =
            process.env.NEXT_PUBLIC_WATCHTOWER_CONTRACT_ADDRESS;

          if (!WatchtowerLoggerAddress) {
            throw new Error("Watchtower contract address not found.");
          }

          // Initialize the contract
          const tmpContract = new ethers.Contract(
            WatchtowerLoggerAddress,
            WatchtowerLoggerABI,
            tmpSigner
          );
          setContract(tmpContract);
        } catch (err) {
          console.error("Error initializing provider:", err);
        }
      }
    };

    initProvider();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTxStatus("Submitting to blockchain...");

    try {
        const { reporter, type, description } = formData;
        const date = new Date().toISOString();
        if (!reporter || !type || !description || !location) {
            setError("Please fill in all fields and select a location.");
            return;
            }
      // Log the incident to the blockchain
      const incidentHash = keccak256(
        ethers.toUtf8Bytes(
          `${reporter}${type}${description}${location.address}${location.latitude}${location.longitude}${date}`
        )
      );

      const tx = await contract?.logIncident(
        incidentHash,
        Math.floor(Date.now() / 1000)
      );
      setTxHash(tx.hash);
      setTxStatus("Transaction pending...");

      await tx.wait();

      setTxStatus("Transaction confirmed!");

      // Insert the incident into Supabase after successful transaction
      const { data, error } = await supabase
        .from("incidents")
        .insert([
          {
            reporter: reporter,
            incident_type: type,
            location: location.address,
            description: description,
            latitude: location.latitude, // Mock latitude
            longitude: location.longitude, // Mock longitude
            timestamp: date,
            transaction_hash: tx.hash,
          },
        ])
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        addIncident(data[0]);
        setFormData({ reporter: "", type: "", location: "", description: "" });
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);

      setTxStatus("Transaction failed.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 bg-white p-4 rounded-xl shadow w-full"
    >
      {error && <p className="text-red-500">Error: {error}</p>}
      {txStatus && <p className="text-blue-500">{txStatus}</p>}
      {txHash && (
        <p>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View on Etherscan
          </a>
        </p>
      )}
      <input
        type="text"
        name="reporter"
        placeholder="Reporter Name"
        value={formData.reporter}
        onChange={handleChange}
        className="border rounded p-2"
      />
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="border rounded p-2"
      >
        <option value="">Select Incident Type</option>
        <option value="Equipment Failure">Equipment Failure</option>
        <option value="Voter Intimidation">Voter Intimidation</option>
        <option value="Long Wait Times">Long Wait Times</option>
      </select>
      {/* @ts-expect-error Searchbox gives a TS error but works.*/}
      <SearchBox
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN!}
        placeholder="Search for location"
        onRetrieve={(res) => {
          const coords = res.features?.[0]?.geometry?.coordinates;
          const placeName = res.features?.[0]?.properties.address;
          setLocation({
            address: placeName,
            latitude: coords[1],
            longitude: coords[0],
          });
        }}
        value={location?.address}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="border rounded p-2"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
        disabled={loading || location === null}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default IncidentForm;
