import { NextResponse } from "next/server";
import { query } from "@/lib/db/db";
import { Tree, Disease } from "@/types/types";

const ML_API_TIMEOUT = 25000; // 25 seconds timeout for ML API

export async function POST(req: Request) {
    try {
        const { userID, imageUrl, treeCode } = await req.json();

        if (!userID || !imageUrl || !treeCode) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        const analysisResult = await analyzeImage(imageUrl);

        if (!analysisResult) {
            return NextResponse.json(
                { error: "Image analysis failed or timed out." },
                { status: 504 }
            );
        }

        if (
            !analysisResult.predictions ||
            !analysisResult.boundingBoxes ||
            !analysisResult.originalImage
        ) {
            return NextResponse.json(
                { error: "Incomplete analysis result." },
                { status: 500 }
            );
        }

        // Fetch or insert tree entry
        let treeID;
        try {
            const tree = (await query(
                `SELECT * FROM tree WHERE treeCode = ? LIMIT 1`,
                [treeCode]
            )) as Tree[];

            if (tree.length === 0) {
                const insertResult = (await query(
                    `INSERT INTO tree (userID, treeCode) VALUES (?, ?)`,
                    [userID, treeCode]
                )) as { insertId: number };
                treeID = insertResult.insertId;
            } else {
                treeID = tree[0].treeID;
            }
        } catch (dbError) {
            console.error("Database error:", dbError);
            return NextResponse.json(
                { error: "Database operation failed." },
                { status: 500 }
            );
        }

        // Analyze image with timeout

        const { predictions, originalImage, analyzedImage, boundingBoxes } =
            analysisResult;

        // Fetch disease information
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

            const result = {
                tree: { treeID, treeCode, userID },
                originalImage,
                analyzedImage,
                boundingBoxes,
                diseases,
            };

            return NextResponse.json({
                message: "Scan completed successfully",
                result,
            });
        } catch (diseaseError) {
            console.error("Error fetching disease information:", diseaseError);
            return NextResponse.json(
                { error: "Error fetching disease information." },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error in POST request:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Something went wrong.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

async function analyzeImage(imageUrl: string) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ML_API_TIMEOUT);

    try {
        const response = await fetch(
            "https://pcjkn8p3-5000.asse.devtunnels.ms/predict",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: imageUrl }),
                signal: controller.signal,
            }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error(
                "Error in prediction API:",
                response.status,
                response.statusText
            );
            return null;
        }

        const predictionResult = await response.json();

        return {
            predictions: predictionResult.predictions,
            originalImage: predictionResult.originalImage,
            analyzedImage: predictionResult.analyzedImage,
            boundingBoxes: predictionResult.boundingBoxes,
        };
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error && error.name === "AbortError") {
            console.error("ML API request timed out");
            return null;
        }

        console.error("Error in analyzeImage function:", error);
        return null;
    }
}
