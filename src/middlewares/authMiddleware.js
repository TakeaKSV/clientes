import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = "c9PcgRFL2S8n0NYQp6MZUbbxRgTRHJxjYnvux54VrnA="; // Debe coincidir con la clave del ESB

export const verifyToken = (req, res, next) => {
  try {
    // Obtener el token del encabezado Authorization
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    // Remover el prefijo "Bearer " si está presente
    const token = authHeader.replace('Bearer ', '');
    
    // Verificar el token
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Agregar el usuario decodificado al objeto de solicitud
    req.user = decoded;
    
    next(); // Continuar con la siguiente función
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};