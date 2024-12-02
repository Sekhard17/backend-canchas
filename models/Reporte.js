// models/Reporte.js - Modelo de Reporte
const supabase = require('../config/database');  // Importar la instancia de Supabase desde config/database
class Reporte {
    static async obtenerTodos() {
      try {
        console.log('Intentando obtener reportes...')
        const { data, error } = await supabase
          .from('reportes')
          .select(`
            id_reporte,
            fecha_reporte,
            tipo_reporte,
            descripción,
            rut_usuario,
            usuarios (nombre, apellido)
          `)
        
        if (error) {
          console.error('Error de Supabase:', error)
          throw error
        }
        
        console.log('Datos obtenidos:', data)
        return data
      } catch (error) {
        console.error('Error en obtenerTodos:', error)
        throw error
      }
    }
  
    static async obtenerPorId(id) {
      const { data, error } = await supabase
        .from('reportes')
        .select(`
          id_reporte,
          fecha_reporte,
          tipo_reporte,
          descripción,
          rut_usuario,
          usuarios (nombre, apellido)
        `)
        .eq('id_reporte', id)
        .single()
      if (error) throw error
      return data
    }
  
    static async crearReporte(reporte) {
      const reporteData = {
        fecha_reporte: reporte.fecha_reporte || new Date(),
        tipo_reporte: reporte.tipo_reporte,
        descripción: reporte.descripción,
        rut_usuario: reporte.rut_usuario
      }
      
      const { data, error } = await supabase
        .from('reportes')
        .insert([reporteData])
        .select()
      if (error) throw error
      return data[0]
    }
  
    static async actualizarReporte(id, data) {
      const { data: updatedData, error } = await supabase.from('Reportes').update(data).eq('ID_Reporte', id).select('*')
      if (error) throw error
      return updatedData[0]
    }
  
    static async eliminarReporte(id) {
      const { data, error } = await supabase.from('Reportes').delete().eq('ID_Reporte', id).select('*')
      if (error) throw error
      return data[0]
    }
  
    static async obtenerEstadisticas(fecha = new Date()) {
      try {
        const ultimosSeisMeses = Array.from({length: 6}, (_, i) => {
          const d = new Date(fecha);
          d.setMonth(d.getMonth() - i);
          return d;
        }).reverse();

        // Obtener datos de pagos
        const { data: pagosData, error: pagosError } = await supabase
          .from('pagos')
          .select(`
            monto,
            fecha_pago,
            metodo_pago,
            estado,
            id_ganancia,
            reservas!inner(
              id_reserva,
              fecha,
              hora_inicio,
              id_cancha,
              canchas(nombre)
            )
          `)
          .gte('fecha_pago', ultimosSeisMeses[0].toISOString())
          .lte('fecha_pago', fecha.toISOString())
          .eq('estado', 'procesado');

        if (pagosError) throw pagosError;

        // Normalizar montos (convertir todos a miles si es necesario)
        const normalizarMonto = (monto) => {
          return monto < 1000 ? monto * 1000 : monto;
        };

        // Datos para el gráfico de ingresos y reservas
        const revenueData = ultimosSeisMeses.map(fecha => {
          const mes = fecha.toLocaleString('es-ES', { month: 'short' });
          const pagosMes = pagosData.filter(pago => 
            new Date(pago.fecha_pago).getMonth() === fecha.getMonth()
          );
          
          return {
            month: mes,
            revenue: pagosMes.reduce((sum, pago) => sum + normalizarMonto(pago.monto), 0),
            bookings: pagosMes.length
          };
        });

        // Obtener datos de ganancias para validación
        const { data: gananciasData, error: gananciasError } = await supabase
          .from('ganancias')
          .select('*')
          .in('id_ganancia', pagosData.map(p => p.id_ganancia));

        if (gananciasError) throw gananciasError;

        // Agrupar pagos por período
        const pagosPorPeriodo = pagosData.reduce((acc, pago) => {
          const periodo = new Date(pago.fecha_pago).toISOString().slice(0, 7); // YYYY-MM
          if (!acc[periodo]) {
            acc[periodo] = {
              total: 0,
              count: 0
            };
          }
          acc[periodo].total += normalizarMonto(pago.monto);
          acc[periodo].count++;
          return acc;
        }, {});

        // Datos de uso de canchas
        const courtUsageData = Object.values(pagosData.reduce((acc, pago) => {
          const nombreCancha = pago.reservas.canchas.nombre;
          if (!acc[nombreCancha]) {
            acc[nombreCancha] = {
              name: nombreCancha,
              usage: 0,
              reservas: 0
            };
          }
          acc[nombreCancha].reservas++;
          acc[nombreCancha].usage = Math.round((acc[nombreCancha].reservas / pagosData.length) * 100);
          return acc;
        }, {}));

        // Distribución horaria
        const timeDistributionData = Object.entries(
          pagosData.reduce((acc, pago) => {
            const hora = new Date(pago.reservas.hora_inicio).getHours();
            let rango = '';
            if (hora >= 15 && hora < 17) rango = '15:00-17:00';
            else if (hora >= 17 && hora < 19) rango = '17:00-19:00';
            else if (hora >= 19 && hora < 21) rango = '19:00-21:00';
            else if (hora >= 21 && hora < 23) rango = '21:00-23:00';
            
            if (!acc[rango]) acc[rango] = 0;
            acc[rango]++;
            return acc;
          }, {})
        ).map(([name, value]) => ({
          name,
          value: Math.round((value / pagosData.length) * 100)
        }));

        // Calcular métricas de resumen
        const totalIngresos = revenueData.reduce((sum, data) => sum + data.revenue, 0);
        const totalReservas = revenueData.reduce((sum, data) => sum + data.bookings, 0);

        // Calcular variaciones respecto al mes anterior
        const mesActual = Object.values(pagosPorPeriodo)[Object.values(pagosPorPeriodo).length - 1] || { total: 0, count: 0 };
        const mesAnterior = Object.values(pagosPorPeriodo)[Object.values(pagosPorPeriodo).length - 2] || { total: 0, count: 0 };

        const variacionIngresos = mesAnterior.total ? 
          ((mesActual.total - mesAnterior.total) / mesAnterior.total) * 100 : 0;
        const variacionReservas = mesAnterior.count ? 
          ((mesActual.count - mesAnterior.count) / mesAnterior.count) * 100 : 0;

        return {
          revenueData,
          courtUsageData,
          timeDistributionData,
          resumen: {
            totalIngresos,
            totalReservas,
            tasaOcupacion: Math.round(
              (totalReservas / (courtUsageData.length * 6 * 30)) * 100
            ),
            promedioReserva: Math.round(totalIngresos / totalReservas),
            variaciones: {
              ingresos: Number(variacionIngresos.toFixed(1)),
              reservas: Number(variacionReservas.toFixed(1))
            }
          }
        };
      } catch (error) {
        console.error('Error en obtenerEstadisticas:', error);
        throw error;
      }
    }
  }
  
  module.exports = Reporte