import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { getCurrentUser } from '@/lib/auth'
import { noteSchema } from '@/lib/validations/notes'

export async function GET(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { classId } = await params

    const notes = await prisma.note.findMany({
      where: { classId: classId },
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      },
      //orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'Only teachers can create notes' }, { status: 403 })
    }

    const { classId } = await params
    const body = await request.json()

    // Validate request body
    const validation = noteSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.error.issues
      }, { status: 400 })
    }

    const { noteName, noteTopic, notesLinks } = validation.data

    const note = await prisma.note.create({
      data: {
        noteName,
        noteTopic,
        notesLinks,
        classId: classId,
        whichTeacherCreated: user.id,
        //createdAt: new Date(),
        //updatedAt: new Date()
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

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}