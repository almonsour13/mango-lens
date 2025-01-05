import { query } from '@/lib/db/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: Promise<{ userID: string; trashID: string }> }) {
    try {
        // Await the params to resolve the promise
        const { userID, trashID } = await params;

        if (!userID || !trashID) {
            return NextResponse.json({ error: 'Missing userID or trashID' }, { status: 400 });
        }

        const { action } = await req.json();

        const items = await query(
            'SELECT itemID, type FROM trash WHERE trashID = ?',
            [trashID]
        ) as { itemID: number; type: number }[];

        if (items.length === 0) {
            return NextResponse.json({ error: 'Trash item not found' }, { status: 404 });
        }

        const item = items[0];
        const status = action === 1 ? 1 : 4;

        const updateQuery = item.type === 1
            ? 'UPDATE tree SET status = ?, userID = ? WHERE treeID = ?'
            : 'UPDATE image SET status = ?, userID = ? WHERE imageID = ?';

        await query(updateQuery, [status, userID, item.itemID]);
        
        await query('DELETE FROM trash WHERE trashID = ?', [trashID]);

        return NextResponse.json({ success: true, message: "Trash Restored" });
    } catch (error) {
        console.error('Error in trash restore API:', error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}
