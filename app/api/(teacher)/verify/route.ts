import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  name: z.string(),
  phoneNo: z.string(),
  College: z.string(),
  Specialization: z.string(),
  DOB: z.string(),
  clerkId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    //  Clean up expired OTPs
    await prisma.oTP.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    const body = await req.json();
    const {
      email, otp, name, phoneNo, College, Specialization, DOB, clerkId
    } = verifyOtpSchema.parse(body);

    const normalizedEmail = email.trim();

    const record = await prisma.oTP.findUnique({
      where: { email: normalizedEmail },
    });

    if (!record) {
      return NextResponse.json({ error: 'No OTP found. Please resend.' }, { status: 400 });
    }

    if (record.code !== otp) {
      return NextResponse.json({ error: 'Invalid OTP.' }, { status: 400 });
    }

    if (new Date() > record.expiresAt) {
      await prisma.oTP.delete({ where: { email: normalizedEmail } });
      return NextResponse.json({ error: 'OTP expired.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { clerkId }],
      },
    });

    if (existingUser) {
      await prisma.oTP.delete({ where: { email: normalizedEmail } });
      return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
    }

    const teacherCode = `TCH${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;

    const teacher = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        phoneNo,
        College,
        Specialization,
        DOB: new Date(DOB),
        clerkId,
        role: 'teacher',
        teacherCode,
      },
    });

    await prisma.oTP.delete({ where: { email: normalizedEmail } });

    return NextResponse.json({
      success: true,
      message: 'Registration completed!',
      teacher: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        college: teacher.College,
        specialization: teacher.Specialization,
        teacherCode: teacher.teacherCode,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'OTP verification failed.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
