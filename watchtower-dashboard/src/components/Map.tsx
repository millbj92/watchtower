"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Import leaflet icon images
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for Leaflet's default icon paths
if (typeof window !== "undefined") {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x.src,
    iconUrl: markerIcon.src,
    shadowUrl: markerShadow.src,
  });
}

const DynamicMapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const DynamicTileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const DynamicMarker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const DynamicPopup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

import { Incident } from "../data/mockIncidents";

interface MapProps {
  incidents: Incident[];
}

const Map: React.FC<MapProps> = ({ incidents }) => {
  const center: [number, number] = [37.0902, -95.7129]; // Centered on the US

  return (
    <DynamicMapContainer
      center={center}
      zoom={4}
      className="h-96 w-full rounded-xl shadow"
      id="map-container"
    >
      <DynamicTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {incidents.map((incident) => (
        <DynamicMarker
          key={incident.id}
          position={[incident.latitude, incident.longitude]}
        >
          <DynamicPopup>
            <strong>{incident.incident_type}</strong>
            <p>{incident.location}</p>
            <p>{incident.description}</p>
          </DynamicPopup>
        </DynamicMarker>
      ))}
    </DynamicMapContainer>
  );
};

export default Map;