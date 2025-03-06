// Define las variables de entorno con tipos específicos para garantizar la seguridad de tipos.

/**
 * Obtiene el entorno de ejecución (NODE_ENV) desde las variables de entorno.
 * @type {string}
 * @example "development", "production", "test"
 */
export const NODE_ENV: string = process.env.NEXT_PUBLIC_NODE_ENV || "development";

/**
 * Obtiene la URL base de la API desde las variables de entorno.
 * Si no está definida, se utiliza un valor predeterminado (http://localhost:3000/api).
 * @type {string}
 */
export const API_URL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";