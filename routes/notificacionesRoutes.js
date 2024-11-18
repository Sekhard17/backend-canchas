// routes/notificacionesRoutes.js - Rutas de Notificacion
const express = require('express')
const router = express.Router()
const notificacionesController = require('../controllers/notificacionesController')

router.get('/', notificacionesController.obtenerNotificaciones)
router.get('/:id', notificacionesController.obtenerNotificacionPorId)
router.post('/', notificacionesController.crearNotificacion)
router.put('/:id', notificacionesController.actualizarNotificacion)
router.delete('/:id', notificacionesController.eliminarNotificacion)

module.exports = router