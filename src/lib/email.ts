import { Resend } from 'resend';
import { getBookingEmailTemplate, getAdminEmailTemplate } from '@/components/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY!);

export interface BaseEmailProps {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
}

export interface BookingEmailProps extends BaseEmailProps {
  meetingUrl: string;
}

export interface AdminEmailProps extends BaseEmailProps {
  phone: string;
}

export async function sendBookingConfirmationEmail(props: BookingEmailProps) {
  try {
    await resend.emails.send({
      from: 'KTSV Media <bookings@ktsv.media>',
      to: props.email,
      subject: 'Your Booking Confirmation - KTSV Media',
      react: getBookingEmailTemplate(props),
      replyTo: process.env.EMAIL_REPLY_TO,
    });
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    throw error;
  }
}

export async function sendAdminNotificationEmail(props: AdminEmailProps) {
  try {
    await resend.emails.send({
      from: 'KTSV Media <bookings@ktsv.media>',
      to: process.env.ADMIN_EMAIL!,
      subject: 'New Booking Alert - KTSV Media',
      react: getAdminEmailTemplate(props),
      replyTo: props.email,
    });
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
    throw error;
  }
}

export async function sendTestEmail() {
  try {
    const testProps: BookingEmailProps = {
      id: 'test-booking-id',
      name: 'Test User',
      email: process.env.TEST_EMAIL || process.env.EMAIL_FROM!,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      meetingUrl: 'https://example.com/meeting-url'
    };

    const [bookingEmail, adminEmail] = await Promise.all([
      sendBookingConfirmationEmail(testProps),
      sendAdminNotificationEmail({ ...testProps, phone: '123-456-7890' })
    ]);

    return {
      success: true,
      bookingEmail,
      adminEmail
    };
  } catch (error) {
    console.error('Failed to send test emails:', error);
    return {
      success: false,
      error
    };
  }
}
