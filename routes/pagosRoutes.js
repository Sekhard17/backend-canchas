// routes/pagosRoutes.js - Rutas de Pago
const express = require('express')
const router = express.Router()
const pagosController = require('../controllers/pagosController')

router.get('/', pagosController.obtenerPagos)
router.get('/:id', pagosController.obtenerPagoPorId)
router.post('/', pagosController.crearPago)
router.put('/:id', pagosController.actualizarPago)
router.delete('/:id', pagosController.eliminarPago)

module.exports = router