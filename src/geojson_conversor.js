const fs = require("fs");

// Carregar o arquivo GeoJSON das microrregiões
const microrregioesPath = "./public/microrregioes_para_updated.geojson"; // Atualize o caminho correto
const microrregioesGeoJSON = JSON.parse(fs.readFileSync(microrregioesPath, "utf8"));

// Remover o prefixo "MESORREGIÃO DO" de NM_MESO
microrregioesGeoJSON.features.forEach((feature) => {
  let mesoName = feature.properties.NM_MESO;
  if (mesoName.startsWith("MESORREGIÃO DO ")) {
    feature.properties.NM_MESO = mesoName.replace("MESORREGIÃO DO ", "").trim();
  } else if (mesoName.startsWith("MESORREGIÃO DE ")) {
    feature.properties.NM_MESO = mesoName.replace("MESORREGIÃO DE ", "").trim();
  }
});

// Salvar o arquivo GeoJSON atualizado
const updatedPath = "./public/microrregioes_para_cleaned.geojson"; // Nome do novo arquivo
fs.writeFileSync(updatedPath, JSON.stringify(microrregioesGeoJSON, null, 2), "utf8");

console.log(`Arquivo atualizado salvo em: ${updatedPath}`);
