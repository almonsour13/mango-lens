import { query } from "@/lib/db/db";
import { Tree, Image, Trash } from "@/type/types";
import { convertBlobToBase64 } from "@/utils/image-utils";
import { NextResponse } from "next/server";

//item statys
// 1 = active
// 2 = inactive
// 3 = temporary delete
// 4 = permanently delete

//trash status
//1 = temporary trash
//2 = permanently delete
//3 = restored

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: string }> }
) {
    const { userID } = await params;
    try {
        const getTrash = (await query(
            `SELECT * FROM trash tr WHERE tr.userID = ? ORDER BY deletedAt DESC`,
            [userID]
        )) as Trash[];

        const trash = await Promise.all(
            getTrash.map(async (trash) => {
                if (trash.type == 1) {
                    const treeItems = (await query(
                        `SELECT * FROM tree t WHERE t.treeID = ?`,
                        [trash.itemID]
                    )) as Tree[];
                    return {
                        ...trash,
                        item: treeItems[0] || null,
                    };
                } else {
                    const imageItems = (await query(
                        `SELECT * FROM image i WHERE i.imageID = ?`,
                        [trash.itemID]
                    )) as Image[];
                    return {
                        ...trash,
                        item: imageItems[0] ? {
                            ...imageItems[0],
                            imageData: convertBlobToBase64(imageItems[0].imageData)
                        } : null,
                    };
                }
            })
        );
        return NextResponse.json({
            success: true,
            trash: trash.filter((t) => t.item !== null),
        });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
export async function POST(
    req: Request,
    { params }: { params: Promise<{ userID: string }> }
) {
    const { userID } = await params;
    try {
        const body = await req.json();

        if (!body.imageID && !body.treeID) {
            throw new Error("Missing required field: imageID or treeID");
        }

        if (body.treeID) {
            await query(
                `UPDATE tree SET status = 3, userID = ? WHERE treeID = ?`,
                [userID, body.treeID]
            );
            await query(
                `INSERT INTO trash (userID, itemID, type) VALUES(?, ?, ?)`,
                [userID, body.treeID, 1]
            );
        } else if (body.imageID) {
            await query(
                `UPDATE image SET status = 3, userID = ? WHERE imageID = ?`,
                [userID, body.imageID]
            );
            await query(
                `INSERT INTO trash (userID, itemID, type) VALUES(?, ?, ?)`,
                [userID, body.imageID, 2]
            );
        }

        return NextResponse.json({ success: true, message: "Move to trash" });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Something went wrong." },
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
        const body = await req.json();
        const action = body.action;
        const selected = body.selected as number[];

        if (!action && selected) {
            throw new Error("Missing required field: imageID or treeID");
        }

        const trashes = await Promise.all(
            selected.map(async (trashID) => {
                const items = (await query(
                    "SELECT itemID, type FROM trash tr WHERE trashID = ?",
                    [trashID]
                )) as { itemID: number; type: number }[];
                return {
                    trashID,
                    itemID: items[0].itemID,
                    type: items[0].type,
                };
            })
        );

        const status = action === 1 ? 1 : 4;

        await Promise.all(
            trashes.map(async (trash) => {
                const updateQuery =
                    trash.type === 1
                        ? "UPDATE tree SET status = ?, userID = ? WHERE treeID = ?"
                        : "UPDATE image SET status = ?, userID = ? WHERE imageID = ?";
                await query(updateQuery, [status, userID, trash.itemID]);
                await query("DELETE FROM trash WHERE trashID = ?", [
                    trash.trashID,
                ]);
            })
        );

        return NextResponse.json({
            success: true,
            message: "Action perform sucessfully",
        });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
