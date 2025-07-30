import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ classId: string; assignmentId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { classId, assignmentId } = await params;

  try {
    // Get user details to check role
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'student') {
      return NextResponse.json({ error: 'Only students can access this endpoint' }, { status: 403 });
    }

    // First check if the assignment exists and belongs to the specified class
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        classId: classId
      },
      include: {
        teacher: { select: { name: true } },
        class: {
          select: {
            name: true,
            enrolledStudents: {
              where: { id: user.id },
              select: { id: true }
            }
          }
        },
        mcqQuestions: true,
        submittedAssignments: {
          where: { studentId: user.id },
          select: {
            id: true,
            submissionLink: true,
            selectedOptions: true,
            marksObtained: true,
            grade: true,
            createdAt: true
          }
        }
      }
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check if student is enrolled in this class
    if (assignment.class.enrolledStudents.length === 0) {
      return NextResponse.json({ error: 'Not enrolled in this class' }, { status: 403 });
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json({ error: 'Failed to fetch assignment' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}