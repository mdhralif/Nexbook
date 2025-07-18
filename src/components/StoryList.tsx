"use client";

import { addStory } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { Story, User } from "@prisma/client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";
import { useOptimistic } from "@/lib/hooks";
import StoryViewer from "./StoryViewer";

type StoryWithUser = Story & {
  user: User;
};

const StoryList = ({
  stories,
  userId,
}: {
  stories: StoryWithUser[];
  userId: string;
}) => {
  const [storyList, setStoryList] = useState(stories);
  const [img, setImg] = useState<any>();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const { user, isLoaded } = useUser();

  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => new Set([...prev, imageUrl]));
  };

  const getImageSrc = (imageUrl: string | null | undefined, fallback: string = "/noAvatar.png") => {
    if (!imageUrl || imageErrors.has(imageUrl)) {
      return fallback;
    }
    return imageUrl;
  };

  const add = async () => {
    if (!img?.secure_url) return;

    addOptimisticStory({
      id: Math.random(),
      img: img.secure_url,
      createdAt: new Date(Date.now()),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: userId,
      user: {
        id: userId,
        username: "Sending...",
        avatar: user?.imageUrl || "/noAvatar.png",
        cover: "",
        description: "",
        name: "",
        surname: "",
        city: "",
        work: "",
        school: "",
        website: "",
        createdAt: new Date(Date.now()),
      },
    });

    try {
      const createdStory = await addStory(img.secure_url);
      setStoryList((prev) => [createdStory!, ...prev]);
      setImg(null)
    } catch (err) {}
  };

  const [optimisticStories, addOptimisticStory] = useOptimistic(
    storyList,
    (state, value: StoryWithUser) => [value, ...state]
  );

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setSelectedStoryIndex(null);
  };

  return (
    <>
      <CldUploadWidget
        uploadPreset="social"
        onSuccess={(result, { widget }) => {
          console.log("Upload successful:", result.info);
          setImg(result.info);
          widget.close();
        }}
        onError={(error) => {
          console.error("Upload error:", error);
        }}
      >
        {({ open }) => {
          return (
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer relative"
              onClick={() => open()}
            >
              <Image
                src={getImageSrc(img?.secure_url || user?.imageUrl, "/noAvatar.png")}
                alt=""
                width={80}
                height={80}
                className="w-20 h-20 rounded-full ring-2 object-cover pointer-events-none"
                onError={() => handleImageError(img?.secure_url || user?.imageUrl || "")}
                priority
              />
              {img ? (
                <form action={add} onClick={(e) => e.stopPropagation()}>
                  <button className="text-xs bg-blue-500 p-1 rounded-md text-white">
                    Send
                  </button>
                </form>
              ) : (
                <span className="font-medium pointer-events-none">Add a Story</span>
              )}
              <div className="absolute text-6xl text-gray-200 top-1 pointer-events-none">+</div>
            </div>
          );
        }}
      </CldUploadWidget>
      
      {/* STORIES */}
      {optimisticStories.map((story, index) => (
        <div
          className="flex flex-col items-center gap-2 cursor-pointer hover:transform hover:scale-105 transition-transform"
          key={story.id}
          onClick={() => handleStoryClick(index)}
        >
          <div className="relative">
            <Image
              src={getImageSrc(story.user.avatar, "/noAvatar.png")}
              alt=""
              width={80}
              height={80}
              className="w-20 h-20 rounded-full ring-2 ring-blue-500 object-cover"
              onError={() => handleImageError(story.user.avatar || "")}
              priority
            />
            {/* Story ring indicator */}
            <div className="absolute inset-0 rounded-full ring-2 ring-blue-500 ring-offset-2"></div>
          </div>
          <span className="font-medium text-center max-w-[80px] truncate">
            {story.user.name || story.user.username}
          </span>
        </div>
      ))}

      {/* Story Viewer Modal */}
      {isViewerOpen && selectedStoryIndex !== null && (
        <StoryViewer
          stories={optimisticStories}
          initialStoryIndex={selectedStoryIndex}
          isOpen={isViewerOpen}
          onClose={closeViewer}
        />
      )}
    </>
  );
};

export default StoryList;
