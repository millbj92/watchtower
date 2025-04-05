"use client";

declare global {
  interface Window {
    ethereum?: any;
  }
}

import { ChangeEvent, FormEvent, useState } from "react";
import { supabase } from "../lib/supabase";
import { Incident } from "../data/mockIncidents";
import { ethers, keccak256 } from "ethers";
import WatchtowerLoggerABI from "../../../blockchain/artifacts/contracts/WatchtowerLogger-abi.json";
import WatchtowerLoggerAddress from "../../../blockchain/artifacts/contracts/WatchtowerLogger-address.json";

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
      // Log the incident to the blockchain
      const provider = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        WatchtowerLoggerAddress.address,
        WatchtowerLoggerABI,
        await signer
      );
      const incidentHash = keccak256(
        ethers.toUtf8Bytes(
          `${formData.reporter}${formData.type}${new Date().toISOString()}`
        )
      );

      const tx = await contract.logIncident(
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
            reporter: formData.reporter,
            incident_type: formData.type,
            location: formData.location,
            description: formData.description,
            latitude: Math.random() * 10 + 30, // Mock latitude
            longitude: Math.random() * -10 - 90, // Mock longitude
            timestamp: new Date().toISOString(),
            transaction_hash: tx.hash,
          },
        ])
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        addIncident(data[0]);
        setFormData({ reporter: "", type: "", location: "", description: "" });
      }
    } catch (err: any) {
      setError(err.message);
      setTxStatus("Transaction failed.");
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
            href={`https://basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View on BaseScan
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
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        className="border rounded p-2"
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
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default IncidentForm;
