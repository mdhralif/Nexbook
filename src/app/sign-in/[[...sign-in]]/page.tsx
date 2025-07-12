'use client';

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  // Debug log to check environment variables
  console.log("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:", process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  console.log("NEXT_PUBLIC_CLERK_SIGN_IN_URL:", process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL);

  return (
    <div className="h-[calc(100vh-96px)] flex items-center justify-center">
      <SignIn />
    </div>
  );
}
