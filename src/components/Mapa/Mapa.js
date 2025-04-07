'use client';
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Mapa = () => {
  const [zoomLevel, setZoomLevel] = useState(null);
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setZoomLevel(isMobile ? 5 : 6);

    fetch("/brazil-states.geojson")
      .then((res) => res.json())
      .then((data) => {
        const paraFeature = data.features.find(
          (feature) =>
            feature.properties.name?.toLowerCase() === "pará" ||
            feature.properties.sigla === "PA"
        );

        if (paraFeature) {
          setGeoData({
            type: "FeatureCollection",
            features: [paraFeature],
          });
        }
      })
      .catch((err) => console.error("Erro ao carregar GeoJSON:", err));
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
        {geoData && (
          <GeoJSON
            data={geoData}
            style={() => ({
              color: "green",
              weight: 3,
              fillOpacity: 0.2,
            })}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Mapa;
