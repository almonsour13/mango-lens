import { NextResponse } from "next/server";
import { query } from "@/lib/db/db";
import { Disease } from "@/types/types";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: number }>}
) {
    const { userID } = await params;

    try {
        if (!userID) return;
        const diseases = (await query("SELECT * FROM disease")) as Disease[];
        return NextResponse.json({ success: true, diseases: diseases });
    } catch (error) {
        console.error("Error fetching diseases:", error);
        return NextResponse.json(
            { success: false, error: "Something went wrong." },
            { status: 500 }
        );
    }
}
