import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'
import { noticeSchema } from '@/lib/validations/notice'

const prisma = new PrismaClient()


// get all notices for a class
export async function GET(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { classId } = await params

    const notices = await prisma.notice.findMany({
      where: { classId: classId },
      include: { 
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(notices)
  } catch (error) {
    console.error('Error fetching notices:', error)
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}


// Create a new notice
export async function POST(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'Only teachers can create notices' }, { status: 403 })
    }

    const { classId } = await params
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

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        classId: classId,
        createdBy: user.id,
        createdAt: new Date(),
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

    return NextResponse.json(notice, { status: 201 })
  } catch (error) {
    console.error('Error creating notice:', error)
    return NextResponse.json({ error: 'Failed to create notice' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}