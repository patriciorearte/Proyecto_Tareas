import express from "express";
import Task from "../models/task.models.js"; // Ajusta la importación
import { verifyToken } from '../middLeware/authMiddlewareJWT.js'
import { pool } from '../db.js';
const router = express.Router();

// Obtener una tarea por ID
router.get('/user/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.params.id; // Captura el ID del usuario desde la URL
        console.log('Buscando tareas para el usuario con ID:', userId);

        // Consulta las tareas asociadas al userId
        const tasks = await pool.query('SELECT * FROM tasks WHERE user_id = ?', [userId]);

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: 'No se encontraron tareas para este usuario.' });
        }

        res.status(200).json(tasks); // Devuelve todas las tareas encontradas
    } catch (error) {
        console.error('Error al obtener tareas:', error);
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