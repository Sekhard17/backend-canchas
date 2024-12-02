// models/RespuestaSolicitud.js - Modelo de RespuestaSolicitud
const supabase = require('../config/database')

class RespuestaSolicitud {
    static async obtenerPorSolicitud(id_solicitud) {
      try {
        const { data, error } = await supabase
          .from('respuesta_solicitud')
          .select(`
            id_respuesta,
            fecha_respuesta,
            respuesta,
            estado,
            id_solicitud
          `)
          .eq('id_solicitud', id_solicitud)
          .single()

        if (error) throw error
        return data
      } catch (error) {
        console.error('Error en obtenerPorSolicitud:', error)
        throw new Error('Error al obtener la respuesta')
      }
    }

    static async crearRespuesta(respuestaData) {
      try {
        const nuevaRespuesta = {
          fecha_respuesta: new Date().toISOString(),
          respuesta: respuestaData.respuesta,
          estado: respuestaData.estado,
          id_solicitud: respuestaData.id_solicitud
        }

        const { data, error } = await supabase
          .from('respuesta_solicitud')
          .insert([nuevaRespuesta])
          .select()

        if (error) throw error

        // Actualizar el estado de la solicitud
        await supabase
          .from('solicitudes')
          .update({ estado_solicitud: respuestaData.estado })
          .eq('id_solicitud', respuestaData.id_solicitud)

        return data[0]
      } catch (error) {
        console.error('Error en crearRespuesta:', error)
        throw new Error('Error al crear la respuesta')
      }
    }
}

module.exports = RespuestaSolicitud