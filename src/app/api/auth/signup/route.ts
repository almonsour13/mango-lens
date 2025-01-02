import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { hash } from "bcrypt";
import { query } from "@/lib/db/db";
import { sendVerificationEmail, transporter } from "@/lib/email-transporter";

const verificationCodes = new Map<string, { code: string; expires: number; userData: any }>();

export async function emailExists(email: string): Promise<boolean> {
    const result = (await query(
        "SELECT COUNT(*) as count FROM user WHERE email = ?",
        [email]
    )) as {count:number}[];

    return result[0].count > 0;
}

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
