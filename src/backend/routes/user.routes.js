import { Router } from 'express';
import { createUser } from '../models/user.model.js';
import { pool } from '../db.js';
import { getAllUsers } from '../models/user.model.js';
import { verifyToken } from '../middleware/authMiddlewareJWT.js';
import { isAdmin } from '../middLeware/authMiddleware.js';
import { deleteUser } from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

// Ruta para registrar al usuario
router.post('/register', async (req, res) => {
    const { usuario, email, password } = req.body;

    try {
        // Realizamos la consulta para verificar si el usuario o el email ya están en uso
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE usuario = ? OR email = ?',
            [usuario, email]
        );

        console.log("Resultado de la consulta:", result);  // Verifica el formato del resultado en la consola

        // Si el resultado está vacío o es un array vacío, significa que el usuario y el email no están en uso
        if (result && result.length > 0) {
            const existingUser = result.find(user => user.usuario === usuario);
            const existingEmail = result.find(user => user.email === email);

            if (existingUser) {
                return res.status(400).json({ message: 'El usuario ya está en uso.' });
            }

            if (existingEmail) {
                return res.status(400).json({ message: 'El email ya está en uso.' });
            }
        }

        // Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Guardar el usuario en la base de datos
        await pool.query(
            'INSERT INTO usuarios (usuario, email, password, rol) VALUES (?, ?, ?, ?)',
            [usuario, email, hashedPassword, 'user']
        );

        res.status(201).json({ message: 'Usuario registrado con éxito.' });

    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Ejecutamos la consulta para obtener al usuario por email
        const result = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        // 'result' debe ser un arreglo de objetos, pero en este caso parece que es un solo objeto
          // Verifica la estructura exacta

        // Si result no es un arreglo o está vacío, significa que no encontramos el usuario
        if (!result || result.length === 0) {
            return res.status(400).json({ message: 'El usuario no existe.' });
        }

        const user = result[0];  // Ahora 'result' es un arreglo, tomamos el primer usuario

          // Verifica el objeto del usuario

        // Verificamos la contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);
         // Verifica si las contraseñas coinciden

        if (!passwordMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta.' });
        }

        // Generamos el token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login exitoso', token });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error en el servidor.', error: error.message });
    }
});
router.get('/list', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await deleteUser(id);  // Usamos el método deleteUser del modelo

        if (result.error) {
            return res.status(404).json({ message: result.error });
        }

        res.status(200).json({ message: result.message });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


export default router;