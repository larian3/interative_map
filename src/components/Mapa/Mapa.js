'use client';
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Mapa = () => {
  const [zoomLevel, setZoomLevel] = useState(null);
  const [geo, setGeo] = useState({});

  useEffect(() => {
    setZoomLevel(window.innerWidth < 768 ? 5 : 6);

    const files = [
      { key: "para", path: "/brazil-states.geojson", filter: (f) => f.properties.sigla === "PA" },
      { key: "meso", path: "/mesorregioes_para.geojson" },
      { key: "micro", path: "/microrregioes_para.geojson" },
    ];

    files.forEach(({ key, path, filter }) => {
      fetch(path)
        .then((res) => res.json())
        .then((data) => {
          const features = filter ? data.features.filter(filter) : data.features;
          setGeo((prev) => ({
            ...prev,
            [key]: { type: "FeatureCollection", features },
          }));
        })
        .catch((err) => console.error(`Erro ao carregar ${key}:`, err));
    });
  }, []);

  if (zoomLevel === null) return null;

  return (
    <div className="h-full w-full">
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
          <GeoJSON
            data={geo.para}
            style={{ color: "green", weight: 3, fillOpacity: 0.2 }}
          />
        )}

        {geo.meso && (
          <GeoJSON
            data={geo.meso}
            style={{ color: "blue", weight: 2, fillOpacity: 0 }}
            onEachFeature={(f, l) => l.bindPopup(`<strong>Mesorregião:</strong> ${f.properties?.NM_RGIM}`)}
          />
        )}

        {geo.micro && (
          <GeoJSON
            data={geo.micro}
            style={{ color: "orange", weight: 1.5, dashArray: "4", fillOpacity: 0 }}
            onEachFeature={(f, l) => l.bindPopup(`<strong>Microrregião:</strong> ${f.properties?.NM_MICRO}`)}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Mapa;
