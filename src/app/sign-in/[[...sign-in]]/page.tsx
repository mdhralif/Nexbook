import { SignIn } from "@clerk/nextjs";

export default function Page() {
  // Enhanced debugging
  console.log("=== CLERK DEBUG INFO ===");
  console.log("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:", process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  console.log("NEXT_PUBLIC_CLERK_SIGN_IN_URL:", process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("Current URL:", typeof window !== "undefined" ? window.location.href : "SSR");
  console.log("========================");
  
  return (
    <div className="h-[calc(100vh-96px)] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Debug info visible on page */}
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <h3 className="font-bold mb-2">🔍 Debug Info:</h3>
          <p><strong>Publishable Key:</strong> {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 
            `${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(0, 25)}...` : 
            "❌ MISSING"}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          <p><strong>Expected:</strong> Clerk sign-in form should appear below</p>
        </div>
        
        {/* Wrapper to make the component more visible */}
        <div className="min-h-[400px] border-2 border-dashed border-blue-300 bg-blue-50 p-4 rounded">
          <p className="text-center text-blue-700 mb-4 font-medium">
            📝 Clerk SignIn Component Area:
          </p>
          <SignIn />
          <p className="text-center text-blue-600 text-xs mt-4">
            If nothing appears above, Clerk is blocking the form
          </p>
        </div>
      </div>
    </div>
  );
}
