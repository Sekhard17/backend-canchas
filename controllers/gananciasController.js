// controllers/gananciasController.js - Controlador de Ganancia
const Ganancia = require('../models/Ganancia')

exports.obtenerGanancias = async (req, res) => {
  try {
    const ganancias = await Ganancia.obtenerTodas()
    res.json({
      total: ganancias.length,
      ganancias
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ 
      error: 'Error al obtener ganancias',
      detalle: error.message 
    })
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
    console.error('Error:', error)
    res.status(500).json({ 
      error: 'Error al obtener ganancia',
      detalle: error.message 
    })
  }
}

exports.crearGanancia = async (req, res) => {
  try {
    // Validación de campos requeridos
    const { numero_reservas, periodo, monto_total } = req.body
    if (!numero_reservas || !periodo || !monto_total) {
      return res.status(400).json({ 
        error: 'Campos incompletos',
        mensaje: 'Los campos numero_reservas, periodo y monto_total son obligatorios' 
      })
    }

    // Validar que monto_total sea un número positivo
    if (isNaN(monto_total) || monto_total < 0) {
      return res.status(400).json({ 
        error: 'Monto inválido',
        mensaje: 'El monto total debe ser un número positivo' 
      })
    }

    const nuevaGanancia = await Ganancia.crearGanancia(req.body)
    res.status(201).json(nuevaGanancia)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ 
      error: 'Error al crear ganancia',
      detalle: error.message 
    })
  }
}

exports.actualizarGanancia = async (req, res) => {
  try {
    // Validar que monto_total sea un número positivo si se proporciona
    if (req.body.monto_total && (isNaN(req.body.monto_total) || req.body.monto_total < 0)) {
      return res.status(400).json({ 
        error: 'Monto inválido',
        mensaje: 'El monto total debe ser un número positivo' 
      })
    }

    const gananciaActualizada = await Ganancia.actualizarGanancia(req.params.id, req.body)
    if (!gananciaActualizada) {
      return res.status(404).json({ error: 'Ganancia no encontrada' })
    }
    res.json(gananciaActualizada)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ 
      error: 'Error al actualizar ganancia',
      detalle: error.message 
    })
  }
}

exports.eliminarGanancia = async (req, res) => {
  try {
    const gananciaEliminada = await Ganancia.eliminarGanancia(req.params.id)
    if (!gananciaEliminada) {
      return res.status(404).json({ error: 'Ganancia no encontrada' })
    }
    res.json({ 
      mensaje: 'Ganancia eliminada correctamente',
      ganancia: gananciaEliminada 
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ 
      error: 'Error al eliminar ganancia',
      detalle: error.message 
    })
  }
}