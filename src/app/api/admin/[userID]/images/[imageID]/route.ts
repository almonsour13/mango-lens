import { supabase } from "@/supabase/supabase";
import { convertBlobToBase64 } from "@/utils/image-utils";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { userID: string; imageID: string } }
) {

    const { userID, imageID } = await params;
    try {
        if (!userID || !imageID) {
            return NextResponse.json(
                { success: false, error: "Missing userID or feedbackID" },
                { status: 400 }
            );
        }
        const { data:image, error:ImageError } = await supabase
            .from("image")
            .select()
            .eq("imageID",imageID)
        if (ImageError) return NextResponse.json({ success: false, error:ImageError }), console.log("image:", ImageError);

        const { data:tree, error:treeError } = await supabase
            .from("tree")
            .select()
            .eq("treeID",image[0].treeID)
        if (treeError) return NextResponse.json({ success: false, error:treeError }), console.log("tree:", treeError);
        
        const { data:analysis, error:analysisError } = await supabase
            .from("analysis")
            .select()
            .eq("imageID",image[0].imageID)
            .single();
        if (analysisError) return NextResponse.json({ success: false, error:analysisError }), console.log("analysis:", analysisError);

        const { data:analyzedimage, error:analyzedimageError } = await supabase
            .from("analyzedimage")
            .select("imageData")
            .eq("analysisID",analysis.analysisID)
        if (analyzedimageError) return NextResponse.json({ success: false, error:analyzedimageError }), console.log("analyzedimage:", analyzedimageError);
        
        const { data:diseaseidentified, error:diseaseidentifiedError } = await supabase
            .from("diseaseidentified")
            .select()
            .eq("analysisID",analysis.analysisID)

        if (diseaseidentifiedError) return NextResponse.json({ success: false, error:diseaseidentifiedError }), console.log("diseaseidentified:", diseaseidentifiedError);
        const updatedData = {
            ...tree[0],
            ...image[0],
            ...tree,
            ...analysis,
            imageData:convertBlobToBase64(image[0].imageData),
            analyzedImage:convertBlobToBase64(analyzedimage[0].imageData),
            diseases:diseaseidentified

        }
        return NextResponse.json({ success: true, data:  updatedData});

    } catch (error) {
        console.error("Error adding feedback response:", error);
        return NextResponse.json(
            { success: false, error: "Something went wrong." },
            { status: 500 }
        );
    }
}