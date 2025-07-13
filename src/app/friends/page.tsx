import FriendRequestWrapper from "@/components/FriendRequestWrapper";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FollowButton from "@/components/FollowButton";
import FollowButtonWrapper from "@/components/FollowButtonWrapper";

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

  // Get users that current user is following
  const followingRelations = await prisma.follower.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: true,
    },
  });
  const following = followingRelations.map(relation => relation.following);

  // Also get users with pending requests to exclude them from suggestions
  const pendingRequestUsers = await prisma.followRequest.findMany({
    where: {
      senderId: userId,
    },
    select: {
      receiverId: true,
    },
  });
  const pendingRequestIds = pendingRequestUsers.map(req => req.receiverId);
  
  // Get following user IDs to exclude from suggestions
  const followingIds = following.map(user => user.id);
  
  const suggestions = await prisma.user.findMany({
    where: {
      id: {
        not: userId,
        notIn: [...pendingRequestIds, ...followingIds],
      },
    },
    include: {
      followers: {
        where: {
          followerId: userId,
        },
      },
      followRequestsReceived: {
        where: {
          senderId: userId,
        },
      },
    },
    orderBy: {
      createdAt: 'desc', // Show newest users first
    },
    take: 20, // Show more users for now
  });

  return (
    <div className="min-h-screen bg-slate-100">
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
                  <FriendRequestWrapper requests={requests} />
                </Suspense>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-gray-400 text-lg mb-2">No friend requests</div>
                <p className="text-gray-500 text-sm">When someone sends you a friend request, it will appear here.</p>
              </div>
            )}
          </div>

          {/* Following */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Following ({following.length})
              </h2>
              {following.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {following.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Link
                        href={`/profile/${user.username}`}
                        className="flex items-center flex-1 min-w-0"
                      >
                        <Image
                          src={user.avatar || "/noAvatar.png"}
                          alt={user.name || user.username}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name && user.surname
                              ? `${user.name} ${user.surname}`
                              : user.username}
                          </p>
                          <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                          {user.city && (
                            <p className="text-xs text-gray-400 truncate">{user.city}</p>
                          )}
                        </div>
                      </Link>
                      <div className="ml-2 flex-shrink-0">
                        <FollowButtonWrapper
                          userId={user.id}
                          isFollowing={true}
                          hasPendingRequest={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-lg mb-2">Not following anyone yet</div>
                  <p className="text-gray-500 text-sm">
                    When you follow someone, they&apos;ll appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                People You May Know
              </h2>
              {suggestions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.map((user) => {
                    const isFollowing = user.followers.length > 0;
                    const hasPendingRequest = user.followRequestsReceived.length > 0;
                    
                    return (
                      <div
                        key={user.id}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Link
                          href={`/profile/${user.username}`}
                          className="flex items-center flex-1 min-w-0"
                        >
                          <Image
                            src={user.avatar || "/noAvatar.png"}
                            alt={user.name || user.username}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.name && user.surname
                                ? `${user.name} ${user.surname}`
                                : user.username}
                            </p>
                            <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                            {user.city && (
                              <p className="text-xs text-gray-400 truncate">{user.city}</p>
                            )}
                          </div>
                        </Link>
                        <div className="ml-2 flex-shrink-0">
                          <FollowButtonWrapper
                            userId={user.id}
                            isFollowing={isFollowing}
                            hasPendingRequest={hasPendingRequest}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-lg mb-2">No suggestions available</div>
                  <p className="text-gray-500 text-sm">
                    We&apos;ll show people you might know here when they join.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FriendsPage;
