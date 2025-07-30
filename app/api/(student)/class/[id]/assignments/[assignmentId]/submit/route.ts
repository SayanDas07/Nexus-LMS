import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ classId: string; assignmentId: string }> } // ✅ Promise type
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { classId, assignmentId } = await context.params; // ✅ Await here

    const body = await request.json();
    const { submissionLink, selectedOptions } = body;

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { mcqQuestions: true }
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    if (assignment.status === 'CLOSED' || new Date() > assignment.deadline) {
      return NextResponse.json({ error: 'Assignment deadline has passed' }, { status: 400 });
    }

    const isEnrolled = await prisma.class.findFirst({
      where: {
        id: classId,
        enrolledStudents: {
          some: { id: user.id }
        }
      }
    });

    if (!isEnrolled) {
      return NextResponse.json({ error: 'Not enrolled in this class' }, { status: 403 });
    }

    const existingSubmission = await prisma.assignmentSubmitted.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: user.id
        }
      }
    });

    if (existingSubmission) {
      return NextResponse.json({ error: 'Assignment already submitted' }, { status: 400 });
    }

    let marksObtained: number | null = null;
    if (assignment.type === 'MCQ' && selectedOptions && assignment.mcqQuestions.length > 0) {
      let correctAnswers = 0;
      const marksPerQuestion = assignment.totalMarks / assignment.mcqQuestions.length;

      assignment.mcqQuestions.forEach((question, index) => {
        if (selectedOptions[index] === question.correctOption) {
          correctAnswers++;
        }
      });

      marksObtained = Math.round(correctAnswers * marksPerQuestion);
    }

    const submission = await prisma.assignmentSubmitted.create({
      data: {
        assignmentId,
        studentId: user.id,
        submissionLink: assignment.type === 'DRIVE' ? submissionLink : null,
        selectedOptions: assignment.type === 'MCQ' ? selectedOptions : [],
        marksObtained
      }
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return NextResponse.json({ error: 'Failed to submit assignment' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
