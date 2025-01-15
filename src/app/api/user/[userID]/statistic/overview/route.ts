import { query } from "@/lib/db/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: string }> }
) {
    const { userID } = await params;
    try {
        // total trees
        // healthy trees
        // diseaed trees

        // total images
        // healthy images
        // diseased images

        const sql = `
            SELECT
                -- Total trees
                COUNT(DISTINCT tree.treeID) AS totalTrees,
                COUNT(DISTINCT CASE WHEN di.diseaseID IS NULL THEN tree.treeID END) AS healthyTrees,
                COUNT(DISTINCT CASE WHEN di.diseaseID IS NOT NULL THEN tree.treeID END) AS diseasedTrees,
                
                COUNT(DISTINCT li.imageID) AS totalImages,
                COUNT(DISTINCT CASE WHEN di.diseaseID IS NULL THEN li.imageID END) AS healthyImages,
                COUNT(DISTINCT CASE WHEN di.diseaseID IS NOT NULL THEN li.imageID END) AS diseasedImages
            FROM
                tree
            LEFT JOIN
                image li ON tree.treeID = li.treeID
            LEFT JOIN
                analysis a ON li.imageID = a.imageID
            LEFT JOIN
                diseaseidentified di ON a.analysisID = di.analysisID
            WHERE
                tree.userID = ?;
        `;
        const overview = (await query(sql, [userID])) as {
            totalTrees: number;
            healthyTrees: number;
            diseasedTrees: number;
            totalImages: number;
            healthyImages: number;
            diseasedImages: number;
        }[];

        console.log(overview)
        return NextResponse.json({ overview: overview[0] });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
