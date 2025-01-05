import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { sendVerificationEmail } from "@/lib/email-transporter";
import { emailExists } from "@/lib/auth/auth";

export async function POST(req: Request) {
    try {
        if (!process.env.JWT_SECRET_KEY) {
            return NextResponse.json(
                { error: "JWT secret key is not set." },
                { status: 500 }
            );
        }

        const { fName, lName, email, password } = await req.json();

        // Check if email already exists
        const exists = await emailExists(email);
        if (exists) {
            return NextResponse.json(
                { error: "Email already exists." },
                { status: 409 }
            );
        }
        const code = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const VerificationToken = sign(
            {
                email:email,
                fName:fName,
                lName:lName,
                password:password,
                verificationCode:code
            },
            process.env.JWT_SECRET_KEY
        );
         await sendVerificationEmail(email, code);

        const response = NextResponse.json({
            success: true,
            message: 'Verification code sent to your email.',
            url:`/verify?token=${VerificationToken}&email=${email}`
        });

        return response;
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}