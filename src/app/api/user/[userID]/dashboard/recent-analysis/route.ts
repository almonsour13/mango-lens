import { NextResponse } from "next/server";
import { query } from "@/lib/db/db";
import { Image } from "@/types/types";
import { convertBlobToBase64 } from "@/utils/image-utils";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: string }> }
) {
    const { userID } = await params;

    try {
        const recentTreeImages = (await query(
            `SELECT *, t.treeCode from image i 
            INNER JOIN tree t 
            ON i.treeID = t.treeID 
            WHERE i.userID = ? 
            ORDER BY uploadedAt DESC LIMIT 5`,
            [userID]
        )) as (Image & { treeCode: string })[];

        const images = await Promise.all(
            recentTreeImages.map(async (image) => {
                const diseases = (await query(
                    `
                    SELECT likelihoodScore, diseaseName FROM analysis a 
                    INNER JOIN diseaseidentified di ON a.analysisID = di.analysisID
                    INNER JOIN disease d ON di.diseaseID = d.diseaseID
                    WHERE a.imageID = ?`,
                    [image.imageID]
                )) as { likelihoodScore: number; diseaseName: string }[];

                return {
                    ...image,
                    imageData:convertBlobToBase64(image.imageData),
                    diseases: diseases,
                };
            })
        );
        return NextResponse.json({ recentAnalysis: images });
    } catch (error) {
        console.error("Error retrieving metrics:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
