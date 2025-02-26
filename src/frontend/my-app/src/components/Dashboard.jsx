import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, IconButton, Card, CardContent, Container, Grid, Box, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const userId = localStorage.getItem("userId"); // Obtener el ID del usuario logueado

  useEffect(() => {
    axios.get('http://localhost:3000/api/tasks')
      .then(response => {
        const tasksData = Array.isArray(response.data) ? response.data : [response.data];
        setTasks(tasksData);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);


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
        setTasks([...tasks, response.data]);
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
    <Container maxWidth="md">
      <h2 style={{ textAlign: 'center' }}>Dashboard</h2>
      <Box my={3} display="flex" flexDirection="column" alignItems="center" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
        <h3>Create Task</h3>
        <TextField
          label="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          style={{ marginBottom: '10px' }}
          fullWidth
        />
        <TextField
          label="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          style={{ marginBottom: '20px' }}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleCreateTask}>
          Create Task
        </Button>
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
