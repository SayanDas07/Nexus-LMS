import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const classes = await prisma.class.findMany({
      where: { enrolledStudents: { some: { clerkId: userId } } },
      select: {
        id: true,
        name: true,
        whichClass: true,
        inviteCode: true,
        teachers: { select: { id: true, name: true, email: true } },
        _count: { select: { enrolledStudents: true } },
        notices: { take: 1, orderBy: { createdAt: 'desc' } },
        // assignments: { 
        //   take: 1, 
        //   where: { deadline: { gt: new Date() } },
        //   orderBy: { deadline: 'asc' } 
        // }
      }
    })

    const formattedClasses = classes.map(cls => ({
      ...cls,
      studentCount: cls._count.enrolledStudents,
      // upcomingAssignments: cls.assignments.length,
      recentNotices: cls.notices.length,
      _count: undefined,
      notices: undefined,
      assignments: undefined
    }))

    return NextResponse.json(formattedClasses)
  } catch (error) {
    console.error('[GET_CLASSES_ERROR]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}