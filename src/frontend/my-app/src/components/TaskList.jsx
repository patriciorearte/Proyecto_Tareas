import React from 'react';
import { Card, CardContent, IconButton, Grid2 , Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';

const TaskList = ({ tasks, onEdit, onDelete }) => {
    return (
      <Grid2 container spacing={3} justifyContent="center" sx={{ marginTop: 3 }}>
        {tasks.length > 0 ? (
          tasks.map(task => (
            <Grid2 item xs={12} sm={6} md={4} lg={3} key={task.id}>
              <Card sx={{ padding: 2, backgroundColor: "#e3f2fd", boxShadow: 3, borderRadius: 2, minHeight: '250px' }}>
                <CardContent>
                  {/* Título con estilo para que no se corte */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      overflow: 'visible', // Para que el texto no se corte
                      whiteSpace: 'normal', // Permitir que el texto ocupe varias líneas
                      marginBottom: '10px',
                      lineHeight: 1.5,  // Para mayor espacio entre líneas
                    }}
                  >
                    {task.title || "Sin título"}
                  </Typography>
  
                  {/* Descripción */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '1rem',
                      color: '#555',
                      marginBottom: '20px',
                      lineHeight: 1.4, // Espacio para que el texto no se vea apretado
                    }}
                  >
                    {task.description || "Sin descripción"}
                  </Typography>
  
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
            </Grid2>
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>No hay tareas disponibles</p>
        )}
      </Grid2>
    );
  };
  
  export default TaskList;