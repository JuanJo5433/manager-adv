import { NextApiResponse } from "next";

/**
 * Manejo de errores de Prisma
 */
export const handleErrorResponse = (res: NextApiResponse, error: any, message: string) => {
    console.error(`${message}:`, error);

    switch (error.code) {
        case 'P2000':
            return res.status(400).json({ success: false, message: `${message}: El valor proporcionado es demasiado largo para este campo` });

        case 'P2001':
            return res.status(404).json({ success: false, message: `${message}: No se encontró el registro solicitado` });

        case 'P2002':
            const field = error.meta?.target?.[0];
            return res.status(409).json({
                success: false,
                message: field ? `El ${field} ya está en uso` : 'Conflicto de datos único',
            });

        case 'P2003':
            return res.status(400).json({ success: false, message: `${message}: Violación de restricción de clave foránea` });

        case 'P2004':
            return res.status(400).json({ success: false, message: `${message}: Restricción fallida en la base de datos` });

        case 'P2005':
            return res.status(400).json({ success: false, message: `${message}: Formato de datos inválido` });

        case 'P2006':
            return res.status(400).json({ success: false, message: `${message}: Valor incorrecto para el tipo de dato esperado` });

        case 'P2007':
            return res.status(400).json({ success: false, message: `${message}: Validación de datos fallida` });

        case 'P2008':
            return res.status(500).json({ success: false, message: `${message}: Error de consulta de la base de datos` });

        case 'P2009':
            return res.status(400).json({ success: false, message: `${message}: Entrada de consulta inválida` });

        case 'P2010':
            return res.status(500).json({ success: false, message: `${message}: Error inesperado en la base de datos` });

        case 'P2011':
            return res.status(400).json({ success: false, message: `${message}: Restricción de campo nulo violada` });

        case 'P2012':
            return res.status(400).json({ success: false, message: `${message}: Valor obligatorio faltante en la base de datos` });

        case 'P2013':
            return res.status(400).json({ success: false, message: `${message}: Argumento faltante para la consulta` });

        case 'P2014':
            return res.status(400).json({ success: false, message: `${message}: Violación de relación en la base de datos` });

        case 'P2015':
            return res.status(404).json({ success: false, message: `${message}: Registro no encontrado en la base de datos` });

        case 'P2016':
            return res.status(400).json({ success: false, message: `${message}: Consulta inválida` });

        case 'P2017':
            return res.status(400).json({ success: false, message: `${message}: Relación inválida en la base de datos` });

        case 'P2018':
            return res.status(404).json({ success: false, message: `${message}: Registro relacionado no encontrado` });

        case 'P2019':
            return res.status(400).json({ success: false, message: `${message}: Entrada inválida para la operación en la base de datos` });

        case 'P2020':
            return res.status(400).json({ success: false, message: `${message}: Valor fuera del rango permitido` });

        case 'P2021':
            return res.status(400).json({ success: false, message: `${message}: Tabla no encontrada en la base de datos` });

        case 'P2022':
            return res.status(400).json({ success: false, message: `${message}: Columna no encontrada en la base de datos` });

        case 'P2023':
            return res.status(400).json({ success: false, message: `${message}: Consulta inválida, datos inconsistentes` });

        case 'P2024':
            return res.status(500).json({ success: false, message: `${message}: La operación en la base de datos tomó demasiado tiempo` });

        case 'P2025':
            return res.status(404).json({ success: false, message: `${message}: No encontrado` });

        case 'P2026':
            return res.status(500).json({ success: false, message: `${message}: No se pudo conectar a la base de datos` });

        case 'P2027':
            return res.status(400).json({ success: false, message: `${message}: Operación no permitida por la base de datos` });

        case 'P2028':
            return res.status(500).json({ success: false, message: `${message}: Transacción interrumpida` });

        default:
            return res.status(500).json({ success: false, message: `${message}: ${error.message}` });
    }
};
