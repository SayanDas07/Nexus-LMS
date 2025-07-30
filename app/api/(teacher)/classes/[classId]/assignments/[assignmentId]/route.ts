import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { getCurrentUser } from '@/lib/auth'

interface MCQQuestion {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; assignmentId: string }> }
) {
  try {
    const { classId, assignmentId } = await params

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId, classId: classId },
      include: {
        teacher: { select: { name: true } },
        class: { select: { name: true } },
        mcqQuestions: true,
        submittedAssignments: {
          include: {
            student: { select: { name: true, email: true } }
          }
        }
      }
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Error fetching assignment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignment' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; assignmentId: string }> }
) {
  try {
    const { classId, assignmentId } = await params

    const user = await getCurrentUser()
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, deadline, totalMarks, type, driveLink, mcqQuestions } = body

    // Verify assignment belongs to the specified class
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id: assignmentId, classId: classId }
    })

    if (!existingAssignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    const assignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        title,
        deadline: new Date(deadline),
        totalMarks: parseInt(totalMarks),
        type,
        driveLink: type === 'DRIVE' ? driveLink : null
      }
    })

    if (type === 'MCQ' && mcqQuestions) {
      await prisma.mCQQuestion.deleteMany({
        where: { assignmentId: assignmentId }
      })

      if (mcqQuestions.length > 0) {
        await prisma.mCQQuestion.createMany({
          data: mcqQuestions.map((q: MCQQuestion) => ({
            assignmentId: assignment.id,
            question: q.question,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption
          }))
        })
      }
    }

    return NextResponse.json(assignment)
  } catch (error) {
    console.error('Error updating assignment:', error)
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; assignmentId: string }> }
) {
  try {
    const { classId, assignmentId } = await params

    const user = await getCurrentUser()
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify assignment belongs to the specified class
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id: assignmentId, classId: classId }
    })

    if (!existingAssignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    await prisma.$transaction([
      prisma.mCQQuestion.deleteMany({
        where: { assignmentId: assignmentId }
      }),
      prisma.assignmentSubmitted.deleteMany({
        where: { assignmentId: assignmentId }
      }),
      prisma.assignment.delete({
        where: { id: assignmentId }
      })
    ])

    return NextResponse.json({ message: 'Assignment deleted successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to delete assignment' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect();
  }
}