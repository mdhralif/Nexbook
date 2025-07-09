import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/client";

export async function POST(req: NextRequest) {
    try {
        const { userId } = auth();
        
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id, username, imageUrl, emailAddresses } = body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (existingUser) {
            return NextResponse.json({ message: "User already exists", user: existingUser });
        }

        // Create user if doesn't exist
        const newUser = await prisma.user.create({
            data: {
                id: userId,
                username: username || emailAddresses?.[0]?.emailAddress?.split('@')[0] || `user_${userId.slice(-8)}`,
                avatar: imageUrl || "/noAvatar.png",
                cover: "/noCover.png"
            }
        });

        return NextResponse.json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error syncing user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
