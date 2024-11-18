// routes/solicitudesRoutes.js - Rutas de Solicitud
const express = require('express')
const router = express.Router()
const solicitudesController = require('../controllers/solicitudesController')

router.get('/', solicitudesController.obtenerSolicitudes)
router.get('/:id', solicitudesController.obtenerSolicitudPorId)
router.post('/', solicitudesController.crearSolicitud)
router.put('/:id', solicitudesController.actualizarSolicitud)
router.delete('/:id', solicitudesController.eliminarSolicitud)

module.exports = router