import { Resend } from 'resend';
import { getBookingEmailTemplate } from '@/components/email-templates';
import { Booking } from '@/types/prisma';
import { format } from 'date-fns';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface BookingEmailProps extends Omit<Booking, 'createdAt' | 'status'> {
  bookingDate: Date;
  bookingTime: string;
}

export interface AdminEmailProps extends BookingEmailProps {}

export async function sendBookingConfirmationEmail(booking: BookingEmailProps): Promise<void> {
  const formattedDate = format(booking.bookingDate, 'EEEE, MMMM d, yyyy');
  
  await resend.emails.send({
    from: 'Bookings <bookings@resend.dev>',
    to: booking.email,
    subject: 'Phone Consultation Confirmation',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #2d3748; margin: 0 0 15px 0; font-size: 20px;">Phone Consultation Confirmation</h2>
        <p style="color: #4a5568; font-size: 15px; margin: 0 0 15px 0;">Dear ${booking.name},</p>
        <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 15px 0;">
          <div style="margin: 5px 0;">📅 <strong>${formattedDate}</strong></div>
          <div style="margin: 5px 0;">🕒 <strong>${booking.bookingTime}</strong></div>
          <div style="margin: 5px 0;">📞 <strong>${booking.phone}</strong></div>
        </div>
        <p style="color: #4a5568; font-size: 14px; margin: 10px 0;">We'll call you at the scheduled time. For questions: <a href="mailto:contact@ktsvmedia.com" style="color: #4299e1;">contact us</a>.</p>
        <p style="color: #4a5568; font-size: 14px; margin: 10px 0;">Best regards,<br>Your Team</p>
      </div>
    `
  });
}

export async function sendAdminNotificationEmail(booking: AdminEmailProps) {
  const formattedDate = format(booking.bookingDate, 'EEEE, MMMM d, yyyy');

  await resend.emails.send({
    from: 'Bookings <bookings@resend.dev>',
    to: process.env.ADMIN_EMAIL || 'admin@example.com',
    subject: 'New Phone Consultation Booking',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">New Phone Consultation</h1>
        <p>A new phone consultation has been scheduled:</p>
        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> ${booking.id}</p>
          <p><strong>Name:</strong> ${booking.name}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Phone:</strong> ${booking.phone}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${booking.bookingTime}</p>
        </div>
        <p>Remember to call the client at the scheduled time.</p>
      </div>
    `
  });
}

export async function sendCampaignEmail(to: string, subject: string, content: string) {
  await resend.emails.send({
    from: 'Campaigns <campaigns@resend.dev>',
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${content}
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>To unsubscribe from these emails, please <a href="{unsubscribe_url}">click here</a>.</p>
        </div>
      </div>
    `
  });
}

export async function sendTestEmail(email: string): Promise<void> {
  await resend.emails.send({
    from: 'KTSV Media <no-reply@ktsv.media>',
    to: email,
    subject: 'Test Email',
    text: 'This is a test email from KTSV Media.'
  });
}
