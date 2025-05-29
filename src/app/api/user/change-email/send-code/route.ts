import { sendVerificationEmail } from "@/lib/email-transporter";
import { NextResponse } from "next/server";

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !isValidEmail(email)) {
            return NextResponse.json({
                success: false,
                message: "Please provide a valid email address"
            }, { status: 400 });
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(email)
        await sendVerificationEmail(email, code, "email_change");

        return NextResponse.json({
            success: true,
            message: "Verification code sent to your email.",
            code: code
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "An error occurred"
        }, { status: 500 });
    }
}
