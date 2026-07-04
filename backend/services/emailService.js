const nodemailer = require('nodemailer');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

/**
 * In-process lock set to prevent concurrent duplicate email blasts for the
 * same event. Stores event IDs currently being processed. This guards against
 * race conditions if the endpoint is called twice in rapid succession.
 */
const emailInProgress = new Set();

/**
 * Send email notifications to all verified registered users when an event is
 * approved. Emails are deduplicated using a Set so each address receives at
 * most one email per invocation.
 *
 * Logging emitted:
 *  - Total users found in DB
 *  - Number of unique email addresses after deduplication
 *  - Per-email success / failure
 *  - Final summary count
 *
 * @param {Object} event        - The approved Event document (Mongoose doc)
 * @param {string} [triggerPoint] - Label identifying the call site (for logs)
 */
const sendNewEventEmail = async (event, triggerPoint = 'unknown') => {
  const eventId = event._id.toString();

  // --- In-process concurrency guard ---
  // If another call for this same event is already in progress (e.g., caused
  // by a double-click retry), skip immediately to avoid a second blast.
  if (emailInProgress.has(eventId)) {
    console.warn(
      `[EmailService] Skipping duplicate in-flight email blast for event ${eventId} (trigger: ${triggerPoint})`
    );
    return;
  }
  emailInProgress.add(eventId);

  try {
    // 1. Fetch all verified users with a non-empty email address
    const users = await User.find(
      { isVerified: true, email: { $exists: true, $ne: '' } },
      'name email'
    );

    console.log(
      `[EmailService] Total verified users found: ${users.length} (event: ${eventId}, trigger: ${triggerPoint})`
    );

    if (!users || users.length === 0) {
      console.log('[EmailService] No verified users found — skipping email blast.');
      return;
    }

    // 2. Deduplicate email addresses using a Set.
    //    This handles cases where the users collection contains documents with
    //    the same email (e.g., seeded test data) to ensure each address gets
    //    exactly one email.
    const emailToUserMap = new Map();
    for (const user of users) {
      const normalizedEmail = user.email.trim().toLowerCase();
      if (!emailToUserMap.has(normalizedEmail)) {
        emailToUserMap.set(normalizedEmail, user);
      }
    }

    const uniqueUsers = Array.from(emailToUserMap.values());
    console.log(
      `[EmailService] Unique email addresses after deduplication: ${uniqueUsers.length} ` +
      `(removed ${users.length - uniqueUsers.length} duplicates)`
    );

    // 3. Configure nodemailer transporter (created once, reused for all mails)
    const transporter = nodemailer.createTransport(sendEmail.createTransportOptions());

    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('[EmailService] Transporter verification failed:', verifyError);
      throw verifyError;
    }

    // 4. Format event date and time for the email body
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

    // 5. Send one personalized email per unique address; track success/failure
    let successCount = 0;
    let failCount = 0;

    for (const user of uniqueUsers) {
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
                Login &amp; Register Now
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
        successCount++;
        console.log(`[EmailService] ✅ Sent to ${user.email}`);
      } catch (err) {
        failCount++;
        console.error(`[EmailService] ❌ Failed to send to ${user.email}:`, err.message);
      }
    }

    // 6. Final summary log
    console.log(
      `[EmailService] Email blast complete for event "${event.title}" (${eventId}): ` +
      `${successCount} sent, ${failCount} failed, ${uniqueUsers.length} unique addresses targeted.`
    );
  } catch (error) {
    // Top-level error (e.g., DB query failure, transporter issue)
    console.error('[EmailService] Fatal error during email blast:', error);
  } finally {
    // Always release the in-process lock, even on error
    emailInProgress.delete(eventId);
  }
};

module.exports = {
  sendNewEventEmail,
};
