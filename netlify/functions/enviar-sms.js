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

    // 1. Configurar email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // 2. Email de notificación para TI (admin)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'maycoljhordan07@gmail.com', 
      subject: '🌱 Nuevo Registro en Naturafy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5016;">Nuevo Registro</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${telefono}</p>
          <p><strong>Mensaje:</strong> ${mensaje || 'Sin mensaje'}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-PE')}</p>
        </div>
      `
    });

    // 3. Email de AGRADECIMIENTO para el USUARIO
    await transporter.sendMail({
      from: `"Naturafy 🌱" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🌱 ¡Bienvenido a Naturafy!',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: linear-gradient(135deg, #7fda89 0%, #6bc975 100%);
              border-radius: 20px;
              overflow: hidden;
            }
            .header {
              background: rgba(255, 255, 255, 0.2);
              padding: 40px 20px;
              text-align: center;
            }
            .logo-container {
              background: white;
              width: 180px;
              height: 180px;
              border-radius: 50%;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            .mascot-image {
              width: 160px;
              height: 160px;
              object-fit: contain;
            }
            .header h1 {
              color: white;
              font-size: 32px;
              margin: 0;
              text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .content {
              background: white;
              padding: 40px 30px;
              text-align: center;
            }
            .greeting {
              color: #2d5016;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .message {
              color: #555;
              font-size: 16px;
              line-height: 1.8;
              margin-bottom: 30px;
            }
            .features {
              display: table;
              width: 100%;
              margin: 30px 0;
            }
            .feature {
              background: #f8fdf9;
              border-left: 4px solid #4CAF50;
              padding: 15px 20px;
              margin-bottom: 15px;
              text-align: left;
              border-radius: 0 10px 10px 0;
            }
            .feature-icon {
              font-size: 24px;
              margin-right: 10px;
            }
            .feature-text {
              color: #2d5016;
              font-weight: 600;
              font-size: 15px;
            }
            .cta-button {
              display: inline-block;
              background: #4CAF50;
              color: white;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 30px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
              box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            }
            .footer {
              background: #2d5016;
              color: white;
              padding: 30px;
              text-align: center;
              font-size: 14px;
            }
            .footer a {
              color: #7fda89;
              text-decoration: none;
            }
            .social-icons {
              margin: 20px 0;
            }
            .social-icons a {
              display: inline-block;
              margin: 0 10px;
              color: white;
              text-decoration: none;
              font-size: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <div class="logo-container">
                <img src="https://naturafy.netlify.app/assets/macety.png" alt="Macety" class="mascot-image" />
              </div>
              <h1>¡Bienvenido a Naturafy! 🌱</h1>
            </div>

            <!-- Content -->
            <div class="content">
              <div class="greeting">
                ¡Hola ${nombre}! 👋
              </div>
              
              <div class="message">
                Soy <strong>Macety</strong>, tu amiguita verde 💚 y estoy súper emocionada de que te unas a nuestra comunidad de amantes de las plantas.
              </div>

              <div class="message">
                En Naturafy, combinamos tecnología IoT con amor por la naturaleza para que tus plantas siempre estén felices y saludables 🌿✨
              </div>

              <!-- Features -->
              <div class="features">
                <div class="feature">
                  <span class="feature-icon">🌡️</span>
                  <span class="feature-text">Monitoreo en tiempo real</span>
                </div>
                <div class="feature">
                  <span class="feature-icon">💧</span>
                  <span class="feature-text">Riego automático inteligente</span>
                </div>
                <div class="feature">
                  <span class="feature-icon">☀️</span>
                  <span class="feature-text">Energía solar sostenible</span>
                </div>
                <div class="feature">
                  <span class="feature-icon">📱</span>
                  <span class="feature-text">Control desde tu móvil</span>
                </div>
              </div>

              <div class="message">
                Pronto nos pondremos en contacto contigo para ayudarte a comenzar tu viaje verde 🌱
              </div>

              <a href="https://naturafy.netlify.app/" class="cta-button">
                Explorar Naturafy
              </a>

              <div style="margin-top: 30px; color: #999; font-size: 14px;">
                <em>"Cultivando buenas energías, una planta a la vez" 🌿</em>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div class="social-icons">
                <a href="#" title="Instagram">📷</a>
                <a href="#" title="Facebook">📘</a>
                <a href="#" title="WhatsApp">💬</a>
              </div>
              
              <p>
                <strong>Naturafy</strong><br>
                Technology that connects with nature 🌱
              </p>
              
              <p style="font-size: 12px; margin-top: 20px; opacity: 0.8;">
                Recibiste este email porque te registraste en Naturafy.<br>
                Si tienes alguna pregunta, responde a este correo.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    // 4. Enviar SMS con Twilio
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const twilioMessage = await twilioClient.messages.create({
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
        sid: twilioMessage.sid,
        mensaje: 'Registro exitoso. Email y SMS enviados.' 
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