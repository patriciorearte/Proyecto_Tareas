import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';  // Ruta de los usuarios
import taskRoutes from "./routes/task.routes.js";

console.log("JWT_SECRET en servidor:", process.env.JWT_SECRET)
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',  // Permitir solo el frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization']  // Encabezados permitidos
  }));
app.use('/api/users', userRoutes);  // Prefijo /api/users
app.use('/api/tasks', taskRoutes);
export default app;