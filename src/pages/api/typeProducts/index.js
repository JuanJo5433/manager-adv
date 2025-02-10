import prisma from "@/lib/prisma";

/**
 * Manejador principal de la API de tipos de productos
 */
export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET":
        return await handleGetRequest(req, res);
      case "POST":
        return await handlePostRequest(req, res);
      case "PUT":
        return await handlePutRequest(req, res);
      case "DELETE":
        return await handleDeleteRequest(req, res);
      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).json({ error: `Método ${req.method} no permitido` });
    }
  } catch (error) {
    return handleErrorResponse(res, error, "Error en la API de tipos de productos");
  }
}

/**
 * Obtener todos los tipos de productos
 */
const handleGetRequest = async (req, res) => {
  try {
    const productTypes = await prisma.ProductType.findMany();
    return res.status(200).json(productTypes);
  } catch (error) {
    return handleErrorResponse(res, error, "Error obteniendo tipos de productos");
  }
};

/**
 * Crear un nuevo tipo de producto
 */
const handlePostRequest = async (req, res) => {
  try {
    const newProductType = await prisma.ProductType.create({
      data: req.body,
    });
    return res.status(201).json(newProductType);
  } catch (error) {
    return handleErrorResponse(res, error, "Error creando tipo de producto");
  }
};

/**
 * Actualizar un tipo de producto
 */
const handlePutRequest = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID del tipo de producto requerido" });

    const updatedProductType = await prisma.ProductType.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    return res.status(200).json(updatedProductType);
  } catch (error) {
    return handleErrorResponse(res, error, "Error actualizando tipo de producto");
  }
};

/**
 * Eliminar un tipo de producto
 */
const handleDeleteRequest = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID del tipo de producto requerido" });

    const deletedProductType = await prisma.ProductType.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: "Tipo de producto eliminado", productType: deletedProductType });
  } catch (error) {
    return handleErrorResponse(res, error, "Error eliminando tipo de producto");
  }
};

/**
 * Manejo de errores de Prisma
 */
const handleErrorResponse = (res, error, message) => {
  console.error(`${message}:`, error);

  if (error.code === "P2025") {
    return res.status(404).json({ success: false, message: `${message}: No encontrado` });
  }
  if (error.code === "P2002") {
    const field = error.meta?.target?.[0];
    return res.status(409).json({
      success: false,
      message: field ? `El ${field} ya está en uso` : "Conflicto de datos único",
    });
  }
  return res.status(500).json({ success: false, message: `${message}: ${error.message}` });
};
