// Importa la instancia de Prisma para interactuar con la base de datos.
const { default: prisma } = require("@/lib/prisma");

// Función handler principal que procesa las solicitudes HTTP entrantes.
export default async function handler(req, res) {
  // Se evalúa el método HTTP de la solicitud.
  switch (req.method) {
    // Si el método es POST, se llama a la función para crear un nuevo proceso.
    case "POST":
      await handlePostRequest(req, res);
      break;
    // Si el método es GET, se llama a la función para obtener todos los procesos.
    case "GET":
      await handleGetRequest(res);
      break;
    // Para otros métodos no permitidos, se establece el encabezado Allow y se responde con un error 405.
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Función que maneja las solicitudes POST para crear un nuevo proceso.
const handlePostRequest = async (req, res) => {
  // Imprime en consola el contenido del body para facilitar la depuración.
  console.log(req.body);
  try {
    // Crea un nuevo registro en la tabla "process" utilizando los datos recibidos en el body.
    const newProcess = await prisma.process.create({
      data: req.body,
    });
    // Envía la respuesta con estado 201 (Creado) y devuelve el proceso recién creado en formato JSON.
    res.status(201).json(newProcess);
  } catch (error) {
    // En caso de error, se delega el manejo a la función handlePrismaError.
    handlePrismaError(res, error, "Error creando el proceso");
  }
};

// Función que maneja las solicitudes GET para obtener todos los procesos.
// No se utiliza el objeto `req` porque no se requieren parámetros adicionales.
const handleGetRequest = async (res) => {
  try {
    // Consulta la base de datos para obtener todos los procesos,
    // incluyendo las relaciones: tareas (tasks) y cliente (client).
    const process = await prisma.process.findMany({
      include: { tasks: true, client: true },
    });
    // Imprime en consola el resultado para facilitar la depuración.
    console.log(process);
    // Envía la respuesta con estado 200 (OK) y devuelve los procesos en formato JSON.
    res.status(200).json(process);
  } catch (error) {
    // En caso de error, se delega el manejo a la función handlePrismaError.
    handlePrismaError(res, error, "Error al obtener el proceso");
  }
};

// Función para manejar errores provenientes de Prisma y enviar respuestas HTTP apropiadas.
const handlePrismaError = (res, error, entity) => {
  // Registra el error en la consola.
  console.error(`Prisma Error: ${error.message}`);

  // Si el error es del tipo "P2025", significa que el registro no fue encontrado.
  if (error.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: `${entity} no encontrado`,
    });
  }

  // Si el error es del tipo "P2002", indica un conflicto de datos únicos (por ejemplo, duplicación de un campo único).
  if (error.code === "P2002") {
    const field = error.meta?.target?.[0];
    return res.status(409).json({
      success: false,
      message: field
        ? `El ${field} ya está en uso`
        : "Conflicto de datos único",
    });
  }

  // Para cualquier otro error, se devuelve una respuesta con estado 500 (Error interno del servidor).
  res.status(500).json({
    success: false,
    message: `Error interno del servidor: ${error.message}`,
  });
};
