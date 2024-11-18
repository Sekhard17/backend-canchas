// controllers/reportesController.js - Controlador de Reporte
const Reporte = require('../models/Reporte')

exports.obtenerReportes = async (req, res) => {
  try {
    const reportes = await Reporte.obtenerTodos()
    res.json(reportes)
  } catch (error) {
    console.error('Error detallado:', error)
    res.status(500).json({ 
      error: 'Error al obtener reportes',
      mensaje: error.message,
      detalles: error.details
    })
  }
}

exports.obtenerReportePorId = async (req, res) => {
  try {
    const reporte = await Reporte.obtenerPorId(req.params.id)
    if (!reporte) {
      return res.status(404).json({ error: 'Reporte no encontrado' })
    }
    res.json(reporte)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reporte' })
  }
}

exports.crearReporte = async (req, res) => {
  try {
    // Validación de campos requeridos
    const { tipo_reporte, descripción, rut_usuario } = req.body
    if (!tipo_reporte || !descripción || !rut_usuario) {
      return res.status(400).json({ 
        error: 'Los campos tipo_reporte, descripción y rut_usuario son obligatorios' 
      })
    }

    const nuevoReporte = await Reporte.crearReporte(req.body)
    res.status(201).json(nuevoReporte)
  } catch (error) {
    console.error('Error al crear reporte:', error)
    res.status(500).json({ 
      error: 'Error al crear reporte',
      detalle: error.message 
    })
  }
}

exports.actualizarReporte = async (req, res) => {
  try {
    const reporteActualizado = await Reporte.actualizarReporte(req.params.id, req.body)
    if (!reporteActualizado) {
      return res.status(404).json({ error: 'Reporte no encontrado' })
    }
    res.json(reporteActualizado)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar reporte' })
  }
}

exports.eliminarReporte = async (req, res) => {
  try {
    const reporteEliminado = await Reporte.eliminarReporte(req.params.id)
    if (!reporteEliminado) {
      return res.status(404).json({ error: 'Reporte no encontrado' })
    }
    res.json({ message: 'Reporte eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar reporte' })
  }
}