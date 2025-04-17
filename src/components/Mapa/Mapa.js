'use client';
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMeso } from "@/context/MesoContext";
import L from "leaflet";

const FitBounds = ({ geojson }) => {
  const map = useMap();
  useEffect(() => {
    if (!geojson || geojson.features.length === 0) return;
    const layer = L.geoJSON(geojson);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [geojson, map]);
  return null;
};

const Mapa = () => {
  const {
    selectedMesoNome,
    setSelectedMesoNome,
    setSelectedMesoId,
  } = useMeso();
  const [originalMeso, setOriginalMeso] = useState(null);
  const [microrregioes, setMicrorregioes] = useState(null);
  const [filteredMicros, setFilteredMicros] = useState(null);

  useEffect(() => {
    fetch("/mesorregioes_para.geojson")
      .then((res) => res.json())
      .then(setOriginalMeso)
      .catch((err) => console.error("Erro ao carregar mesorregiões:", err));
  }, []);

  useEffect(() => {
    fetch("/microrregioes_para_cleaned.geojson")
      .then((res) => res.json())
      .then(setMicrorregioes)
      .catch((err) => console.error("Erro ao carregar microrregiões:", err));
  }, []);

  useEffect(() => {
    if (microrregioes && selectedMesoNome) {
      const microsFiltradas = {
        type: "FeatureCollection",
        features: microrregioes.features.filter((f) =>
          f.properties.NM_MESO?.trim().toUpperCase() === selectedMesoNome.trim().toUpperCase()
        ),
      };
      setFilteredMicros(microsFiltradas);
    } else {
      setFilteredMicros({ type: "FeatureCollection", features: [] });
    }
  }, [microrregioes, selectedMesoNome]);

  const onEachFeature = (feature, layer) => {
    const mesoName = feature.properties.NM_MESO;
    layer.on({
      click: () => {
        console.log("Mesorregião clicada:", mesoName);
        setSelectedMesoNome(mesoName);

        fetch("/api/regioes")
          .then(res => res.json())
          .then(data => {
            const selected = data.meso?.find(m => m.nome.trim().toUpperCase() === mesoName.trim().toUpperCase());
            if (selected) setSelectedMesoId(selected.id.toString());
          });
      },
    });
    layer.bindTooltip(mesoName, { sticky: true });
  };

  const getFeatureStyle = (feature) => {
    const mesoName = feature.properties.NM_MESO.trim().toUpperCase();
    const isSelected = selectedMesoNome?.trim().toUpperCase() === mesoName;
    return {
      color: isSelected ? "green" : "blue",
      weight: isSelected ? 3 : 2,
      fillOpacity: 0.1,
    };
  };

  const getMicroStyle = () => ({
    color: "purple",
    weight: 2,
    fillOpacity: 0.4,
  });

  return (
    <MapContainer
      center={[-3.4168, -52.1472]}
      zoom={6}
      className="h-full w-full z-0"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {originalMeso && (
        <GeoJSON
          key={`meso-${selectedMesoNome}`}
          data={originalMeso}
          style={getFeatureStyle}
          onEachFeature={onEachFeature}
        />
      )}

      {filteredMicros?.features.length > 0 && (
        <>
          <GeoJSON
            key={`micro-${Date.now()}`}
            data={filteredMicros}
            style={getMicroStyle}
          />
          <FitBounds geojson={filteredMicros} />
        </>
      )}
    </MapContainer>
  );
};

export default Mapa;
