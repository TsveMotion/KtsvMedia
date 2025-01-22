import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json(
        { error: 'Start and end dates are required' },
        { status: 400 }
      );
    }

    // Get all bookings for the date range
    const bookings = await prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: new Date(start),
          lte: new Date(end),
        },
      },
      select: {
        bookingDate: true,
        bookingTime: true,
        status: true,
      },
    });

    // Organize bookings by date
    const bookedSlots: { [key: string]: string[] } = {};
    bookings.forEach((booking) => {
      const dateStr = booking.bookingDate.toISOString().split('T')[0];
      if (!bookedSlots[dateStr]) {
        bookedSlots[dateStr] = [];
      }
      if (booking.status === 'confirmed') {
        bookedSlots[dateStr].push(booking.bookingTime);
      }
    });

    // Get available time slots for each day
    const timeSlots = [
      '09:00', '10:00', '11:00', '12:00', '13:00',
      '14:00', '15:00', '16:00', '17:00'
    ];

    const availability: { [key: string]: string[] } = {};
    const startDate = new Date(start);
    const endDate = new Date(end);

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();

      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }

      // Get available slots for this day
      availability[dateStr] = timeSlots.filter(
        time => !bookedSlots[dateStr]?.includes(time)
      );
    }

    return NextResponse.json({
      bookedSlots,
      availability,
      timeSlots,
    });
  } catch (error) {
    console.error('Failed to get availability:', error);
    return NextResponse.json(
      { error: 'Failed to get availability' },
      { status: 500 }
    );
  }
}
