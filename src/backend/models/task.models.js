import {pool} from "../db.js"; // Asegúrate de importar correctamente tu conexión a la DB

const Task = {
    async create(title, description, user_id) {
        try {
            const result = await pool.query(
                'INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)',
                [title, description, user_id]
            );
            console.log('Resultado de la consulta:', result); // Para ver qué devuelve exactamente
            return Number(result.insertId);  // Convertir insertId a un número
        } catch (error) {
            console.error('Error al crear tarea:', error);
            throw error;  // Para capturar el error en el controlador
        }
    },
  
    async getAll() {
      const [rows] = await pool.query('SELECT * FROM tasks');
      return rows;
    },
  
    async getById(id) {
      const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
      return rows[0];
    },
  
    async update(id, title, description) {
      await pool.query(
        'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
        [title, description, id]
      );
    },
  
    async delete(id) {
      await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    },
  };
  
  export default Task;