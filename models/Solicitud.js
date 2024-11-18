// models/Solicitud.js - Modelo de Solicitud
const supabase = require('../config/database')

class Solicitud {
    static async obtenerTodas() {
      try {
        console.log('Obteniendo solicitudes...')
        const { data, error } = await supabase
          .from('solicitudes')  // Cambiado a minúsculas
          .select(`
            id_solicitud,
            fecha_solicitud,
            motivo,
            nueva_hora_inicio,
            nueva_hora_fin,
            tipo_solicitud,
            estado_solicitud,
            rut_usuario,
            usuarios (nombre, apellido)
          `)
        
        if (error) {
          console.error('Error de Supabase:', error)
          throw error
        }
        return data
      } catch (error) {
        console.error('Error en obtenerTodas:', error)
        throw error
      }
    }
  
    static async obtenerPorId(id) {
      const { data, error } = await supabase
        .from('solicitudes')
        .select(`
          id_solicitud,
          fecha_solicitud,
          motivo,
          nueva_hora_inicio,
          nueva_hora_fin,
          tipo_solicitud,
          estado_solicitud,
          rut_usuario,
          usuarios (nombre, apellido)
        `)
        .eq('id_solicitud', id)  // Cambiado a id_solicitud
        .single()
      if (error) throw error
      return data
    }
  
    static async crearSolicitud(solicitud) {
      const solicitudData = {
        fecha_solicitud: solicitud.fecha_solicitud || new Date(),
        motivo: solicitud.motivo,
        nueva_hora_inicio: solicitud.nueva_hora_inicio,
        nueva_hora_fin: solicitud.nueva_hora_fin,
        tipo_solicitud: solicitud.tipo_solicitud,
        estado_solicitud: solicitud.estado_solicitud || 'pendiente',
        rut_usuario: solicitud.rut_usuario
      }
      
      const { data, error } = await supabase
        .from('solicitudes')
        .insert([solicitudData])
        .select()
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