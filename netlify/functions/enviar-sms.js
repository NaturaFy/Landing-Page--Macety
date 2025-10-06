const twilio = require('twilio');
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const { nombre, email, telefono, mensaje } = JSON.parse(event.body);

    // 1. Configurar email (usando Gmail, Outlook, etc.)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,     // tu@email.com
        pass: process.env.EMAIL_PASSWORD  // Tu contraseña de aplicación
      }
    });

    // 2. Enviar email a ti
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'maycoljhordan07@gmail.com', 
      subject: '🌱 Nuevo Registro en Naturafy',
      html: `
        <h2>Nuevo Registro</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Mensaje:</strong> ${mensaje || 'Sin mensaje'}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-PE')}</p>
      `
    });

    // Validar teléfono
    if (!telefono || !telefono.startsWith('+')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          error: 'Teléfono inválido. Debe incluir código de país (+51...)' 
        })
      };
    }

    // Inicializar Twilio con variables de entorno
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Enviar SMS
    const message = await client.messages.create({
      body: `🌱 ¡Hola ${nombre || ''}! Soy Macety, tu amiguita de Naturafy 🍃 Gracias por escribirnos 💚. Sigue cultivando buenas energías 🌿☀️`,
      messagingServiceSid: process.env.TWILIO_MESSAGING_SID,
      to: telefono
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true, 
        sid: message.sid,
        mensaje: 'SMS enviado correctamente' 
      })
    };

  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};