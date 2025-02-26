import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook de react-router-dom para navegar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Limpiar mensaje de error antes de hacer la solicitud
    try {
      // Enviar los datos al backend para realizar el login
      const response = await axios.post('http://localhost:3000/api/users/login', formData);
      console.log('Login exitoso:', response.data);
  
      // Guardar el token y userId en localStorage
      localStorage.setItem('authToken', response.data.token); // Suponiendo que el backend devuelve un token
      localStorage.setItem('userId', response.data.userId); // Guardamos el userId también
  
      // Redirigir al dashboard después de iniciar sesión
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message); // Mostrar el mensaje de error que venga del backend
      } else {
        setErrorMessage('Error al iniciar sesión.');
      }
    }
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
      <Typography variant="h5">Iniciar sesión</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Correo"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" fullWidth>
          Iniciar sesión
        </Button>
        {errorMessage && <Typography color="error" sx={{ marginTop: 2 }}>{errorMessage}</Typography>}
      </form>
    </Box>
  );
};

export default LoginForm;