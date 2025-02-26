import { pool } from '../db.js';  // Importamos la conexión a la BD

// Función para crear un usuario
export const createUser = async (usuario, email, password, rol = 'user') => {
    try {
        const result = await pool.query(
            'INSERT INTO usuarios (usuario, email, password, rol) VALUES (?, ?, ?, ?)', 
            [usuario, email, password, rol]
        );
        return result.insertId ? Number(result.insertId) : null;
    } catch (error) {
        return { error: error.message };
    }
};
export const deleteUser = async (id) => {
    try {
        const [user] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Eliminar el usuario de la base de datos
        await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

        return { message: 'Usuario eliminado con éxito' };
    } catch (error) {
        return { error: error.message };
    }
};

// Función para obtener todos los usuarios
export const getAllUsers = async () => {
    try {
        const result = await pool.query('SELECT usuario, email, password FROM usuarios');
        const rows = Array.isArray(result) ? result : [result]; // Asegurar que sea un array
        console.log('Usuarios obtenidos desde la DB:', rows);
        return rows;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};