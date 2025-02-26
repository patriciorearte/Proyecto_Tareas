import app from './app.js';
import { connectDB } from './db.js';

// Conectamos con la base de datos
connectDB();

app.listen(3000, () => {
    console.log('Servidor en el puerto 3000');
});