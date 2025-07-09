"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function UserSync() {
    const { user, isLoaded } = useUser();

    useEffect(() => {
        if (isLoaded && user) {
            // Call API to ensure user exists in database
            fetch('/api/sync-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: user.id,
                    username: user.username,
                    imageUrl: user.imageUrl,
                    emailAddresses: user.emailAddresses,
                }),
            }).catch(console.error);
        }
    }, [isLoaded, user]);

    return null;
}
