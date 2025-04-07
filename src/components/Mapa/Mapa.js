"use client";
import { MapContainer, TileLayer } from "react-leaflet";

const Mapa = () => {
  return (
    <div className="h-full w-full">
      <MapContainer center={[-3.4168, -52.1472]} zoom={6} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default Mapa;
