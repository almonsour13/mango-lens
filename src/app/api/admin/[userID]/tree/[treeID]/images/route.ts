import { NextResponse } from "next/server";
import { supabase } from "@/supabase/supabase";
import { convertBlobToBase64 } from "@/utils/image-utils";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: number; treeID: string }> }
) {
    try {
        const { userID, treeID } = await params;
        const { data: images, error: imageError } = await supabase
            .from("image")
            .select("*")
            .eq("treeID", treeID)
            .order("uploadedAt", { ascending: false });

        if (imageError)
            return NextResponse.json({ success: false, imageError });
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
                imageData: img.imageData
                    ? convertBlobToBase64(img.imageData)
                    : "",
                diseases: di.map((d) => ({
                    diseaseName: d.diseaseName,
                    likelihoodScore: Number(d.likelihoodScore.toFixed(1)),
                })),
            };
        });
        return NextResponse.json({ success: false, data:updatedImages });
    } catch (error) {
        console.error("Error retrieving trees:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
