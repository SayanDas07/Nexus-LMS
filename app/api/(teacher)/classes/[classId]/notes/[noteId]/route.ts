import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'
import { noteSchema } from '@/lib/validations/notes'

const prisma = new PrismaClient()

// GET single note
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; noteId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { classId, noteId } = await params

    const note = await prisma.note.findUnique({
      where: {
        id: noteId,
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

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error('Error fetching note:', error)
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// UPDATE note
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; noteId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'Only teachers can update notes' }, { status: 403 })
    }

    const { classId, noteId } = await params
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

    // Check if note exists and belongs to the class
    const existingNote = await prisma.note.findUnique({
      where: {
        id: noteId,
        classId: classId
      }
    })

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    // Check if user is the creator of the note
    if (existingNote.whichTeacherCreated !== user.id) {
      return NextResponse.json({ error: 'You can only update your own notes' }, { status: 403 })
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        noteName,
        noteTopic,
        notesLinks,
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

    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string; noteId: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'Only teachers can delete notes' }, { status: 403 })
    }

    const { classId, noteId } = await params

    // Check if note exists and belongs to the class
    const existingNote = await prisma.note.findUnique({
      where: {
        id: noteId,
        classId: classId
      }
    })

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    // Check if user is the creator of the note
    if (existingNote.whichTeacherCreated !== user.id) {
      return NextResponse.json({ error: 'You can only delete your own notes' }, { status: 403 })
    }

    await prisma.note.delete({
      where: { id: noteId }
    })

    return NextResponse.json({ message: 'Note deleted successfully' })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}