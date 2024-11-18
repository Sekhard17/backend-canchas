const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

function generarHorarios() {
  const horarios = [];
  let hora = 16;

  while (hora <= 24) {
    const inicio = `${hora.toString().padStart(2, '0')}:00:00`;
    const fin = `${((hora + 1) % 24).toString().padStart(2, '0')}:00:00`;
    horarios.push({ horaInicio: inicio, horaFin: fin });
    hora++;
  }

  return horarios;
}

router.get('/:fecha/:idCancha', async (req, res) => {
  const { fecha, idCancha } = req.params;
  console.log(`Procesando solicitud para fecha: ${fecha}, idCancha: ${idCancha}`);

  try {
    const { data: reservas, error } = await supabase
      .from('reservas')
      .select('hora_inicio, hora_fin')
      .eq('fecha', fecha)
      .eq('id_cancha', parseInt(idCancha));

    if (error) {
      console.error('Error en consulta Supabase:', error);
      throw error;
    }

    console.log(`Reservas encontradas: ${reservas.length}`);
    console.log('Primeras 3 reservas:', reservas.slice(0, 3));

    const horarios = generarHorarios().map((bloque) => {
      const ocupado = reservas.some(
        (reserva) =>
          reserva.hora_inicio === bloque.horaInicio &&
          reserva.hora_fin === bloque.horaFin
      );

      return { ...bloque, disponible: !ocupado };
    });

    console.log(`Horarios generados: ${horarios.length}`);
    console.log('Primeros 3 horarios:', horarios.slice(0, 3));

    res.status(200).json(horarios);
  } catch (err) {
    console.error('Error detallado al obtener los horarios:', err);
    res.status(500).json({ 
      error: 'No se pudieron obtener los horarios.',
      details: err.message 
    });
  }
});

module.exports = router;