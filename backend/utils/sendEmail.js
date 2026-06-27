const nodemailer = require('nodemailer');

const createTransportOptions = () => {
  const transport = {
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.EMAIL_ALLOW_SELF_SIGNED !== 'true',
    },
  };

  if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
    transport.host = process.env.EMAIL_HOST;
    transport.port = Number(process.env.EMAIL_PORT);
    transport.secure = process.env.EMAIL_SECURE === 'true';
  } else {
    transport.service = process.env.EMAIL_SERVICE || 'Gmail';
  }

  return transport;
};

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport(createTransportOptions());

  try {
    await transporter.verify();
  } catch (verifyError) {
    console.error('Email transporter verification failed:', verifyError);
    throw verifyError;
  }

  const mailOptions = {
    from: `"CampusV2 Admin" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (sendError) {
    console.error('Email sending failed:', sendError);
    throw sendError;
  }
};

sendEmail.createTransportOptions = createTransportOptions;
module.exports = sendEmail;
