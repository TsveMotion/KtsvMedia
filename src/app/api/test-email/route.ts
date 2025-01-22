import { NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/email';

export async function GET() {
  try {
    const result = await sendTestEmail();
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send test emails' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Test emails sent successfully',
      result
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { error: 'Failed to process test emails' },
      { status: 500 }
    );
  }
}
