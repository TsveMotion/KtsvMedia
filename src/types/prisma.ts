import { Booking, Email, EmailGroup } from '@prisma/client';

export type { Booking, Email, EmailGroup };

export interface BookingWithoutId extends Omit<Booking, 'id' | 'createdAt'> {
  bookingDate: Date;
  bookingTime: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

export interface EmailWithoutId {
  email: string;
  isValid: boolean;
  status: string;
  notes: string | null;
}

export interface EmailGroupWithoutId {
  name: string;
}
