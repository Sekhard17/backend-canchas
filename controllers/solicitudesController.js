// controllers/solicitudesController.js - Controlador de Solicitud
const Solicitud = require('../models/Solicitud')

exports.obtenerSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.obtenerTodas()
    res.json(solicitudes)
  } catch (error) {
    console.error('Error detallado:', error)
    res.status(500).json({ 
      error: 'Error al obtener solicitudes',
      mensaje: error.message,
      detalles: error.details
    })
  }
}

exports.obtenerSolicitudPorId = async (req, res) => {
  try {
    const solicitud = await Solicitud.obtenerPorId(req.params.id)
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }
    res.json(solicitud)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener solicitud' })
  }
}

exports.crearSolicitud = async (req, res) => {
  try {
    // Validación de campos requeridos
    const { motivo, tipo_solicitud, rut_usuario } = req.body
    if (!motivo || !tipo_solicitud || !rut_usuario) {
      return res.status(400).json({ 
        error: 'Los campos motivo, tipo_solicitud y rut_usuario son obligatorios' 
      })
    }

    const nuevaSolicitud = await Solicitud.crearSolicitud(req.body)
    res.status(201).json(nuevaSolicitud)
  } catch (error) {
    console.error('Error al crear solicitud:', error)
    res.status(500).json({ 
      error: 'Error al crear solicitud',
      detalle: error.message 
    })
  }
}

exports.actualizarSolicitud = async (req, res) => {
  try {
    const solicitudActualizada = await Solicitud.actualizarSolicitud(req.params.id, req.body)
    if (!solicitudActualizada) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }
    res.json(solicitudActualizada)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar solicitud' })
  }
}

exports.eliminarSolicitud = async (req, res) => {
  try {
    const solicitudEliminada = await Solicitud.eliminarSolicitud(req.params.id)
    if (!solicitudEliminada) {
      return res.status(404).json({ error: 'Solicitud no encontrada' })
    }
    res.json({ message: 'Solicitud eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar solicitud' })
  }
}