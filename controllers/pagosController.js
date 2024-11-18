// controllers/pagosController.js - Controlador de Pago
const Pago = require('../models/Pago');
const mercadopago = require('mercadopago');

// Configuración de Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN, // Usa una variable de entorno para mayor seguridad
});

exports.obtenerPagos = async (req, res) => {
  try {
    const pagos = await Pago.obtenerTodos();
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pagos' });
  }
};

exports.obtenerPagoPorId = async (req, res) => {
  try {
    const pago = await Pago.obtenerPorId(req.params.id);
    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json(pago);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pago' });
  }
};

exports.crearPago = async (req, res) => {
  try {
    // Datos del pago desde la solicitud
    const { title, description, price, quantity, rut_usuario, id_reserva, id_ganancia } = req.body;

    // Crear preferencia de pago de Mercado Pago
    const preference = {
      items: [
        {
          title: title,
          description: description,
          quantity: quantity,
          currency_id: 'CLP',
          unit_price: price,
        },
      ],
      back_urls: {
        success: "https://tusitio.com/success",
        failure: "https://tusitio.com/failure",
        pending: "https://tusitio.com/pending",
      },
      auto_return: "approved",
      metadata: {
        rut_usuario, // Guardar el RUT del usuario para referencia futura
        id_reserva,  // Relacionar el pago con una reserva específica
      },
    };

    // Crear la preferencia en Mercado Pago
    const response = await mercadopago.preferences.create(preference);

    // Almacenar el pago en la base de datos
    const nuevoPago = await Pago.crearPago({
      rut_usuario,
      monto: price,
      fecha_pago: new Date(), // Fecha de creación del pago
      metodo_pago: 'MercadoPago',
      estado: 'Pendiente',
      id_reserva,
      id_ganancia,
      preference_id: response.body.id, // Guardar el ID de la preferencia de Mercado Pago
    });

    // Responder con los datos del nuevo pago y la URL de Mercado Pago
    res.status(201).json({
      payment: nuevoPago,
      mercadoPagoUrl: response.body.init_point, // URL de Mercado Pago para redirigir al cliente
    });
  } catch (error) {
    console.error('Error al crear pago:', error);
    res.status(500).json({ error: 'Error al crear pago' });
  }
};

exports.actualizarPago = async (req, res) => {
  try {
    const pagoActualizado = await Pago.actualizarPago(req.params.id, req.body);
    if (!pagoActualizado) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json(pagoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar pago' });
  }
};

exports.eliminarPago = async (req, res) => {
  try {
    const pagoEliminado = await Pago.eliminarPago(req.params.id);
    if (!pagoEliminado) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json({ message: 'Pago eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar pago' });
  }
};
