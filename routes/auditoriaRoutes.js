// routes/auditoriaRoutes.js - Rutas de Auditoria
const express = require('express')
const router = express.Router()
const auditoriaController = require('../controllers/auditoriaController')

router.get('/', auditoriaController.obtenerAuditorias)
router.get('/:id', auditoriaController.obtenerAuditoriaPorId)
router.post('/', auditoriaController.crearAuditoria)
router.put('/:id', auditoriaController.actualizarAuditoria)
router.delete('/:id', auditoriaController.eliminarAuditoria)

module.exports = router