import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const campaigns = await prisma.emailCampaign.findMany({
      include: {
        group: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch campaigns',
      campaigns: []
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { subject, content, groupId } = await request.json();

    // Validate input
    if (!subject || !content || !groupId) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Create campaign
    const campaign = await prisma.emailCampaign.create({
      data: {
        subject,
        content,
        status: 'draft',
        groupId
      },
      include: {
        group: true
      }
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ 
      error: 'Failed to create campaign' 
    }, { status: 500 });
  }
}
