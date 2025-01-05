import { NextResponse } from "next/server";
import { query } from "@/lib/db/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ userID: string }> }
) {
    const { userID } = await params;
    try {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );

        const trees = (await query(
            `SELECT *, addedAt FROM tree WHERE userID = ?`,
            [userID]
        )) as {
            treeID: number;
            treeCode: string;
            treeName: string;
            addedAt: Date;
        }[];

        const thisMonthTrees = trees.filter(
            (tree) => new Date(tree.addedAt) >= firstDayOfMonth
        ).length;

        const images = (await query(`SELECT * FROM image WHERE userID = ?`, [
            userID,
        ])) as {
            imageID: number;
            treeID: number;
            uploadedAt: Date;
            imageData: string;
        }[];

        const thisMonthImages = images.filter(
            (image) => new Date(image.uploadedAt) >= firstDayOfMonth
        ).length;

        const diseasesDetected = (await query(
            `SELECT *, analyzedAt as identifiedDate FROM diseaseidentified di 
            INNER JOIN analysis a ON di.analysisID = a.analysisID
            INNER JOIN image i ON a.imageID = i.imageID
            WHERE i.userID = ?`,
            [userID]
        )) as {
            diseaseID: number;
            analysisID: number;
            identifiedDate: string;
        }[];

        const thisMonthDiseases = diseasesDetected.filter(
            (disease) => new Date(disease.identifiedDate) >= firstDayOfMonth
        ).length;

        // Calculate disease detection rate
        const detectionRate =
            images.length > 0
                ? ((diseasesDetected.length / images.length) * 100).toFixed(1)
                : "0";

        const metrics = [
            {
                name: "Total Trees",
                value: trees.length,
                detail: `+${thisMonthTrees} this month`,
            },
            {
                name: "Total Images",
                value: images.length,
                detail: `+${thisMonthImages} this month`,
            },
            {
                name: "Disease Detected",
                value: diseasesDetected.length,
                detail: `+${thisMonthDiseases} this month`,
            },
            {
                name: "Detection Rate",
                value: `${detectionRate}%`,
                detail: "From all images",
            },
        ];

        return NextResponse.json({ success: true, metrics });
    } catch (error) {
        console.error("Error retrieving trees:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
