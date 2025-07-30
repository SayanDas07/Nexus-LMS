import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; assignmentId: string }> }
) {
  try {
    const { classId, assignmentId } = await params

    const user = await getCurrentUser()
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify assignment belongs to class
    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
        classId: classId
      }
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    const submissions = await prisma.assignmentSubmitted.findMany({
      where: { assignmentId: assignmentId },
      include: {
        student: { select: { name: true, email: true } },
        assignment: {
          select: {
            type: true,
            totalMarks: true,
            mcqQuestions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}