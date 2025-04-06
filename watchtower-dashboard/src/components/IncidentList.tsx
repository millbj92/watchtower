import { Incident } from "../data/mockIncidents";

interface IncidentListProps {
  incidents: Incident[];
}

const IncidentList: React.FC<IncidentListProps> = ({ incidents }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow w-full">
      <h2 className="text-lg font-semibold mb-4">Incident List</h2>
      <ul className="space-y-4">
        {incidents.map((incident) => (
          <li key={incident.id} className="border-b pb-2">
            <p><strong>Type:</strong> {incident.type}</p>
            <p><strong>Location:</strong> {incident.location}</p>
            <p><strong>Description:</strong> {incident.description}</p>
            <p><strong>Timestamp:</strong> {incident.timestamp}</p>
            {incident.transaction_hash && (
              <p>
                <a
                  href={`https://sepolia.etherscan.io/tx/${incident.transaction_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View on Etherscan
                </a>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncidentList;