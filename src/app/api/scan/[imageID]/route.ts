import { NextResponse } from 'next/server'
import { query } from '@/lib/db/db'
import { Analysis, Disease, diseaseIdentified, Image, Tree } from '@/type/types';


export async function GET(request: Request,{ params }: { params: Promise<{ imageID: string }> }) {
     const { imageID } = await params;

    try {
        const imageAnalysis = await query(`
            SELECT * FROM tree t 
            INNER JOIN image i ON t.treeID = i.treeID
            INNER JOIN analysis a ON i.imageID = a.imageID
            WHERE i.imageID = ?
        `,[imageID]) as (Tree & Image & Analysis)[];

        if (!imageAnalysis || imageAnalysis.length === 0) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 })
        }

        const diseases  = await query(`
                SELECT * FROM diseaseidentified di 
                INNER JOIN disease d ON di.diseaseID = d.diseaseID
                WHERE di.analysisID = ?`,[imageAnalysis[0].analysisID]) as (diseaseIdentified & Disease)[]

        const imageDetails = {
            ...imageAnalysis[0],
            diseases
        }
        console.log(imageDetails)  
        return NextResponse.json(imageDetails)

    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}