import FriendRequestList from "@/components/rightMenu/FriendRequestList";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import { redirect } from "next/navigation";

const FriendsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const requests = await prisma.followRequest.findMany({
    where: {
      receiverId: userId,
    },
    include: {
      sender: true,
    },
  });

  return (
    <div className="flex justify-center pt-6">
      <div className="w-full max-w-4xl px-4">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Friends</h1>
            <p className="text-gray-600">Manage your friend requests and connections</p>
          </div>

          {/* Friend Requests */}
          <div className="bg-white rounded-lg shadow-md">
            {requests.length > 0 ? (
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Friend Requests ({requests.length})
                </h2>
                <Suspense fallback={
                  <div className="animate-pulse">
                    <div className="space-y-3">
                      <div className="h-12 bg-gray-200 rounded"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                }>
                  <FriendRequestList requests={requests} />
                </Suspense>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-lg mb-2">No friend requests</div>
                <p className="text-gray-500 text-sm">When someone sends you a friend request, it will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
