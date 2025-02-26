import express from "express";
import Task from "../models/task.models.js"; // Ajusta la importación

const router = express.Router();

// Obtener todas las tareas
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.getAll(); // Usa la función correcta
        res.json(tasks);
    } catch (error) {
        console.error("Error al obtener tareas:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Obtener una tarea por ID
router.get('/:id', async (req, res) => {
    try {
      const taskId = req.params.id; // Captura el ID de la tarea desde la URL
      const userId = req.user.id; // Asegúrate de que el userId esté disponible

      // Realiza la consulta en la base de datos
      const task = await pool.query('SELECT * FROM tasks WHERE id = ? AND userId = ?', [taskId, userId]);

      if (!task || task.length === 0) {
        return res.status(404).json({ message: 'Tarea no encontrada o no autorizada' });
      }

      res.status(200).json(task[0]); // Devuelve la tarea encontrada
    } catch (error) {
      console.error('Error al obtener tarea:', error); // Muestra el error completo
      res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
});
// Crear una nueva tarea
router.post("/", async (req, res) => {
    const { title, description, userId } = req.body;
    console.log("Datos recibidos en el backend:", req.body); 
    
    if (!title || !description || !userId) {
        return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    try {
        console.log("Intentando guardar tarea:", { title, description });
        const taskId = await Task.create(title, description, userId); // Usa la función correcta
        res.status(201).json({ message: "Tarea creada", id: taskId });
    } catch (error) {
        console.error("Error al crear tarea:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Actualizar una tarea
router.put("/:id", async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    try {
        await Task.update(req.params.id, title, description); // Usa la función correcta
        res.json({ message: "Tarea actualizada" });
    } catch (error) {
        console.error("Error al actualizar tarea:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// Eliminar una tarea
router.delete("/:id", async (req, res) => {
    try {
        await Task.delete(req.params.id); // Usa la función correcta
        res.json({ message: "Tarea eliminada" });
    } catch (error) {
        console.error("Error al eliminar tarea:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

export default router;