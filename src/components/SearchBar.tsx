"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface User {
    id: string;
    username: string;
    name: string | null;
    surname: string | null;
    avatar: string | null;
}

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const searchUsers = async () => {
            if (query.trim().length < 1) {
                setUsers([]);
                setIsOpen(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
                const data = await response.json();
                setUsers(data.users || []);
                setIsOpen(true);
            } catch (error) {
                console.error("Search error:", error);
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchUsers, 200); // Reduced debounce time for faster response
        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleUserClick = (username: string) => {
        setQuery("");
        setIsOpen(false);
        router.push(`/profile/${username}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && users.length > 0) {
            handleUserClick(users[0].username);
        }
        if (e.key === "Escape") {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={searchRef}>
            <div className="hidden xl:flex p-2 bg-slate-100 items-center rounded-xl">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="bg-transparent outline-none flex-1 min-w-0"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Image src="/search.png" alt="Search" width={14} height={14} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                    ) : users.length > 0 ? (
                        users.map((user) => (
                            <div
                                key={user.id}
                                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                                onClick={() => handleUserClick(user.username)}
                            >
                                <Image
                                    src={user.avatar || "/noAvatar.png"}
                                    alt={user.username}
                                    width={32}
                                    height={32}
                                    className="rounded-full object-cover"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-sm">
                                        {user.name && user.surname
                                            ? `${user.name} ${user.surname}`
                                            : user.username}
                                    </div>
                                    {user.name && user.surname && (
                                        <div className="text-xs text-gray-500">@{user.username}</div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : query.trim().length >= 1 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No users found for &quot;{query}&quot;
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
