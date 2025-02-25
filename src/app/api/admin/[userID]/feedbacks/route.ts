import { supabase } from "@/supabase/supabase";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: number }> }
) {
    const { userID } = await params;

    try {
        if (!userID) return;
        
        const { data:users, error:userError } = await supabase.from("user").select("*")

        if (userError) return NextResponse.json({ success: false, userError });
        const { data:feedback, error:feedbackError } = await supabase.from("feedback").select("*")

        if (feedbackError) return NextResponse.json({ success: false, feedbackError });
        const { data:feedbackResponse, error:feedbackResponseError } = await supabase.from("feedbackResponse").select("*")

        if (feedbackResponseError) return NextResponse.json({ success: false, feedbackResponseError });

        const updatedFeedbacks = feedback.map((fd) => {
            const user = users.filter(u => u.userID === fd.userID)[0]
            const fdRes = feedbackResponse?.filter(res => fd.feedbackID === res.feedbackID);
            return{
                ...fd,
                user:user,
                responses:fdRes
            }
        },[])

        return NextResponse.json({
            success: true,
            data: updatedFeedbacks
        });
    } catch (error) {
        console.error("Error fetching diseases:", error);
        return NextResponse.json(
            { success: false, error: "Something went wrong." },
            { status: 500 }
        );
    }
}