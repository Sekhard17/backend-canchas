// models/Solicitud.js - Modelo de Solicitud
class Solicitud {
    static async obtenerTodas() {
      const { data, error } = await supabase.from('Solicitudes').select('*')
      if (error) throw error
      return data
    }
  
    static async obtenerPorId(id) {
      const { data, error } = await supabase.from('Solicitudes').select('*').eq('ID_Solicitud', id).single()
      if (error) throw error
      return data
    }
  
    static async crearSolicitud(solicitud) {
      const { data, error } = await supabase.from('Solicitudes').insert([solicitud]).select('*')
      if (error) throw error
      return data[0]
    }
  
    static async actualizarSolicitud(id, data) {
      const { data: updatedData, error } = await supabase.from('Solicitudes').update(data).eq('ID_Solicitud', id).select('*')
      if (error) throw error
      return updatedData[0]
    }
  
    static async eliminarSolicitud(id) {
      const { data, error } = await supabase.from('Solicitudes').delete().eq('ID_Solicitud', id).select('*')
      if (error) throw error
      return data[0]
    }
  }
  
  module.exports = Solicitud