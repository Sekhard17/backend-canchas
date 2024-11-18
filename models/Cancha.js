const supabase = require('../config/database')

class Cancha {
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

    static async crearCancha(cancha) {
        try {
            const { data, error } = await supabase
                .from('canchas')
                .insert([
                    {
                        nombre: cancha.nombre,
                        ubicación: cancha.ubicación,
                        tipo: cancha.tipo
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

    static async actualizarCancha(id, cancha) {
        try {
            const { data, error } = await supabase
                .from('canchas')
                .update({
                    nombre: cancha.nombre,
                    ubicación: cancha.ubicación,
                    tipo: cancha.tipo
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
