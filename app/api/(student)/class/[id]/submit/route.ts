/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  
  try {
    const { id } = await params;
    //console.log('Fetching submitted assignments for class:',id);
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
    //console.log('Fetching submitted assignments for class:', id, 'for user:', userId);
  
    const scores = await prisma.assignmentSubmitted.findMany({
      where: {
        student: { clerkId: userId },
        assignment: { classId: id },
      },
      include: {
        assignment: { select: { title: true, totalMarks: true } },
      },
    });
  
    return NextResponse.json(scores);
  } catch (error) {
    console.error('Error fetching submitted assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch submitted assignments' }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
}



export async function POST(req: Request, context: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    const body = await req.json();
    const { assignmentId, submissionLink } = body;
  
    if (!assignmentId || !submissionLink) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
  
    const student = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });
  
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
  
    const submission = await prisma.assignmentSubmitted.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: student.id,
        },
      },
      update: {
        submissionLink,
        updatedAt: new Date(),
      },
      create: {
        assignmentId,
        studentId: student.id,
        submissionLink,
      },
    });
  
    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return NextResponse.json({ error: 'Failed to submit assignment' }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
}

