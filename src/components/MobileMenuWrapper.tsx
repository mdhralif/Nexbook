import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import MobileMenu from "./MobileMenu";

const MobileMenuWrapper = async () => {
  const { userId } = auth();
  
  let friendRequestCount = 0;
  
  if (userId) {
    try {
      friendRequestCount = await prisma.followRequest.count({
        where: {
          receiverId: userId,
        },
      });
    } catch (error) {
      console.error("Error fetching friend request count:", error);
    }
  }

  return <MobileMenu friendRequestCount={friendRequestCount} />;
};

export default MobileMenuWrapper;
