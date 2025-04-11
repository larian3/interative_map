'use client';
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMeso } from "@/context/MesoContext";
import L from "leaflet";

const FitBounds = ({ geojson }) => {
  const map = useMap();

  useEffect(() => {
    if (!geojson) return;

    const layer = L.geoJSON(geojson);
    const bounds = layer.getBounds();
    const isMobile = window.innerWidth > 768;
    map.fitBounds(bounds, { padding: [0, 0] });
  }, [geojson, map]);

  return null;
};

const FitBoundsPara = ({ geojson }) => {
  const map = useMap();

  useEffect(() => {
    if (!geojson) return;

    const layer = L.geoJSON(geojson);
    const bounds = layer.getBounds();
    const isMobile = window.innerWidth < 768;

    map.fitBounds(bounds, {
      padding: isMobile ? [0, 0] : [0, 0],
    });
  }, [geojson, map]);

  return null;
};

const Mapa = () => {
  const { selectedMesoNome } = useMeso();
  const [geo, setGeo] = useState({ para: null, meso: null });
  const [zoomLevel, setZoomLevel] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      setZoomLevel(window.innerWidth < 768 ? 5 : 6);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
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

    fetch("/mesorregioes_para.geojson")
      .then((res) => res.json())
      .then((data) => {
        const features = data.features.filter(
          (f) =>
            f.properties.NM_MESO.trim().toUpperCase() ===
            selectedMesoNome.trim().toUpperCase()
        );
        setGeo((prev) => ({
          para: null,
          meso: { type: "FeatureCollection", features },
        }));
      })
      .catch((err) => console.error("Erro ao carregar mesorregião:", err));
  }, [selectedMesoNome]);

  return (
    <MapContainer
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
        <>
          <GeoJSON
            data={geo.para}
            style={{ color: "green", weight: 3, fillOpacity: 0.2 }}
          />
          <FitBoundsPara geojson={geo.para} />
        </>
      )}

      {geo.meso && (
        <>
          <GeoJSON
            key={JSON.stringify(geo.meso)}
            data={geo.meso}
            style={() => ({
              color: "blue",
              weight: 2,
              fillOpacity: 0.2,
            })}
            onEachFeature={(_, layer) => {
              layer.setStyle({ color: "blue", weight: 2, fillOpacity: 0.2 });
              layer.bringToFront();
            }}
          />
          <FitBounds geojson={geo.meso} />
        </>
      )}
    </MapContainer>
  );
};

export default Mapa;
