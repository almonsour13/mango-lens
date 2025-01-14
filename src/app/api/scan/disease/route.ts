import { NextResponse } from "next/server";
import { query } from "@/lib/db/db";
import { convertImageToBlob } from "@/utils/image-utils";
import { BoundingBox, Disease } from "@/types/types";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { predictions } = body;

        try {
            const diseases = await Promise.all(
                predictions.map(
                    async (predict: {
                        diseaseName: string;
                        likelihoodScore: number;
                    }) => {
                        const disease = (await query(
                            `SELECT * FROM disease WHERE diseaseName = ? LIMIT 1`,
                            [predict.diseaseName]
                        )) as Disease[];

                        return disease.length > 0
                            ? {
                                  ...disease[0],
                                  likelihoodScore: predict.likelihoodScore,
                              }
                            : {
                                  diseaseName: predict.diseaseName,
                                  likelihoodScore: predict.likelihoodScore,
                                  description: "Unknown disease",
                              };
                    }
                )
            );

            return NextResponse.json({
                diseases,
            });
        } catch (diseaseError) {
            console.error("Error fetching disease information:", diseaseError);
            return NextResponse.json(
                { error: "Error fetching disease information." },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error in saveScan POST request:", error);
        return NextResponse.json(
            { error: "Something went wrong while saving." },
            { status: 500 }
        );
    }
}
