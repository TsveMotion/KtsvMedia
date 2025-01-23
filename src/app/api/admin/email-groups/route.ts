import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const groups = await prisma.emailGroup.findMany({
      include: {
        emails: true,
        campaigns: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      groups: groups.map(group => ({
        ...group,
        emailCount: group.emails.length,
        campaignCount: group.campaigns.length
      }))
    });
  } catch (error) {
    console.error('Error fetching email groups:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch email groups',
      groups: []
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, emailIds } = await request.json();

    // Validate input
    if (!name || !Array.isArray(emailIds)) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Create group
    const group = await prisma.emailGroup.create({
      data: {
        name,
        emails: {
          connect: emailIds.map(id => ({ id }))
        }
      },
      include: {
        emails: true,
        campaigns: true
      }
    });

    return NextResponse.json({
      group: {
        ...group,
        emailCount: group.emails.length,
        campaignCount: group.campaigns.length
      }
    });
  } catch (error) {
    console.error('Error creating email group:', error);
    return NextResponse.json({ 
      error: 'Failed to create email group' 
    }, { status: 500 });
  }
}
