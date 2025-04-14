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
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [0, 0] });
    }
  }, [geojson, map]);

  return null;
};

const Mapa = () => {
  const { selectedMesoNome, setSelectedMesoNome } = useMeso();
  const [originalMeso, setOriginalMeso] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(
    window.innerWidth < 768 ? 5 : 6 
  );

  useEffect(() => {
    const handleResize = () => {
      setZoomLevel(window.innerWidth < 768 ? 5 : 6);
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch("/mesorregioes_para.geojson")
      .then((res) => res.json())
      .then((data) => setOriginalMeso(data))
      .catch((err) => console.error("Erro ao carregar mesorregiões:", err));
  }, []);

  const onEachFeature = (feature, layer) => {
    const mesoName = feature.properties.NM_MESO;
    layer.on({
      click: () => {
        setSelectedMesoNome(mesoName);
      },
    });
    layer.bindTooltip(mesoName, { sticky: true });
  };

  const getFeatureStyle = (feature) => {
    const mesoName = feature.properties.NM_MESO.trim().toUpperCase();
    const isSelected =
      selectedMesoNome &&
      mesoName === selectedMesoNome.trim().toUpperCase();

    return {
      color: isSelected ? "green" : "blue",
      weight: isSelected ? 3 : 2,
      fillOpacity: isSelected ? 0.1 : 0.1,
    };
  };

  const selectedFeatureGeoJSON =
    originalMeso && selectedMesoNome
      ? {
          type: "FeatureCollection",
          features: originalMeso.features.filter(
            (f) =>
              f.properties.NM_MESO.trim().toUpperCase() ===
              selectedMesoNome.trim().toUpperCase()
          ),
        }
      : null;

  return (
    <MapContainer
      center={[-3.4168, -52.1472]}
      zoom={zoomLevel}
      className="h-full w-full z-0"
      scrollWheelZoom={true} 
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {originalMeso && (
        <>
          <GeoJSON
            data={originalMeso}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
          {selectedFeatureGeoJSON && <FitBounds geojson={selectedFeatureGeoJSON} />}
        </>
      )}
    </MapContainer>
  );
};

export default Mapa;
