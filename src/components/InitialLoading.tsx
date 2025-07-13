"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface InitialLoadingProps {
  children: React.ReactNode;
}

const InitialLoading = ({ children }: InitialLoadingProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loading for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center z-50">
        <div className="text-center">
          {/* Logo */}
          {/* <div className="relative w-32 h-32 mx-auto mb-6">
            <Image
              src="/login.png"
              alt="Nexbook"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div> */}
          {/* Website Name */}
          <h1 className="text-6xl font-bold text-blue-600 tracking-tight">nexbook</h1>
          <p className="text-gray-600 text-xl mt-4">Connect with friends around you</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default InitialLoading;
