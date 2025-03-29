import { handleErrorResponse } from "@/utils/handleErrorResponse";
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

// Inicializa la instancia de Prisma.
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        return await handlePostRequest(req, res);
      case "DELETE":
        return await handleDeleteRequest(req, res);
      default:
        res.setHeader("Allow", ["POST", "DELETE"]);
        return res
          .status(405)
          .json({ error: `Método ${req.method} no permitido` });
    }
  } catch (error) {
    return handleErrorResponse(res, error, "Error en la API de productos");
  }
}

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { processId, productsId } = req.body as {
    processId: string;
    productsId: string[];
  };

  const promises = productsId.map((productId) =>
    prisma.processProducts.upsert({
      where: {
        processId_productId: {
          processId,
          productId,
        },
      },
      update: {}, // No se actualiza nada si ya existe
      create: {
        processId,
        productId,
      },
    })
  );

  await Promise.all(promises);
  return res.status(200).json({ success: true });
};

const handleDeleteRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { processId, productId } = req.body as {
    processId: string;
    productId: string;
  };

  const deleted = await prisma.processProducts.delete({
    where: {
      processId_productId: { processId, productId },
    },
  });
  return res.status(200).json(deleted);
};
