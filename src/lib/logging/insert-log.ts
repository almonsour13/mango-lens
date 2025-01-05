import { query } from "@/lib/db/db";

export async function insertLog(
    userID: number,
    type: number | string,
    activity: string
): Promise<{ success: boolean; message?: string; error?: string; result?: any }> {
    try {
        if (typeof userID !== "number") {
            return { success: false, error: "Invalid userID. Must be a number." };
        }

        if (typeof type !== "number" && typeof type !== "string") {
            return { success: false, error: "Invalid type. Must be a number or string." };
        }

        if (!activity || typeof activity !== "string") {
            return { success: false, error: "Invalid activity. Must be a non-empty string." };
        }

        const result = await query(
            "INSERT INTO log (userID, type, activity) VALUES (?, ?, ?)",
            [userID, type, activity]
        );

        return {
            success: true,
            message: "Log entry added successfully.",
            result,
        };
    } catch (error) {
        console.error("Error inserting log entry:", error);
        return { success: false, error: "Something went wrong while inserting the log entry." };
    }
}