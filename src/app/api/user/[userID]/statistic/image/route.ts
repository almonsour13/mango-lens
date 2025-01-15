import { query } from "@/lib/db/db";
import { NextResponse } from "next/server";

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

        // Query to count healthy and diseased images per month
        const data = (await query(
            `SELECT 
                YEAR(li.uploadedAt) AS year,
                MONTH(li.uploadedAt) AS month,
                COUNT(DISTINCT li.imageID) AS totalImages,
                COUNT(DISTINCT CASE WHEN di.diseaseID IS NULL THEN li.imageID END) AS healthyCount,
                COUNT(DISTINCT CASE WHEN di.likelihoodScore > 50 IS NOT NULL THEN li.imageID END) AS diseasedCount
            FROM 
                image li
            LEFT JOIN 
                analysis a ON li.imageID = a.imageID
            LEFT JOIN
                diseaseidentified di ON a.analysisID = di.analysisID
            WHERE 
                li.uploadedAt BETWEEN ? AND ?
            GROUP BY 
                YEAR(li.uploadedAt), MONTH(li.uploadedAt)
            ORDER BY 
                YEAR(li.uploadedAt), MONTH(li.uploadedAt);`,
            [from, to]
        )) as {
            year: number;
            month: number;
            healthyCount: number;
            diseasedCount: number;
        }[];

        // Generate full monthly range
        const generateMonthlyRange = (from: string, to: string) => {
            const startDate = new Date(from);
            const endDate = new Date(to);
            const months: {
                year: number;
                month: number;
                healthyCount: number;
                diseasedCount: number;
            }[] = [];

            while (startDate <= endDate) {
                months.push({
                    year: startDate.getFullYear(),
                    month: startDate.getMonth() + 1, // Months are 0-based in JS
                    healthyCount: 0,
                    diseasedCount: 0,
                });
                startDate.setMonth(startDate.getMonth() + 1);
            }

            return months;
        };

        const monthlyRange = generateMonthlyRange(from, to);
        const mergedData = monthlyRange.map((month) => {
            const match = data.find(
                (item) => item.year === month.year && item.month === month.month
            );
            return {
                year: month.year,
                month: month.month,
                healthyCount: match ? match.healthyCount : 0,
                diseasedCount: match ? match.diseasedCount : 0,
            };
        });
        return NextResponse.json({ success: true, chartData: mergedData });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
