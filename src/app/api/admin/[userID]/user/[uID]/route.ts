import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/supabase/supabase";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: string; uID: string }> }
) {
    try {
        const { userID, uID } = await params;

        const { data: user, error: userError } = await supabase
            .from("user")
            .select("*")
            .eq("userID", uID);
            console.log(user)
        if (userError) return NextResponse.json({ success: false, error:userError });
        
        return NextResponse.json({
            success: true,
            data: user[0],
        });
    } catch (error) {
        console.error("Error retrieving trees:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
