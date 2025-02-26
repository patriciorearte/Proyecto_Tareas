import mariadb from 'mariadb';

export const pool = mariadb.createPool({
  host: 'localhost',
  user: 'patricio',  // Asegúrate de usar el usuario correcto
  password: 'contrapato',  // Coloca tu contraseña
  database: 'trabajo2',  // La base de datos que creaste
  connectionLimit: 5
});

export const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado a la base de datos MariaDB');
    connection.release(); // Libera la conexión después de usarla
  } catch (error) {
    console.error('Error al conectar a MariaDB:', error.message);
  }
};
