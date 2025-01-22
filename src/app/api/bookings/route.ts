import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBookingConfirmationEmail as sendBookingConfirmation, sendAdminNotificationEmail as sendAdminNotification } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { name, email, phone, date, time } = await req.json();

    // Validate required fields
    if (!date || !time || !name || !email || !phone) {
      console.error('Missing required fields:', { date, time, name, email, phone });
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    if (!phoneRegex.test(phone)) {
      console.error('Invalid phone format:', phone);
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate date is not in the past
    const bookingDate = new Date(date);
    if (bookingDate < new Date()) {
      console.error('Date is in the past:', date);
      return NextResponse.json(
        { error: 'Cannot book a date in the past' },
        { status: 400 }
      );
    }

    console.log('Checking for existing booking:', { date: bookingDate, time });

    // Check for existing booking
    const existingBooking = await prisma.booking.findFirst({
      where: {
        bookingDate: bookingDate,
        bookingTime: time,
      },
    });

    if (existingBooking) {
      console.error('Time slot already booked:', { date, time });
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 400 }
      );
    }

    console.log('Creating new booking...');

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone,
        bookingDate: new Date(date),
        bookingTime: time,
        status: 'PENDING'
      }
    });

    console.log('Booking created:', booking);

    // Send confirmation email to customer
    await sendBookingConfirmation({
      id: booking.id,
      name,
      email,
      date: bookingDate.toLocaleDateString(),
      time,
      meetingUrl: `${process.env.MEETING_URL}/${booking.id}`
    });

    // Send notification to admin
    await sendAdminNotification({
      id: booking.id,
      name,
      email,
      phone,
      date: bookingDate.toLocaleDateString(),
      time
    });

    return NextResponse.json({ 
      success: true, 
      booking,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}
