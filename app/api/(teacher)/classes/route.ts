import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getCurrentUser } from '@/lib/auth'
import { z } from 'zod'

const prisma = new PrismaClient()


//for fetching all classes for teacher dashboard
export async function GET() {
    try {
        const user = await getCurrentUser()
        // console.log('Current user:', user)
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const classes = user.role === 'teacher'
            ? await prisma.class.findMany({
                where: { teachers: { some: { id: user.id } } },
                include: { enrolledStudents: true, _count: { select: { assignments: true, notes: true, notices: true } } }
            })
            : await prisma.class.findMany({
                where: { enrolledStudents: { some: { id: user.id } } },
                include: { teachers: true, _count: { select: { assignments: true, notes: true, notices: true } } }
            })

        return NextResponse.json(classes)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}

const createClassSchema = z.object({
  name: z.string()
    .min(1, 'Class name is required')
    .max(100, 'Class name must be less than 100 characters')
    .refine((name) => {
      const boards = ['ICSE', 'ISC', 'WBBSE', 'WBCHSE', 'CBSE']
      return boards.some(board => name.toUpperCase().includes(board))
    }, 'Board name is required in class name (ICSE/ISC/WBBSE/WBCHSE/CBSE)'),
  whichClass: z.string()
    .min(1, 'Grade/Level is required')
    .refine((grade) => {
      const num = parseInt(grade)
      return !isNaN(num) && num >= 1 && num <= 12
    }, 'Grade must be a valid number between 1-12')
})

export async function POST(request: NextRequest) {
  try {
    // Check user authentication and role
    const user = await getCurrentUser()
    if (!user || user.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Only teachers can create classes' }, 
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    
    // Validate using Zod schema
    const validationResult = createClassSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
      
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: errors,
          message: errors[0]?.message || 'Invalid input data'
        }, 
        { status: 400 }
      )
    }

    const { name, whichClass } = validationResult.data

    // Generate unique invite code
    const generateInviteCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase()
    }

    let inviteCode = generateInviteCode()
    
    // Ensure invite code is unique
    let existingClass = await prisma.class.findUnique({
      where: { inviteCode }
    })
    
    while (existingClass) {
      inviteCode = generateInviteCode()
      existingClass = await prisma.class.findUnique({
        where: { inviteCode }
      })
    }

    // Create the class
    const newClass = await prisma.class.create({
      data: {
        name: name.trim(),
        whichClass: whichClass.trim(),
        inviteCode,
        teachers: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        teachers: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            enrolledStudents: true
          }
        }
      }
    })

    return NextResponse.json({
      ...newClass,
      message: 'Class created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Failed to create class:', error)
    
    // Handle Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'A class with this name already exists' }, 
          { status: 409 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' }, 
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
