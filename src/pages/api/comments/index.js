// Se importa la instancia de Prisma desde la carpeta de librerías para poder interactuar con la base de datos.
const { default: prisma } = require("@/lib/prisma");

// Función principal del endpoint que maneja las peticiones HTTP.
export default async function handler(req, res) {
    // Se evalúa el método HTTP de la petición.
    switch (req.method) {
        // Si el método es POST, se invoca la función que maneja la creación de un comentario.
        case "POST":
            await handlePostRequest(req, res);
            break;

        // Para otros métodos no permitidos, se envía una respuesta con los métodos permitidos.
        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Función para manejar las solicitudes POST y crear un nuevo comentario.
const handlePostRequest = async (req, res) => {
    // Se imprime el contenido del body de la solicitud para fines de depuración.
    console.log(req.body);
    try {
        // Se crea un nuevo registro en la tabla "comments" utilizando los datos recibidos en el body.
        const newComments = await prisma.comments.create({
            data: req.body,
        });
        // Se responde con un estado 201 (Creado) y se devuelve el comentario recién creado en formato JSON.
        res.status(201).json(newComments);
    } catch (error) {
        // En caso de error, se delega el manejo del error a la función handlePrismaError.
        handlePrismaError(res, error, "Error creando el proceso");
    }
};

// Función para manejar errores de Prisma y devolver respuestas HTTP adecuadas según el error.
const handlePrismaError = (res, error, entity) => {
    // Se imprime el mensaje de error en la consola para facilitar la depuración.
    console.error(`Prisma Error: ${error.message}`);

    // Error con código "P2025" indica que el registro no fue encontrado.
    if (error.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: `${entity} no encontrado`,
        });
    }

    // Error con código "P2002" indica un conflicto de datos únicos (por ejemplo, campo duplicado).
    if (error.code === "P2002") {
        // Se extrae el campo específico que está causando el conflicto, si está disponible.
        const field = error.meta?.target?.[0];
        return res.status(409).json({
            success: false,
            message: field
                ? `El ${field} ya está en uso`
                : "Conflicto de datos único",
        });
    }

    // Para cualquier otro tipo de error, se envía una respuesta genérica de error interno del servidor.
    res.status(500).json({
        success: false,
        message: `Error interno del servidor: ${error.message}`,
    });
};
