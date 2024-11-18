const supabase = require('../config/database')

class Horario {
  static async obtenerHorariosDisponibles(fecha, idCancha) {
    try {
      console.log('Consultando horarios para fecha:', fecha, 'cancha:', idCancha)

      // Obtener la hora actual si es el día de hoy
      const esHoy = new Date(fecha).toDateString() === new Date().toDateString()
      const horaActual = esHoy ? new Date().getHours() : 0

      // 1. Obtener reservas existentes
      const { data: reservasExistentes, error } = await supabase
        .from('reservas')
        .select('hora_inicio, hora_fin')
        .eq('fecha', fecha)
        .eq('id_cancha', idCancha)
        .eq('estado', 'confirmada')
        .order('hora_inicio')

      if (error) {
        console.error('Error al consultar reservas:', error)
        throw error
      }

      // 2. Generar bloques disponibles
      const bloques = []
      // Si es hoy, empezar desde la siguiente hora disponible
      const horaInicio = esHoy ? Math.max(16, horaActual + 1) : 16

      for (let hora = horaInicio; hora < 24; hora++) {
        const horaFormateada = hora.toString().padStart(2, '0')
        const siguienteHora = (hora + 1).toString().padStart(2, '0')

        const bloque = {
          hora_inicio: `${horaFormateada}:00:00`,
          hora_fin: `${siguienteHora}:00:00`
        }

        // 3. Verificar si el bloque está ocupado
        const estaOcupado = reservasExistentes.some(reserva => 
          reserva.hora_inicio === bloque.hora_inicio &&
          reserva.hora_fin === bloque.hora_fin
        )

        if (!estaOcupado) {
          bloques.push(bloque)
        }
      }

      console.log('Bloques disponibles encontrados:', bloques.length)
      return bloques

    } catch (error) {
      console.error('Error en obtenerHorariosDisponibles:', error)
      throw error
    }
  }
}

module.exports = Horario 