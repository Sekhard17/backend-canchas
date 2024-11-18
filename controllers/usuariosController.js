// controllers/usuariosController.js - Controlador de Usuario
const Usuario = require('../models/Usuario')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.obtenerTodos()
    res.json(usuarios)
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al obtener la lista de usuarios, por favor inténtelo más tarde.' })
  }
}

exports.obtenerPerfilUsuario = async (req, res) => {
  try {
    // Usa el ID decodificado del token en lugar de req.params.id
    const usuario = await Usuario.obtenerPorId(req.user.id); 
    if (!usuario) {
      return res.status(404).json({ error: 'El usuario no se ha encontrado en el sistema.' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al obtener el perfil del usuario, por favor inténtelo más tarde.' });
  }
};


exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.obtenerPorId(req.params.id)
    if (!usuario) {
      return res.status(404).json({ error: 'El usuario no se ha encontrado en el sistema.' })
    }
    res.json(usuario)
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al obtener el usuario, por favor inténtelo más tarde.' })
  }
}

exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido, correo, rut, contraseña } = req.body

    // Verificar que todos los campos requeridos estén presentes
    if (!nombre || !apellido || !correo || !rut || !contraseña) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' })
    }

    // Verificar si el usuario ya existe
    let usuarioExistente
    try {
      usuarioExistente = await Usuario.obtenerPorCorreo(correo)
    } catch (error) {
      if (error.message !== 'Usuario no encontrado') {
        throw error
      }
    }

    if (usuarioExistente) {
      return res.status(400).json({ error: 'El correo ya está registrado.' })
    }

    // Hash de la contraseña
    const hash = await bcrypt.hash(contraseña, 10)

    // Crear el nuevo usuario
    const nuevoUsuario = await Usuario.crearUsuario({ nombre, apellido, correo, rut, contraseña: hash })
    res.status(201).json(nuevoUsuario)
  } catch (error) {
    console.error('Error al crear usuario:', error)
    res.status(500).json({ error: 'Hubo un problema al crear el usuario, por favor inténtelo más tarde.', detalle: error.message })
  }
}

exports.loginUsuario = async (req, res) => {
  try {
    const { correo, contraseña } = req.body
    console.log('Intentando iniciar sesión para:', correo)

    const usuario = await Usuario.obtenerPorCorreo(correo)
    if (!usuario) {
      console.log('Usuario no encontrado')
      return res.status(404).json({ error: 'El usuario no ha sido encontrado.' })
    }

    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) {
      console.log('Contraseña incorrecta')
      return res.status(401).json({ error: 'Las credenciales ingresadas no son correctas.' })
    }

    // Incluir nombre, apellido y correo en el token
    const token = jwt.sign(
      { id: usuario.rut, rol: usuario.rol, nombre: usuario.nombre, apellido: usuario.apellido, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({ token })
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Hubo un problema al iniciar sesión, por favor inténtelo más tarde.', detalle: error.message })
  }
}



exports.actualizarUsuario = async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.actualizarUsuario(req.params.id, req.body)
    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'El usuario que deseas actualizar no se ha encontrado.' })
    }
    res.json(usuarioActualizado)
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al actualizar el usuario, por favor inténtelo más tarde.' })
  }
}

exports.eliminarUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.eliminarUsuario(req.params.id)
    if (!usuarioEliminado) {
      return res.status(404).json({ error: 'El usuario que deseas eliminar no se ha encontrado.' })
    }
    res.json({ message: 'El usuario ha sido eliminado correctamente.' })
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema al eliminar el usuario, por favor inténtelo más tarde.' })
  }
}