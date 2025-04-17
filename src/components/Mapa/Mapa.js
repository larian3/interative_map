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
  const { selectedMesoNome, setSelectedMesoNome } = useMeso(); 
  const [originalMeso, setOriginalMeso] = useState(null);
  const [microrregioes, setMicrorregioes] = useState(null);
  const [filteredMicros, setFilteredMicros] = useState(null);

  useEffect(() => {
    fetch("/mesorregioes_para.geojson")
      .then((res) => res.json())
      .then((data) => setOriginalMeso(data))
      .catch((err) => console.error("Erro ao carregar mesorregiões:", err));
  }, []);

  useEffect(() => {
    fetch("/microrregioes_para_cleaned.geojson")
      .then((res) => res.json())
      .then((data) => setMicrorregioes(data))
      .catch((err) => console.error("Erro ao carregar microrregiões:", err));
  }, []);

  useEffect(() => {
    if (microrregioes && selectedMesoNome) {
      const microsFiltradas = {
        type: "FeatureCollection",
        features: microrregioes.features.filter((f) => {
          const microrregiaoMeso = f.properties.NM_MESO?.trim().toUpperCase();
          const mesoSelecionada = selectedMesoNome.trim().toUpperCase();
          return microrregiaoMeso === mesoSelecionada;
        }),
      };
      console.log("Microrregiões filtradas:", microsFiltradas); 
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
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {originalMeso && (
        <GeoJSON
          key={`meso-layer-${selectedMesoNome}`}
          data={originalMeso}
          style={getFeatureStyle}
          onEachFeature={onEachFeature}
        />
      )}

      {filteredMicros && filteredMicros.features.length > 0 && (
        <>
          <GeoJSON
            key={`micro-layer-${selectedMesoNome}-${Date.now()}`}
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
