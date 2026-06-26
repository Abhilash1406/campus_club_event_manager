const nodemailer = require('nodemailer');
const User = require('../models/User');

/**
 * Send email notifications to all registered users when a new event is posted.
 * This function handles the sending asynchronously and will not crash the server on failure.
 *
 * @param {Object} event - The newly created or approved event document
 */
const sendNewEventEmail = async (event) => {
  try {
    // 1. Fetch all registered users
    const users = await User.find({ email: { $exists: true, $ne: '' } }, 'name email');
    if (!users || users.length === 0) {
      console.log('No registered users found to send email notifications.');
      return;
    }

    // 2. Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Format Date and Time
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const hours = eventDate.getHours();
    const minutes = eventDate.getMinutes();
    let formattedTime = 'TBD';
    if (hours !== 0 || minutes !== 0) {
      formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const eventUrl = `${frontendUrl}/login`;

    // 4. Send personalized email to each user
    for (const user of users) {
      const greeting = user.name ? `Hello ${user.name},` : 'Hello,';
      
      const mailOptions = {
        from: `"Campus Club Manager" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: '🎉 New Event Posted',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px;">
              <h2 style="color: #2563eb; margin: 0;">🏫 Campus Club Event Manager</h2>
            </div>
            
            <p style="font-size: 16px; color: #333333; line-height: 1.6;">${greeting}</p>
            <p style="font-size: 16px; color: #555555; line-height: 1.6;">An exciting new event has been posted on the campus portal! Here are the details:</p>
            
            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <h3 style="color: #1e293b; margin: 0 0 10px 0; font-size: 18px;">🎉 ${event.title}</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #475569;">
                <tr>
                  <td style="padding: 4px 0; font-weight: bold; width: 80px;">Date:</td>
                  <td style="padding: 4px 0;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: bold;">Time:</td>
                  <td style="padding: 4px 0;">${formattedTime}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: bold;">Venue:</td>
                  <td style="padding: 4px 0;">${event.venue || 'TBD'}</td>
                </tr>
              </table>
              
              <h4 style="color: #475569; margin: 15px 0 5px 0; font-size: 14px;">Description:</h4>
              <p style="color: #334155; margin: 0; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${event.description}</p>
            </div>
            
            <p style="font-size: 16px; color: #555555; line-height: 1.6; text-align: center; margin-top: 30px;">
              Don't miss out! Click the button below to log in and register for this event.
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${eventUrl}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: bold; font-size: 15px; border-radius: 6px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
                Login & Register Now
              </a>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
              You received this email because you are registered on the Campus Club Event Management System.
            </p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (err) {
        console.error(`Failed to send email to ${user.email}:`, err);
      }
    }
    
    console.log(`Email notifications sent successfully to ${users.length} users.`);
  } catch (error) {
    // Graceful error handling (Requirement 8)
    console.error('Error sending email notifications in background:', error);
  }
};

module.exports = {
  sendNewEventEmail,
};
