import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(
   _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  
    //console.log('Fetching notices for class:', id, 'for user:', userId);
  
    const notices = await prisma.notice.findMany({
      where: { classId: id },
      orderBy: { createdAt: "desc" },
    });
  
    return NextResponse.json(notices);
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
}
