import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/db";
import { Tree, Image } from "@/type/types";
import { convertBlobToBase64, convertImageToBlob } from "@/utils/image-utils";

export async function GET(
    req: Request,
    { params }: { params: { userID: number } }
) {
    const { userID } = await params;
    try {
        const url = new URL(req.url);
        const type = url.searchParams.get("type");

        let queryCondition = `t.status = 1`;
        if (!type) {
            queryCondition = `t.status = 1 OR t.status = 2`;
        }

        const trees = (await query(
            `SELECT * FROM tree t WHERE userID = ? AND (${queryCondition}) ORDER BY addedAt DESC`,
            [userID]
        )) as Tree[];

        const treeWidthImage = await Promise.all(
            trees.map(async (tree) => {
                const image = (await query(
                    `SELECT imageData FROM image i WHERE i.treeID = ? AND i.status = 1  ORDER BY uploadedAt DESC`,
                    [tree.treeID]
                )) as { imageData: string }[];  

                const treeImage = await query(
                    `SELECT imageData FROM treeImage WHERE status = 1 AND treeID = ?`,
                    [tree.treeID]
                ) as { imageData: string }[];
                
                return {
                    ...tree,
                    treeImage:convertBlobToBase64(treeImage[0]?.imageData),
                    recentImage: convertBlobToBase64(image[0]?.imageData),
                    imagesLength: image.length,
                };
            })
        );
        return NextResponse.json({ success: true, treeWidthImage });
    } catch (error) {
        console.error("Error retrieving trees:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
export async function POST(
    req: Request,
    { params }: { params: { userID: number } }
) {
    const { userID } = await params;
    const { treeCode, description } = await req.json();

    try {
        if (!treeCode || !userID) {
            return NextResponse.json(
                { success: false, error: "Missing treeCode or userID" },
                { status: 400 }
            );
        }

        const checkIfExist = (await query(
            `SELECT * FROM Tree t WHERE t.treeCode = ?`,
            [treeCode]
        )) as Tree[];

        if (checkIfExist.length > 0) {
            return NextResponse.json(
                { success: false, error: "Tree already exists" },
                { status: 400 }
            );
        }

        const insertId = (await query(
            `INSERT INTO tree (treeCode, description, userID) VALUES (?, ?, ?)`,
            [treeCode, description, userID]
        )) as { insertId: number };
        const newTree = (await query(`SELECT * FROM Tree WHERE treeID = ?`, [
            insertId.insertId,
        ])) as Tree[];

        return NextResponse.json({ success: true, tree: newTree[0] });
    } catch (error) {
        console.error("Error adding tree:", error);
        return NextResponse.json(
            { success: false, error: "Failed to add tree" },
            { status: 500 }
        );
    }
}

