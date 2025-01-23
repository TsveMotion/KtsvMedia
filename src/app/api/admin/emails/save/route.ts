import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { emails } = await request.json();

    // Bulk create/update emails
    const results = await Promise.all(
      emails.map(async (result: { email: string; isValid: boolean; status: string; notes?: string }) => {
        return prisma.email.upsert({
          where: { email: result.email },
          update: {
            isValid: result.isValid,
            status: result.status,
            notes: result.notes
          },
          create: {
            email: result.email,
            isValid: result.isValid,
            status: result.status,
            notes: result.notes
          }
        });
      })
    );

    return NextResponse.json({
      success: true,
      savedCount: results.length,
      emails: results
    });
  } catch (error) {
    console.error('Error saving emails:', error);
    return NextResponse.json(
      { error: 'Failed to save emails' },
      { status: 500 }
    );
  }
}
