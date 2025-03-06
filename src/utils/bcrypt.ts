import bcrypt from 'bcryptjs';

/**
 * Función para hashear una contraseña.
 * @param {string} password - Contraseña en texto plano.
 * @returns {Promise<string>} Contraseña hasheada.
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Genera un salt (valor aleatorio) para aumentar la seguridad del hash.
  const salt = await bcrypt.genSalt(10);
  // Hashea la contraseña utilizando el salt generado.
  return await bcrypt.hash(password, salt);
};

/**
 * Función para comparar una contraseña en texto plano con una contraseña hasheada.
 * @param {string} plainTextPassword - Contraseña en texto plano.
 * @param {string} hashedPassword - Contraseña hasheada almacenada.
 * @returns {Promise<boolean>} `true` si las contraseñas coinciden, `false` si no.
 * @throws {Error} Si ocurre un error durante la comparación.
 */
export const comparePassword = async (
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    // Compara la contraseña en texto plano con la contraseña hasheada.
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  } catch (error) {
    // Registra el error en la consola y lanza una excepción con un mensaje descriptivo.
    console.error('Error al comparar las contraseñas:', error);
    throw new Error('Error al comparar las contraseñas');
  }
};