// routes/respuestaSolicitudesRoutes.js - Rutas de RespuestaSolicitud
const express = require('express')
const router = express.Router()
const respuestaSolicitudesController = require('../controllers/respuestaSolicitudesController')

router.get('/', respuestaSolicitudesController.obtenerRespuestas)
router.get('/:id', respuestaSolicitudesController.obtenerRespuestaPorId)
router.post('/', respuestaSolicitudesController.crearRespuesta)
router.put('/:id', respuestaSolicitudesController.actualizarRespuesta)
router.delete('/:id', respuestaSolicitudesController.eliminarRespuesta)

module.exports = router