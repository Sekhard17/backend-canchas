/**
 * Configuración principal del servidor Express
 * Este archivo configura y arranca el servidor con todas sus rutas y middleware
 */

// Importación de dependencias fundamentales
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan'); // Faltaba importar morgan

// Importación de rutas
const routes = {
  usuarios: require('./routes/usuarioRoutes'),
  canchas: require('./routes/canchasRoutes'),
  reservas: require('./routes/reservasRoutes'),
  solicitudes: require('./routes/solicitudesRoutes'),
  respuestaSolicitudes: require('./routes/respuestaSolicitudesRoutes'),
  ganancias: require('./routes/gananciasRoutes'),
  pagos: require('./routes/pagosRoutes'),
  auditoria: require('./routes/auditoriaRoutes'),
  reportes: require('./routes/reportesRoutes'),
  notificaciones: require('./routes/notificacionesRoutes'),
  dashboard: require('./routes/dashboardRoutes'),
  horarios: require('./routes/horariosRoutes')
};

// Importación de la configuración de la base de datos
const database = require('./config/database');

// Configuración de variables de entorno
const PORT = process.env.PORT || 3001;

/**
 * Configuración de Middleware
 */
// Habilita CORS para permitir peticiones de otros dominios
app.use(cors());
// Parsea el body de las peticiones a JSON
app.use(express.json());
// Logger para desarrollo
app.use(morgan('dev'));

/**
 * Configuración de Rutas API
 * Cada ruta maneja un recurso específico de la aplicación
 */
app.use('/api/usuarios', routes.usuarios);           // Gestión de usuarios
app.use('/api/canchas', routes.canchas);            // Gestión de canchas deportivas
app.use('/api/reservas', routes.reservas);          // Gestión de reservas
app.use('/api/solicitudes', routes.solicitudes);     // Gestión de solicitudes
app.use('/api/respuestas-solicitudes', routes.respuestaSolicitudes); // Respuestas a solicitudes
app.use('/api/ganancias', routes.ganancias);        // Registro de ganancias
app.use('/api/pagos', routes.pagos);                // Gestión de pagos
app.use('/api/auditoria', routes.auditoria);        // Sistema de auditoría
app.use('/api/reportes', routes.reportes);          // Generación de reportes
app.use('/api/notificaciones', routes.notificaciones); // Sistema de notificaciones
app.use('/api/dashboard', routes.dashboard);         // Datos para el dashboard
app.use('/api/horarios', routes.horarios);          // Gestión de horarios

/**
 * Inicialización del servidor
 */
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});