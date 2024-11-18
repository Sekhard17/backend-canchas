// controllers/pagosController.js - Controlador de Pago
const Pago = require('../models/Pago');

exports.obtenerPagos = async (req, res) => {
  try {
    const pagos = await Pago.obtenerTodos();
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pagos' });
  }
};

exports.obtenerPagoPorId = async (req, res) => {
  try {
    const pago = await Pago.obtenerPorId(req.params.id);
    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json(pago);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pago' });
  }
};

exports.crearPago = async (req, res) => {
  try {
    const { rut_usuario, monto, id_reserva, id_ganancia, metodo_pago } = req.body;

    const nuevoPago = await Pago.crearPago({
      rut_usuario,
      monto,
      fecha_pago: new Date(),
      metodo_pago,
      estado: 'Completado',
      id_reserva,
      id_ganancia
    });

    res.status(201).json(nuevoPago);
  } catch (error) {
    console.error('Error al crear pago:', error);
    res.status(500).json({ error: 'Error al crear pago' });
  }
};

exports.actualizarPago = async (req, res) => {
  try {
    const pagoActualizado = await Pago.actualizarPago(req.params.id, req.body);
    if (!pagoActualizado) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json(pagoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar pago' });
  }
};

exports.eliminarPago = async (req, res) => {
  try {
    const pagoEliminado = await Pago.eliminarPago(req.params.id);
    if (!pagoEliminado) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json({ message: 'Pago eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar pago' });
  }
};

exports.obtenerPagosDetallados = async (req, res) => {
  try {
    const pagos = await Pago.obtenerTodosDetallado();
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pagos detallados' });
  }
};

exports.obtenerPagosPorEstado = async (req, res) => {
  try {
    const pagos = await Pago.obtenerPorEstado(req.params.estado);
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pagos por estado' });
  }
};

exports.obtenerPagosPorFecha = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const pagos = await Pago.obtenerPorRangoFechas(fechaInicio, fechaFin);
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pagos por fecha' });
  }
};

exports.obtenerEstadisticas = async (req, res) => {
  try {
    const estadisticas = await Pago.obtenerEstadisticas();
    res.json(estadisticas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};
