/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // Or your auth solution
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



// GET - fetch profile + student counts
export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        College: true,
        Specialization: true,
        phoneNo: true,
        DOB: true,
        teacherCode: true,
        clerkId: true,
        createdClasses: {
          select: {
            id: true,
            name: true,
            whichClass: true,
            enrolledStudents: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
    }

    const classes = user.createdClasses.map((cls) => ({
      id: cls.id,
      name: cls.name,
      whichClass: cls.whichClass,
      studentCount: cls.enrolledStudents.length,
      students: cls.enrolledStudents,
    }));

    const totalStudents = classes.reduce((sum, cls) => sum + cls.studentCount, 0);

    const response = {
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        College: user.College,
        Specialization: user.Specialization,
        phoneNo: user.phoneNo,
        DOB: user.DOB,
        teacherCode: user.teacherCode,
        clerkId: user.clerkId,

      },
      totalStudents,
      classes,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error("GET teacher profile error:", err);
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
      College,
      Specialization,
      DOB
    } = data;

    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: {
        name,
        phoneNo,

        College,
        Specialization,
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
