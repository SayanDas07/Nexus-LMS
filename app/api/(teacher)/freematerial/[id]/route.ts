import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

// ✅ GET - Fetch a specific free material
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await context.params;

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true, role: true }
        });

        if (!user || user.role !== 'teacher') {
            return NextResponse.json({ error: 'Access denied. Teacher role required.' }, { status: 403 });
        }

        const freeMaterial = await prisma.freeMaterial.findFirst({
            where: { id, createdBy: user.id },
            include: {
                creator: {
                    select: { name: true, email: true }
                }
            }
        });

        if (!freeMaterial) {
            return NextResponse.json({ error: 'Free material not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: freeMaterial });

    } catch (error) {
        console.error('Error fetching free material:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// ✅ PUT - Update a free material
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await context.params;

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true, role: true }
        });

        if (!user || user.role !== 'teacher') {
            return NextResponse.json({ error: 'Access denied. Teacher role required.' }, { status: 403 });
        }

        const existingFreeMaterial = await prisma.freeMaterial.findFirst({
            where: { id, createdBy: user.id }
        });

        if (!existingFreeMaterial) {
            return NextResponse.json({ error: 'Free material not found' }, { status: 404 });
        }

        const body = await request.json();
        const {
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAns,
            notesLink,
            topic,
            explanation
        } = body;

        if (correctAns && !['A', 'B', 'C', 'D'].includes(correctAns)) {
            return NextResponse.json({ error: 'correctAns must be A, B, C, or D' }, { status: 400 });
        }

        const updatedFreeMaterial = await prisma.freeMaterial.update({
            where: { id },
            data: {
                ...(notesLink !== undefined && { notesLink }),
                ...(topic !== undefined && { topic }),
                ...(question !== undefined && { question }),
                ...(optionA !== undefined && { optionA }),
                ...(optionB !== undefined && { optionB }),
                ...(optionC !== undefined && { optionC }),
                ...(optionD !== undefined && { optionD }),
                ...(correctAns !== undefined && { correctAns }),
                ...(explanation !== undefined && { explanation })
            },
            include: {
                creator: {
                    select: { name: true, email: true }
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Free material updated successfully',
            data: updatedFreeMaterial
        });

    } catch (error) {
        console.error('Error updating free material:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// ✅ DELETE - Delete a free material
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await context.params;

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true, role: true }
        });

        if (!user || user.role !== 'teacher') {
            return NextResponse.json({ error: 'Access denied. Teacher role required.' }, { status: 403 });
        }

        const existingFreeMaterial = await prisma.freeMaterial.findFirst({
            where: { id, createdBy: user.id }
        });

        if (!existingFreeMaterial) {
            return NextResponse.json({ error: 'Free material not found' }, { status: 404 });
        }

        await prisma.freeMaterial.delete({ where: { id } });

        return NextResponse.json({
            success: true,
            message: 'Free material deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting free material:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
