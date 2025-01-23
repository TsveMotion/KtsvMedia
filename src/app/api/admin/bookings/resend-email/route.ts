import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBookingConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ 
        error: 'Booking ID is required' 
      }, { status: 400 });
    }

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });

    if (!booking) {
      return NextResponse.json({ 
        error: 'Booking not found' 
      }, { status: 404 });
    }

    // Resend confirmation email
    await sendBookingConfirmationEmail(booking);

    return NextResponse.json({ 
      success: true,
      message: 'Confirmation email resent successfully' 
    });

  } catch (error) {
    console.error('Error resending confirmation email:', error);
    return NextResponse.json({ 
      error: 'Failed to resend confirmation email' 
    }, { status: 500 });
  }
}
