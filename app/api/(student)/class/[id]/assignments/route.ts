import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  //console.log('Fetching assignments for class:', id, 'for user:', userId);
  try {
    // First get the student's ID from your User table using clerk's userId
    const student = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const now = new Date();
    const assignments = await prisma.assignment.findMany({
      where: { classId: id },
      include: {
        teacher: { select: { name: true } },
        submittedAssignments: {
          where: { studentId: student.id },
          select: { id: true, marksObtained: true, grade: true }
        }
      },
      orderBy: { deadline: "asc" },
    });

    console.log('Assignments fetched:', assignments.length);

    // Transform assignments with student-specific status
    const studentAssignments = assignments.map(assignment => {
      const submission = assignment.submittedAssignments[0];
      let status = 'ACTIVE'; // Default status

      if (submission) {
        status = submission.marksObtained !== null ? 'GRADED' : 'SUBMITTED';
      } else if (now > assignment.deadline) {
        status = 'OVERDUE';
      }

      return {
        ...assignment,
        status, // Override with student-facing status
        // Include additional fields you might need
        teacherName: assignment.teacher.name,
        hasSubmitted: !!submission,
        isGraded: submission?.marksObtained !== null
      };
    });

    return NextResponse.json(studentAssignments);
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    return NextResponse.json(
      { error: "Failed to fetch assignments" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}