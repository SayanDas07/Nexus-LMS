import { z } from "zod"
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

const userSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Name is required" })
        .trim()
        .regex(/^[A-Za-z\s]+$/, { message: "Name can only contain letters and spaces" }),

    email: z.string().email({ message: "Invalid email address" }),

    school: z.string().trim().optional(),

    phoneNo: z
        .string()
        .regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits" }),


    guardianName: z
        .string()
        .min(1, { message: "Guardian name is required" })
        .trim()
        .regex(/^[A-Za-z\s]+$/, { message: "Guardian name can only contain letters and spaces" }),

    guardianPhoneNo: z.string().regex(/^\d{10}$/, { message: "Guardian phone number must be exactly 10 digits" }),

    clerkId: z.string().min(1),
    dob: z.string(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()

        //console.log("Received body:", body)

        // ✅ Validate using Zod
        const parsed = userSchema.safeParse(body)

        console.log("Parsed data:", parsed)

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid input", issues: parsed.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        const {
            name,
            email,
            school,
            phoneNo,
            guardianName,
            guardianPhoneNo,
            clerkId,
            dob
        } = parsed.data

        const existingUser = await prisma.user.findUnique({
            where: { clerkId },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            )
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                clerkId,
                school,
                phoneNo,
                guardianName,
                guardianPhoneNo,
                role: "student", // default
                DOB: dob ? new Date(`${dob}T00:00:00.000Z`) : undefined, // Ensure dob is stored as a Date object
            },
        })

        return NextResponse.json(newUser, { status: 201 })
    } catch (error) {
        console.error("User creation failed:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
