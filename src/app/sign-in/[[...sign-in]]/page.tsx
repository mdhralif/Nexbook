import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-[calc(100vh-96px)] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-2 text-center">Sign in to Nexbook</h1>
        <p className="mb-6 text-center text-gray-600">Welcome back! Please sign in to continue</p>
        <SignIn />
        <p className="mt-4 text-center text-xs text-gray-400">Secured by Clerk</p>
      </div>
    </div>
  );
}
