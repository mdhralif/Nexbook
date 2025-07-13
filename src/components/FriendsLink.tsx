"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const FriendsLink = () => {
  const pathname = usePathname();

  return (
    <div className="cursor-pointer hidden md:block">
      <Link href="/friends" className={`flex items-center gap-2 ${pathname === '/friends' ? 'text-blue-600' : 'hover:text-blue-600'}`}>
        <Image 
          src="/people.png" 
          alt="Friends" 
          width={24} 
          height={24}
          className={`${pathname === '/friends' ? 'brightness-0 saturate-100 hue-rotate-210' : ''}`}
        />
      </Link>
    </div>
  );
};

export default FriendsLink;
