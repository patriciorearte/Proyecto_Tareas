import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
    console.log("Encabezados recibidos:", req.headers); // Para debug

    const authHeader = req.headers.authorization;
const token = Array.isArray(authHeader) ? authHeader[0].split(" ")[1] : authHeader?.split(" ")[1];

console.log('Token recibido:', token);  

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, no se proporcionó un token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido o expirado.' });
    }
};