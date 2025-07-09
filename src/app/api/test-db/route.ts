import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function GET() {
    try {
        // Test database connection
        const userCount = await prisma.user.count();
        const users = await prisma.user.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ 
            success: true, 
            userCount, 
            recentUsers: users,
            message: "Database connection successful" 
        });
    } catch (error) {
        console.error("Database test error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error" 
        }, { status: 500 });
    }
}
