import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { inviteCode } = await req.json();
    if (!inviteCode || typeof inviteCode !== 'string') {
      return NextResponse.json({ error: 'Valid invite code is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true }
    });

    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Only students can join classes' }, { status: 403 });
    }

    const classroom = await prisma.class.findUnique({
      where: { inviteCode },
      select: {
        id: true,
        enrolledStudents: {
          where: { clerkId: userId },
          select: { id: true } // Can be clerkId too
        }
      }
    });

    if (!classroom) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    if (classroom.enrolledStudents.length > 0) {
      return NextResponse.json({ error: 'Already enrolled' }, { status: 400 });
    }

    await prisma.class.update({
      where: { id: classroom.id },
      data: {
        enrolledStudents: {
          connect: { clerkId: userId }
        }
      }
    });

    return NextResponse.json({ success: true, message: 'Joined class successfully' }, { status: 200 });

  } catch (err) {
    console.error('[JOIN_CLASS_ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
