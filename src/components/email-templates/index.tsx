import { BookingEmailProps, AdminEmailProps } from "@/lib/email";
import {
  Html,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Section,
  Heading,
} from "@react-email/components";

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

export function getBookingEmailTemplate(props: BookingEmailProps) {
  const { id, name, date, time, meetingUrl } = props;

  return (
    <Html>
      <Preview>Your booking with KTSV Media has been confirmed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Booking Confirmation</Heading>
          <Section style={section}>
            <Text style={text}>Dear {name},</Text>
            <Text style={text}>
              Your booking with KTSV Media has been confirmed for {date} at {time}.
            </Text>
            <Text style={text}>
              Meeting Link: <Link href={meetingUrl}>Join Meeting</Link>
            </Text>
            {id && (
              <Text style={text}>
                You can view or manage your booking at:{" "}
                <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/meeting/${encodeURIComponent(id)}`}>
                  View Booking
                </Link>
              </Text>
            )}
            <Text style={text}>
              If you need to make any changes or have questions, please don&apos;t hesitate to contact us.
            </Text>
            <Text style={text}>Best regards,</Text>
            <Text style={text}>KTSV Media Team</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function getAdminEmailTemplate(props: AdminEmailProps) {
  const { id, name, email, phone, date, time } = props;

  return (
    <Html>
      <Preview>New Booking Notification - KTSV Media</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Booking Notification</Heading>
          <Section style={section}>
            <Text style={text}>A new booking has been made:</Text>
            <Text style={text}>
              Client: {name}
              <br />
              Email: {email}
              <br />
              Phone: {phone}
              <br />
              Date: {date}
              <br />
              Time: {time}
            </Text>
            {id && (
              <Text style={text}>
                Booking details:{" "}
                <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/meeting/${encodeURIComponent(id)}`}>
                  View Booking
                </Link>
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
