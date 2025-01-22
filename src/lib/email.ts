import { Resend } from 'resend';

const resend = new Resend('re_4RE73uzJ_PDTwxnGdkgQW1mXejFJGw2gW');

// Production configuration since domain is verified
const IS_TEST_MODE = false;
const ADMIN_EMAIL = 'hello@ktsvmedia.com';

// Email configuration
const EMAIL_CONFIG = {
  from: 'KTSV Media <consultation@ktsvmedia.com>',
  replyTo: 'hello@ktsvmedia.com'
};

interface BookingEmailProps {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  meetingUrl?: string;
}

export async function sendBookingConfirmation({
  name,
  email,
  phone,
  date,
  time,
  meetingUrl = '#'
}: BookingEmailProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      reply_to: EMAIL_CONFIG.replyTo,
      subject: 'Your Discovery Call with KTSV Media is Confirmed!',
      html: `
        <!DOCTYPE html>
        <html>
        ${generateEmailTemplate({
          name,
          email,
          phone,
          formattedDate,
          time,
          meetingUrl,
        })}
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send confirmation email:', error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendAdminNotification(booking: BookingEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: ADMIN_EMAIL,
      reply_to: EMAIL_CONFIG.replyTo,
      subject: 'New Discovery Call Booking',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Booking Received</h2>
          <p>A new discovery call has been scheduled.</p>
          <h3>Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${booking.name}</li>
            <li><strong>Email:</strong> ${booking.email}</li>
            <li><strong>Phone:</strong> ${booking.phone}</li>
            <li><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</li>
            <li><strong>Time:</strong> ${booking.time}</li>
          </ul>
          <p>
            <a href="mailto:${booking.email}" style="color: #1d4ed8; text-decoration: none;">
              Reply to ${booking.name}
            </a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send admin notification:', error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return { success: false, error };
  }
}

// Test function to verify email sending
export async function sendTestEmail() {
  try {
    // Test successful delivery
    const { data: deliveredData, error: deliveredError } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: 'delivered@resend.dev',
      subject: 'Test Email - Successful Delivery',
      html: '<p>This is a test email to verify successful delivery.</p>'
    });

    if (deliveredError) {
      console.error('Failed to send test delivery email:', deliveredError);
      return { success: false, error: deliveredError };
    }

    // Test spam handling
    const { data: spamData, error: spamError } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: 'complained@resend.dev',
      subject: 'Test Email - Spam Handling',
      html: '<p>This is a test email to verify spam handling.</p>'
    });

    if (spamError) {
      console.error('Failed to send test spam email:', spamError);
      return { success: false, error: spamError };
    }

    return { 
      success: true, 
      delivered: deliveredData,
      spam: spamData
    };
  } catch (error) {
    console.error('Failed to send test emails:', error);
    return { success: false, error };
  }
}

// Helper function to generate email template
function generateEmailTemplate({
  name,
  email,
  phone,
  formattedDate,
  time,
  meetingUrl,
}: {
  name: string;
  email: string;
  phone: string;
  formattedDate: string;
  time: string;
  meetingUrl: string;
}) {
  return `
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6; 
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px;
          background-color: #ffffff;
        }
        .header { 
          background-color: #1d4ed8; 
          color: white; 
          padding: 30px 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content { 
          padding: 30px 20px;
          background-color: #ffffff;
        }
        .details { 
          background-color: #f3f4f6;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
        }
        .button { 
          background-color: #1d4ed8;
          color: white !important;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          display: inline-block;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-size: 0.875rem;
        }
        @media only screen and (max-width: 600px) {
          .container {
            width: 100% !important;
            padding: 10px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">Your Discovery Call is Confirmed!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Thank you for scheduling a discovery call with KTSV Media. We're excited to discuss how we can help you achieve your advertising goals!</p>
          
          <div class="details">
            <h2 style="margin-top: 0;">Booking Details</h2>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Your Name:</strong> ${name}</p>
            <p><strong>Your Email:</strong> ${email}</p>
            <p><strong>Your Phone:</strong> ${phone}</p>
          </div>

          <div style="text-align: center;">
            <p style="margin-bottom: 10px;">Click below to join your meeting at the scheduled time:</p>
            <a href="${meetingUrl}" class="button">Join Meeting</a>
          </div>

          <div style="margin-top: 30px;">
            <h3 style="color: #4b5563;">Need to make changes?</h3>
            <p>If you need to reschedule or have any questions, please don't hesitate to:</p>
            <ul>
              <li>Email us at <a href="mailto:hello@ktsvmedia.com" style="color: #1d4ed8;">hello@ktsvmedia.com</a></li>
              <li>Call us at <a href="tel:+447305979981" style="color: #1d4ed8;">+44 07305 979981</a></li>
            </ul>
          </div>

          <p>We look forward to speaking with you!</p>
          
          <p>Best regards,<br>The KTSV Media Team</p>
        </div>
        
        <div class="footer">
          <p> 2024 KTSV Media. All rights reserved.</p>
          <p style="margin-top: 10px; font-size: 0.75rem;">
            This email was sent to ${email}. If you didn't request this email, please ignore it.
          </p>
        </div>
      </div>
    </body>
  `;
}
