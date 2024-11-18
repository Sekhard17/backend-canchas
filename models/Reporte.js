// models/Reporte.js - Modelo de Reporte
class Reporte {
    static async obtenerTodos() {
      const { data, error } = await supabase.from('Reportes').select('*')
      if (error) throw error
      return data
    }
  
    static async obtenerPorId(id) {
      const { data, error } = await supabase.from('Reportes').select('*').eq('ID_Reporte', id).single()
      if (error) throw error
      return data
    }
  
    static async crearReporte(reporte) {
      const { data, error } = await supabase.from('Reportes').insert([reporte]).select('*')
      if (error) throw error
      return data[0]
    }
  
    static async actualizarReporte(id, data) {
      const { data: updatedData, error } = await supabase.from('Reportes').update(data).eq('ID_Reporte', id).select('*')
      if (error) throw error
      return updatedData[0]
    }
  
    static async eliminarReporte(id) {
      const { data, error } = await supabase.from('Reportes').delete().eq('ID_Reporte', id).select('*')
      if (error) throw error
      return data[0]
    }
  }
  
  module.exports = Reporte