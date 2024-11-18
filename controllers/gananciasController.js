// controllers/gananciasController.js - Controlador de Ganancia
const Ganancia = require('../models/Ganancia')

exports.obtenerGanancias = async (req, res) => {
  try {
    const ganancias = await Ganancia.obtenerTodas()
    res.json(ganancias)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ganancias' })
  }
}

exports.obtenerGananciaPorId = async (req, res) => {
  try {
    const ganancia = await Ganancia.obtenerPorId(req.params.id)
    if (!ganancia) {
      return res.status(404).json({ error: 'Ganancia no encontrada' })
    }
    res.json(ganancia)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ganancia' })
  }
}

exports.crearGanancia = async (req, res) => {
  try {
    const nuevaGanancia = await Ganancia.crearGanancia(req.body)
    res.status(201).json(nuevaGanancia)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear ganancia' })
  }
}

exports.actualizarGanancia = async (req, res) => {
  try {
    const gananciaActualizada = await Ganancia.actualizarGanancia(req.params.id, req.body)
    if (!gananciaActualizada) {
      return res.status(404).json({ error: 'Ganancia no encontrada' })
    }
    res.json(gananciaActualizada)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar ganancia' })
  }
}

exports.eliminarGanancia = async (req, res) => {
  try {
    const gananciaEliminada = await Ganancia.eliminarGanancia(req.params.id)
    if (!gananciaEliminada) {
      return res.status(404).json({ error: 'Ganancia no encontrada' })
    }
    res.json({ message: 'Ganancia eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar ganancia' })
  }
}