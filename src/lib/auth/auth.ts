import { query } from "@/lib/db/db";

export async function emailExists(email: string): Promise<boolean> {
    const result = await query(
        "SELECT COUNT(*) as count FROM user WHERE email = ?",
        [email]
    ) as {count:number}[];
    return result[0].count > 0;
}