"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Story, User } from "@prisma/client";

type StoryWithUser = Story & {
  user: User;
};

interface StoryViewerProps {
  stories: StoryWithUser[];
  initialStoryIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const StoryViewer = ({ stories, initialStoryIndex, isOpen, onClose }: StoryViewerProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const STORY_DURATION = 5000; // 5 seconds

  const currentStory = stories[currentStoryIndex];

  useEffect(() => {
    if (!isOpen) return;
    
    setProgress(0);
    setCurrentStoryIndex(initialStoryIndex);
  }, [isOpen, initialStoryIndex]);

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (!isOpen || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    setProgress(0);
    
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (STORY_DURATION / 100));
        
        if (newProgress >= 100) {
          if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(prevIndex => prevIndex + 1);
          } else {
            onClose();
          }
          return 0;
        }
        
        return newProgress;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentStoryIndex, isOpen, isPaused, stories.length, onClose]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const centerX = rect.width / 2;

    if (clickX < centerX) {
      prevStory();
    } else {
      nextStory();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d`;
    }
  };

  if (!isOpen || !currentStory) return null;

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{
                width: index === currentStoryIndex 
                  ? `${progress}%` 
                  : index < currentStoryIndex 
                    ? '100%' 
                    : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Image
            src={currentStory.user.avatar || "/noAvatar.png"}
            alt={currentStory.user.name || currentStory.user.username}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-white font-semibold text-sm">
              {currentStory.user.name || currentStory.user.username}
            </p>
            <p className="text-gray-300 text-xs">
              {formatTime(currentStory.createdAt)}
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Story content */}
      <div 
        className="relative w-full h-full max-w-md cursor-pointer select-none"
        onClick={handleClick}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <Image
          src={currentStory.img}
          alt="Story"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Navigation areas (invisible) */}
      <button
        className="absolute left-0 top-0 bottom-0 w-1/3 z-10 opacity-0"
        onClick={prevStory}
        disabled={currentStoryIndex === 0}
      />
      <button
        className="absolute right-0 top-0 bottom-0 w-1/3 z-10 opacity-0"
        onClick={nextStory}
      />

      {/* Navigation indicators */}
      {currentStoryIndex > 0 && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white opacity-50">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      )}
      
      {currentStoryIndex < stories.length - 1 && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white opacity-50">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default StoryViewer;
