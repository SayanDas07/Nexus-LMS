/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  try {
    // Query your database for user role
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true }
    });

    return NextResponse.json({ role: user?.role || null });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user role' }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}