// models/Ganancia.js - Modelo para gestionar las ganancias y estadísticas financieras
const supabase = require('../config/database')

class Ganancia {
    /**
     * Obtiene todas las ganancias ordenadas por fecha
     * @returns {Promise<Array>} Lista de ganancias con:
     *  - id_ganancia
     *  - numero_reservas
     *  - periodo
     *  - monto_total
     *  - fecha
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerTodas() {
        try {
            const { data, error } = await supabase
                .from('ganancias')
                .select(`
                    id_ganancia,
                    numero_reservas,
                    periodo,
                    monto_total,
                    fecha
                `)
                .order('fecha', { ascending: false })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error en obtenerTodas:', error)
            throw error
        }
    }

    /**
     * Obtiene una ganancia específica por su ID
     * @param {number} id - ID de la ganancia a buscar
     * @returns {Promise<Object>} Datos de la ganancia encontrada
     * @throws {Error} Si hay un error en la consulta o no se encuentra la ganancia
     */
    static async obtenerPorId(id) {
        const { data, error } = await supabase
            .from('ganancias')
            .select(`
                id_ganancia,
                numero_reservas,
                periodo,
                monto_total,
                fecha
            `)
            .eq('id_ganancia', id)
            .single()
        if (error) throw error
        return data
    }

    /**
     * Crea un nuevo registro de ganancia
     * @param {Object} ganancia - Datos de la ganancia a crear
     * @param {number} ganancia.numero_reservas - Número de reservas en el periodo
     * @param {string} ganancia.periodo - Periodo de la ganancia (ej: '2024-03')
     * @param {number} ganancia.monto_total - Monto total de las ganancias
     * @param {string} [ganancia.fecha] - Fecha del registro (por defecto fecha actual)
     * @returns {Promise<Object>} Datos de la ganancia creada
     * @throws {Error} Si hay un error en la creación
     */
    static async crearGanancia(ganancia) {
        // Validar campos requeridos
        const gananciaData = {
            numero_reservas: ganancia.numero_reservas,
            periodo: ganancia.periodo,
            monto_total: ganancia.monto_total,
            fecha: ganancia.fecha || new Date().toISOString().split('T')[0]
        }
        
        const { data, error } = await supabase
            .from('ganancias')
            .insert([gananciaData])
            .select()
        if (error) throw error
        return data[0]
    }

    /**
     * Actualiza un registro de ganancia existente
     * @param {number} id - ID de la ganancia a actualizar
     * @param {Object} ganancia - Datos a actualizar
     * @returns {Promise<Object>} Datos de la ganancia actualizada
     * @throws {Error} Si hay un error en la actualización
     */
    static async actualizarGanancia(id, ganancia) {
        const { data, error } = await supabase
            .from('ganancias')
            .update(ganancia)
            .eq('id_ganancia', id)
            .select()
        if (error) throw error
        return data[0]
    }

    /**
     * Elimina un registro de ganancia
     * @param {number} id - ID de la ganancia a eliminar
     * @returns {Promise<Object>} Datos de la ganancia eliminada
     * @throws {Error} Si hay un error en la eliminación
     */
    static async eliminarGanancia(id) {
        const { data, error } = await supabase
            .from('ganancias')
            .delete()
            .eq('id_ganancia', id)
            .select()
        if (error) throw error
        return data[0]
    }
}

module.exports = Ganancia