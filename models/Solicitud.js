// models/Solicitud.js - Modelo para gestionar las solicitudes de cambios en reservas
const supabase = require('../config/database')

class Solicitud {
    /**
     * Obtiene todas las solicitudes con información del usuario asociado
     * @returns {Promise<Array>} Array de solicitudes que incluye:
     *  - Datos básicos de la solicitud
     *  - Información del usuario (nombre y apellido)
     * @throws {Error} Si hay un error al obtener las solicitudes
     */
    static async obtenerTodas() {
      try {
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
            usuarios (
              nombre, 
              apellido
            )
          `)
          .order('fecha_solicitud', { ascending: false })
        
        if (error) throw error
        return data
      } catch (error) {
        console.error('Error en obtenerTodas:', error)
        throw new Error('Error al obtener las solicitudes')
      }
    }

    /**
     * Obtiene todas las solicitudes de un usuario específico
     * @param {string} rut_usuario - RUT del usuario
     * @returns {Promise<Array>} Array de solicitudes del usuario que incluye:
     *  - ID de la solicitud
     *  - Fecha de solicitud
     *  - Motivo
     *  - Nueva hora inicio y fin
     *  - Tipo y estado de la solicitud
     * @throws {Error} Si hay un error al obtener las solicitudes del usuario
     */
    static async obtenerPorUsuario(rut_usuario) {
      try {
        const { data, error } = await supabase
          .from('solicitudes')
          .select(`
            id_solicitud,
            fecha_solicitud,
            motivo,
            nueva_hora_inicio,
            nueva_hora_fin,
            tipo_solicitud,
            estado_solicitud
          `)
          .eq('rut_usuario', rut_usuario)
          .order('fecha_solicitud', { ascending: false })

        if (error) throw error
        return data
      } catch (error) {
        throw new Error('Error al obtener las solicitudes del usuario')
      }
    }

    /**
     * Crea una nueva solicitud en el sistema
     * @param {Object} solicitudData - Datos de la solicitud
     * @param {string} solicitudData.motivo - Motivo de la solicitud
     * @param {string} solicitudData.nueva_hora_inicio - Nueva hora de inicio propuesta
     * @param {string} solicitudData.nueva_hora_fin - Nueva hora de fin propuesta
     * @param {string} solicitudData.tipo_solicitud - Tipo de solicitud
     * @param {string} solicitudData.rut_usuario - RUT del usuario que realiza la solicitud
     * @returns {Promise<Object>} Datos de la solicitud creada
     * @throws {Error} Si hay un error al crear la solicitud
     */
    static async crearSolicitud(solicitudData) {
      try {
        const nuevaSolicitud = {
          fecha_solicitud: new Date().toISOString(),
          motivo: solicitudData.motivo,
          nueva_hora_inicio: solicitudData.nueva_hora_inicio,
          nueva_hora_fin: solicitudData.nueva_hora_fin,
          tipo_solicitud: solicitudData.tipo_solicitud,
          estado_solicitud: 'Pendiente',
          rut_usuario: solicitudData.rut_usuario
        }

        const { data, error } = await supabase
          .from('solicitudes')
          .insert([nuevaSolicitud])
          .select()

        if (error) throw error
        return data[0]
      } catch (error) {
        console.error('Error en crearSolicitud:', error)
        throw new Error('Error al crear la solicitud')
      }
    }

    /**
     * Actualiza el estado de una solicitud existente
     * @param {number} id_solicitud - ID de la solicitud a actualizar
     * @param {Object} datos - Datos a actualizar
     * @param {string} datos.estado_solicitud - Nuevo estado ('Aprobada', 'Rechazada', 'Pendiente')
     * @param {string} [datos.motivo_respuesta] - Motivo opcional de la respuesta
     * @returns {Promise<Object>} Datos de la solicitud actualizada
     * @throws {Error} Si hay un error al actualizar la solicitud
     */
    static async actualizarSolicitud(id_solicitud, datos) {
        try {
            // Validar el estado
            const estadosValidos = ['Aprobada', 'Rechazada', 'Pendiente']
            if (datos.estado_solicitud && !estadosValidos.includes(datos.estado_solicitud)) {
                throw new Error('Estado de solicitud no válido')
            }

            const { data, error } = await supabase
                .from('solicitudes')
                .update({
                    estado_solicitud: datos.estado_solicitud,
                    motivo_respuesta: datos.motivo_respuesta,
                    fecha_respuesta: new Date().toISOString()
                })
                .eq('id_solicitud', id_solicitud)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error en actualizarSolicitud:', error)
            throw new Error('Error al actualizar la solicitud')
        }
    }

    /**
     * Anula/elimina una solicitud existente
     * @param {number} id_solicitud - ID de la solicitud a anular
     * @returns {Promise<Object>} Datos de la solicitud anulada
     * @throws {Error} Si hay un error al anular la solicitud o la solicitud no existe
     */
    static async anularSolicitud(id_solicitud) {
        try {
            // Primero verificamos si la solicitud existe y está en estado pendiente
            const { data: solicitudExistente, error: errorConsulta } = await supabase
                .from('solicitudes')
                .select('estado_solicitud')
                .eq('id_solicitud', id_solicitud)
                .single()

            if (errorConsulta) throw new Error('Error al verificar la solicitud')
            if (!solicitudExistente) throw new Error('Solicitud no encontrada')
            if (solicitudExistente.estado_solicitud !== 'Pendiente') {
                throw new Error('Solo se pueden anular solicitudes pendientes')
            }

            const { data, error } = await supabase
                .from('solicitudes')
                .delete()
                .eq('id_solicitud', id_solicitud)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error en anularSolicitud:', error)
            throw error
        }
    }
}

module.exports = Solicitud