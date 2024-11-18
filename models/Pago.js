// models/Pago.js - Modelo de Pago
const supabase = require('../config/database'); // Importar la instancia de Supabase desde config/database

class Pago {
  static async obtenerTodos() {
    const { data, error } = await supabase.from('pagos').select('*'); // "pagos" en minúsculas
    if (error) throw error;
    return data;
  }

  static async obtenerPorId(id) {
    const { data, error } = await supabase.from('pagos').select('*').eq('id_pago', id).single(); // "id_pago" en minúsculas
    if (error) throw error;
    return data;
  }

  static async crearPago(pago) {
    const { data, error } = await supabase.from('pagos').insert([pago]).select('*'); // "pagos" en minúsculas
    if (error) throw error;
    return data[0];
  }

  static async actualizarPago(id, data) {
    const { data: updatedData, error } = await supabase.from('pagos').update(data).eq('id_pago', id).select('*'); // "id_pago" en minúsculas
    if (error) throw error;
    return updatedData[0];
  }

  static async eliminarPago(id) {
    const { data, error } = await supabase.from('pagos').delete().eq('id_pago', id).select('*'); // "id_pago" en minúsculas
    if (error) throw error;
    return data[0];
  }

  // Nuevo método para obtener los pagos por usuario
  static async obtenerPorUsuario(rutUsuario) {
    const { data, error } = await supabase.from('pagos').select('*').eq('rut_usuario', rutUsuario); // Obtener pagos por RUT de usuario
    if (error) throw error;
    return data;
  }

  // Obtener pagos con información relacionada
  static async obtenerTodosDetallado() {
    try {
      const { data, error } = await supabase
        .from('pagos')
        .select(`
          *,
          usuarios (nombre, apellido),
          reservas (fecha, hora_inicio, hora_fin),
          ganancias (periodo, monto_total)
        `)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error en obtenerTodosDetallado:', error)
      throw error
    }
  }

  // Obtener pagos por estado
  static async obtenerPorEstado(estado) {
    try {
      const { data, error } = await supabase
        .from('pagos')
        .select('*')
        .eq('estado', estado)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error en obtenerPorEstado:', error)
      throw error
    }
  }

  // Obtener pagos por rango de fechas
  static async obtenerPorRangoFechas(fechaInicio, fechaFin) {
    try {
      const { data, error } = await supabase
        .from('pagos')
        .select('*')
        .gte('fecha_pago', fechaInicio)
        .lte('fecha_pago', fechaFin)
        .order('fecha_pago', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error en obtenerPorRangoFechas:', error)
      throw error
    }
  }

  // Obtener estadísticas de pagos
  static async obtenerEstadisticas() {
    try {
      const { data, error } = await supabase
        .from('pagos')
        .select('monto, estado, metodo_pago')

      if (error) throw error

      const estadisticas = {
        total: data.reduce((sum, pago) => sum + parseFloat(pago.monto), 0),
        porEstado: data.reduce((acc, pago) => {
          acc[pago.estado] = (acc[pago.estado] || 0) + 1
          return acc
        }, {}),
        porMetodoPago: data.reduce((acc, pago) => {
          acc[pago.metodo_pago] = (acc[pago.metodo_pago] || 0) + 1
          return acc
        }, {})
      }

      return estadisticas
    } catch (error) {
      console.error('Error en obtenerEstadisticas:', error)
      throw error
    }
  }

  // Validar pago antes de crear/actualizar
  static validarPago(pago) {
    const errores = []

    if (!pago.monto || pago.monto <= 0) {
      errores.push('El monto debe ser mayor a 0')
    }

    if (!pago.metodo_pago) {
      errores.push('El método de pago es requerido')
    }

    if (!pago.rut_usuario) {
      errores.push('El RUT del usuario es requerido')
    }

    if (!pago.id_reserva) {
      errores.push('El ID de reserva es requerido')
    }

    if (!pago.id_ganancia) {
      errores.push('El ID de ganancia es requerido')
    }

    return errores
  }

  // Crear pago con validación
  static async crearPago(pago) {
    try {
      const errores = this.validarPago(pago)
      if (errores.length > 0) {
        throw new Error('Errores de validación: ' + errores.join(', '))
      }

      const { data, error } = await supabase
        .from('pagos')
        .insert([{
          ...pago,
          fecha_pago: new Date().toISOString(),
          estado: pago.estado || 'pendiente'
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error en crearPago:', error)
      throw error
    }
  }
}

module.exports = Pago;
