export type Incident = {
  id: string;
  incident_type: string;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  transaction_hash?: string; // Optional field for transaction hash
};

export type IncidentLocation = {
    address: string;
    latitude: number;
    longitude: number;
}

const mockIncidents: Incident[] = [
  {
    id: "1",
    incident_type: "Equipment Failure",
    location: "Atlanta, GA",
    description: "Voting machine malfunctioned.",
    latitude: 33.749,
    longitude: -84.388,
    timestamp: "2025-04-05T10:00:00Z",
  },
  {
    id: "2",
    incident_type: "Voter Intimidation",
    location: "Detroit, MI",
    description: "Aggressive behavior near polling station.",
    latitude: 42.331,
    longitude: -83.045,
    timestamp: "2025-04-05T11:00:00Z",
  },
  {
    id: "3",
    incident_type: "Long Wait Times",
    location: "Phoenix, AZ",
    description: "Wait times exceeded 2 hours.",
    latitude: 33.448,
    longitude: -112.074,
    timestamp: "2025-04-05T12:00:00Z",
  },
];

export default mockIncidents;