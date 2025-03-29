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
    return handleErrorResponse(res, error, "Error en la API de usuarios");
  }
}

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { processId, usersId } = req.body as {
    processId: string;
    usersId: string[];
  };

  const promises = usersId.map((userId) =>
    prisma.processUsers.upsert({
      where: {
        processId_userId: {
          processId,
          userId,
        },
      },
      update: {}, // No se actualiza nada si ya existe
      create: {
        processId,
        userId,
      },
    })
  );

  await Promise.all(promises);
  return res.status(200).json({ success: true });
};

const handleDeleteRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { processId, userId } = req.body as {
    processId: string;
    userId: string;
  };

  const deleted = await prisma.processUsers.delete({
    where: {
      processId_userId: { processId, userId },
    },
  });
  return res.status(200).json(deleted);
};
