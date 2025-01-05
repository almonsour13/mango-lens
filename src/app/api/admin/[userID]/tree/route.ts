import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/db";
import { Tree, User } from "@/type/types";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: number }> }
) {
    const { userID } = await params; // No need to await params here.
    console.log(userID);
    try {
        const trees = (await query(
            `SELECT 
                t.*, 
                u.*, 
                (SELECT COUNT(*) FROM image i WHERE i.treeID = t.treeID) AS imagesLength
            FROM tree t
            LEFT JOIN user u ON t.userID = u.userID
            ORDER BY t.addedAt DESC`
        )) as (Tree & { imagesLength: number; user: User })[]; // Type the result properly

        console.log(trees);
        return NextResponse.json({ success: true, trees });
    } catch (error) {
        console.error("Error retrieving trees:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
