import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { getCurrentUser } from '@/lib/auth'

export async function PUT(
    request: NextRequest, 
    { params }: { params: Promise<{ assignmentId: string; classId: string }> }
) {
    try {
        const user = await getCurrentUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        
        // Await params before using its properties
        const { assignmentId } = await params
        
        const body = await request.json();
        const { studentId, marksObtained, grade } = body;

        const submission = await prisma.assignmentSubmitted.update({
            where: {
                assignmentId_studentId: {
                    assignmentId, // Now using the awaited value
                    studentId
                }
            },
            data: {
                marksObtained: parseInt(marksObtained),
                grade
            }
        });

        return NextResponse.json(submission);
    } catch (error) {
        console.error('Failed to grade submission:', error);
        return NextResponse.json({ error: 'Failed to grade submission' }, { status: 500 });
    } finally
    {
        await prisma.$disconnect();
    }
}