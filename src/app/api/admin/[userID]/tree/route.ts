import { supabase } from "@/supabase/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: number }> }
) {
    try {
        const { userID } = await params;

        // Fetch trees added by the user
        const { data: trees, error: treeError } = await supabase
            .from("tree")
            .select("*")
            .order("addedAt", { ascending: false });

        if (treeError) return NextResponse.json({ success: false, treeError });

        // Fetch users (assuming 'user' is a separate table)
        const { data: users, error: userError } = await supabase
            .from("user")
            .select("*");

        if (userError) return NextResponse.json({ success: false, userError });

        // Fetch images count for each tree
        const { data: imagesCount, error: imageError } = await supabase
            .from("image")
            .select("treeID, count:treeID", { count: "exact" });

        if (imageError)
            return NextResponse.json({ success: false, imageError });
        const finalTrees = trees.map((t) => {
            const user = users.filter((u) => u.userID === t.userID)[0];
            return {
                ...t,
                userID: user ? user.userID : "",
                fName: user ? user.fName : "",
                lName: user ? user.lName : "",
                imagesLength:
                    imagesCount.filter((imag) => imag.treeID === t.treeID)
                        .length || 0,
            };
        });

        return NextResponse.json({ success: true, data: finalTrees });
    } catch (error) {
        console.error("Error retrieving trees:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
