import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: {
        bookingDate: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bookingDate: true,
        bookingTime: true,
        status: true,
        createdAt: true
      }
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({ 
        error: 'Database connection error', 
        bookings: [] 
      }, { status: 503 });
    }
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ 
        error: 'Database query error', 
        bookings: [] 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Internal server error', 
      bookings: [] 
    }, { status: 500 });
  }
}
