// controllers/solicitudesController.js - Controlador de Solicitud
const Solicitud = require('../models/Solicitud')

exports.obtenerSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.obtenerTodas()
    res.json({
      success: true,
      data: solicitudes
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
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
    const { motivo, tipo_solicitud, nueva_hora_inicio, nueva_hora_fin, rut_usuario } = req.body

    if (!motivo || !tipo_solicitud || !rut_usuario) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos'
      })
    }

    const solicitud = await Solicitud.crearSolicitud(req.body)
    res.status(201).json({
      success: true,
      data: solicitud
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
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