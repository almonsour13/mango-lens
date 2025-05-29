import { supabase } from "@/supabase/supabase";
import { Disease } from "@/types/types";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: number }> }
) {
    const { userID } = await params;

    try {
        if (!userID) return;
        const { data, error } = await supabase.from("disease").select("*").eq("status",1);
        if (error) return NextResponse.json({ success: false, error });
        return NextResponse.json({
            success: true,
            diseases: data
        });
    } catch (error) {
        console.error("Error fetching diseases:", error);
        return NextResponse.json(
            { success: false, error: "Something went wrong." },
            { status: 500 }
        );
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ userID: number }> }
) {
    const { value } = await req.json();
    try {
        const { data, error } = await supabase
            .from("disease")
            .insert([value])
            .select()
            .single();
        if (error) return NextResponse.json({ success: false, error });
        return NextResponse.json({
            success: true,
            diseases: data as Disease[],
        });
    } catch (error) {}
}
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ userID: number }> }
) {
    const { value } = await req.json();
    try {
        const { data, error } = await supabase
            .from("disease")
            .update([value])
            .eq("diseaseID", value.diseaseID    )
            .select()
            .single();
        if (error) return NextResponse.json({ success: false, error });
        return NextResponse.json({
            success: true,
            diseases: data as Disease[],
        });
    } catch (error) {}
}
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ userID: number }> }
) {
    const { diseaseID } = await req.json();
    try {
        const { data, error } = await supabase
            .from("disease")
            .update({status:3})
            .eq("diseaseID", diseaseID  )
            .select()
            .single();
        if (error) return NextResponse.json({ success: false, error });
        return NextResponse.json({
            success: true,
            diseases: data as Disease[],
        });
    } catch (error) {}
}