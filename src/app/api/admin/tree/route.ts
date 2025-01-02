import { NextResponse } from 'next/server';
import { query } from '@/lib/db/db'; // Adjust the import based on your db helper
import { Tree } from '@/type/types';


export async function GET(req:Request) {
    try {
        
        const trees = await query(`
            SELECT * addedAt FROM tree
        `) as Tree[];

        return NextResponse.json(trees);
    } catch (error) {
        console.error('Error retrieving trees:', error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}
