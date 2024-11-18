// models/Reserva.js - Modelo de Reserva
const supabase = require('../config/database');  // Importar la instancia de Supabase desde config/database

class Reserva {
  static async obtenerTodas() {
    try {
      const { data, error } = await supabase.from('reservas').select('*');  // Sin comillas dobles
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en obtenerTodas:', error);
      throw error;
    }
  }

  static async obtenerPorId(id) {
    try {
      const { data, error } = await supabase.from('reservas').select('*').eq('id_reserva', id).single();  // Sin comillas dobles
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en obtenerPorId:', error);
      throw error;
    }
  }

  static async crearReserva(reserva) {
    try {
      const { data, error } = await supabase.from('reservas').insert([reserva]).select('*');  // Sin comillas dobles
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error en crearReserva:', error);
      throw error;
    }
  }

  static async actualizarReserva(id, data) {
    try {
      const { data: updatedData, error } = await supabase.from('reservas').update(data).eq('id_reserva', id).select('*');  // Sin comillas dobles
      if (error) throw error;
      return updatedData[0];
    } catch (error) {
      console.error('Error en actualizarReserva:', error);
      throw error;
    }
  }

  static async eliminarReserva(id) {
    try {
      const { data, error } = await supabase.from('reservas').delete().eq('id_reserva', id).select('*');  // Sin comillas dobles
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error en eliminarReserva:', error);
      throw error;
    }
  }

  static async obtenerPorUsuario(rutUsuario) {
    try {
      const { data, error } = await supabase.from('reservas').select('*').eq('rut_usuario', rutUsuario);  // Sin comillas dobles
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error en obtenerPorUsuario:', error);
      throw error;
    }
  }
}

module.exports = Reserva;
