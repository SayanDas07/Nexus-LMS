/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { auth } from '@clerk/nextjs/server';


export async function GET(request: NextRequest) {
    try {
        const freeMaterials = await prisma.freeMaterial.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                creator: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        console.log('Fetched free materials:', freeMaterials.length);

        return NextResponse.json({
            success: true,
            data: freeMaterials,
            count: freeMaterials.length
        });

    } catch (error) {
        console.error('Error fetching free materials:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

// POST - Create a new free material
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Verify user is a teacher
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true, role: true }
        });

        if (!user || user.role !== 'teacher') {
            return NextResponse.json(
                { error: 'Access denied. Teacher role required.' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { question, optionA, optionB, optionC, optionD, correctAns, notesLink, topic, explanation } = body;
        const newFreeMaterial = await prisma.freeMaterial.create({
            data: {
                question,
                optionA,
                optionB,
                optionC,
                optionD,
                correctAns,
                explanation: explanation,
                topic: topic,
                notesLink: notesLink || null,
                createdBy: user.id
            },
            include: {
                creator: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Free material created successfully',
            data: newFreeMaterial
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating free material:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}