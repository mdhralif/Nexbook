"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  friendRequestCount?: number;
}

const MobileMenu = ({ friendRequestCount = 0 }: MobileMenuProps) => {
  const pathname = usePathname();
  return (
    <>
      {/* Fixed bottom navigation for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          <Link href="/" className={`flex flex-col items-center p-2 ${pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
            <Image 
              src="/home.png" 
              alt="Home" 
              width={24} 
              height={24}
              className={`${pathname === '/' ? 'brightness-0 saturate-100 hue-rotate-210' : ''}`}
            />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/clips/autoplay" className={`flex flex-col items-center p-2 ${pathname === '/clips' || pathname === '/clips/autoplay' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
            <Image 
              src="/clips.png" 
              alt="Clips" 
              width={24} 
              height={24}
              className={`${pathname === '/clips' || pathname === '/clips/autoplay' ? 'brightness-0 saturate-100 hue-rotate-210' : ''}`}
            />
            <span className="text-xs mt-1">Clips</span>
          </Link>
          <Link href="/friends" className={`flex flex-col items-center p-2 relative ${pathname === '/friends' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
            <div className="relative">
              <Image 
                src="/people.png" 
                alt="Friends" 
                width={24} 
                height={24}
                className={`${pathname === '/friends' ? 'brightness-0 saturate-100 hue-rotate-210' : ''}`}
              />
              {friendRequestCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {friendRequestCount > 9 ? '9+' : friendRequestCount}
                </div>
              )}
            </div>
            <span className="text-xs mt-1">Friends</span>
          </Link>
          <Link href="https://nexchat-8ufl.onrender.com/" target="_blank" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
            <Image src="/messages.png" alt="Messages" width={24} height={24} />
            <span className="text-xs mt-1">Chat</span>
          </Link>
          
          {/* <Link href="/" className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600">
            <Image src="/notifications.png" alt="Notifications" width={24} height={24} />
            <span className="text-xs mt-1">Alerts</span>
          </Link> */}
          <div className="flex flex-col items-center p-2 text-gray-600">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in" className="flex flex-col items-center">
                <Image src="/login.png" alt="Login" width={24} height={24} />
                <span className="text-xs mt-1">Login</span>
              </Link>
            </SignedOut>
            <span className="text-xs mt-1">Profile</span>
          </div>
        </div>
      </div>
      
      {/* Add bottom padding to body content on mobile to prevent overlap */}
      <style jsx global>{`
        @media (max-width: 768px) {
          body {
            padding-bottom: 70px;
          }
        }
      `}</style>
    </>
  );
};

export default MobileMenu;
