import { NextResponse } from "next/server";
import { query } from "@/lib/db/db";
import {
    Analysis,
    Disease,
    diseaseIdentified,
    Image,
    Tree,
} from "@/type/types";
import { convertBlobToBase64 } from "@/utils/image-utils";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ imageID: string }> }
) {
    const { imageID } = await params;

    try {
        const imageAnalysis = (await query(
            `
            SELECT * FROM tree t 
            INNER JOIN image i ON t.treeID = i.treeID
            INNER JOIN analysis a ON i.imageID = a.imageID
            WHERE i.imageID = ? AND i.status = 1
        `,
            [imageID]
        )) as (Tree & Image & Analysis)[];

        if (!imageAnalysis || imageAnalysis.length === 0) {
            return NextResponse.json(
                { error: "Image not found" },
                { status: 404 }
            );
        }

        console.log(imageAnalysis)
        const diseases = (await query(
            `
            SELECT * FROM diseaseidentified di 
            INNER JOIN disease d ON di.diseaseID = d.diseaseID
            WHERE di.analysisID = ?`,
            [imageAnalysis[0].analysisID]
        )) as (diseaseIdentified & Disease)[];


        const analyzedImage = (await query(
            `SELECT ai.analyzedImageID, ai.imageData FROM image i 
                                            INNER JOIN analysis a ON i.imageID = a.imageID
                                            INNER JOIN analyzedimage ai ON a.analysisID = ai.analysisID
                                            WHERE i.imageID = ?`,
            [imageAnalysis[0].imageID]
        )) as { analyzedImageID: number; imageData: string }[];

        const boundingBoxes =
            analyzedImage.length > 0
                ? ((await query(
                      `SELECT * FROM boundingbox bb
                        INNER JOIN diseaseidentified di 
                        ON bb.diseaseIdentifiedID = di.diseaseIdentifiedID WHERE di.analysisID = ?`,
                      [imageAnalysis[0].analysisID]
                  )) as {
                      diseaseName: string;
                      x: number;
                      y: number;
                      w: number;
                      h: number;
                  }[])
                : [];

        const imageDetails = {
            ...imageAnalysis[0],
            imageData: convertBlobToBase64(imageAnalysis[0].imageData),
            analyzedImage: convertBlobToBase64(analyzedImage[0].imageData),
            boundingBoxes: boundingBoxes,
            diseases,
        };

        return NextResponse.json(imageDetails);
    } catch (error) {
        console.error("Database query error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ imageID: string }> }
) {
    const { imageID } = await params;

    const { newTreeCode } = await request.json();

    try {
        const tree = (await query(
            `SELECT treeID from tree WHERE treeCode = ?`,
            [newTreeCode]
        )) as { treeID: number }[];

        const result = await query(
            `UPDATE image set treeID = ? WHERE imageID = ?`,
            [tree[0].treeID, imageID]
        );
        console.log(result);
        return NextResponse.json(
            { message: "Tree code updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Database query error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
