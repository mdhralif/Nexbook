"use client";

import { switchFollow } from "@/lib/actions";
import { useState, useTransition } from "react";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  hasPendingRequest: boolean;
}

const FollowButton = ({ userId, isFollowing, hasPendingRequest }: FollowButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [followState, setFollowState] = useState({
    isFollowing,
    hasPendingRequest,
  });

  const handleFollow = () => {
    startTransition(async () => {
      try {
        await switchFollow(userId);
        
        // Update local state based on current state
        if (followState.isFollowing) {
          // Currently following -> unfollow
          setFollowState({ isFollowing: false, hasPendingRequest: false });
        } else if (followState.hasPendingRequest) {
          // Has pending request -> cancel request
          setFollowState({ isFollowing: false, hasPendingRequest: false });
        } else {
          // Not following and no request -> send request
          setFollowState({ isFollowing: false, hasPendingRequest: true });
        }
      } catch (error) {
        console.error("Error following/unfollowing user:", error);
      }
    });
  };

  const getButtonText = () => {
    if (followState.isFollowing) return "Following";
    if (followState.hasPendingRequest) return "Requested";
    return "Follow";
  };

  const getButtonStyles = () => {
    if (followState.isFollowing) {
      return "bg-blue-500 text-white hover:bg-red-100 hover:text-red-700";
    }
    if (followState.hasPendingRequest) {
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
    }
    return "bg-blue-500 text-white hover:bg-blue-600";
  };

  const getHoverText = () => {
    if (followState.isFollowing) return "Unfollow";
    return getButtonText();
  };

  return (
    <button
      onClick={handleFollow}
      disabled={isPending}
      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors group ${getButtonStyles()} ${
        isPending ? "opacity-50 cursor-not-allowed" : ""
      }`}
      title={followState.isFollowing ? "Click to unfollow" : ""}
    >
      {isPending ? "..." : (
        <>
          <span className="group-hover:hidden">
            {getButtonText()}
          </span>
          <span className="hidden group-hover:inline">
            {getHoverText()}
          </span>
        </>
      )}
    </button>
  );
};

export default FollowButton;
