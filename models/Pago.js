// models/Pago.js - Modelo de Pago
const supabase = require('../config/database'); // Importar la instancia de Supabase desde config/database

class Pago {
  static async obtenerTodos() {
    const { data, error } = await supabase.from('pagos').select('*'); // "pagos" en minúsculas
    if (error) throw error;
    return data;
  }

  static async obtenerPorId(id) {
    const { data, error } = await supabase.from('pagos').select('*').eq('id_pago', id).single(); // "id_pago" en minúsculas
    if (error) throw error;
    return data;
  }

  static async crearPago(pago) {
    const { data, error } = await supabase.from('pagos').insert([pago]).select('*'); // "pagos" en minúsculas
    if (error) throw error;
    return data[0];
  }

  static async actualizarPago(id, data) {
    const { data: updatedData, error } = await supabase.from('pagos').update(data).eq('id_pago', id).select('*'); // "id_pago" en minúsculas
    if (error) throw error;
    return updatedData[0];
  }

  static async eliminarPago(id) {
    const { data, error } = await supabase.from('pagos').delete().eq('id_pago', id).select('*'); // "id_pago" en minúsculas
    if (error) throw error;
    return data[0];
  }

  // Nuevo método para obtener los pagos por usuario
  static async obtenerPorUsuario(rutUsuario) {
    const { data, error } = await supabase.from('pagos').select('*').eq('rut_usuario', rutUsuario); // Obtener pagos por RUT de usuario
    if (error) throw error;
    return data;
  }
}

module.exports = Pago;
