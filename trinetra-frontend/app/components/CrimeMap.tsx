"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic import for leaflet to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false });

export default function CrimeMap() {
  const [firs, setFirs] = useState<any[]>([]);
  const [hotspots, setHotspots] = useState<any[]>([]);

  useEffect(() => {
    // Fix Leaflet marker icons not showing up due to Next.js image loading
    // @ts-ignore
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    });

    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/firs`)
      .then((res) => res.json())
      .then((data) => setFirs(data));
      
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/hotspots`)
      .then((res) => res.json())
      .then((data) => setHotspots(data.hotspots));
  }, []);

  // Bengaluru center
  const center: [number, number] = [12.9716, 77.5946];

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "0.5rem", overflow: "hidden", border: "1px solid #374151" }}>
      <MapContainer center={center} zoom={11} style={{ height: "100%", width: "100%", background: "#111827" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {firs.map((fir) => (
          <Marker key={fir.id} position={[fir.lat, fir.lng]}>
            <Popup>
              <div className="text-gray-900 font-sans">
                <strong className="block text-red-600">{fir.crime_type}</strong>
                <span className="text-xs text-gray-500">{fir.date}</span>
                <p className="text-sm mt-1">{fir.description}</p>
                <div className="mt-2 text-xs font-mono bg-gray-100 p-1 rounded">{fir.fir_number}</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {hotspots.map((hs, idx) => (
          <Circle
            key={`hs-${idx}`}
            center={[hs.lat, hs.lng]}
            radius={hs.intensity * 100}
            pathOptions={{ color: 'red', fillColor: '#ef4444', fillOpacity: 0.4 }}
          >
            <Popup>
              <div className="text-gray-900">
                <strong>Predicted Hotspot</strong>
                <p>Primary Crime: {hs.primary_crime}</p>
                <p>Intensity: {hs.intensity} incidents</p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}
