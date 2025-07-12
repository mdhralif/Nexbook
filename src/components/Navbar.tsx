import Link from "next/link";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import MobileSearchBar from "./MobileSearchBar";
import Image from "next/image";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="h-24 flex items-center justify-between">
      {/* LEFT */}
      <div className="md:hidden lg:block w-[20%]">
        <Link href="/" className="font-bold text-xl text-blue-600">
          nexbook
        </Link>
      </div>
      {/* CENTER */}
      <div className="md:flex w-[50%] text-sm items-center justify-between">
        {/* LINKS */}
        <div className="hidden md:flex w-[50%]  gap-6 text-gray-600">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/home.png"
              alt="Homepage"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>Homepage</span>
          </Link>
          
          <Link href="https://nexchat-8ufl.onrender.com/" target="_blank" className="flex items-center gap-2">
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
        <SearchBar />
      </div>
      {/* RIGHT */}
      <div className="w-[30%] flex items-center gap-2 sm:gap-4 xl:gap-8 justify-end">
        <MobileSearchBar />
        <ClerkLoading>
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <div className="cursor-pointer hidden sm:block">
              <Image src="/people.png" alt="" width={24} height={24} />
            </div>
            <div className="cursor-pointer hidden md:block">
              <Image src="/messages.png" alt="" width={20} height={20} />
            </div>
            <div className="cursor-pointer hidden md:block">
              <Image src="/notifications.png" alt="" width={20} height={20} />
            </div>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-2 text-sm">
              <Image src="/login.png" alt="" width={20} height={20} className="hidden sm:block" />
              <Link href="/sign-in" className="text-xs sm:text-sm">Login/Register</Link>
            </div>
          </SignedOut>
        </ClerkLoaded>
        <MobileMenu />
      </div>
    </div>
  );
};

export default Navbar;
