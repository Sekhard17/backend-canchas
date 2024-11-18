// routes/canchasRoutes.js - Rutas de Cancha
const express = require('express')
const router = express.Router()
const canchasController = require('../controllers/canchasController')

router.get('/', canchasController.obtenerCanchas)
router.get('/:id', canchasController.obtenerCanchaPorId)
router.post('/', canchasController.crearCancha)
router.put('/:id', canchasController.actualizarCancha)
router.delete('/:id', canchasController.eliminarCancha)

module.exports = router