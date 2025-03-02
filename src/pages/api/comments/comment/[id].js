// Importa la instancia de Prisma para interactuar con la base de datos
const { default: prisma } = require("@/lib/prisma");

// Función principal del endpoint que maneja las solicitudes HTTP
export default async function handler(req, res) {
  // Se evalúa el método HTTP de la solicitud
  switch (req.method) {
    // Si el método es GET, se llama a la función handleGetRequest
    case "GET":
      await handleGetRequest(req, res);
      break;
    // Para métodos no permitidos, se establece el encabezado Allow y se responde con un error 405
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Función que maneja las solicitudes GET para obtener comentarios
const handleGetRequest = async (req, res) => {
  try {
    // Extrae el parámetro 'id' de la consulta (query) de la solicitud
    const { id } = req.query;

    // Busca en la base de datos los comentarios que coincidan con el 'id' proporcionado
    const comments = await prisma.comments.findMany({
      where: { id: id },
    });
    
    // Imprime en consola los comentarios obtenidos (útil para depuración)
    console.log(comments);
    
    // Devuelve la respuesta con estado 200 (OK) y los comentarios en formato JSON
    res.status(200).json(comments);
  } catch (error) {
    // En caso de error, se llama a la función handlePrismaError para manejarlo adecuadamente
    handlePrismaError(res, error, "Error al obtener el proceso");
  }
};

// Función para manejar errores provenientes de Prisma y devolver respuestas HTTP apropiadas
const handlePrismaError = (res, error, entity) => {
  // Registra el error en la consola
  console.error(`Prisma Error: ${error.message}`);

  // Si el error es del tipo "P2025", significa que no se encontró el registro
  if (error.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: `${entity} no encontrado`,
    });
  }

  // Si el error es del tipo "P2002", indica un conflicto de datos (p. ej., duplicidad en un campo único)
  if (error.code === "P2002") {
    const field = error.meta?.target?.[0];
    return res.status(409).json({
      success: false,
      message: field
        ? `El ${field} ya está en uso`
        : "Conflicto de datos único",
    });
  }

  // Para cualquier otro error, se devuelve un error interno del servidor (500)
  res.status(500).json({
    success: false,
    message: `Error interno del servidor: ${error.message}`,
  });
};
