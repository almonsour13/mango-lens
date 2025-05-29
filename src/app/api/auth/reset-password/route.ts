import { NextResponse } from "next/server";
import { sign, verify } from "jsonwebtoken";
import { sendVerificationEmail } from "@/lib/email-transporter";
import { emailExists } from "@/lib/auth/auth";
import { supabase } from "@/supabase/supabase";
import { redirect } from "next/dist/server/api-utils";
import { hash } from "bcrypt";

export async function POST(req: Request) {
    try {
        if (!process.env.JWT_SECRET_KEY) {
            return NextResponse.json(
                { error: "JWT secret key is not set." },
                { status: 500 }
            );
        }
        const { token, values } = await req.json();

        const { password, confirmPassword } = values;

        if (!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 400 }
            );
        }
        const decoded = verify(token, process.env.JWT_SECRET_KEY) as {
            email: string;
        };
        if (!decoded) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 400 }
            );
        }

        const hashedPassword = await hash(password, 10);
        try {
            const { data, error } = await supabase
                .from("user")
                .update({
                    password: hashedPassword,
                })
                .eq("email", decoded.email)
                .select()
                .single();
        } catch (error) {
            return NextResponse.json(
                { error: "Failed to update password" },
                { status: 500 }
            );
        }
        return NextResponse.json({
            success: true,
            message: "Password reset successfully",
            redirect: "/signin",
        });
    } catch (error) {
        return NextResponse.json(
            { error: "An error occurred while resetting password" },
            { status: 500 }
        );
    }
}
