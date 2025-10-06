const twilio = require('twilio');
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Método no permitido' })
    };
  }

  try {
    const { nombre, email, telefono, mensaje } = JSON.parse(event.body);

    // 1. Configurar email (usando Gmail)
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,     // tu@email.com
        pass: process.env.EMAIL_PASSWORD  // Tu contraseña de aplicación
      }
    });

    // 2. Enviar email a ti (notificación)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'maycoljhordan07@gmail.com', 
      subject: '🌱 Nuevo Registro en Naturafy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fdf9; padding: 20px; border-radius: 12px;">
          <h2 style="color: #2d5016; text-align: center;">🌱 Nuevo Registro en Naturafy</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Mensaje:</strong> ${mensaje || 'Sin mensaje'}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-PE')}</p>
          </div>
        </div>
      `
    });

    // 3. Enviar email de agradecimiento al usuario
    if(email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: '🌱 ¡Gracias por contactar a Naturafy! - Macety te saluda',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f8fdf9 0%, #e8f5e8 100%); padding: 0; border-radius: 12px; overflow: hidden;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #4CAF50 0%, #2d5016 100%); padding: 30px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🌱 ¡Hola ${nombre}!</h1>
              <p style="color: #e8f5e8; margin: 10px 0 0 0; font-size: 16px;">Soy Macety, tu amiguita de Naturafy</p>
            </div>

            <!-- Macety Image -->
            <div style="text-align: center; padding: 30px 20px;">
              <div style="width: 200px; height: 200px; background: linear-gradient(135deg, #81C784 0%, #4CAF50 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);">
                <div style="font-size: 80px; color: white;">🌿</div>
              </div>
              
              <h2 style="color: #2d5016; margin: 0 0 15px 0;">¡Gracias por escribirnos! 💚</h2>
              <p style="color: #4a7c59; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Me da mucha alegría que te intereses por Naturafy. Pronto nuestro equipo se pondrá en contacto contigo para ayudarte con todo lo que necesites.
              </p>
            </div>

            <!-- Message Box -->
            <div style="background: white; margin: 0 20px 30px 20px; padding: 25px; border-radius: 12px; border-left: 4px solid #4CAF50;">
              <h3 style="color: #2d5016; margin: 0 0 15px 0; font-size: 18px;">🌱 Tu mensaje:</h3>
              <p style="color: #666; font-style: italic; margin: 0; padding: 15px; background: #f8fdf9; border-radius: 8px;">
                "${mensaje || 'Quiero conocer más sobre Naturafy'}"
              </p>
            </div>

            <!-- Features -->
            <div style="padding: 0 20px 30px 20px;">
              <h3 style="color: #2d5016; text-align: center; margin: 0 0 20px 0;">🚀 Mientras tanto, conoce lo que tenemos para ti:</h3>
              <div style="background: white; border-radius: 12px; padding: 20px;">
                <div style="margin-bottom: 15px;">
                  <strong style="color: #4CAF50;">🌱 Monitoreo inteligente:</strong>
                  <span style="color: #666;"> Humedad, luz y temperatura en tiempo real</span>
                </div>
                <div style="margin-bottom: 15px;">
                  <strong style="color: #4CAF50;">💧 Riego automático:</strong>
                  <span style="color: #666;"> Agua precisa cuando tus plantas la necesiten</span>
                </div>
                <div style="margin-bottom: 15px;">
                  <strong style="color: #4CAF50;">☀️ Energía solar:</strong>
                  <span style="color: #666;"> Funcionamiento eco-friendly y autónomo</span>
                </div>
                <div>
                  <strong style="color: #4CAF50;">🤖 Macety AI:</strong>
                  <span style="color: #666;"> Tu asistente personal para el cuidado de plantas</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #2d5016; padding: 25px 20px; text-align: center;">
              <p style="color: #e8f5e8; margin: 0 0 10px 0; font-size: 16px;">
                Sigue cultivando buenas energías 🌿☀️
              </p>
              <p style="color: #81C784; margin: 0; font-size: 14px;">
                — Macety & El equipo de Naturafy
              </p>
            </div>

          </div>
        `
      });
    }

    // 4. Enviar SMS si hay teléfono
    if (telefono && telefono.startsWith('+')) {
      // Inicializar Twilio con variables de entorno
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      // Enviar SMS
      const message = await client.messages.create({
        body: `🌱 ¡Hola ${nombre}! Soy Macety, tu amiguita de Naturafy 🍃 Gracias por escribirnos 💚. Sigue cultivando buenas energías 🌿☀️`,
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
          mensaje: 'SMS y emails enviados correctamente' 
        })
      };
    } else {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          success: true, 
          mensaje: 'Email enviado correctamente (sin SMS)' 
        })
      };
    }

  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};