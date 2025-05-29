import { NextResponse } from "next/server";
import { supabase } from "@/supabase/supabase";
import { convertBlobToBase64 } from "@/utils/image-utils";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: string }> }
) {
    const { userID } = await params;

    try {
        const { data: images, error: imageError } = await supabase
            .from("image")
            .select("*")
            .order("uploadedAt", { ascending: false });

        if (imageError)
            return NextResponse.json({ success: false, imageError });

        const { data: trees, error: treeError } = await supabase
            .from("tree")
            .select("*");

        if (treeError) return NextResponse.json({ success: false, treeError });

        const { data: users, error: userError } = await supabase
            .from("user")
            .select("*");

        if (userError) return NextResponse.json({ success: false, userError });

        const { data: analysis, error: analysisError } = await supabase
            .from("analysis")
            .select("*");
        if (analysisError)
            return NextResponse.json({ success: false, analysisError });

        const { data: analyzedimage, error: analyzedimageError } =
            await supabase.from("analyzedimage").select("*");
        if (analyzedimageError)
            return NextResponse.json({ success: false, analyzedimageError });

        const { data: diseaseidentified, error: diseaseidentifiedError } =
            await supabase.from("diseaseidentified").select("*");

        if (diseaseidentifiedError)
            return NextResponse.json({
                success: false,
                diseaseidentifiedError,
            });

        const updatedImages = images.map((img) => {
            const tree = trees.filter((t) => t.treeID === img.treeID)[0];
            const user = users.filter((u) => u.userID === img.userID)[0];
            const imgAnalysis = analysis.filter(
                (a) => a.imageID === img.imageID
            )[0];
            const anImg = analyzedimage.filter(
                (ai) => ai.analysisID === imgAnalysis.analysisID
            )[0];
            const di = diseaseidentified.filter(
                (d) => d.analysisID === imgAnalysis.analysisID
            );

            return {
                ...img,
                analyzedImage: anImg
                    ? convertBlobToBase64(anImg.imageData)
                    : "",
                userID: user ? user.userID : "",
                userName: user ? user.fName + " " + user.lName : "",
                treeID: tree.treeID,
                treeCode: tree.treeCode,
                imageData: img.imageData
                    ? convertBlobToBase64(img.imageData)
                    : "",
                diseases: di.map((d) => ({
                    diseaseName: d.diseaseName,
                    likelihoodScore: Number(d.likelihoodScore.toFixed(1)),
                })),
            };
        });

        return NextResponse.json({ success: true, data: updatedImages });
    } catch (error) {
        console.error("Error retrieving trees:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
