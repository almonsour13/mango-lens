import { supabase } from "@/supabase/supabase";

export async function emailExists(email: string): Promise<boolean> {
    const { data, error } = await supabase
        .from("user")
        .select("email", { count: "exact" })
        .eq("email", email);

    if (error) {
        console.error("Error checking email existence:", error);
        throw new Error("Failed to check email existence.");
    }

    // Check if the count of rows matching the email is greater than 0
    return (data?.length || 0) > 0;
}
