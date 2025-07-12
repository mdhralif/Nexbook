import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-[calc(100vh-96px)] flex items-center justify-center">
      <SignUp path={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}/>
    </div>
  );
}
