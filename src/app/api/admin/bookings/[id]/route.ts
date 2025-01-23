import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { type NextApiRequest } from 'next';

interface DeleteResponse {
  success: boolean;
  error?: string;
}

type RouteParams = {
  params: { id: string | undefined };
};

export async function DELETE(
  request: NextApiRequest | Request,
  { params }: RouteParams
): Promise<NextResponse<DeleteResponse>> {
  if (!params?.id) {
    return NextResponse.json(
      { success: false, error: 'Booking ID is required' },
      { status: 400 }
    );
  }

  try {
    await prisma.booking.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
