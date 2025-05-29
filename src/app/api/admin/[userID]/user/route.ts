import { supabase } from "@/supabase/supabase";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { data: users, error } = await supabase.from("user").select("*");
        if(error) return NextResponse.json({ success: true, error });
        return NextResponse.json({ success: true, users: users });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
