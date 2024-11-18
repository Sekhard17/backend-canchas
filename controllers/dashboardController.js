// controllers/dashboardController.js - Controlador del Dashboard
const Reserva = require('../models/Reserva');
const Pago = require('../models/Pago'); // Modelo de Pago

exports.obtenerDatosDashboard = async (req, res) => {
  try {
    const rutUsuario = req.user.RUT; // Obtenemos el RUT del usuario autenticado desde el token.

    // Consultar las reservas del usuario.
    const reservas = await Reserva.obtenerPorUsuario(rutUsuario);
    const totalReservas = reservas.length;

    // Consultar los pagos del usuario.
    const pagos = await Pago.obtenerPorUsuario(rutUsuario);
    const saldoGastado = pagos.reduce((total, pago) => total + (pago.monto || 0), 0);

    // Determinar la cancha favorita y el horario favorito.
    const canchaCount = {};
    const horarioCount = {};
    reservas.forEach((reserva) => {
      // Contar las canchas.
      canchaCount[reserva.id_cancha] = (canchaCount[reserva.id_cancha] || 0) + 1;

      // Contar los horarios.
      const horario = `${reserva.hora_inicio} - ${reserva.hora_fin}`;
      horarioCount[horario] = (horarioCount[horario] || 0) + 1;
    });

    const canchaFavoritaId = Object.keys(canchaCount).reduce((a, b) => canchaCount[a] > canchaCount[b] ? a : b, '');
    const canchaFavorita = reservas.find(reserva => reserva.id_cancha === parseInt(canchaFavoritaId))?.nombre_cancha || 'Ninguna';
    const horarioFavorito = Object.keys(horarioCount).reduce((a, b) => horarioCount[a] > horarioCount[b] ? a : b, '') || 'No definido';

    // Devolvemos la respuesta consolidada en un objeto JSON.
    res.json({
      totalReservas,
      saldoGastado,
      canchaFavorita,
      horarioFavorito,
      reservas,
      pagos,
    });
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    res.status(500).json({ error: 'Error al obtener los datos del dashboard' });
  }
};
