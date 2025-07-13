import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ users: [] });
    }

    try {
        // Clean and normalize the search query
        const normalizedQuery = query.trim().toLowerCase();
        const searchTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0);

        // Create search conditions for better matching
        const searchConditions = [];

        // Add individual term searches
        searchTerms.forEach(term => {
            searchConditions.push(
                // Username matches
                {
                    username: {
                        contains: term,
                        mode: "insensitive" as const,
                    },
                },
                {
                    username: {
                        startsWith: term,
                        mode: "insensitive" as const,
                    },
                },
                // Name matches
                {
                    name: {
                        contains: term,
                        mode: "insensitive" as const,
                    },
                },
                {
                    name: {
                        startsWith: term,
                        mode: "insensitive" as const,
                    },
                },
                // Surname matches
                {
                    surname: {
                        contains: term,
                        mode: "insensitive" as const,
                    },
                },
                {
                    surname: {
                        startsWith: term,
                        mode: "insensitive" as const,
                    },
                }
            );
        });

        // Add multi-term combinations using AND
        if (searchTerms.length > 1) {
            searchConditions.push(
                // First name + Last name combination
                {
                    AND: [
                        {
                            name: {
                                contains: searchTerms[0],
                                mode: "insensitive" as const,
                            },
                        },
                        {
                            surname: {
                                contains: searchTerms[1],
                                mode: "insensitive" as const,
                            },
                        },
                    ],
                },
                // Last name + First name combination
                {
                    AND: [
                        {
                            name: {
                                contains: searchTerms[1],
                                mode: "insensitive" as const,
                            },
                        },
                        {
                            surname: {
                                contains: searchTerms[0],
                                mode: "insensitive" as const,
                            },
                        },
                    ],
                }
            );
        }

        const users = await prisma.user.findMany({
            where: {
                OR: searchConditions,
            },
            select: {
                id: true,
                username: true,
                name: true,
                surname: true,
                avatar: true,
            },
            take: 15, // Increased limit for better results
        });

        // Sort results by relevance
        const sortedUsers = users.sort((a, b) => {
            const aFullName = `${a.name || ''} ${a.surname || ''}`.toLowerCase().trim();
            const bFullName = `${b.name || ''} ${b.surname || ''}`.toLowerCase().trim();
            const aUsername = a.username.toLowerCase();
            const bUsername = b.username.toLowerCase();

            // Calculate relevance scores
            let aScore = 0;
            let bScore = 0;

            searchTerms.forEach(term => {
                // Exact username match gets highest score
                if (aUsername === term) aScore += 100;
                if (bUsername === term) bScore += 100;

                // Username starts with term
                if (aUsername.startsWith(term)) aScore += 50;
                if (bUsername.startsWith(term)) bScore += 50;

                // Full name exact match
                if (aFullName === normalizedQuery) aScore += 80;
                if (bFullName === normalizedQuery) bScore += 80;

                // Full name starts with term
                if (aFullName.startsWith(term)) aScore += 40;
                if (bFullName.startsWith(term)) bScore += 40;

                // Contains term
                if (aUsername.includes(term)) aScore += 20;
                if (bUsername.includes(term)) bScore += 20;
                if (aFullName.includes(term)) aScore += 15;
                if (bFullName.includes(term)) bScore += 15;

                // Individual name/surname matches
                if (a.name?.toLowerCase().includes(term)) aScore += 10;
                if (a.surname?.toLowerCase().includes(term)) aScore += 10;
                if (b.name?.toLowerCase().includes(term)) bScore += 10;
                if (b.surname?.toLowerCase().includes(term)) bScore += 10;
            });

            return bScore - aScore;
        });

        // Remove duplicates while preserving order
        const uniqueUsers = sortedUsers.filter((user, index, array) => 
            array.findIndex(u => u.id === user.id) === index
        );

        return NextResponse.json({ users: uniqueUsers.slice(0, 10) });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ users: [] });
    }
}
