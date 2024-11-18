// models/Ganancia.js - Modelo de Ganancia
class Ganancia {
    static async obtenerTodas() {
      const { data, error } = await supabase.from('Ganancias').select('*')
      if (error) throw error
      return data
    }
  
    static async obtenerPorId(id) {
      const { data, error } = await supabase.from('Ganancias').select('*').eq('ID_Ganancia', id).single()
      if (error) throw error
      return data
    }
  
    static async crearGanancia(ganancia) {
      const { data, error } = await supabase.from('Ganancias').insert([ganancia]).select('*')
      if (error) throw error
      return data[0]
    }
  
    static async actualizarGanancia(id, data) {
      const { data: updatedData, error } = await supabase.from('Ganancias').update(data).eq('ID_Ganancia', id).select('*')
      if (error) throw error
      return updatedData[0]
    }
  
    static async eliminarGanancia(id) {
      const { data, error } = await supabase.from('Ganancias').delete().eq('ID_Ganancia', id).select('*')
      if (error) throw error
      return data[0]
    }
  }
  
  module.exports = Ganancia