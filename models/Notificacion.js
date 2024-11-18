// models/Notificacion.js - Modelo de Notificacion
class Notificacion {
    static async obtenerTodas() {
      const { data, error } = await supabase.from('Notificaciones').select('*')
      if (error) throw error
      return data
    }
  
    static async obtenerPorId(id) {
      const { data, error } = await supabase.from('Notificaciones').select('*').eq('ID_Notificacion', id).single()
      if (error) throw error
      return data
    }
  
    static async crearNotificacion(notificacion) {
      const { data, error } = await supabase.from('Notificaciones').insert([notificacion]).select('*')
      if (error) throw error
      return data[0]
    }
  
    static async actualizarNotificacion(id, data) {
      const { data: updatedData, error } = await supabase.from('Notificaciones').update(data).eq('ID_Notificacion', id).select('*')
      if (error) throw error
      return updatedData[0]
    }
  
    static async eliminarNotificacion(id) {
      const { data, error } = await supabase.from('Notificaciones').delete().eq('ID_Notificacion', id).select('*')
      if (error) throw error
      return data[0]
    }
  }
  
  module.exports = Notificacion