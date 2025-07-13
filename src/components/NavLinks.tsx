"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NavLinks = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex w-[50%]  gap-6 text-gray-600">
      <Link href="/" className={`flex items-center gap-2 ${pathname === '/' ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}>
        <Image
          src="/home.png"
          alt="Homepage"
          width={16}
          height={16}
          className={`w-4 h-4 ${pathname === '/' ? 'brightness-0 saturate-100 hue-rotate-210' : ''}`}
        />
        <span>Homepage</span>
      </Link>
      
      <Link href="https://nexchat-8ufl.onrender.com/" target="_blank" className="flex items-center gap-2 hover:text-blue-600">
        <Image
          src="/messages.png"
          alt="Stories"
          width={16}
          height={16}
          className="w-4 h-4"
        />
        <span>Chat</span>
      </Link>
    </div>
  );
};

export default NavLinks;
