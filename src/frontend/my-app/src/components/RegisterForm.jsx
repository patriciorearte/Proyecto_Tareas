import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({}); // Estado para manejar errores individuales
  const navigate = useNavigate(); // Hook de navegación

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Limpiar el error cuando el usuario empieza a escribir
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Limpiar errores anteriores

    try {
      const response = await axios.post('http://localhost:3000/api/users/register', formData);
      console.log('Usuario registrado:', response.data);

      // Verificar si la respuesta fue exitosa antes de redirigir
      if (response.status === 201) {
        // Redirigir al login después de un registro exitoso
        console.log("Redirigiendo al login...");
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { message, field } = error.response.data;

        // Si el backend devuelve el campo que tiene el error
        if (field) {
          setErrors({ [field]: message });
        } else {
          setErrors({ general: message });
        }
      } else {
        setErrors({ general: 'Error al registrar el usuario.' });
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 2,
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: 3,
        width: '100%',
        maxWidth: 400
      }}
    >
      <Typography variant="h5" component="h1" sx={{ marginBottom: 2 }}>
        Registrarse
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        {/* Campo de Usuario */}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Usuario"
          name="usuario"
          value={formData.usuario}
          onChange={handleChange}
          autoComplete="usuario"
          autoFocus
          error={!!errors.usuario} // Mostrar error si existe
          helperText={errors.usuario} // Mensaje de error debajo del campo
        />
        
        {/* Campo de Correo */}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Correo"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email}
        />

        {/* Campo de Contraseña */}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password}
        />

        {/* Mensaje de error general */}
        {errors.general && (
          <Typography color="error" sx={{ marginTop: 1 }}>
            {errors.general}
          </Typography>
        )}

        {/* Botón de Registro */}
        <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 2 }}>
          Registrarse
        </Button>
      </form>
    </Box>
  );
};

export default RegisterForm;