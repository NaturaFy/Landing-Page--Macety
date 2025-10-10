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
  subject: '🌿 Gracias por contactarte con Naturafy',
  html: `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Naturafy - Contacto</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f5f7f4;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .container {
        max-width: 640px;
        margin: 40px auto;
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        overflow: hidden;
      }

      .header {
        background: linear-gradient(135deg, #7fda89, #5ebf70);
        text-align: center;
        padding: 40px 20px 20px;
      }

      .logo-wrapper {
        width: 140px;
        height: 140px;
        background: #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 15px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
      }

      .logo-wrapper img {
        width: 120px;
        height: 120px;
        object-fit: contain;
        border-radius: 50%;
      }

      .header h1 {
        color: #ffffff;
        font-size: 28px;
        margin: 10px 0 5px;
      }

      .content {
        padding: 40px 35px;
        text-align: center;
      }

      .greeting {
        font-size: 22px;
        color: #2d5016;
        font-weight: 600;
        margin-bottom: 15px;
      }

      .message {
        color: #444;
        font-size: 16px;
        line-height: 1.7;
        margin-bottom: 25px;
      }

      .features {
        text-align: left;
        margin: 30px 0;
      }

      .feature {
        background: #f4faf5;
        padding: 12px 18px;
        border-left: 4px solid #4caf50;
        border-radius: 0 12px 12px 0;
        margin-bottom: 10px;
      }

      .feature span {
        font-size: 16px;
        color: #2d5016;
        font-weight: 600;
      }

      .cta-button {
        background: #4caf50;
        color: white;
        padding: 14px 36px;
        border-radius: 28px;
        font-weight: 600;
        font-size: 16px;
        text-decoration: none;
        display: inline-block;
        margin-top: 10px;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        transition: background 0.3s ease;
      }

      .cta-button:hover {
        background: #43a047;
      }

      .footer {
        background: #2d5016;
        color: white;
        padding: 25px;
        text-align: center;
        font-size: 14px;
      }

      .footer a {
        color: #7fda89;
        text-decoration: none;
      }

      .social-icons {
        margin: 15px 0;
      }

      .social-icons a {
        margin: 0 8px;
        text-decoration: none;
        font-size: 20px;
        color: white;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="logo-wrapper">
          <img src="https://naturafy.netlify.app/assets/macety.png" alt="Macety Mascota Naturafy" />
        </div>
        <h1>¡Gracias por escribirnos! 🌱</h1>
      </div>

      <!-- Content -->
      <div class="content">
        <div class="greeting">¡Hola ${nombre}! 👋</div>
        <div class="message">
          Soy <strong>Macety</strong>, tu amiguita verde 💚.  
          Hemos recibido tu mensaje desde la página de contacto de <strong>Naturafy</strong> y nuestro equipo te responderá muy pronto.
        </div>

        <div class="message">
          Mientras tanto, te contamos que Naturafy usa tecnología <strong>IoT</strong> para cuidar tus plantas de forma automática y sostenible 🌿☀️
        </div>

        <div class="features">
          <div class="feature"><span>🌡️ Monitoreo de temperatura y humedad</span></div>
          <div class="feature"><span>💧 Riego automático inteligente</span></div>
          <div class="feature"><span>☀️ Alimentación solar ecoamigable</span></div>
          <div class="feature"><span>📱 Control total desde tu app móvil</span></div>
        </div>

        <div class="message">
          Gracias por interesarte en nuestro proyecto verde.  
          Si deseas conocer más sobre nuestras soluciones inteligentes, puedes visitar nuestra web:
        </div>

        <a href="https://naturafy.netlify.app/" class="cta-button">Explorar Naturafy</a>

        <div style="margin-top: 35px; color: #888; font-size: 14px;">
          <em>“Cultivando buenas energías, una planta a la vez” 🌿</em>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="social-icons">
          <a href="#" title="Instagram">📷</a>
          <a href="#" title="Facebook">📘</a>
          <a href="#" title="WhatsApp">💬</a>
        </div>
        <p><strong>Naturafy</strong><br> Tecnología que conecta con la naturaleza 🌱</p>
        <p style="font-size: 12px; opacity: 0.8;">
          Este correo fue generado desde el formulario de contacto de Naturafy.<br />
          Si no fuiste tú, simplemente ignóralo 🌿
        </p>
      </div>
    </div>
  </body>
  </html>
  `,
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