import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const { classId } = await params

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'teacher' && user.role !== 'student') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // update expired assignments to CLOSED
    const now = new Date()
    await prisma.assignment.updateMany({
      where: {
        classId,
        deadline: { lt: now },
        status: 'OPEN',
      },
      data: { status: 'CLOSED' },
    })

    //  Fetch class data
    const classData = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        teachers: { select: { id: true, name: true, email: true } },
        enrolledStudents: { select: { id: true, name: true, email: true, role: true } },
        assignments: {
          include: {
            teacher: { select: { id: true, name: true } },
            _count: { select: { submittedAssignments: true } },
            mcqQuestions: true,
            submittedAssignments: {
              where: { studentId: user.id },
              select: { id: true, marksObtained: true, grade: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        notes: {
          include: { creator: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' }
        },
        notices: {
          include: { creator: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    // Authorization – ensure teacher is assigned
    if (user.role === 'teacher') {
      const isAssignedTeacher = classData.teachers.some(teacher => teacher.id === user.id)
      if (!isAssignedTeacher) {
        return NextResponse.json({ error: 'You are not assigned to this class' }, { status: 403 })
      }
    }

    //  Enhance assignments for student
    let assignments = classData.assignments
    if (user.role === 'student') {
      assignments = assignments.map((assignment) => {
        const submission = assignment.submittedAssignments[0]
        let studentStatus: 'ACTIVE' | 'SUBMITTED' | 'GRADED' | 'OVERDUE' = 'ACTIVE'

        if (submission) {
          studentStatus = submission.marksObtained !== null ? 'GRADED' : 'SUBMITTED'
        } else if (now > assignment.deadline) {
          studentStatus = 'OVERDUE'
        }

        return {
          ...assignment,
          studentStatus, 
        }
      })
    }

    //  Final Response
    const responseData = {
      ...classData,
      currentUserRole: user.role,
      assignments, // override with enhanced ones if student
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('[CLASS_GET_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
