-- Suponha que a mesorregião padrão tenha o ID 1
ALTER TABLE "Micro" ADD COLUMN "mesoId" INTEGER NOT NULL DEFAULT 1;

-- Agora, remova o valor padrão
ALTER TABLE "Micro" ALTER COLUMN "mesoId" DROP DEFAULT;
