// models/Pago.js - Modelo para gestionar los pagos de reservas de canchas
const supabase = require('../config/database')

class Pago {
    /**
     * Obtiene todos los pagos registrados
     * @returns {Promise<Array>} Lista de todos los pagos
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerTodos() {
        const { data, error } = await supabase.from('pagos').select('*')
        if (error) throw error
        return data
    }

    /**
     * Obtiene un pago específico por su ID
     * @param {number} id - ID del pago a buscar
     * @returns {Promise<Object>} Datos del pago encontrado
     * @throws {Error} Si hay un error en la consulta o no se encuentra el pago
     */
    static async obtenerPorId(id) {
        const { data, error } = await supabase
            .from('pagos')
            .select('*')
            .eq('id_pago', id)
            .single()
        if (error) throw error
        return data
    }

    /**
     * Crea un nuevo registro de pago
     * @param {Object} pago - Datos del pago a crear
     * @returns {Promise<Object>} Datos del pago creado
     * @throws {Error} Si hay errores de validación o en la creación
     */
    static async crearPago(pago) {
        try {
            const errores = this.validarPago(pago)
            if (errores.length > 0) {
                throw new Error('Errores de validación: ' + errores.join(', '))
            }

            const { data, error } = await supabase
                .from('pagos')
                .insert([{
                    ...pago,
                    fecha_pago: new Date().toISOString(),
                    estado: pago.estado || 'pendiente'
                }])
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error en crearPago:', error)
            throw error
        }
    }

    /**
     * Actualiza un pago existente
     * @param {number} id - ID del pago a actualizar
     * @param {Object} data - Datos a actualizar
     * @returns {Promise<Object>} Datos del pago actualizado
     * @throws {Error} Si hay un error en la actualización
     */
    static async actualizarPago(id, data) {
        const { data: updatedData, error } = await supabase
            .from('pagos')
            .update(data)
            .eq('id_pago', id)
            .select('*')
        if (error) throw error
        return updatedData[0]
    }

    /**
     * Elimina un pago existente
     * @param {number} id - ID del pago a eliminar
     * @returns {Promise<Object>} Datos del pago eliminado
     * @throws {Error} Si hay un error en la eliminación
     */
    static async eliminarPago(id) {
        const { data, error } = await supabase
            .from('pagos')
            .delete()
            .eq('id_pago', id)
            .select('*')
        if (error) throw error
        return data[0]
    }

    /**
     * Obtiene los pagos asociados a un usuario específico
     * @param {string} rutUsuario - RUT del usuario
     * @returns {Promise<Array>} Lista de pagos del usuario
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerPorUsuario(rutUsuario) {
        const { data, error } = await supabase
            .from('pagos')
            .select('*')
            .eq('rut_usuario', rutUsuario)
        if (error) throw error
        return data
    }

    /**
     * Obtiene pagos con información detallada incluyendo datos relacionados
     * @returns {Promise<Array>} Lista de pagos con información de usuarios, reservas y ganancias
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerTodosDetallado() {
        try {
            const { data, error } = await supabase
                .from('pagos')
                .select(`
                    *,
                    usuarios (nombre, apellido),
                    reservas (fecha, hora_inicio, hora_fin),
                    ganancias (periodo, monto_total)
                `)

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error en obtenerTodosDetallado:', error)
            throw error
        }
    }

    /**
     * Obtiene pagos filtrados por estado
     * @param {string} estado - Estado del pago ('pendiente', 'procesado', 'cancelado', etc.)
     * @returns {Promise<Array>} Lista de pagos con el estado especificado
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerPorEstado(estado) {
        try {
            const { data, error } = await supabase
                .from('pagos')
                .select('*')
                .eq('estado', estado)

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error en obtenerPorEstado:', error)
            throw error
        }
    }

    /**
     * Obtiene pagos dentro de un rango de fechas
     * @param {string} fechaInicio - Fecha inicial en formato ISO
     * @param {string} fechaFin - Fecha final en formato ISO
     * @returns {Promise<Array>} Lista de pagos dentro del rango especificado
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerPorRangoFechas(fechaInicio, fechaFin) {
        try {
            const { data, error } = await supabase
                .from('pagos')
                .select('*')
                .gte('fecha_pago', fechaInicio)
                .lte('fecha_pago', fechaFin)
                .order('fecha_pago', { ascending: false })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error en obtenerPorRangoFechas:', error)
            throw error
        }
    }

    /**
     * Obtiene estadísticas generales de los pagos
     * @returns {Promise<Object>} Objeto con estadísticas:
     *  - total: Suma total de pagos
     *  - porEstado: Conteo de pagos por estado
     *  - porMetodoPago: Conteo de pagos por método
     * @throws {Error} Si hay un error al calcular las estadísticas
     */
    static async obtenerEstadisticas() {
        try {
            const { data, error } = await supabase
                .from('pagos')
                .select('monto, estado, metodo_pago')

            if (error) throw error

            const estadisticas = {
                total: data.reduce((sum, pago) => sum + parseFloat(pago.monto), 0),
                porEstado: data.reduce((acc, pago) => {
                    acc[pago.estado] = (acc[pago.estado] || 0) + 1
                    return acc
                }, {}),
                porMetodoPago: data.reduce((acc, pago) => {
                    acc[pago.metodo_pago] = (acc[pago.metodo_pago] || 0) + 1
                    return acc
                }, {})
            }

            return estadisticas
        } catch (error) {
            console.error('Error en obtenerEstadisticas:', error)
            throw error
        }
    }

    /**
     * Valida los datos de un pago antes de su creación o actualización
     * @param {Object} pago - Datos del pago a validar
     * @returns {Array<string>} Array de mensajes de error, vacío si no hay errores
     */
    static validarPago(pago) {
        const errores = []

        if (!pago.monto || pago.monto <= 0) {
            errores.push('El monto debe ser mayor a 0')
        }

        if (!pago.metodo_pago) {
            errores.push('El método de pago es requerido')
        }

        if (!pago.rut_usuario) {
            errores.push('El RUT del usuario es requerido')
        }

        if (!pago.id_reserva) {
            errores.push('El ID de reserva es requerido')
        }

        if (!pago.id_ganancia) {
            errores.push('El ID de ganancia es requerido')
        }

        return errores
    }

    /**
     * Calcula el total gastado por un usuario específico
     * @param {string} rutUsuario - RUT del usuario
     * @returns {Promise<number>} Total gastado por el usuario
     * @throws {Error} Si hay un error en el cálculo
     */
    static async obtenerTotalGastadoPorUsuario(rutUsuario) {
        try {
            console.log('Calculando total para usuario:', rutUsuario)
            
            const { data, error } = await supabase
                .from('pagos')
                .select('monto')
                .eq('rut_usuario', rutUsuario)
                .eq('estado', 'procesado')

            if (error) {
                console.error('Error en la consulta:', error)
                throw error
            }

            console.log('Pagos encontrados:', data)

            const totalGastado = data.reduce((total, pago) => {
                return total + Number(pago.monto)
            }, 0)

            console.log('Total calculado:', totalGastado)
            return totalGastado
        } catch (error) {
            console.error('Error en obtenerTotalGastadoPorUsuario:', error)
            throw error
        }
    }
}

module.exports = Pago