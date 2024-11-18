// controllers/notificacionesController.js - Controlador de Notificacion
const Notificacion = require('../models/Notificacion')

exports.obtenerNotificaciones = async (req, res) => {
  try {
    const notificaciones = await Notificacion.obtenerTodas()
    res.json(notificaciones)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener notificaciones' })
  }
}

exports.obtenerNotificacionPorId = async (req, res) => {
  try {
    const notificacion = await Notificacion.obtenerPorId(req.params.id)
    if (!notificacion) {
      return res.status(404).json({ error: 'Notificación no encontrada' })
    }
    res.json(notificacion)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener notificación' })
  }
}

exports.crearNotificacion = async (req, res) => {
  try {
    const nuevaNotificacion = await Notificacion.crearNotificacion(req.body)
    res.status(201).json(nuevaNotificacion)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear notificación' })
  }
}

exports.actualizarNotificacion = async (req, res) => {
  try {
    const notificacionActualizada = await Notificacion.actualizarNotificacion(req.params.id, req.body)
    if (!notificacionActualizada) {
      return res.status(404).json({ error: 'Notificación no encontrada' })
    }
    res.json(notificacionActualizada)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar notificación' })
  }
}

exports.eliminarNotificacion = async (req, res) => {
  try {
    const notificacionEliminada = await Notificacion.eliminarNotificacion(req.params.id)
    if (!notificacionEliminada) {
      return res.status(404).json({ error: 'Notificación no encontrada' })
    }
    res.json({ message: 'Notificación eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar notificación' })
  }
}