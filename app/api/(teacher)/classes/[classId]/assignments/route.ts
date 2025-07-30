/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const { classId } = await params

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // First, check and update any assignments that should be CLOSED due to deadline
    const now = new Date();
    await prisma.assignment.updateMany({
      where: {
        classId: classId,
        deadline: { lt: now },
        status: 'OPEN'
      },
      data: { status: 'CLOSED' }
    });

    // Then fetch assignments
    const assignments = await prisma.assignment.findMany({
      where: { classId: classId },
      include: {
        teacher: { select: { name: true } },
        _count: { select: { submittedAssignments: true } },
        mcqQuestions: true,
        submittedAssignments: {
          where: { studentId: user.id },
          select: { id: true, marksObtained: true, grade: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Enhance assignments with proper status based on user role
    const enhancedAssignments = assignments.map(assignment => {
      if (user.role === 'student') {
        const submission = assignment.submittedAssignments[0];
        let studentStatus = 'ACTIVE';

        if (submission) {
          studentStatus = submission.marksObtained !== null ? 'GRADED' : 'SUBMITTED';
        } else if (now > assignment.deadline) {
          studentStatus = 'OVERDUE';
        }

        return {
          ...assignment,
          status: studentStatus // Override the teacher status with student status
        };
      }

      // For teachers, return the original status (OPEN, CLOSED, PENDING)
      return assignment;
    });

    return NextResponse.json(enhancedAssignments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const { classId } = await params

    const user = await getCurrentUser();
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, deadline, totalMarks, type, driveLink, mcqQuestions } = body;

    // Create new assignment
    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        deadline: new Date(deadline),
        totalMarks: parseInt(totalMarks),
        type,
        status: 'OPEN', // Default status for new assignments
        driveLink: type === 'DRIVE' ? driveLink : null,
        classId: classId,
        whichTeacher: user.id,
      }
    });

    // If MCQ type, create questions
    if (type === 'MCQ' && mcqQuestions && mcqQuestions.length > 0) {
      await prisma.mCQQuestion.createMany({
        data: mcqQuestions.map((q: any) => ({
          assignmentId: newAssignment.id,
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctOption: q.correctOption
        }))
      });
    }

    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}