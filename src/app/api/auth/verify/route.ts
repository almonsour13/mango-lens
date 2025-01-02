import { NextResponse } from "next/server";
import { sign, verify } from "jsonwebtoken";
import { hash } from "bcrypt";
import { query } from "@/lib/db/db";

export async function POST(request: Request) {
    try {
        if (!process.env.JWT_SECRET_KEY) {
            return NextResponse.json(
                { error: "JWT secret key is not set." },
                { status: 500 }
            );
        }

        const { email, code, token } = await request.json();

        if (!email || !code || !token) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        let decodedToken;
        try {
            decodedToken = verify(token, process.env.JWT_SECRET_KEY) as {
                fName: string;
                lName: string;
                password: string;
                verificationCode: string;
            };
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid token." },
                { status: 400 }
            );
        }
        console.log(decodedToken);

        const { fName, lName, password, verificationCode } = decodedToken;

        if (code !== verificationCode) {
            return NextResponse.json(
                { success: false, message: "Invalid verification code." },
                { status: 400 }
            );
        }

        const hashedPassword = await hash(password, 10);

        const result = (await query(
            "INSERT INTO user (fName, lName, email, password, role) VALUES (?, ?, ?, ?, ?)",
            [fName, lName, email, hashedPassword, 2]
        )) as { insertId: number };

        const newUserId = result.insertId;

        const newToken = sign(
            {
                userID: newUserId,
                role: 2,
            },
            process.env.JWT_SECRET_KEY
        );

        const response = NextResponse.json({
            success: true,
            message: "Email verified successfully. Account created.",
            redirect:'/user',
            role: 2,
            user: {
                userID: newUserId,
                fName,
                lName,
                email,
                role: 2,
                profileImage:''
            },
        });

        response.cookies.set("token", newToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "An error occurred during verification.",
            },
            { status: 500 }
        );
    }
}
