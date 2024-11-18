const express = require('express');
const router = express.Router();
const horariosController = require('../controllers/horariosController');

router.get('/:fecha/:idCancha', horariosController.obtenerHorarios);

module.exports = router;