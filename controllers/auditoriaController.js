// controllers/auditoriaController.js - Controlador de Auditoria
const Auditoria = require('../models/Auditoria')

exports.obtenerAuditorias = async (req, res) => {
  try {
    const auditorias = await Auditoria.obtenerTodas()
    res.json(auditorias)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener auditorías' })
  }
}

exports.obtenerAuditoriaPorId = async (req, res) => {
  try {
    const auditoria = await Auditoria.obtenerPorId(req.params.id)
    if (!auditoria) {
      return res.status(404).json({ error: 'Auditoría no encontrada' })
    }
    res.json(auditoria)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener auditoría' })
  }
}

exports.crearAuditoria = async (req, res) => {
  try {
    const nuevaAuditoria = await Auditoria.crearAuditoria(req.body)
    res.status(201).json(nuevaAuditoria)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear auditoría' })
  }
}

exports.actualizarAuditoria = async (req, res) => {
  try {
    const auditoriaActualizada = await Auditoria.actualizarAuditoria(req.params.id, req.body)
    if (!auditoriaActualizada) {
      return res.status(404).json({ error: 'Auditoría no encontrada' })
    }
    res.json(auditoriaActualizada)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar auditoría' })
  }
}

exports.eliminarAuditoria = async (req, res) => {
  try {
    const auditoriaEliminada = await Auditoria.eliminarAuditoria(req.params.id)
    if (!auditoriaEliminada) {
      return res.status(404).json({ error: 'Auditoría no encontrada' })
    }
    res.json({ message: 'Auditoría eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar auditoría' })
  }
}