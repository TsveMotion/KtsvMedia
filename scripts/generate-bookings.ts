import { PrismaClient } from '@prisma/client';
import { addDays, format, isWeekend } from 'date-fns';

const prisma = new PrismaClient();

// Define time slots
const WEEKDAY_TIME_SLOTS = [
  '16:00', '17:00', '18:00', '19:00', '20:00'
];

const WEEKEND_TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00'
];

// Sample names and emails for random bookings
const SAMPLE_BOOKINGS = [
  { name: 'John Smith', email: 'john.smith@example.com', phone: '+44 7700 900123' },
  { name: 'Emma Wilson', email: 'emma.wilson@example.com', phone: '+44 7700 900124' },
  { name: 'Michael Brown', email: 'michael.brown@example.com', phone: '+44 7700 900125' },
  { name: 'Sarah Davis', email: 'sarah.davis@example.com', phone: '+44 7700 900126' },
  { name: 'James Taylor', email: 'james.taylor@example.com', phone: '+44 7700 900127' },
  { name: 'Lisa Anderson', email: 'lisa.anderson@example.com', phone: '+44 7700 900128' },
  { name: 'David Martinez', email: 'david.martinez@example.com', phone: '+44 7700 900129' },
  { name: 'Emily White', email: 'emily.white@example.com', phone: '+44 7700 900130' }
];

async function generateRandomBookings() {
  try {
    const startDate = new Date();
    const bookings = [];

    // Generate bookings for the next 30 days
    for (let i = 0; i < 30; i++) {
      const currentDate = addDays(startDate, i);
      const timeSlots = isWeekend(currentDate) ? WEEKEND_TIME_SLOTS : WEEKDAY_TIME_SLOTS;
      
      // Randomly select 2-3 slots per day to be booked
      const numBookings = Math.floor(Math.random() * 2) + 2; // 2-3 bookings
      const selectedSlots = timeSlots
        .sort(() => Math.random() - 0.5)
        .slice(0, numBookings);

      for (const time of selectedSlots) {
        const randomBooking = SAMPLE_BOOKINGS[Math.floor(Math.random() * SAMPLE_BOOKINGS.length)];
        bookings.push({
          name: randomBooking.name,
          email: randomBooking.email,
          phone: randomBooking.phone,
          bookingDate: currentDate,
          bookingTime: time,
          status: 'confirmed'
        });
      }
    }

    // Insert all bookings
    await prisma.booking.createMany({
      data: bookings,
      skipDuplicates: true
    });

    console.log(`Successfully generated ${bookings.length} random bookings`);
  } catch (error) {
    console.error('Error generating bookings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateRandomBookings();
