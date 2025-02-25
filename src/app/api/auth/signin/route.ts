import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import { query } from "@/lib/db/db";
import { User } from "@/types/types";
import { supabase } from "@/supabase/supabase";

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
        const { data, error } = await supabase.from("user").select("*").eq("email", email);
        if(!data || data.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 });
        }

        const user = data[0];
        
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
        
        const hasProfile = await supabase.from("userprofileimage").select("imageData").eq("userID", user.userID);
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
                profileImage: hasProfile?.data && hasProfile.data[0]?.imageData ? hasProfile.data[0].imageData : ''
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
            maxAge: 30 * 24 * 60 * 60
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
