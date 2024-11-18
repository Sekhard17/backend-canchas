// models/RespuestaSolicitud.js - Modelo de RespuestaSolicitud
class RespuestaSolicitud {
    static async obtenerTodas() {
      const { data, error } = await supabase.from('Respuesta_solicitud').select('*')
      if (error) throw error
      return data
    }
  
    static async obtenerPorId(id) {
      const { data, error } = await supabase.from('Respuesta_solicitud').select('*').eq('ID_Respuesta', id).single()
      if (error) throw error
      return data
    }
  
    static async crearRespuesta(respuesta) {
      const { data, error } = await supabase.from('Respuesta_solicitud').insert([respuesta]).select('*')
      if (error) throw error
      return data[0]
    }
  
    static async actualizarRespuesta(id, data) {
      const { data: updatedData, error } = await supabase.from('Respuesta_solicitud').update(data).eq('ID_Respuesta', id).select('*')
      if (error) throw error
      return updatedData[0]
    }
  
    static async eliminarRespuesta(id) {
      const { data, error } = await supabase.from('Respuesta_solicitud').delete().eq('ID_Respuesta', id).select('*')
      if (error) throw error
      return data[0]
    }
  }
  
  module.exports = RespuestaSolicitud