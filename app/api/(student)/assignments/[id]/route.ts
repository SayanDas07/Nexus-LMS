import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  _req: Request,
  context: { params: Promise<{ assignmentId: string }> } // 👈 mark as Promise
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { assignmentId } = await context.params; // 👈 await the promise
  
    const submission = await prisma.assignmentSubmitted.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: userId,
        },
      },
    });
  
    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error fetching assignment submission:", error);
    return NextResponse.json({ error: "Failed to fetch assignment submission" }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
}
