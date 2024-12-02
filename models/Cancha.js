const supabase = require('../config/database')

class Cancha {
    /**
     * Obtiene todas las canchas de la base de datos
     * @returns {Promise<Array>} Array con todas las canchas
     * @throws {Error} Si hay un error en la consulta
     */
    static async obtenerTodas() {
        try {
            const { data, error } = await supabase
                .from('canchas')
                .select('*')

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error en obtenerTodas:', error)
            throw error
        }
    }

    /**
     * Busca una cancha por su ID
     * @param {number} id - ID de la cancha a buscar
     * @returns {Promise<Object>} Datos de la cancha encontrada
     * @throws {Error} Si hay un error en la consulta o no se encuentra la cancha
     */
    static async obtenerPorId(id) {
        try {
            const { data, error } = await supabase
                .from('canchas')
                .select('*')
                .eq('id_cancha', id)
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error en obtenerPorId:', error)
            throw error
        }
    }

    /**
     * Crea una nueva cancha en la base de datos
     * @param {Object} cancha - Objeto con los datos de la nueva cancha
     * @returns {Promise<Object>} Datos de la cancha creada
     * @throws {Error} Si hay un error en la inserción
     */
    static async crearCancha(cancha) {
        try {
            const { data, error } = await supabase
                .from('canchas')
                .insert([
                    {
                        nombre: cancha.nombre,
                        ubicacion: cancha.ubicacion,
                        tipo: cancha.tipo,
                        precio_hora: cancha.precio_hora
                    }
                ])
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error en crearCancha:', error)
            throw error
        }
    }

    /**
     * Actualiza los datos de una cancha existente
     * @param {number} id - ID de la cancha a actualizar
     * @param {Object} cancha - Objeto con los campos a actualizar
     * @returns {Promise<Object>} Datos de la cancha actualizada
     * @throws {Error} Si hay un error en la actualización
     */
    static async actualizarCancha(id, cancha) {
        try {
            const { data, error } = await supabase
                .from('canchas')
                .update({
                    nombre: cancha.nombre,
                    ubicación: cancha.ubicación,
                    tipo: cancha.tipo,
                    precio_hora: cancha.precio_hora
                })
                .eq('id_cancha', id)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error en actualizarCancha:', error)
            throw error
        }
    }

    /**
     * Elimina una cancha de la base de datos
     * @param {number} id - ID de la cancha a eliminar
     * @returns {Promise<Object>} Datos de la cancha eliminada
     * @throws {Error} Si hay un error en la eliminación
     */
    static async eliminarCancha(id) {
        try {
            const { data, error } = await supabase
                .from('canchas')
                .delete()
                .eq('id_cancha', id)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error en eliminarCancha:', error)
            throw error
        }
    }
}

module.exports = Cancha