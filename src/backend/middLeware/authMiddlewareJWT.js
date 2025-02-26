import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');  // Obtener el token de la cabecera Authorization

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, no se proporcionó un token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verificar el token
        req.userId = decoded.id;  // Agregar el ID del usuario al objeto de la solicitud
        next();  // Continuar con la siguiente función de middleware o ruta
    } catch (error) {
        res.status(400).json({ message: 'Token inválido o expirado.' });
    }
};