// app/chooserole/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChooseRole from "./ChooseRole";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function ChooseRolePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });

  // If user already has a role, redirect to dashboard
  if (user?.role === "student") {
    redirect("/student/dashboard");
  } else if (user?.role === "teacher") {
    redirect("/teacher/dashboard");
  }

  return <ChooseRole />;
}
