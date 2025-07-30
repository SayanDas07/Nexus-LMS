import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'
import { noticeSchema } from '@/lib/validations/notice'

const prisma = new PrismaClient()

// GET single notice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; noticeId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { classId, noticeId } = await params

    const notice = await prisma.notice.findUnique({
      where: {
        id: noticeId,
        classId: classId
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!notice) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 })
    }

    return NextResponse.json(notice)
  } catch (error) {
    console.error('Error fetching notice:', error)
    return NextResponse.json({ error: 'Failed to fetch notice' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// UPDATE notice
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; noticeId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'Only teachers can update notices' }, { status: 403 })
    }

    const { classId, noticeId } = await params
    const body = await request.json()

    // Validate request body
    const validation = noticeSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.error.issues
      }, { status: 400 })
    }

    const { title, content } = validation.data

    // Check if notice exists and belongs to the class
    const existingNotice = await prisma.notice.findUnique({
      where: {
        id: noticeId,
        classId: classId
      }
    })

    if (!existingNotice) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 })
    }

    // Check if user is the creator of the notice
    if (existingNotice.createdBy !== user.id) {
      return NextResponse.json({ error: 'You can only update your own notices' }, { status: 403 })
    }

    const updatedNotice = await prisma.notice.update({
      where: { id: noticeId },
      data: {
        title,
        content,
        updatedAt: new Date()
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(updatedNotice)
  } catch (error) {
    console.error('Error updating notice:', error)
    return NextResponse.json({ error: 'Failed to update notice' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE notice
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; noticeId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'Only teachers can delete notices' }, { status: 403 })
    }

    const { classId, noticeId } = await params

    // Check if notice exists and belongs to the class
    const existingNotice = await prisma.notice.findUnique({
      where: {
        id: noticeId,
        classId: classId
      }
    })

    if (!existingNotice) {
      return NextResponse.json({ error: 'Notice not found' }, { status: 404 })
    }

    // Check if user is the creator of the notice
    if (existingNotice.createdBy !== user.id) {
      return NextResponse.json({ error: 'You can only delete your own notices' }, { status: 403 })
    }

    await prisma.notice.delete({
      where: { id: noticeId }
    })

    return NextResponse.json({ message: 'Notice deleted successfully' })
  } catch (error) {
    console.error('Error deleting notice:', error)
    return NextResponse.json({ error: 'Failed to delete notice' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}