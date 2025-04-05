"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Map from "../components/Map";
import IncidentForm from "../components/IncidentForm";
import IncidentList from "../components/IncidentList";
import { Incident } from "../data/mockIncidents";

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from("incidents").select("*");
        if (error) throw error;
        setIncidents(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const addIncident = (newIncident: Incident) => {
    setIncidents((prev) => [...prev, newIncident]);
  };

  return (
    <div className="flex flex-col items-center p-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">🗳️ Watchtower: Election Incident Monitor</h1>
      <div className="bg-gray-100 p-4 rounded-xl shadow w-full text-center">
        <p className="text-lg font-semibold">Total Incidents: {incidents.length}</p>
      </div>
      {loading && <p>Loading incidents...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <>
          <Map incidents={incidents} />
          <IncidentForm addIncident={addIncident} />
          <IncidentList incidents={incidents} />
        </>
      )}
    </div>
  );
}
