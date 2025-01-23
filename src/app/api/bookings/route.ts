import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBookingConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email';
import { format } from 'date-fns';
import { Booking, BookingWithoutId } from '@/types/prisma';

interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
}

interface BookingResponse {
  error?: string;
  success: boolean;
  booking?: Booking;
}

export async function GET(): Promise<NextResponse<{ bookings: Booking[]; error?: string }>> {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        bookingDate: 'desc'
      }
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch bookings', 
      bookings: [] 
    }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse<BookingResponse>> {
  try {
    const body: BookingRequest = await request.json();
    const { name, email, phone, date, time } = body;

    // Validate input
    if (!name || !email || !phone || !date || !time) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        success: false 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email);
      return NextResponse.json(
        { error: 'Invalid email format', success: false },
        { status: 400 }
      );
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    if (!phoneRegex.test(phone)) {
      console.error('Invalid phone format:', phone);
      return NextResponse.json(
        { error: 'Invalid phone number format', success: false },
        { status: 400 }
      );
    }

    // Validate date is not in the past
    const bookingDate = new Date(date);
    if (bookingDate < new Date()) {
      console.error('Date is in the past:', date);
      return NextResponse.json(
        { error: 'Cannot book a date in the past', success: false },
        { status: 400 }
      );
    }

    // Check if slot is still available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        bookingDate: bookingDate,
        bookingTime: time
      }
    });

    if (existingBooking) {
      return NextResponse.json({ 
        error: 'This time slot is no longer available',
        success: false 
      }, { status: 409 });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone,
        bookingDate,
        bookingTime: time,
        status: 'confirmed'
      }
    });

    // Send confirmation emails
    await Promise.all([
      sendBookingConfirmationEmail(booking),
      sendAdminNotificationEmail(booking)
    ]);

    return NextResponse.json({ 
      success: true, 
      booking 
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ 
      error: 'Failed to create booking',
      success: false 
    }, { status: 500 });
  }
}
