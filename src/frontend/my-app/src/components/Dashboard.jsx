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

  console.log("Tareas:", tasks);

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
      return;  // No enviar si faltan datos
    }
  
    console.log("Datos a enviar:", newTask);  // Verifica los datos que estás enviando
    
    axios.post('http://localhost:3000/api/tasks', newTask)
      .then(response => {
        console.log("Respuesta de creación de tarea:", response);  // Ver la respuesta completa
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', description: '' });
        setSnackbarMessage("Tarea creada con éxito");
        setOpenSnackbar(true);
      })
      .catch(error => {
        // Aquí vemos todo el error para depurar
        console.error('Error creando la tarea:', error.response ? error.response.data : error.message);
        setSnackbarMessage(`Error al crear la tarea: ${error.response ? error.response.data.message : error.message}`);
        setOpenSnackbar(true);
      });
  };

  const handleUpdateTask = (taskId) => {
    const updatedTask = { ...editingTask };
    axios.put(`http://localhost:3000/api/tasks/${taskId}`, updatedTask)
      .then(response => {
        const updatedTasks = tasks.map(task =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        );
        setTasks(updatedTasks);
        setEditingTask(null);
        setSnackbarMessage("Tarea actualizada con éxito");
        setOpenSnackbar(true);
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const handleDeleteTask = (taskId) => {
    axios.delete(`http://localhost:3000/api/tasks/${taskId}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== taskId));
        setSnackbarMessage("Tarea eliminada");
        setOpenSnackbar(true);
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  return (
    <Container maxWidth="md">
      <h2 style={{ textAlign: 'center' }}>Dashboard</h2>
      
      {/* Create Task */}
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

      {/* Display Tasks */}
      <Grid container spacing={3} mt={2}>
        {tasks.map(task => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card style={{ padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <h4>{task.title}</h4>
                <p>{task.description}</p>

                {/* Edit and Delete buttons */}
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <IconButton onClick={() => setEditingTask(task)} style={{ backgroundColor: '#f0f0f0' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTask(task.id)} style={{ backgroundColor: '#f0f0f0' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>

                {/* Show editing form if needed */}
                {editingTask && editingTask.id === task.id && (
                  <Box mt={2}>
                    <TextField
                      label="Title"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                      fullWidth
                      style={{ marginBottom: '10px' }}
                    />
                    <TextField
                      label="Description"
                      value={editingTask.description}
                      onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                      fullWidth
                      style={{ marginBottom: '20px' }}
                    />
                    <Button variant="contained" color="primary" onClick={() => handleUpdateTask(task.id)}>
                      Update
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar for feedback */}
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