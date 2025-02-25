import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const users = await prisma.user.findMany(); // Fetch all users

        return NextResponse.json({ success: true, users });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, error: "Something went wrong." },
            { status: 500 }
        );
    }
}
