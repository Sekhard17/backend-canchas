// controllers/respuestaSolicitudesController.js - Controlador de RespuestaSolicitud
const RespuestaSolicitud = require('../models/RespuestaSolicitud')

exports.obtenerRespuestas = async (req, res) => {
  try {
    const respuestas = await RespuestaSolicitud.obtenerTodas()
    res.json(respuestas)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuestas' })
  }
}

exports.obtenerRespuestaPorId = async (req, res) => {
  try {
    const respuesta = await RespuestaSolicitud.obtenerPorId(req.params.id)
    if (!respuesta) {
      return res.status(404).json({ error: 'Respuesta no encontrada' })
    }
    res.json(respuesta)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuesta' })
  }
}

exports.crearRespuesta = async (req, res) => {
  try {
    const nuevaRespuesta = await RespuestaSolicitud.crearRespuesta(req.body)
    res.status(201).json(nuevaRespuesta)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear respuesta' })
  }
}

exports.actualizarRespuesta = async (req, res) => {
  try {
    const respuestaActualizada = await RespuestaSolicitud.actualizarRespuesta(req.params.id, req.body)
    if (!respuestaActualizada) {
      return res.status(404).json({ error: 'Respuesta no encontrada' })
    }
    res.json(respuestaActualizada)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar respuesta' })
  }
}

exports.eliminarRespuesta = async (req, res) => {
  try {
    const respuestaEliminada = await RespuestaSolicitud.eliminarRespuesta(req.params.id)
    if (!respuestaEliminada) {
      return res.status(404).json({ error: 'Respuesta no encontrada' })
    }
    res.json({ message: 'Respuesta eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar respuesta' })
  }
}