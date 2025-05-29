import { NextResponse } from "next/server";
import { supabase } from "@/supabase/supabase";
import { sign } from "jsonwebtoken";
import { sendVerificationEmail } from "@/lib/email-transporter";

export async function POST(req: Request) {
    try {
        if (!process.env.JWT_SECRET_KEY) {
            return NextResponse.json(
                { error: "JWT secret key is not set." },
                { status: 500 }
            );
        }
        const body = await req.json();
        const { email } = body;

        const { data, error } = await supabase
            .from("user")
            .select("*")
            .eq("email", email);
        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: "User with this email not found" },
                { status: 404 }
            );
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await sendVerificationEmail(email, code, "password_reset");

        const VerificationToken = sign(
            {
                email: email,
                verificationCode: code,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h", // Token will expire in 1 hour, you can customize this duration
            }
        );
        const response = NextResponse.json({
            success: true,
            message: "Verification code sent to your email.",
            url: `/verify?token=${VerificationToken}&email=${email}&type=forgot-password`,
        });
        return response;
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: "An error occurred during verification.",
            },
            { status: 500 }
        );
    }
}
