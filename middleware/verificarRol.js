// middleware/verificarRol.js
const jwt = require('jsonwebtoken')

const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.sendStatus(401)

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
      if (err) return res.sendStatus(403)

      if (!rolesPermitidos.includes(usuario.rol)) {
        return res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' })
      }

      req.usuario = usuario
      next()
    })
  }
}

module.exports = verificarRol
