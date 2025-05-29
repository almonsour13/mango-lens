import { supabase } from "@/supabase/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { orgCode, code, email, userID } = await req.json();

        if (orgCode === code) {
            await supabase
                .from("user")
                .update({
                    email: email,
                })
                .eq("userID", userID);
        } else {
            return NextResponse.json(
                { success: false, message: "Invalid verification code." },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: "Email updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update email" },
            { status: 500 }
        );
    }
}
