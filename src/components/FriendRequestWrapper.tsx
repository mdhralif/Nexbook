"use client";

import { useRouter } from "next/navigation";
import FriendRequestList from "@/components/rightMenu/FriendRequestList";

interface FriendRequestWrapperProps {
  requests: any[];
}

const FriendRequestWrapper = ({ requests }: FriendRequestWrapperProps) => {
  const router = useRouter();

  const handleRequestAction = () => {
    // Refresh the page to update all sections when a friend request is accepted/declined
    router.refresh();
  };

  return <FriendRequestList requests={requests} onRequestAction={handleRequestAction} />;
};

export default FriendRequestWrapper;
