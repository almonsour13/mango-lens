import { emailExists } from "@/lib/auth/auth";
import { sendVerificationEmail } from "@/lib/email-transporter";
import { sign, verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        if (!process.env.JWT_SECRET_KEY) {
            return NextResponse.json(
                { error: "JWT secret key is not set." },
                { status: 500 }
            );
        }
        const { email, token } = await req.json();
        const exists = await emailExists(email);

        if (exists) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Account already exists with this email.",
                    redirect: "/signin",
                },
                { status: 400 }
            );
        }
        let decodedToken = verify(token, process.env.JWT_SECRET_KEY) as {
            fName: string;
            lName: string;
            password: string;
            verificationCode: string;
        };
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const VerificationToken = sign(
            {
                email: email,
                fName: decodedToken.fName,
                lName: decodedToken.lName,
                password: decodedToken.password,
                verificationCode: code,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h",
            }
        );
        await sendVerificationEmail(email, code);

        const response = NextResponse.json({
            success: true,
            message: "Verification code sent to your email.",
            url: `/verify?token=${VerificationToken}&email=${email}`,
            token: VerificationToken,
        });

        return response;
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            {
                error: "Authentication failed. Please try again.",
            },
            {
                status: 500,
            }
        );
    }
}
