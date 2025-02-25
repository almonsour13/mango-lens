import { supabase } from "@/supabase/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: number; treeID: string }> }
) {
    try {
        const { userID, treeID } = await params;

        const { data, error } = await supabase
            .from("tree")
            .select()
            .eq("treeID", treeID)
            .single();
        if (error) return NextResponse.json({ success: false, error });
        
        return NextResponse.json({ success: false, data: data });
    } catch (error) {
        console.error("Error retrieving trees:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
