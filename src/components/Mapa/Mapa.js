'use client';
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMeso } from "@/context/MesoContext";

const Mapa = () => {
  const { selectedMesoNome } = useMeso(); 
  const [geo, setGeo] = useState({ para: null, meso: null }); 
  const [zoomLevel, setZoomLevel] = useState(null);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    setZoomLevel(window.innerWidth < 768 ? 5 : 6);

    fetch("/brazil-states.geojson")
      .then((res) => res.json())
      .then((data) => {
        const features = data.features.filter((f) => f.properties.sigla === "PA");
        setGeo((prev) => ({
          ...prev,
          para: { type: "FeatureCollection", features },
        }));
      })
      .catch((err) => console.error("Erro ao carregar estado do Pará:", err));
  }, []);

  useEffect(() => {
    if (!selectedMesoNome) return;

    console.log("Mesorregião selecionada:", selectedMesoNome);

    fetch("/mesorregioes_para.geojson")
      .then((res) => res.json())
      .then((data) => {
        const features = data.features.filter(
          (f) => f.properties.NM_MESO.trim().toUpperCase() === selectedMesoNome.trim().toUpperCase()
        );
        setGeo((prev) => ({
          para: null,
          meso: { type: "FeatureCollection", features },
        }));
        setRenderKey((prev) => prev + 1);
      })
      .catch((err) => console.error("Erro ao carregar mesorregião:", err));
  }, [selectedMesoNome]);

  if (zoomLevel === null) return null;

  return (
    <MapContainer
      key={renderKey}
      center={[-3.4168, -52.1472]}
      zoom={zoomLevel}
      className="h-full w-full z-0"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {geo.para && (
        <GeoJSON
          data={geo.para}
          style={{ color: "green", weight: 3, fillOpacity: 0.2 }}
        />
      )}
      
      {geo.meso && (
        <GeoJSON
          data={geo.meso}
          style={{ color: "blue", weight: 2, fillOpacity: 0.2 }}
        />
      )}
    </MapContainer>
  );
};

export default Mapa;
