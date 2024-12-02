// models/Reserva.js - Modelo para gestionar las reservas de canchas
const supabase = require('../config/database')

class Reserva {
    /**
     * Obtiene todas las reservas con información básica de las canchas asociadas
     * @returns {Promise<Array>} Array de reservas con datos de canchas
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerTodas() {
        try {
            const { data, error } = await supabase
                .from('reservas')
                .select(`
                    *,
                    cancha:canchas (
                        nombre,
                        ubicacion
                    )
                `)
            if (error) throw error
            return data
        } catch (error) {
            console.error('Error en obtenerTodas:', error)
            throw error
        }
    }

    /**
     * Busca una reserva específica por su ID
     * @param {number} id - ID de la reserva a buscar
     * @returns {Promise<Object>} Datos de la reserva con información de la cancha
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerPorId(id) {
        try {
            const { data, error } = await supabase
                .from('reservas')
                .select(`
                    *,
                    cancha:canchas (
                        nombre,
                        ubicacion
                    )
                `)
                .eq('id_reserva', id)
                .single()
            if (error) throw error
            return data
        } catch (error) {
            console.error('Error en obtenerPorId:', error)
            throw error
        }
    }

    /**
     * Crea una nueva reserva
     * @param {Object} reserva - Objeto con los datos de la reserva
     * @returns {Promise<Object>} Datos de la reserva creada
     * @throws {Error} Si hay un error en la inserción
     */
    static async crearReserva(reserva) {
        try {
            const { data, error } = await supabase
                .from('reservas')
                .insert([reserva])
                .select('*')
            if (error) throw error
            return data[0]
        } catch (error) {
            console.error('Error en crearReserva:', error)
            throw error
        }
    }

    /**
     * Actualiza una reserva existente
     * @param {number} id - ID de la reserva a actualizar
     * @param {Object} data - Datos a actualizar
     * @returns {Promise<Object>} Datos de la reserva actualizada
     * @throws {Error} Si hay un error en la actualización
     */
    static async actualizarReserva(id, data) {
        try {
            const { data: updatedData, error } = await supabase
                .from('reservas')
                .update(data)
                .eq('id_reserva', id)
                .select('*')
            if (error) throw error
            return updatedData[0]
        } catch (error) {
            console.error('Error en actualizarReserva:', error)
            throw error
        }
    }

    /**
     * Elimina una reserva
     * @param {number} id - ID de la reserva a eliminar
     * @returns {Promise<Object>} Datos de la reserva eliminada
     * @throws {Error} Si hay un error en la eliminación
     */
    static async eliminarReserva(id) {
        try {
            const { data, error } = await supabase
                .from('reservas')
                .delete()
                .eq('id_reserva', id)
                .select('*')
            if (error) throw error
            return data[0]
        } catch (error) {
            console.error('Error en eliminarReserva:', error)
            throw error
        }
    }

    /**
     * Obtiene todas las reservas de un usuario específico
     * @param {string} rutUsuario - RUT del usuario
     * @returns {Promise<Array>} Array de reservas con información detallada de las canchas
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerPorUsuario(rutUsuario) {
        try {
            const { data, error } = await supabase
                .from('reservas')
                .select(`
                    *,
                    cancha:canchas (
                        id_cancha,
                        nombre,
                        ubicacion,
                        tipo,
                        precio_hora,
                        estado
                    )
                `)
                .eq('rut_usuario', rutUsuario)
                .order('fecha', { ascending: false })

            if (error) {
                console.error('Error en la consulta:', error)
                throw error
            }

            console.log('Datos crudos de Supabase:', data)
            if (data && data.length > 0) {
                console.log('Primera reserva:', {
                    id: data[0].id_reserva,
                    hora_inicio: data[0].hora_inicio,
                    hora_fin: data[0].hora_fin
                })
            }

            return data
        } catch (error) {
            console.error('Error en obtenerPorUsuario:', error)
            throw error
        }
    }

    /**
     * Obtiene todas las reservas para una fecha específica
     * @param {string} fecha - Fecha en formato YYYY-MM-DD
     * @returns {Promise<Array>} Array de reservas con información de canchas y usuarios
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerPorFecha(fecha) {
        try {
            console.log('Fecha recibida en el modelo:', fecha)

            const { data, error } = await supabase
                .from('reservas')
                .select(`
                    *,
                    cancha:canchas (
                        nombre,
                        ubicacion
                    ),
                    usuario:usuarios (
                        nombre,
                        email,
                        telefono
                    )
                `)
                .eq('fecha', fecha)
                .order('hora_inicio')
            
            if (error) {
                console.error('Error en la consulta:', error)
                throw error
            }

            console.log('Resultados encontrados:', data?.length || 0)
            return data || []
        } catch (error) {
            console.error('Error en obtenerPorFecha:', error)
            throw error
        }
    }
}

module.exports = Reserva