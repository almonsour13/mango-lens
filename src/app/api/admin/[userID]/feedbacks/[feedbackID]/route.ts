import { supabase } from "@/supabase/supabase";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ userID: string; feedbackID: string }>}
) {
    const { userID, feedbackID } = await params;

    try {
        if (!userID || !feedbackID) {
            return NextResponse.json(
                { success: false, error: "Missing userID or feedbackID" },
                { status: 400 }
            );
        }

        const { feedbackResponseID, content } = await req.json();

        if (!feedbackResponseID || !content) {
            return NextResponse.json(
                { success: false, error: "Missing response content" },
                { status: 400 }
            );
        }
        const { data, error } = await supabase
            .from("feedbackResponse")
            .insert({ feedbackResponseID, feedbackID, content, userID })
            .select()
            .single();
        if (error) return NextResponse.json({ success: false, error });

        const { error: updateError } = await supabase
            .from("feedback")
            .update({ status: 3 })
            .eq("feedbackID", feedbackID);

        if (updateError)
            return NextResponse.json({ success: updateError, error });

        return NextResponse.json({
            success: true,
            data: data,
        });
    } catch (error) {
        console.error("Error adding feedback response:", error);
        return NextResponse.json(
            { success: false, error: "Something went wrong." },
            { status: 500 }
        );
    }
}
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ userID: string; feedbackID: string } >}
) {
    const { userID, feedbackID } = await params;
    try {
        
    } catch (error) {
        
    }
}
