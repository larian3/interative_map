import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mesoId = searchParams.get("mesoId");

    const mesoRegioes = await prisma.meso.findMany({
      select: {
        id: true,
        nome: true,
      },
    });

    let microRegioes = [];

    if (mesoId) {
      microRegioes = await prisma.micro.findMany({
        where: { mesoId: Number(mesoId) },
        select: {
          id: true,
          nome: true,
        },
      });
    }

    return Response.json({ meso: mesoRegioes, micro: microRegioes });
  } catch (error) {
    console.error("Erro ao buscar regiões:", error);
    return new Response(JSON.stringify({ error: "Erro no servidor" }), {
      status: 500,
    });
  }
}
