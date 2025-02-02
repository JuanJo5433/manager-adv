
/**
 * Manejador principal de la API
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
    return handleErrorResponse(res, error, "Error en la API de productos");
  }
}

/**
 * Obtener todos los productos (excluyendo los eliminados)
 */
const handleGetRequest = async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      where: { deletedAt: null },
    });
    return res.status(200).json(products);
  } catch (error) {
    return handleErrorResponse(res, error, "Error obteniendo productos");
  }
};

/**
 * Crear un nuevo producto
 */
const handlePostRequest = async (req, res) => {
  try {
    const newProduct = await prisma.products.create({
      data: req.body,
    });
    return res.status(201).json(newProduct);
  } catch (error) {
    return handleErrorResponse(res, error, "Error creando producto");
  }
};

/**
 * Actualizar un producto
 */
const handlePutRequest = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID del producto requerido" });

    const updatedProduct = await prisma.products.update({
      where: { id: parseInt(id) },
      data: req.body,
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return handleErrorResponse(res, error, "Error actualizando producto");
  }
};

/**
 * Eliminar un producto (soft delete)
 */
const handleDeleteRequest = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "ID del producto requerido" });

    const deletedProduct = await prisma.products.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return res.status(200).json({ message: "Producto eliminado", product: deletedProduct });
  } catch (error) {
    return handleErrorResponse(res, error, "Error eliminando producto");
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