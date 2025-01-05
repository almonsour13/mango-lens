import { NextResponse } from "next/server";
import { query } from "@/lib/db/db"; // Adjust the import based on your db helper
import { Image, Tree } from "@/type/types";
import { convertBlobToBase64, convertImageToBlob } from "@/utils/image-utils";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ treeID: string; userID: string }> }
) {
    const { userID, treeID } = await params;
    try {
        if (!userID || !treeID)
            return NextResponse.json(
                { error: "Missing treeID, treeCode, or userID" },
                { status: 400 }
            );
        console.log(userID, treeID);

        const tree = (await query(`SELECT * FROM tree WHERE treeID = ?`, [
            treeID,
        ])) as Tree[];

        console.log(tree);
        const img = (await query(
            `SELECT * FROM image i 
            INNER JOIN tree t ON i.treeID = t.treeID 
            WHERE t.treeID = ? AND t.userID = ? 
            AND t.status = 1 AND i.status = 1 
            ORDER BY i.uploadedAt DESC`,
            [tree[0].treeID, userID]
        )) as Image[];

        const images = await Promise.all(
            img.map(async (image) => {
                const diseases = (await query(
                    `
                    SELECT likelihoodScore, diseaseName FROM analysis a 
                    INNER JOIN diseaseidentified di ON a.analysisID = di.analysisID
                    INNER JOIN disease d ON di.diseaseID = d.diseaseID
                    WHERE a.imageID = ?`,
                    [image.imageID]
                )) as { likelihoodScore: number; diseaseName: string }[];

                const analyzedImage = (await query(
                    `SELECT ai.analyzedImageID, ai.imageData FROM image i 
                                                    INNER JOIN analysis a ON i.imageID = a.imageID
                                                    INNER JOIN analyzedimage ai ON a.analysisID = ai.analysisID
                                                    WHERE i.imageID = ?`,
                    [image.imageID]
                )) as { analyzedImageID: number; imageData: string }[];

                return {
                    ...image,
                    imageData: convertBlobToBase64(image.imageData),
                    analyzedImage: convertBlobToBase64(
                        analyzedImage[0].imageData
                    ),
                    diseases: diseases,
                };
            })
        );

        const treeImage = (await query(
            `SELECT imageData FROM treeimage WHERE status = 1 AND treeID = ?`,
            [treeID]
        )) as { imageData: string }[];

        const updatedTreeImage = convertBlobToBase64(treeImage[0]?.imageData);

        const updatedTree = {
            ...tree[0],
            treeImage: updatedTreeImage,
        };
        return NextResponse.json({ success: true, tree: updatedTree, images });
    } catch (error) {
        console.error("Error retrieving trees:", error);
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
    const { treeID, treeCode, description, status, treeImage } =
        await req.json();

    try {
        if (!treeCode || !treeID || !userID || !status) {
            return NextResponse.json(
                { error: "Missing treeID, treeCode, or userID" },
                { status: 400 }
            );
        }

        await query(
            `UPDATE tree SET treeCode = ?, description = ?, status = ? WHERE treeID = ? AND userID = ?`,
            [treeCode, description, status, treeID, userID]
        );

        if (treeImage) {
            const hasTreeImage = (await query(
                `SELECT treeImageID FROM treeimage WHERE status = 1 AND treeID = ?`,
                [treeID]
            )) as { userprofileimageID: number }[];

            if (hasTreeImage.length > 0) {
                await query(
                    `UPDATE treeimage SET status = 2 WHERE treeID = ?`,
                    [treeID]
                );
            }

            const blobImageData = convertImageToBlob(treeImage);

            const result = await query(
                `INSERT INTO treeimage (treeID, imageData) VALUES (?, ?)`,
                [treeID, blobImageData]
            );
            console.log(result);
        }
        return NextResponse.json({ message: "Tree updated successfully" });
    } catch (error) {
        console.error("Error updating tree:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
