import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema for validating the request body
const sendOtpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneNo: z.string(),
  collegeName: z.string(),
  specialization: z.string(),
  dob: z.string(),
  clerkId: z.string(),
});

// Function to generate a 6-digit OTP
// This function generates a random 6-digit number as a string
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    // Clean up expired OTPs
    await prisma.oTP.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    const body = await req.json();
    const {
      name, email, phoneNo, collegeName, specialization, dob
    } = sendOtpSchema.parse(body);

    // Normalize email
    const normalizedEmail = email.trim();
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // 🔄 Upsert OTP
    await prisma.oTP.upsert({
      where: { email: normalizedEmail },
      update: { code: otp, expiresAt },
      create: { email: normalizedEmail, code: otp, expiresAt },
    });

    // ✉️ Send email to admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });

    const dobDate = new Date(dob);
    const age = new Date().getFullYear() - dobDate.getFullYear();

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: '🔐 Teacher Registration – OTP Verification',
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #2c3e50;">👨‍🏫 New Teacher Registration Request</h2>
      <p style="font-size: 16px;">A new teacher has requested registration. Here are the details:</p>
      <table style="width: 100%; font-size: 15px; margin-top: 10px;">
        <tr>
          <td><strong>Name:</strong></td>
          <td>${name}</td>
        </tr>
        <tr>
          <td><strong>Email:</strong></td>
          <td>${normalizedEmail}</td>
        </tr>
        <tr>
          <td><strong>Phone:</strong></td>
          <td>${phoneNo}</td>
        </tr>
        <tr>
          <td><strong>College:</strong></td>
          <td>${collegeName}</td>
        </tr>
        <tr>
          <td><strong>Specialization:</strong></td>
          <td>${specialization}</td>
        </tr>
        <tr>
          <td><strong>Age:</strong></td>
          <td>${age}</td>
        </tr>
      </table>
      
      <div style="margin-top: 30px; text-align: center;">
        <p style="font-size: 18px; margin-bottom: 5px;"><strong>Your OTP</strong></p>
        <p style="font-size: 28px; color: #e74c3c; letter-spacing: 2px;"><strong>${otp}</strong></p>
        <p style="font-size: 14px; color: #555;">This OTP will expire in <strong>10 minutes</strong>.</p>
      </div>

      <hr style="margin: 30px 0;">
      <p style="font-size: 13px; color: #888; text-align: center;">
        Please verify and approve the request if the information is correct.
      </p>
    </div>
  `
    });


    return NextResponse.json({ success: true, message: 'OTP sent to admin for verification' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
