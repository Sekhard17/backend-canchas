// routes/dashboardRoutes.js - Rutas del Dashboard
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verificarToken = require('../middleware/verificarToken'); // Importar el middleware para verificar el token.

// Ruta para obtener los datos del dashboard.
router.get('/', verificarToken, dashboardController.obtenerDatosDashboard);

module.exports = router;
