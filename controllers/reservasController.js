// controllers/reservasController.js - Controlador de Reserva
const Reserva = require('../models/Reserva')

exports.obtenerReservas = async (req, res) => {
  try {
    const { date } = req.query;
    console.log('Fecha recibida:', date);

    let reservas;
    if (date) {
      reservas = await Reserva.obtenerPorFecha(date);
    } else {
      reservas = await Reserva.obtenerTodas();
    }
    
    res.json(reservas || []);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ 
      error: 'Error al obtener reservas', 
      details: error.message 
    });
  }
};


exports.obtenerReservaPorId = async (req, res) => {
  try {
    const reserva = await Reserva.obtenerPorId(req.params.id)
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' })
    }
    res.json(reserva)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reserva' })
  }
}

exports.crearReserva = async (req, res) => {
  try {
    const nuevaReserva = await Reserva.crearReserva(req.body)
    res.status(201).json(nuevaReserva)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear reserva' })
  }
}

exports.actualizarReserva = async (req, res) => {
  try {
    const reservaActualizada = await Reserva.actualizarReserva(req.params.id, req.body)
    if (!reservaActualizada) {
      return res.status(404).json({ error: 'Reserva no encontrada' })
    }
    res.json(reservaActualizada)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar reserva' })
  }
}

exports.eliminarReserva = async (req, res) => {
  try {
    const reservaEliminada = await Reserva.eliminarReserva(req.params.id)
    if (!reservaEliminada) {
      return res.status(404).json({ error: 'Reserva no encontrada' })
    }
    res.json({ message: 'Reserva eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar reserva' })
  }
}

exports.obtenerReservasUsuario = async (req, res) => {
  try {
    console.log('Usuario solicitando reservas:', req.user);
    
    const reservas = await Reserva.obtenerPorUsuario(req.user.id);
    
    console.log('Reservas sin procesar:', reservas);
    
    if (reservas && reservas.length > 0) {
      const ejemploReserva = reservas[0];
      console.log('Ejemplo de horarios:', {
        id: ejemploReserva.id_reserva,
        fecha: ejemploReserva.fecha,
        hora_inicio: ejemploReserva.hora_inicio,
        hora_fin: ejemploReserva.hora_fin
      });
    }
    
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas del usuario:', error);
    res.status(500).json({ 
      error: 'Error al obtener reservas del usuario',
      details: error.message 
    });
  }
};




