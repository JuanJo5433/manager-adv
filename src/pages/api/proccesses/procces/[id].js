// Importa la instancia de Prisma para interactuar con la base de datos.
const { default: prisma } = require("@/lib/prisma");

// Función principal del endpoint que maneja las peticiones HTTP.
export default async function handler(req, res) {
  // Se evalúa el método HTTP de la solicitud.
  switch (req.method) {
    // Si el método es GET, se procesa la solicitud para obtener el proceso y sus detalles.
    case "GET":
      await handleGetRequest(req, res);
      break;
    // Para otros métodos no permitidos, se establecen los métodos permitidos y se devuelve un error 405.
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Función que maneja las solicitudes GET para obtener el proceso con sus tareas y comentarios.
const handleGetRequest = async (req, res) => {
  try {
    // Extrae el parámetro 'id' de la query string de la solicitud.
    const { id } = req.query;

    // Consulta a la base de datos para obtener el proceso que coincida con el 'id',
    // incluyendo sus tareas y, para cada tarea, sus comentarios. También se incluye
    // la información del cliente relacionado.
    const processData = await prisma.process.findMany({
      where: { id: id },
      include: {
        tasks: {
          include: { comments: true }
        },
        client: true
      }
    });

    // Recorre cada tarea del proceso (se asume que processData[0] existe).
    for (const task of processData[0].tasks) {
      // Para cada tarea, recorre sus comentarios.
      for (const comment of task.comments) {
        // Se consulta la información del usuario relacionado a cada comentario,
        // utilizando el 'userId' que está almacenado en el comentario.
        const user = await prisma.users.findUnique({
          where: { id: comment.userId }
        });
        // Se agrega una propiedad "createdBy" en el comentario, que contiene el nombre del usuario.
        comment.createdBy = user.username;
      }
    }

    // Imprime en la consola la información del proceso con los comentarios actualizados.
    console.log("Proceso con comentarios actualizados:", processData);
    // Envía la respuesta con estado 200 y el proceso actualizado en formato JSON.
    res.status(200).json(processData);
  } catch (error) {
    // En caso de error, se delega el manejo del error a la función handlePrismaError.
    handlePrismaError(res, error, "Error al obtener el proceso");
  }
};

// Función para manejar errores provenientes de Prisma y enviar respuestas HTTP apropiadas.
const handlePrismaError = (res, error, entity) => {
  // Registra el error en la consola.
  console.error(`Prisma Error: ${error.message}`);

  // Si el error tiene el código "P2025", significa que el registro no fue encontrado.
  if (error.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: `${entity} no encontrado`,
    });
  }

  // Si el error tiene el código "P2002", indica un conflicto en datos únicos (por ejemplo, un campo duplicado).
  if (error.code === "P2002") {
    const field = error.meta?.target?.[0];
    return res.status(409).json({
      success: false,
      message: field
        ? `El ${field} ya está en uso`
        : "Conflicto de datos único",
    });
  }

  // Para cualquier otro error, se responde con un error interno del servidor (500).
  res.status(500).json({
    success: false,
    message: `Error interno del servidor: ${error.message}`,
  });
};
