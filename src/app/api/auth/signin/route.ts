import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import { query } from "@/lib/db/db";
import { User } from "@/type/types";

export async function POST(req: Request) {
    try {
        if (!process.env.JWT_SECRET_KEY) {
            return NextResponse.json(
                { error: "JWT secret key is not set." },
                { status: 500 }
            );
        }

        const { email, password } = await req.json();

        // Get user from database
        const users = (await query(
            "SELECT * FROM user WHERE email = ?",
            [email]
        )) as (User & {password:string})[];

        const user = users[0];

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 401 }
            );
        }

        const hasProfile = (await query(
            `SELECT imageData FROM userprofileimage WHERE status = 1 AND userID = ?`,
            [user.userID]
        )) as { imageData: string }[];

        const token = sign(
            {
                userID: user.userID,
                role: user.role,
            },
            process.env.JWT_SECRET_KEY
        );

        const response = NextResponse.json({
            success: true,
            role: user.role,
            redirect: user.role === 1 ? '/admin' : '/user', 
            user: {
                userID: user.userID,
                email: user.email,
                fName: user.fName,
                lName: user.lName,
                role: user.role,
                profileImage: hasProfile.length > 0?hasProfile[0].imageData : "",
            },

        });

        // const activity: string = `${
        //     user.fName + " " + user.lName
        // } just logged in`;

        // await insertLog(user.userID, 1, activity);

        response.cookies.set("token", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
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
