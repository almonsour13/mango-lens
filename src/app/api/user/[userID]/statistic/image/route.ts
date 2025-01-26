import { supabase } from '@/supabase/supabase';
import { cookies } from 'next/headers';
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: string }> }
) {
    const { userID } = await params;

    try {
        const url = new URL(req.url);
        const from = url.searchParams.get("from");
        const to = url.searchParams.get("to");
        if (!from || !to) {
            return NextResponse.json(
                { error: "'from' and 'to' query parameters are required." },
                { status: 400 }
            );
        }
        
        console.log(from)
        console.log(to)

        // Supabase query
        const { data, error } = await supabase.rpc('get_user_date_range_image_stats', {
            filter_start_date: from,
            filter_end_date: to,
            filter_user_id: userID
          });
          console.log(data)
        const monthlyData = data.reduce((acc: any, item: any) => {
            const date = new Date(item.uploadedAt);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const key = `${year}-${month}`;

            if (!acc[key]) {
                acc[key] = {
                    year,
                    month,
                    healthyCount: 0,
                    diseasedCount: 0
                };
            }

            // Check if image is diseased (has analysis with likelihood > 50)
            const isDiseased = item.analysis?.some((a: any) => 
                a.diseaseidentified?.some((d: any) => d.likelihoodScore > 50)
            );

            if (isDiseased) {
                acc[key].diseasedCount++;
            } else {
                acc[key].healthyCount++;
            }

            return acc;
        }, {});

        // Generate full monthly range
        const generateMonthlyRange = (from: string, to: string) => {
            const startDate = new Date(from);
            const endDate = new Date(to);
            const months = [];

            while (startDate <= endDate) {
                months.push({
                    year: startDate.getFullYear(),
                    month: startDate.getMonth() + 1,
                    healthyCount: 0,
                    diseasedCount: 0,
                });
                startDate.setMonth(startDate.getMonth() + 1);
            }

            return months;
        };

        const monthlyRange = generateMonthlyRange(from, to);
        const mergedData = monthlyRange.map(month => {
            const key = `${month.year}-${month.month}`;
            return {
                ...month,
                ...(monthlyData[key] || {
                    healthyCount: 0,
                    diseasedCount: 0
                })
            };
        });

        return NextResponse.json({ success: true, chartData: mergedData });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
