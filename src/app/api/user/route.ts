import { supabase } from "@/supabase/supabase";
import { compare, hash } from "bcrypt";
import { NextResponse } from "next/server";
export async function PUT(req: Request) {
    try {
        const {
            type,
            userID,
            fName,
            lName,
            currentPassword,
            newPassword,
        } = await req.json();
        if (type === 1) {
            //userInfo
            const { data, error } = await supabase
                .from("user") // replace 'users' with your actual table name
                .update({
                    lName: lName,
                })
                .eq("userID", userID);

            if (error) {
                return new Response(JSON.stringify({ error: error.message }), {
                    status: 400,
                });
            }

            return new Response(
                JSON.stringify({ message: "User updated successfully" }),
                {
                    status: 200,
                }
            );
        } else if (type === 2) {
            //user email
        } else if (type === 3) {
            //confirm
        } else if (type === 4) {
            //user password
            const { data: user, error: selectError } = await supabase
                .from("user")
                .select()
                .eq("userID", userID);

                // console.log(user)
            if (selectError) {
                return NextResponse.json(
                    { error: "user not found" },
                    { status: 401 }
                );
            }
            const passwordMatch = await compare(
                currentPassword,
                user[0].password
            );
            if (!passwordMatch) {
                return NextResponse.json(
                    { error: "current password is incorrect" },
                    { status: 401 }
                );
            }

            const hashedPassword = await hash(newPassword, 10);

            const { error: updateError } = await supabase
                .from("user")
                .update({
                    password: hashedPassword,
                })
                .eq("userID", userID);

            if (updateError) {
                return NextResponse.json(
                    { error: updateError.message },
                    { status: 401 }
                );
            }

            return NextResponse.json(
                { message: "Password updated successfully" },
                { status: 200 }
            );
        }
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            {
                status: 500,
            }
        );
    }
}
