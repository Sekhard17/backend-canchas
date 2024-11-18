// models/Ganancia.js - Modelo de Ganancia
const supabase = require('../config/database')

class Ganancia {
    static async obtenerTodas() {
      try {
        const { data, error } = await supabase
          .from('ganancias')  // Cambiado a minúsculas
          .select(`
            id_ganancia,
            numero_reservas,
            periodo,
            monto_total,
            fecha
          `)
          .order('fecha', { ascending: false })

        if (error) throw error
        return data
      } catch (error) {
        console.error('Error en obtenerTodas:', error)
        throw error
      }
    }
  
    static async obtenerPorId(id) {
      const { data, error } = await supabase
        .from('ganancias')
        .select(`
          id_ganancia,
          numero_reservas,
          periodo,
          monto_total,
          fecha
        `)
        .eq('id_ganancia', id)  // Cambiado a id_ganancia
        .single()
      if (error) throw error
      return data
    }
  
    static async crearGanancia(ganancia) {
      // Validar campos requeridos
      const gananciaData = {
        numero_reservas: ganancia.numero_reservas,
        periodo: ganancia.periodo,
        monto_total: ganancia.monto_total,
        fecha: ganancia.fecha || new Date().toISOString().split('T')[0]
      }
      
      const { data, error } = await supabase
        .from('ganancias')
        .insert([gananciaData])
        .select()
      if (error) throw error
      return data[0]
    }
  
    static async actualizarGanancia(id, ganancia) {
      const { data, error } = await supabase
        .from('ganancias')
        .update(ganancia)
        .eq('id_ganancia', id)
        .select()
      if (error) throw error
      return data[0]
    }
  
    static async eliminarGanancia(id) {
      const { data, error } = await supabase
        .from('ganancias')
        .delete()
        .eq('id_ganancia', id)
        .select()
      if (error) throw error
      return data[0]
    }
}

module.exports = Ganancia