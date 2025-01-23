import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format, parse } from 'date-fns';

// Define time slots for weekdays (Monday to Friday)
const WEEKDAY_TIME_SLOTS = [
  '16:00', '17:00', '18:00', '19:00', '20:00'
];

// Define time slots for weekends (Saturday and Sunday)
const WEEKEND_TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00'
];

export async function GET(request: Request) {
  try {
    // Get date from query params
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    if (!dateParam) {
      return NextResponse.json({ 
        error: 'Date parameter is required',
        availableTimeSlots: [] 
      }, { status: 400 });
    }

    // Parse the date
    const bookingDate = parse(dateParam, 'yyyy-MM-dd', new Date());

    // Get existing bookings for the date
    const bookings = await prisma.booking.findMany({
      where: {
        bookingDate: {
          equals: bookingDate
        }
      },
      select: {
        bookingTime: true
      }
    });

    // Get booked time slots
    const bookedTimeSlots = bookings.map(booking => booking.bookingTime);

    // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = bookingDate.getDay();
    
    // Select time slots based on weekday (Monday-Friday) or weekend (Saturday-Sunday)
    const availableSlots = (dayOfWeek === 0 || dayOfWeek === 6)
      ? WEEKEND_TIME_SLOTS 
      : WEEKDAY_TIME_SLOTS;

    // Filter out booked slots
    const availableTimeSlots = availableSlots.filter(
      time => !bookedTimeSlots.includes(time)
    );

    return NextResponse.json({ availableTimeSlots });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({
      error: 'Failed to check availability',
      availableTimeSlots: []
    }, {
      status: 500
    });
  }
}
