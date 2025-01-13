import { NextResponse } from 'next/server';
import { query } from '@/lib/db/db';
import { Tree, Disease } from '@/types/types';

export async function POST(req: Request) {
    try {
        const { userID, imageUrl, treeCode } = await req.json();

        // Fetch or insert tree entry
        let treeID;
        const tree = await query(
            `SELECT * FROM tree WHERE treeCode = ? LIMIT 1`,
            [treeCode]
        ) as Tree[];

        if (tree.length === 0) {
            const insertResult = await query(
                `INSERT INTO tree (userID, treeCode) VALUES (?, ?)`,
                [userID, treeCode]
            ) as { insertId: number };
            treeID = insertResult.insertId;
        } else {
            treeID = tree[0].treeID;
        }

        // predict image
        const analysisResult = await analyzeImage(imageUrl);
        if (!analysisResult || !analysisResult.predictions || !analysisResult.boundingBoxes || !analysisResult.originalImage) {
            return NextResponse.json(
                { error: 'Image analysis failed.' },
                { status: 500 }
            );
        }
        const {predictions, originalImage, analyzedImage, boundingBoxes,} = analysisResult;

        const diseases = await Promise.all(
            predictions.map(async (predict: { diseaseName: string; likelihoodScore: number }) => {
                const disease = await query(
                    `SELECT * FROM disease WHERE diseaseName = ? LIMIT 1`,
                    [predict.diseaseName]
                ) as Disease[];

                if (disease.length > 0) {
                    return {
                        ...disease[0],
                        likelihoodScore: predict.likelihoodScore,
                    };
                } else {
                    return {
                        diseaseName: predict.diseaseName,
                        likelihoodScore: predict.likelihoodScore,
                        description: 'Unknown disease',
                    };
                }
            })
        );

        const result = {
            tree: tree.length > 0 ? tree[0] : { treeID, treeCode, userID },
            originalImage: originalImage,
            analyzedImage,
            boundingBoxes,
            diseases,
        };

        return NextResponse.json({
            message: 'Scan completed successfully',
            result,
        });
    } catch (error) {
        console.error('Error in POST request:', error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}

async function analyzeImage(imageUrl: string) {
    try {
        //ML backend end point
        const response = await fetch('http://0.0.0.0:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageUrl }),
        });

        if (response.ok) {
            const predictionResult = await response.json();
            return {"predictions":predictionResult.predictions, 
                    "originalImage":predictionResult.originalImage, 
                    "analyzedImage":predictionResult.analyzedImage, 
                    "boundingBoxes":predictionResult.boundingBoxes         
                };
        } else {
            console.error('Error in prediction API:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error in analyzeImage function:', error);
        return null;
    }
}