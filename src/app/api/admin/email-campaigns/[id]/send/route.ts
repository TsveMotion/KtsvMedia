import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get campaign and associated emails
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: params.id },
      include: {
        group: {
          include: {
            emails: true
          }
        }
      }
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Send emails to all addresses in the group
    const emailPromises = campaign.group.emails.map(async (emailRecord) => {
      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: emailRecord.email,
          subject: campaign.subject,
          html: campaign.content,
        });
        return { success: true, email: emailRecord.email };
      } catch (error) {
        console.error(`Failed to send email to ${emailRecord.email}:`, error);
        return { success: false, email: emailRecord.email, error };
      }
    });

    const results = await Promise.all(emailPromises);

    // Update campaign status
    await prisma.emailCampaign.update({
      where: { id: params.id },
      data: {
        status: 'sent',
        sentAt: new Date(),
      }
    });

    // Return results
    return NextResponse.json({
      success: true,
      results,
      successCount: results.filter(r => r.success).length,
      failureCount: results.filter(r => !r.success).length,
    });
  } catch (error) {
    console.error('Error sending campaign:', error);
    return NextResponse.json(
      { error: 'Failed to send campaign' },
      { status: 500 }
    );
  }
}
