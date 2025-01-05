import { NextResponse } from "next/server";
import { query } from "@/lib/db/db";
import { User } from "@/type/types";
import { compare, hash } from "bcrypt";
import { convertImageToBlob } from "@/utils/image-utils";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: string }> }
) {
    const { userID } = await params;

    try {
        const user = (await query(`SELECT * FROM user WHERE userID = ?`, [
            userID,
        ])) as User[];
        const hasProfile = (await query(
            `SELECT imageData FROM userprofileimage WHERE status = 1 AND userID = ?`,
            [userID]
        )) as { imageData: string }[];

        return NextResponse.json({
            success: true,
            user: user[0],
            profileImage: hasProfile[0].imageData || "",
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ userID: string }> }
) {
    const { userID } = await params;

    try {
        const {
            type,
            fName,
            lName,
            imageData,
            email,
            currentPassword,
            newPassword,
        } = await req.json();
        if (type === 1) {
            if (!fName && !lName) {
                return NextResponse.json(
                    { error: "fName not found" },
                    { status: 404 }
                );
            }
            await query(
                `UPDATE user SET fName = ?, lName = ? WHERE userID = ?`,
                [fName, lName, userID]
            );
            if (imageData) {
                const hasProfile = (await query(
                    `SELECT userprofileimageID FROM userprofileimage WHERE status = 1 AND userID = ?`,
                    [userID]
                )) as { userprofileimageID: number }[];

                if (hasProfile.length > 0) {
                    await query(
                        `UPDATE userprofileimage SET status = 2 WHERE userID = ?`,
                        [userID]
                    );
                }

                const blobImageData = convertImageToBlob(imageData);

                const result = await query(
                    `INSERT INTO userprofileimage (userID, imageData) VALUES (?, ?)`,
                    [userID, blobImageData]
                );
                console.log(result)
            }
            const updatedUser = (await query(
                `SELECT * FROM user u INNER JOIN userprofileimage up ON u.userID = up.userID WHERE up.status = 1 AND u.userID = ?`,
                [userID]
            )) as User[];
            console.log(updatedUser);
            return NextResponse.json({ success: true, user: updatedUser[0] });
        } else if (type === 2) {
            if (email) {
                await query(`UPDATE user SET email = ? WHERE userID = ?`, [
                    email,
                    userID,
                ]);
            }
            if (currentPassword) {
                const user = (await query(
                    `SELECT password FROM user WHERE userID = ?`,
                    [userID]
                )) as { password: string }[];

                const passwordMatch = await compare(
                    currentPassword,
                    user[0].password
                );

                if (!passwordMatch) {
                    return NextResponse.json(
                        { error: "Incorrect password" },
                        { status: 401 }
                    );
                }
            }
            if (newPassword) {
                const hashedPassword = await hash(newPassword, 10);
                await query(`UPDATE user SET password = ? WHERE userID = ?`, [
                    hashedPassword,
                    userID,
                ]);
            }
            const updatedUser = (await query(
                `SELECT * FROM user WHERE userID = ?`,
                [userID]
            )) as User[];
            return NextResponse.json({ success: true, user: updatedUser[0] });
        }
    } catch (error) {
        console.error("Error updating user information:", error);
        return NextResponse.json(
            { error: "Failed to updated user information" },
            { status: 500 }
        );
    }
}
