//backend/middlewares/verificarToken.js
//Este archivo contiene un middleware que verifica si el token proporcionado es válido para acceder a las rutas y sesiones protegidas.
const jwt = require('jsonwebtoken')

const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Extraer el token
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado, no hay token proporcionado' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);  // Verificar el token con la clave secreta
    req.user = verified;  // Aquí es donde asignamos el contenido del token JWT a req.user
    console.log('Usuario verificado:', req.user);  // Imprimir para verificar que contiene el RUT o ID
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token inválido' });
  }
}

module.exports = verificarToken;
