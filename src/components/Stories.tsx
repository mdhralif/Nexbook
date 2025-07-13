//import prisma from "@/lib/client";
import prisma from "@/lib/client";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import StoryList from "./StoryList";
//import StoryList from "./StoryList";

const Stories = async () => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) return null;

  // Get people the current user follows (to see their stories)
  const userFollowings = await prisma.follower.findMany({
    where: {
      followerId: currentUserId,
    },
    include: {
      following: true,
    },
  });

  console.log(`User ${currentUserId} is following:`, userFollowings.map(f => f.following.username));

  // Get stories from people the current user follows + their own stories
  const stories = await prisma.story.findMany({
    where: {
      expiresAt: {
        gt: new Date(),
      },
      OR: [
        {
          // Stories from users that the current user follows
          userId: {
            in: userFollowings.map(f => f.followingId),
          },
        },
        {
          // Current user's own stories
          userId: currentUserId,
        },
      ],
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  console.log(`Found ${stories.length} stories for user ${currentUserId}:`, stories.map(s => s.user.username));

  return (
    <div className="p-4 bg-white rounded-lg shadow-md overflow-scroll text-xs scrollbar-hide">
      <div className="flex gap-8 w-max">
        <StoryList stories={stories} userId={currentUserId}/>
      </div>
    </div>
  );
};

export default Stories;
