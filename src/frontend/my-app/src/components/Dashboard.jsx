import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, IconButton, Card, CardContent, Container, Grid, Box, Snackbar } from '@mui/material';

import TaskList from './TaskList';


const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const userId = localStorage.getItem("userId"); // Obtener el ID del usuario logueado

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("No hay usuario autenticado");
      return;
    }
  
    axios.get(`http://localhost:3000/api/tasks?userId=${userId}`)
      .then(response => {
        const tasksData = Array.isArray(response.data) ? response.data : [response.data];
        setTasks(tasksData);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({ title: task.title, description: task.description });
  };
  
  const handleDeleteTask = (taskId) => {
    axios.delete(`http://localhost:3000/api/tasks/${taskId}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== taskId));
        setSnackbarMessage("Tarea eliminada con éxito");
        setOpenSnackbar(true);
      })
      .catch(error => {
        console.error("Error al eliminar tarea:", error.response ? error.response.data : error.message);
        setSnackbarMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
        setOpenSnackbar(true);
      });
  };
  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description) {
      setSnackbarMessage("Faltan datos requeridos");
      setOpenSnackbar(true);
      return;
    }
  
    if (!userId) {
      setSnackbarMessage("No hay usuario autenticado");
      setOpenSnackbar(true);
      return;
    }
  
    const taskData = { 
      title: newTask.title, 
      description: newTask.description, 
      userId: parseInt(userId) 
    };
  
    axios.post("http://localhost:3000/api/tasks", taskData)
    .then(response => {
      if (response.data && response.data.id) {
        const newTaskWithData = {
          id: response.data.id,
          title: newTask.title,  // Usamos los valores que ya tenemos
          description: newTask.description,
          user_id: parseInt(userId),
          created_at: new Date().toISOString() // Opcional, solo si quieres agregar la fecha
        };
  
        setTasks(prevTasks => [...prevTasks, newTaskWithData]);
      } else {
        console.error("Respuesta inesperada del backend:", response.data);
      }
  
      setNewTask({ title: "", description: "" });
      setSnackbarMessage("Tarea creada con éxito");
      setOpenSnackbar(true);
    })
    .catch(error => {
      console.error("Error al crear tarea:", error.response ? error.response.data : error.message);
      setSnackbarMessage(`Error: ${error.response ? error.response.data.message : error.message}`);
      setOpenSnackbar(true);
    });
  };

  
  return (
    <Container maxWidth="lg">
      <h2 style={{ textAlign: 'center' }}>Lista de Tareas</h2>
      
      {/* Formulario para crear tarea */}
      <Box my={3} display="flex" flexDirection="column" alignItems="center" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
        <h3>Crear Tarea</h3>
        <TextField
          label="Titulo"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          style={{ marginBottom: '10px' }}
          fullWidth
        />
        <TextField
          label="Descripcion"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          style={{ marginBottom: '20px' }}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleCreateTask}>
          {editingTask ? "Update Task" : "Create Task"}
        </Button>
      </Box>

      {/* Lista de tareas */}
      <Box mt={4}>
        <TaskList tasks={tasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};
export default Dashboard;
