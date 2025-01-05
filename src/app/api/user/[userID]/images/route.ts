import { NextResponse } from 'next/server';
import { query } from '@/lib/db/db'; 
import { Image } from '@/type/types';
import { convertBlobToBase64 } from '@/utils/image-utils';


export async function GET(request: Request, { params }: { params: { userID:number } }) {
    const { userID } = await params;
    
    try {  
        const img = await query(`SELECT * FROM Image i 
            INNER JOIN tree t ON i.treeID = t.treeID
            AND t.userID = ? AND t.status = 1 AND i.status = 1 
            ORDER BY i.uploadedAt DESC`,[userID]) as (Image & {treeCode:number})[];

        const images = await Promise.all(
            img.map( async (image) => {
                const diseases  = await query(`
                    SELECT likelihoodScore, diseaseName FROM analysis a 
                    INNER JOIN diseaseidentified di ON a.analysisID = di.analysisID
                    INNER JOIN disease d ON di.diseaseID = d.diseaseID
                    WHERE a.imageID = ?`,[image.imageID]) as {likelihoodScore:number, diseaseName:string}[];

                const analyzedImage = await query(`SELECT ai.analyzedImageID, ai.imageData FROM image i 
                                                    INNER JOIN analysis a ON i.imageID = a.imageID
                                                    INNER JOIN analyzedImage ai ON a.analysisID = ai.analysisID
                                                    WHERE i.imageID = ?`,[image.imageID]) as {analyzedImageID:number, imageData:string}[]
                return {
                    ...image,
                    imageData:convertBlobToBase64(image.imageData),
                    analyzedImage: convertBlobToBase64(analyzedImage[0].imageData),
                    diseases:diseases
                }
            })
        );
        
        return NextResponse.json({success:true, images});
    } catch (error) {
        console.error('Error retrieving trees:', error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}
