import { NextResponse } from "next/server";
import { convertBlobToBase64 } from "@/utils/image-utils";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: string }> }
) {
    const { userID } = await params;

    try {
        const [images, trees, users, analysis, analyzedimage, diseaseidentified] = await Promise.all([
            prisma.image.findMany({
                orderBy: {
                    uploadedAt: 'desc'
                },
            }),
            prisma.tree.findMany(),
            prisma.user.findMany(),
            prisma.analysis.findMany(),
            prisma.analyzedimage.findMany(),
            prisma.diseaseidentified.findMany()
        ]);

        const updatedImages = images.map((img) => {
            const tree = trees.find((t) => t.treeID === img.treeID);
            const user = users.find((u) => u.userID === img.userID);
            const imgAnalysis = analysis.find((a) => a.imageID === img.imageID);
            const anImg = analyzedimage.find(
                (ai) => ai.analysisID === imgAnalysis?.analysisID
            );
            const di = diseaseidentified.filter(
                (d) => d.analysisID === imgAnalysis?.analysisID
            );

            return {
                ...img,
                analyzedImage: anImg ? convertBlobToBase64(anImg.imageData) : "",
                userID: user ? user.userID : "",
                userName: user ? `${user.fName} ${user.lName}` : "",
                treeID: tree?.treeID,
                treeCode: tree?.treeCode,
                imageData: img.imageData ? convertBlobToBase64(img.imageData) : "",
                diseases: di.map((d) => ({
                    diseaseName: d.diseaseName,
                    likelihoodScore: Number(d.likelihoodScore.toFixed(1)),
                })),
            };
        });

        return NextResponse.json({ success: true, data: updatedImages });
    } catch (error) {
        console.error("Error retrieving data:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
