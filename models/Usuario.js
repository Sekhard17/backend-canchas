// models/Usuario.js - Modelo de Usuario para gestionar operaciones CRUD en la tabla 'usuarios'
const supabase = require('../config/database')

class Usuario {
  /**
   * Obtiene todos los usuarios de la base de datos
   * @returns {Promise<Array>} Array con todos los usuarios
   * @throws {Error} Si hay un error en la consulta
   */
  static async obtenerTodos() {
    const { data, error } = await supabase.from('usuarios').select('*')
    if (error) throw error
    return data
  }

  /**
   * Busca un usuario por su RUT
   * @param {string} id - RUT del usuario a buscar
   * @returns {Promise<Object>} Datos del usuario encontrado
   * @throws {Error} Si hay un error en la consulta o no se encuentra el usuario
   */
  static async obtenerPorId(id) {
    const { data, error } = await supabase.from('usuarios').select('*').eq('RUT', id).single()
    if (error) throw error
    return data
  }

  /**
   * Busca un usuario por su correo electrónico
   * @param {string} email - Correo electrónico del usuario
   * @returns {Promise<Object>} Datos del usuario encontrado
   * @throws {Error} Si no se encuentra el usuario o hay múltiples coincidencias
   */
  static async obtenerPorCorreo(email) {
    const { data, error } = await supabase.from('usuarios').select('*').eq('correo', email)
    if (error) throw error
    
    if (data.length === 0) {
      throw new Error('Usuario no encontrado')
    }
    
    if (data.length > 1) {
      throw new Error('Más de un usuario encontrado con ese correo')
    }

    return data[0]
  }

  /**
   * Crea un nuevo usuario en la base de datos
   * @param {Object} usuario - Objeto con los datos del nuevo usuario
   * @returns {Promise<Object>} Datos del usuario creado
   * @throws {Error} Si hay un error en la inserción
   */
  static async crearUsuario(usuario) {
    const { data, error } = await supabase.from('usuarios').insert([usuario]).select('*')
    if (error) throw error
    return data[0]
  }

  /**
   * Actualiza los datos de un usuario existente
   * @param {string} rut - RUT del usuario a actualizar
   * @param {Object} datos - Objeto con los campos a actualizar
   * @returns {Promise<Object>} Datos del usuario actualizado
   * @throws {Error} Si hay un error en la actualización o el estado es inválido
   */
  static async actualizarUsuario(rut, datos) {
    try {
      console.log('Ejecutando actualización en Supabase:', { rut, datos });

      // Normalizar el estado si viene en los datos
      if (datos.estado) {
        datos.estado = datos.estado.charAt(0).toUpperCase() + datos.estado.slice(1).toLowerCase();
        
        if (!['Activo', 'Inactivo'].includes(datos.estado)) {
          throw new Error('Estado inválido. Debe ser "Activo" o "Inactivo"');
        }
      }

      const { data, error } = await supabase
        .from('usuarios')
        .update(datos)
        .eq('rut', rut)
        .select('*')
        .single();

      if (error) {
        console.error('Error de Supabase en actualización:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No se pudo actualizar el usuario');
      }

      console.log('Usuario actualizado exitosamente:', data);
      return data;
    } catch (error) {
      console.error('Error en actualizarUsuario:', error);
      throw error;
    }
  }

  /**
   * Elimina un usuario de la base de datos
   * @param {string} rut - RUT del usuario a eliminar
   * @returns {Promise<Object>} Datos del usuario eliminado
   * @throws {Error} Si hay un error en la eliminación
   */
  static async eliminarUsuario(rut) {
    try {
      console.log('Ejecutando eliminación en Supabase para RUT:', rut);

      const { data, error } = await supabase
        .from('usuarios')
        .delete()
        .eq('rut', rut)
        .select('*');

      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }

      return data[0];
    } catch (error) {
      console.error('Error en eliminarUsuario:', error);
      throw error;
    }
  }
}

module.exports = Usuario