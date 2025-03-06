import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

interface Comment {
  id?: number;
  text: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  // Agrega más propiedades según tu modelo
}

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
  res: NextApiResponse<Comment | ErrorResponse>
) {
  try {
    switch (req.method) {
      case 'POST':
        await handlePostRequest(req, res);
        break;

      default:
        res.setHeader('Allow', ['POST']);
        res.status(405).json({
          success: false,
          message: `Method ${req.method} Not Allowed`
        });
    }
  } catch (error) {
    handlePrismaError(res, error, 'Error en el endpoint de comentarios');
  }
}

const handlePostRequest = async (
  req: NextApiRequest,
  res: NextApiResponse<Comment | ErrorResponse>
) => {
  try {
    const commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'> & { task: { connect: { id: string } }, user: { connect: { id: string } } } = {
      ...req.body,
      task: { connect: { id: req.body.task } },
      user: { connect: { id: req.body.user } }
    };
    
    // Validación básica de datos
    if (!commentData.text || !commentData.createdBy) {
      return res.status(400).json({
        success: false,
        message: 'Texto y creador son campos requeridos'
      });
    }

    const newComment = await prisma.comments.create({
      data: commentData
    });

    res.status(201).json({
      ...newComment,
      id: Number(newComment.id),
      createdBy: commentData.createdBy
    });
  } catch (error) {
    handlePrismaError(res, error, 'Error creando comentario');
  }
};

const handlePrismaError = (
  res: NextApiResponse<ErrorResponse>,
  error: unknown,
  context: string
) => {
  const err = error as PrismaError;
  console.error(`${context}:`, err.message);

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: `${context}: Recurso no encontrado`
    });
  }

  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'campo único';
    return res.status(409).json({
      success: false,
      message: `${context}: Conflicto en ${field}`
    });
  }

  res.status(500).json({
    success: false,
    message: `${context}: ${err.message || 'Error desconocido'}`
  });
};