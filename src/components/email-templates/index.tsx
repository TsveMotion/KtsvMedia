import { format } from 'date-fns';
import { BookingEmailProps, AdminEmailProps } from "@/lib/email";

interface EmailTemplateProps extends BookingEmailProps {
  meetingUrl?: string;
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const section = {
  padding: "0 48px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.5",
  margin: "16px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "16px 0",
};

export function getBookingEmailTemplate(props: EmailTemplateProps): string {
  const { name, email, phone, bookingDate, bookingTime, meetingUrl } = props;
  const formattedDate = format(bookingDate, 'EEEE, MMMM d, yyyy');

  return `
Dear ${name},

Your booking with KTSV Media has been confirmed for ${formattedDate} at ${bookingTime}.

${meetingUrl ? `Meeting Link: ${meetingUrl}` : ''}

Best regards,
KTSV Media Team
  `.trim();
}

export function getAdminEmailTemplate(props: AdminEmailProps): string {
  const { name, email, phone, bookingDate, bookingTime } = props;
  const formattedDate = format(bookingDate, 'EEEE, MMMM d, yyyy');

  return `
New Booking Notification

Customer Details:
Name: ${name}
Email: ${email}
Phone: ${phone}
Date: ${formattedDate}
Time: ${bookingTime}

Best regards,
KTSV Media System
  `.trim();
}
