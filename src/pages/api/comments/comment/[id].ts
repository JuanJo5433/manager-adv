import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { Comments } from '@/utils/types/types';



interface ErrorResponse {
  success: boolean;
  message: string;
}

interface PrismaError extends Error {
  code?: string;
  meta?: {
    target?: string[];
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Comments | ErrorResponse>
) {
  try {
    switch (req.method) {
      case 'GET':
        await handleGetRequest(req, res);
        break;

      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).json({
          success: false,
          message: `Método ${req.method} no permitido`,
        });
    }
  } catch (error) {
    handlePrismaError(res, error, 'Error en el endpoint de comentarios');
  }
}

const handleGetRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<Comments | ErrorResponse>
) => {
  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de comentario inválido',
      });
    }

    const comment = await prisma.comments.findUnique({
      where: { id: id   },
      
     
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado',
      });
    }

    res.status(200).json(comment);
  } catch (error) {
    handlePrismaError(res, error, 'Error obteniendo el comentario');
  }
};

const handlePrismaError = (
  res: NextApiResponse<ErrorResponse>,
  error: unknown,
  context: string
) => {
  const err = error as PrismaError;
  console.error(`${context}:`, err.message, err.stack);

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: `${context}: Recurso no encontrado`,
    });
  }

  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'campo único';
    return res.status(409).json({
      success: false,
      message: `${context}: Conflicto en ${field}`,
    });
  }

  res.status(500).json({
    success: false,
    message: `${context}: ${err.message || 'Error desconocido'}`,
  });
};
