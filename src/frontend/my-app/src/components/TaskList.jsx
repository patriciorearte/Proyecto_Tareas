import React from 'react';
import { Card, CardContent, IconButton, Grid, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TaskList = ({ tasks, onEdit, onDelete }) => {
  return (
    <Grid container spacing={3} justifyContent="center">
      {tasks.length > 0 ? (
        tasks.map(task => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card sx={{ padding: 2, backgroundColor: "#e3f2fd", boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>
                  {task.title || "Sin título"}
                </h3>
                <p style={{ fontSize: '1rem', color: '#555' }}>
                  {task.description || "Sin descripción"}
                </p>

                <Box mt={2} display="flex" justifyContent="space-between">
                  <IconButton onClick={() => onEdit(task)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(task.id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <p style={{ textAlign: "center", width: "100%" }}>No hay tareas disponibles</p>
      )}
    </Grid>
  );
};

export default TaskList;