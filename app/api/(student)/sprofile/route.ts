/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET - fetch student profile
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const existing = await prisma.user.findUnique({ where: { clerkId } });
    if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        name: true,
        email: true,
        school: true,
        phoneNo: true,
        guardianName: true,
        DOB: true,
        guardianPhoneNo: true,
        clerkId: true,
        role: true,
      },
    });

    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const response = {
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        school: user.school,
        phoneNo: user.phoneNo,
        DOB: user.DOB,
        guardianName: user.guardianName,
        guardianPhoneNo: user.guardianPhoneNo,
        clerkId: user.clerkId,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("GET student profile error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - delete the current user
export async function DELETE(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.user.findUnique({ where: { clerkId } });
    if (!existing) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.user.delete({ where: { clerkId } });

    return NextResponse.json({ message: "User deleted successfully." }, { status: 200 });
  } catch (err) {
    console.error("DELETE user error:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const {
      name,
      phoneNo,
      school,
      guardianName,
      guardianPhoneNo,
      DOB,
    } = data;
    console.log("Incoming PUT request data:", data);
console.log("Parsed DOB:", DOB ? new Date(`${DOB}T00:00:00.000Z`) : undefined);

    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: {
        name,
        phoneNo,
        school,
        guardianName,
        guardianPhoneNo,
        DOB: DOB ? new Date(`${DOB}T00:00:00.000Z`) : undefined,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err) {
    console.error("PUT user profile update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}