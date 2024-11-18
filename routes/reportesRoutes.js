// routes/reportesRoutes.js - Rutas de Reporte
const express = require('express')
const router = express.Router()
const reportesController = require('../controllers/reportesController')

router.get('/', reportesController.obtenerReportes)
router.get('/:id', reportesController.obtenerReportePorId)
router.post('/', reportesController.crearReporte)
router.put('/:id', reportesController.actualizarReporte)
router.delete('/:id', reportesController.eliminarReporte)

module.exports = router