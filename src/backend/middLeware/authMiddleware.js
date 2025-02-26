export const isAdmin = (req, res, next) => {
    // Verificar si el rol del usuario es "admin" (obtenido del JWT)
    if (req.user?.rol !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado: se requiere rol de admin' });
    }

    next(); // Si el rol es admin, continúa con la ejecución de la ruta
};