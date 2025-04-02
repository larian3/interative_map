/*
  Warnings:

  - You are about to drop the `Regiao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Regiao";

-- CreateTable
CREATE TABLE "Meso" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Meso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Micro" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Micro_pkey" PRIMARY KEY ("id")
);
