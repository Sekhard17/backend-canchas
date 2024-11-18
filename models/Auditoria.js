// models/Auditoria.js - Modelo de Auditoria
class Auditoria {
    static async obtenerTodas() {
      const { data, error } = await supabase.from('Auditoria').select('*')
      if (error) throw error
      return data
    }
  
    static async obtenerPorId(id) {
      const { data, error } = await supabase.from('Auditoria').select('*').eq('ID_Auditoria', id).single()
      if (error) throw error
      return data
    }
  
    static async crearAuditoria(auditoria) {
      const { data, error } = await supabase.from('Auditoria').insert([auditoria]).select('*')
      if (error) throw error
      return data[0]
    }
  
    static async actualizarAuditoria(id, data) {
      const { data: updatedData, error } = await supabase.from('Auditoria').update(data).eq('ID_Auditoria', id).select('*')
      if (error) throw error
      return updatedData[0]
    }
  
    static async eliminarAuditoria(id) {
      const { data, error } = await supabase.from('Auditoria').delete().eq('ID_Auditoria', id).select('*')
      if (error) throw error
      return data[0]
    }
  }
  
  module.exports = Auditoria