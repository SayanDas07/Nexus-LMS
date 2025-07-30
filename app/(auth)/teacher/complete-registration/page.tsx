import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import TeacherRegistration from "./TeacherRegistrationClient";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Page() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });

  if (user?.role === "teacher") {
    redirect("/teacher/dashboard");
  }

  return <TeacherRegistration />;
}
