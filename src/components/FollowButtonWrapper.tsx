"use client";

import { useRouter } from "next/navigation";
import FollowButton from "./FollowButton";

interface FollowButtonWrapperProps {
  userId: string;
  isFollowing: boolean;
  hasPendingRequest: boolean;
}

const FollowButtonWrapper = ({ userId, isFollowing, hasPendingRequest }: FollowButtonWrapperProps) => {
  const router = useRouter();

  const handleFollowAction = () => {
    // Refresh the page to update all sections when follow action happens
    setTimeout(() => {
      router.refresh();
    }, 100); // Small delay to ensure the action completes
  };

  return (
    <div onClick={handleFollowAction}>
      <FollowButton
        userId={userId}
        isFollowing={isFollowing}
        hasPendingRequest={hasPendingRequest}
      />
    </div>
  );
};

export default FollowButtonWrapper;
