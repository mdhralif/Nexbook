import { NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function GET() {
    try {
        // Check database connection
        const userCount = await prisma.user.count();
        
        // Check environment variables
        const envCheck = {
            database: !!process.env.DATABASE_URL,
            clerk: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY,
            webhook: !!process.env.WEBHOOK_SECRET,
        };

        return NextResponse.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            userCount,
            environment: process.env.NODE_ENV,
            envCheck,
            version: "1.0.0"
        });
    } catch (error) {
        return NextResponse.json({
            status: "error",
            message: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}
