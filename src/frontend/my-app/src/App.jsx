import React, { useState } from 'react';
import { Container } from '@mui/material';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm'; 
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Navbar /> {/* El Navbar con los botones de login y registro */}

        <Container component="main" maxWidth="xs" sx={{ marginTop: 8 }}>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;