// routes/gananciasRoutes.js - Rutas de Ganancia
const express = require('express')
const router = express.Router()
const gananciasController = require('../controllers/gananciasController')

router.get('/', gananciasController.obtenerGanancias)
router.get('/:id', gananciasController.obtenerGananciaPorId)
router.post('/', gananciasController.crearGanancia)
router.put('/:id', gananciasController.actualizarGanancia)
router.delete('/:id', gananciasController.eliminarGanancia)

module.exports = router