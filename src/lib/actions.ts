"use server";

import { auth } from "@clerk/nextjs/server"
import prisma from "./client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Utility function to ensure user exists in database
export const ensureUserExists = async (userId: string, userData?: any) => {
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (existingUser) {
            return existingUser;
        }

        // Create user if doesn't exist
        const newUser = await prisma.user.create({
            data: {
                id: userId,
                username: userData?.username || userData?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || `user_${userId.slice(-8)}`,
                avatar: userData?.imageUrl || "/noAvatar.png",
                cover: "/noCover.png"
            }
        });

        return newUser;
    } catch (error) {
        console.error('Error ensuring user exists:', error);
        throw error;
    }
};

export const switchFollow = async (userId: string) => {
    const { userId: currentUserId } = auth();

    if (!currentUserId) {
        throw new Error("User is not authenticated!");
    }

    try {
        const existingFollow = await prisma.follower.findFirst({
            where: {
                followerId: currentUserId,
                followingId: userId,
            },
        });

        if (existingFollow) {
            await prisma.follower.delete({
                where: {
                    id: existingFollow.id,
                },
            });
        } else {
            const existingFollowRequest = await prisma.followRequest.findFirst({
                where: {
                    senderId: currentUserId,
                    receiverId: userId,
                },
            });

            if (existingFollowRequest) {
                await prisma.followRequest.delete({
                    where: {
                        id: existingFollowRequest.id,
                    },
                });
            } else {
                await prisma.followRequest.create({
                    data: {
                        senderId: currentUserId,
                        receiverId: userId,
                    },
                });
            }
        }
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};

export const switchBlock = async (userId: string) => {
    const { userId: currentUserId } = auth();
  
    if (!currentUserId) {
      throw new Error("User is not Authenticated !");
    }
  
    try {
      const existingBlock = await prisma.block.findFirst({
        where: {
          blockerId: currentUserId,
          blockedId: userId,
        },
      });
  
      if (existingBlock) {
        await prisma.block.delete({
          where: {
            id: existingBlock.id,
          },
        });
      } else {
        await prisma.block.create({
          data: {
            blockerId: currentUserId,
            blockedId: userId,
          },
        });
      }
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong!");
    }
  };


  export const acceptFollowRequest = async (userId: string) => {
    const { userId: currentUserId } = auth();
  
    if (!currentUserId) {
      throw new Error("User is not Authenticated!!");
    }
  
    try {
      const existingFollowRequest = await prisma.followRequest.findFirst({
        where: {
          senderId: userId,
          receiverId: currentUserId,
        },
      });
  
      if (existingFollowRequest) {
        await prisma.followRequest.delete({
          where: {
            id: existingFollowRequest.id,
          },
        });
  
        await prisma.follower.create({
          data: {
            followerId: userId,
            followingId: currentUserId,
          },
        });
      }
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong!");
    }
  };
  
  export const declineFollowRequest = async (userId: string) => {
    const { userId: currentUserId } = auth();
  
    if (!currentUserId) {
      throw new Error("User is not Authenticated!!");
    }
  
    try {
      const existingFollowRequest = await prisma.followRequest.findFirst({
        where: {
          senderId: userId,
          receiverId: currentUserId,
        },
      });
  
      if (existingFollowRequest) {
        await prisma.followRequest.delete({
          where: {
            id: existingFollowRequest.id,
          },
        });
      }
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong!");
    }
  };

  export const updateProfile = async (
    prevState: { success: boolean; error: boolean },
    payload: { formData: FormData; cover: string }
  ) => {
    const { formData, cover } = payload;
    const fields = Object.fromEntries(formData);
  
    const filteredFields = Object.fromEntries(
      Object.entries(fields).filter(([_, value]) => value !== "")
    );
  
    const Profile = z.object({
      cover: z.string().optional(),
      name: z.string().max(60).optional(),
      surname: z.string().max(60).optional(),
      description: z.string().max(255).optional(),
      city: z.string().max(60).optional(),
      school: z.string().max(60).optional(),
      work: z.string().max(60).optional(),
      website: z.string().max(60).optional(),
    });
  
    const validatedFields = Profile.safeParse({ cover, ...filteredFields });
  
    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors);
      return { success: false, error: true };
    }
  
    const { userId } = auth();
  
    if (!userId) {
      return { success: false, error: true };
    }
  
    try {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: validatedFields.data,
      });
      return { success: true, error: false };
    } catch (err) {
      console.log(err);
      return { success: false, error: true };
    }
  };

  export const switchLike = async (postId: number) => {
    const { userId } = auth();
  
    if (!userId) throw new Error("User is not authenticated!");
  
    try {
      const existingLike = await prisma.like.findFirst({
        where: {
          postId,
          userId,
        },
      });
  
      if (existingLike) {
        await prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });
      } else {
        await prisma.like.create({
          data: {
            postId,
            userId,
          },
        });
      }
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong");
    }
  };

  export const addComment = async (postId: number, desc: string) => {
    const { userId } = auth();
  
    if (!userId) throw new Error("User is not authenticated!");
  
    try {
      const createdComment = await prisma.comment.create({
        data: {
          desc,
          userId,
          postId,
        },
        include: {
          user: true,
        },
      });
  
      return createdComment;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong!");
    }
  };

  export const addPost = async (formData: FormData, img: string) => {
    const desc = formData.get("desc") as string;
  
    // Allow empty description but enforce max length if provided
    const Desc = z.string().max(255).optional();
  
    const validatedDesc = Desc.safeParse(desc || "");
  
    if (!validatedDesc.success) {
      console.log("description is not valid");
      return;
    }

    // Ensure user has either text or image
    const hasContent = (desc && desc.trim().length > 0) || img;
    
    if (!hasContent) {
      console.log("Post must have either text or image");
      return;
    }

    const { userId } = auth();
  
    if (!userId) throw new Error("User is not authenticated!");
  
    try {
      await prisma.post.create({
        data: {
          desc: validatedDesc.data || "",
          userId,
          img,
        },
      });
  
      revalidatePath("/");
    } catch (err) {
      console.log(err);
    }
  };

  export const addStory = async (img: string) => {
    const { userId } = auth();
  
    if (!userId) throw new Error("User is not authenticated!");
  
    try {
      // Delete any existing story for this user (keep it simple - one story per user)
      const existingStory = await prisma.story.findFirst({
        where: {
          userId,
        },
      });
  
      if (existingStory) {
        await prisma.story.delete({
          where: {
            id: existingStory.id,
          },
        });
      }

      // Create new story
      const createdStory = await prisma.story.create({
        data: {
          userId,
          img,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        include: {
          user: true,
        },
      });
  
      revalidatePath("/");
      return createdStory;
    } catch (err) {
      console.log(err);
    }
  };
  
  export const deletePost = async (postId: number) => {
    const { userId } = auth();
  
    if (!userId) throw new Error("User is not authenticated!");
  
    try {
      await prisma.post.delete({
        where: {
          id: postId,
          userId,
        },
      });
      revalidatePath("/")
    } catch (err) {
      console.log(err);
    }
  };

