import { NextResponse } from 'next/server';
import { query } from '@/lib/db/db'; // Adjust the import based on your db helper
import { Analysis, Image, Tree } from '@/types/types';

export async function GET() {
    try {
        // Fetch tree, image, and analysis data
        const treeImageAnalysis = await query(
            `SELECT * 
             FROM tree t 
             INNER JOIN image i ON t.treeID = i.treeID 
             INNER JOIN analysis a ON i.imageID = a.imageID;`
        ) as (Tree & Image & Analysis)[];

        // Fetch diseases associated with each analysis and merge the data
        const treeImageAnalysisDisease = await Promise.all(
            treeImageAnalysis.map(async (analysis) => {
                const diseases = await query(
                    `SELECT di.analysisID, di.diseaseID, di.likelihoodScore, d.diseaseName, d.description
                     FROM diseaseidentified di
                     INNER JOIN disease d ON di.diseaseID = d.diseaseID
                     WHERE di.analysisID = ?`,
                    [analysis.analysisID]
                );

                return {
                    ...analysis,
                    diseases, // Attach disease details to the analysis
                };
            })
        );
        console.log(treeImageAnalysisDisease)
        return NextResponse.json(treeImageAnalysisDisease);
    } catch (error) {
        console.error('Error retrieving data:', error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}
