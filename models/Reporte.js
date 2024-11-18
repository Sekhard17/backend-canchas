// models/Reporte.js - Modelo de Reporte
const supabase = require('../config/database');  // Importar la instancia de Supabase desde config/database
class Reporte {
    static async obtenerTodos() {
      try {
        console.log('Intentando obtener reportes...')
        const { data, error } = await supabase
          .from('reportes')
          .select(`
            id_reporte,
            fecha_reporte,
            tipo_reporte,
            descripción,
            rut_usuario,
            usuarios (nombre, apellido)
          `)
        
        if (error) {
          console.error('Error de Supabase:', error)
          throw error
        }
        
        console.log('Datos obtenidos:', data)
        return data
      } catch (error) {
        console.error('Error en obtenerTodos:', error)
        throw error
      }
    }
  
    static async obtenerPorId(id) {
      const { data, error } = await supabase
        .from('reportes')
        .select(`
          id_reporte,
          fecha_reporte,
          tipo_reporte,
          descripción,
          rut_usuario,
          usuarios (nombre, apellido)
        `)
        .eq('id_reporte', id)
        .single()
      if (error) throw error
      return data
    }
  
    static async crearReporte(reporte) {
      const reporteData = {
        fecha_reporte: reporte.fecha_reporte || new Date(),
        tipo_reporte: reporte.tipo_reporte,
        descripción: reporte.descripción,
        rut_usuario: reporte.rut_usuario
      }
      
      const { data, error } = await supabase
        .from('reportes')
        .insert([reporteData])
        .select()
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