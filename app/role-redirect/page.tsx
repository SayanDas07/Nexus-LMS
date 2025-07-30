// app/role-redirect/page.tsx

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function RoleRedirectPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  // If user is NOT found in DB, show message
  if (!dbUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">
          Your account has been deleted from the Database.
        </h1>
        <p className="text-lg mb-6 max-w-md text-gray-700">
          Please go to sign-up page to create a new account.
        </p>
        <Link
          href="/sign-up"
          className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          Go to Sign Up
        </Link>
      </div>
    );
  }

  

  if (dbUser.role === "teacher") {
    redirect("/teacher/dashboard");
  }
  if (dbUser.role === "student") {
    redirect("/student/dashboard");
  }


  
}
