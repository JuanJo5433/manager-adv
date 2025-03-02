const { default: prisma } = require("@/lib/prisma");

export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            await handlePostRequest(req, res);
            break;


        default:
            res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

const handlePostRequest = async (req, res) => {
    console.log(req.body)
    try {
        const newTask = await prisma.task.create({
          data:  req.body,
        });
        res.status(201).json(newTask);
    } catch (error) {
        handlePrismaError(res, error, "Error creando el proceso");
    }
};


const handlePrismaError = (res, error, entity) => {
    console.error(`Prisma Error: ${error.message}`);

    if (error.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: `${entity} no encontrado`,
        });
    }

    if (error.code === "P2002") {
        const field = error.meta?.target?.[0];
        return res.status(409).json({
            success: false,
            message: field
                ? `El ${field} ya está en uso`
                : "Conflicto de datos único",
        });
    }

    res.status(500).json({
        success: false,
        message: `Error interno del servidor: ${error.message}`,
    });
};
