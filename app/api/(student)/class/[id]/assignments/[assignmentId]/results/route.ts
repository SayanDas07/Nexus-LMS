import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ classId: string; assignmentId: string }> } // ✅ Promise type
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assignmentId } = await context.params; // ✅ await params

    // Get assignment with questions and student's submission
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        mcqQuestions: true,
        submittedAssignments: {
          where: { studentId: user.id },
          select: {
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

    if (assignment.type !== 'MCQ') {
      return NextResponse.json({ error: 'Results only available for MCQ assignments' }, { status: 400 });
    }

    const submission = assignment.submittedAssignments[0];
    if (!submission) {
      return NextResponse.json({ error: 'No submission found' }, { status: 404 });
    }

    // Prepare results with correct answers
    const results = assignment.mcqQuestions.map((question, index) => ({
      question: question.question,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctOption: question.correctOption,
      selectedOption: submission.selectedOptions[index] || null,
      isCorrect: submission.selectedOptions[index] === question.correctOption
    }));

    return NextResponse.json({
      assignment: {
        title: assignment.title,
        totalMarks: assignment.totalMarks
      },
      submission: {
        marksObtained: submission.marksObtained,
        grade: submission.grade,
        submittedAt: submission.createdAt
      },
      results
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
