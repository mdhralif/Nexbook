import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json({ users: [] });
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        username: {
                            contains: query,
                        },
                    },
                    {
                        name: {
                            contains: query,
                        },
                    },
                    {
                        surname: {
                            contains: query,
                        },
                    },
                ],
            },
            select: {
                id: true,
                username: true,
                name: true,
                surname: true,
                avatar: true,
            },
            take: 10,
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({ users: [] });
    }
}
