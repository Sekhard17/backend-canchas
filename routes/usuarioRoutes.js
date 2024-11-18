const express = require('express')
const router = express.Router()
const usuariosController = require('../controllers/usuariosController')
const verificarToken = require('../middleware/verificarToken')
const verificarRol = require('../middleware/verificarRol') // Importar el middleware para verificar el rol

// Rutas protegidas - Requieren un token válido para ser accedidas
router.get('/', verificarToken, verificarRol(['Administrador']), usuariosController.obtenerUsuarios) // Solo administradores pueden ver todos los usuarios
router.get('/:id', verificarToken, usuariosController.obtenerUsuarioPorId) // Cualquier usuario autenticado puede obtener su perfil
router.put('/:id', verificarToken, usuariosController.actualizarUsuario) // Cualquier usuario autenticado puede actualizar su información
router.delete('/:id', verificarToken, verificarRol(['Administrador']), usuariosController.eliminarUsuario) // Solo administradores pueden eliminar usuarios

// Rutas públicas - No requieren token
router.post('/', usuariosController.crearUsuario) // Registro de usuario
router.post('/login', usuariosController.loginUsuario) // Inicio de sesión

module.exports = router
