const Horario = require('../models/Horario')

exports.obtenerHorarios = async (req, res) => {
  try {
    // Obtener parámetros ya sea de params o query
    const fecha = req.params.fecha || req.query.fecha;
    const idCancha = req.params.idCancha || req.query.idCancha;

    // Validar que se proporcionaron los parámetros necesarios
    if (!fecha || !idCancha) {
      return res.status(400).json({
        error: 'Parámetros requeridos',
        mensaje: 'Debe proporcionar fecha y idCancha',
        ejemplo: '/api/horarios?fecha=18-11-2024&idCancha=1'
      });
    }

    // Validar formato de fecha (dd-mm-yyyy)
    if (!fecha.match(/^\d{2}-\d{2}-\d{4}$/)) {
      return res.status(400).json({
        error: 'Formato de fecha inválido',
        mensaje: 'Use el formato DD-MM-YYYY',
        ejemplo: '18-11-2024'
      });
    }

    // Convertir fecha de DD-MM-YYYY a objeto Date
    const [dia, mes, anio] = fecha.split('-');
    const fechaSeleccionada = new Date(anio, mes - 1, dia); // mes - 1 porque en JS los meses van de 0 a 11
    const hoy = new Date();
    
    // Resetear las horas para comparar solo las fechas
    fechaSeleccionada.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada.getTime() < hoy.getTime()) {
      return res.status(400).json({
        error: 'Fecha inválida',
        mensaje: 'No se pueden consultar fechas pasadas',
        fecha_actual: hoy.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '-')
      });
    }

    // Convertir fecha al formato que espera la base de datos (YYYY-MM-DD)
    const fechaDB = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    const horariosDisponibles = await Horario.obtenerHorariosDisponibles(fechaDB, idCancha);
    
    res.status(200).json({
      fecha,
      id_cancha: idCancha,
      horarios_disponibles: horariosDisponibles,
      total_disponibles: horariosDisponibles.length
    });

  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({
      error: 'Error al obtener horarios disponibles',
      detalle: error.message
    });
  }
} 