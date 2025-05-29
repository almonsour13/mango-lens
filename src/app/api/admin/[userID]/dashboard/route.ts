import { supabase } from "@/supabase/supabase";
import { Disease } from "@/types/types";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: number }> }
) {
    
}