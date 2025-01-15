import { query } from "@/lib/db/db";
import { NextResponse } from "next/server";

function generateMonthlyRange(from: string, to: string) {
    const startDate = new Date(from);
    const endDate = new Date(to);
    const months: { year: number; month: number; treeCount: number }[] = [];

    // Loop through each month in the range
    while (startDate <= endDate) {
        months.push({
            year: startDate.getFullYear(),
            month: startDate.getMonth() + 1, // Months are 0-based in JS
            treeCount: 0,
        });
        startDate.setMonth(startDate.getMonth() + 1); // Increment month
    }

    return months;
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: string }> }
) {
    const { userID } = await params;
    try {
        // Extract query parameters from the URL
        const url = new URL(req.url);
        const from = url.searchParams.get("from");
        const to = url.searchParams.get("to");

        // Ensure both 'from' and 'to' are provided
        if (!from || !to) {
            return NextResponse.json(
                { error: "'from' and 'to' query parameters are required." },
                { status: 400 }
            );
        }

        // Query the database for tree counts
        const data = await query(
            `SELECT 
                YEAR(t.addedAt) AS year,
                MONTH(t.addedAt) AS month,
                COUNT(*) AS treeCount
            FROM 
                tree t
            WHERE 
                t.addedAt BETWEEN ? AND ?
            GROUP BY 
                YEAR(t.addedAt), MONTH(t.addedAt)
            ORDER BY 
                YEAR(t.addedAt), MONTH(t.addedAt);`,
            [from, to]
        ) as { year: number; month: number; treeCount: number }[];

        // Generate the full monthly range
        const monthlyRange = generateMonthlyRange(from, to);

        // Merge the query results with the monthly range
        const mergedData = monthlyRange.map((month) => {
            const match = data.find(
                (item) => item.year === month.year && item.month === month.month
            );
            return {
                year: month.year,
                month: month.month,
                treeCount: match ? match.treeCount : 0, // Use query result or default to 0
            };
        });

        // Return the merged data
        return NextResponse.json({ success: true, chartData: mergedData });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
