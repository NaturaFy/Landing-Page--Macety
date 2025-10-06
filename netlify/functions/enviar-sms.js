const twilio = require('twilio');

exports.handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    // Parsear el body
    const { telefono, nombre } = JSON.parse(event.body);

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