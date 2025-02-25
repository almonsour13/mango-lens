import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/supabase/supabase";
import { convertBlobToBase64 } from "@/utils/image-utils";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: string; uID: string }> }
) {
    try {
        const { userID, uID } = await params;
        const { data: trees, error: treeError } = await supabase
            .from("tree")
            .select("*")
            .eq("userID",uID);

        if (treeError) return NextResponse.json({ success: false, treeError });
        
        const { data: imagesCount, error: imageError } = await supabase
            .from("image")
            .select("treeID, count:treeID", { count: "exact" });

        if (imageError)
            return NextResponse.json({ success: false, imageError });

        const finalTrees = trees.map((t) => {
            return {
                ...t,
                imagesLength:
                    imagesCount.filter((imag) => imag.treeID === t.treeID)
                        .length || 0,
            };
        });

        return NextResponse.json({ success: true, data: finalTrees });
    } catch (error) {}
}
