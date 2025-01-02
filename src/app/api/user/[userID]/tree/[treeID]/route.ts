import { NextResponse } from "next/server";
import { query } from "@/lib/db/db"; // Adjust the import based on your db helper
import {
    Analysis,
    Disease,
    diseaseIdentified,
    Image,
    ScanResult,
    Tree,
} from "@/type/types";
import { convertBlobToBase64, convertImageToBlob } from "@/utils/image-utils";

export async function GET(
    request: Request,
    { params }: { params: { treeID: number; userID: number } }
) {
    const { userID, treeID } = await params;
    try {

        const tree = await query(`SELECT * FROM tree WHERE treeID = ?`,[treeID]) as Tree[];

        const img = (await query(
            `SELECT * FROM Image i 
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
                                                    INNER JOIN analyzedImage ai ON a.analysisID = ai.analysisID
                                                    WHERE i.imageID = ?`,
                    [image.imageID]
                )) as { analyzedImageID: number; imageData: string }[];

        
                return {
                    ...image,
                    imageData:convertBlobToBase64(image.imageData),
                    analyzedImage: convertBlobToBase64(analyzedImage[0].imageData),
                    diseases: diseases,
                };
            })
        );

        const treeImage = await query(
            `SELECT imageData FROM treeImage WHERE status = 1 AND treeID = ?`,
            [treeID]
        ) as { imageData: string }[];

        const updatedTreeImage = convertBlobToBase64(treeImage[0]?.imageData)

        const updatedTree = {
            ...tree[0],
            treeImage:updatedTreeImage
        }
        return NextResponse.json({ success: true, tree:updatedTree, images });

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
    { params }: { params: { userID: number } }
) {
    const { userID } = await params;
    const { treeID, treeCode, description, status, treeImage } = await req.json();

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

        if(treeImage){
            const hasTreeImage = await query(
                `SELECT treeImageID FROM treeImage WHERE status = 1 AND treeID = ?`,
                [treeID]
            ) as { userprofileimageID: number }[];

            if (hasTreeImage.length > 0) {
                await query(
                    `UPDATE treeImage SET status = 2 WHERE treeID = ?`,
                    [treeID]
                );
            }
            
            const blobImageData = convertImageToBlob(treeImage);

            const result = await query(
                `INSERT INTO treeImage (treeID, imageData) VALUES (?, ?)`,
                [treeID, blobImageData]
            );
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
