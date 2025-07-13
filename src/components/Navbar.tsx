import Link from "next/link";
import MobileMenuWrapper from "./MobileMenuWrapper";
import SearchBar from "./SearchBar";
import MobileSearchBar from "./MobileSearchBar";
import Image from "next/image";
import NavLinks from "./NavLinks";
import FriendsLink from "./FriendsLink";
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
        <NavLinks />
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
            <FriendsLink />
            <div className="cursor-pointer hidden md:block">
            </div>
            {/* <div className="cursor-pointer hidden md:block">
              <Image src="/messages.png" alt="" width={20} height={20} />
            </div> */}
            <div className="cursor-pointer hidden md:block">
              <Image src="/notifications.png" alt="" width={20} height={20} />
            </div>
            <div className="hidden md:block">
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-2 text-sm">
              <Image src="/login.png" alt="" width={20} height={20} className="hidden sm:block" />
              <Link href="/sign-in" className="text-xs sm:text-sm hidden md:block">Login/Register</Link>
            </div>
          </SignedOut>
        </ClerkLoaded>
        <MobileMenuWrapper />
      </div>
    </div>
  );
};

export default Navbar;
