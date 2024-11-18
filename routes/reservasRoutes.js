// routes/reservasRoutes.js - Rutas de Reserva
const express = require('express')
const router = express.Router()
const reservasController = require('../controllers/reservasController')
const verificarToken = require('../middleware/verificarToken') // Importar el middleware

// Proteger las rutas de reservas con el middleware verificarToken
router.get('/', verificarToken, reservasController.obtenerReservasUsuario) // Cambiado para obtener solo las reservas del usuario logueado
router.get('/:id', verificarToken, reservasController.obtenerReservaPorId)
router.post('/', verificarToken, reservasController.crearReserva)
router.put('/:id', verificarToken, reservasController.actualizarReserva)
router.delete('/:id', verificarToken, reservasController.eliminarReserva)

module.exports = router
