import React from 'react';
import { AppBar, Toolbar, Button, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Mi Aplicación
        </Typography>
        {/* Enlaces para Login y Register */}
        <Button color="inherit" component={Link} to="/">Iniciar sesión</Button>
        <Button color="inherit" component={Link} to="/register">Registrarse</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;