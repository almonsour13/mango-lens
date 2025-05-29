import { supabase } from "@/supabase/supabase";
import { Disease } from "@/types/types";
import { ImageIcon, MessageSquare, TreeDeciduous, User } from "lucide-react";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: number }> }
) {
    const { userID } = await params;
    try {
        const { data: users, error } = await supabase.from("user").select("*");
        if (error) return NextResponse.json({ success: true, error });

        const { data: images, error: imageError } = await supabase
            .from("image")
            .select("*")
            .order("uploadedAt", { ascending: false });
        if (imageError)
            return NextResponse.json({ success: false, imageError });

        const { data: trees, error: treeError } = await supabase
            .from("tree")
            .select("*")
            .order("addedAt", { ascending: false });
        if (treeError) return NextResponse.json({ success: false, treeError });

        const { data: feedback, error: feedbackError } = await supabase
            .from("feedback")
            .select("*");
        if (feedbackError)
            return NextResponse.json({ success: false, feedbackError });

        const currentDate = new Date();
        const firstDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );

        const thisMonthUser = users.filter(
            (user) => new Date(user.createdAt) >= firstDayOfMonth
        ).length;
        const thisMonthTrees = trees.filter(
            (tree) => new Date(tree.addedAt) >= firstDayOfMonth
        ).length;

        const thisMonthImages = images.filter(
            (image) => new Date(image.uploadedAt) >= firstDayOfMonth
        ).length;
        const thisMonthFeedbacks = feedback.filter(
            (feed) => new Date(feed.feedbackAt) >= firstDayOfMonth
        ).length;

        const res = [
            {
                name: "Total User",
                value: users.length,
                detail: `+${thisMonthUser} this month`,
            },
            {
                name: "Total Images",
                value: images.length,
                detail: `+${thisMonthTrees} this month`,
            },
            {
                name: "Total Trees",
                value: trees.length,
                detail: `+${thisMonthImages} this month`,
            },
            {
                name: "Total Feedback",
                value: feedback.length,
                detail: `+${thisMonthFeedbacks} this month`,
            },
        ];
        return NextResponse.json({
            success: true,
            data: res,
        });
    } catch (error) {
        console.error("Error fetching diseases:", error);
        return NextResponse.json(
            { success: false, error: "Something went wrong." },
            { status: 500 }
        );
    }
}
