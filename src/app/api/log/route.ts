import { NextResponse } from 'next/server';
import { query } from '@/lib/db/db';

const stringType: Record<number, string> = {
    1: "login",
    2: "logout",
    3: "signup",
    4: "password_reset",
};

interface User{
    userID: number
    fName: string
    lName: string
    email: string
    role: string
    status: string
    createdAt: string 
}
interface Image{
    imageID: number
    imageData: string
    status: string
    uploadedAt: string
}
interface Log{
    logID: number;
    userID: number;
    activity: string;
    type: number;
    status: number;
    createdAt: Date;
}
const activityToType: Record<string, number> = Object.entries(stringType).reduce((acc, [key, value]) => {
    acc[value.toLowerCase()] = Number(key);
    return acc;
}, {} as Record<string, number>);

export async function GET() {
    try {
        const logs = await query(`
            SELECT * FROM log
        `) as Log[];

        const logsWithStringActivity = logs.map(log => ({
            ...log,
            type: stringType[log.type] || 'Unknown',
        }));
        return NextResponse.json(logsWithStringActivity);
    } catch (error) {
        console.error('Error retrieving logs:', error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}
export async function DELETE(request: Request) {
    const { logID } = await request.json();  // Assuming the logID is passed in the request body
    console.log(logID)
    if (!logID) {   
        return NextResponse.json({ error: 'logID is required' }, { status: 400 });
    }

    try {
        const result = await query('DELETE FROM log WHERE logID = ?', [logID]);

        return NextResponse.json({success: true, message: 'Log deleted successfully' });
    } catch (error) {
        console.error('Error deleting log:', error);
        return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}

export async function insertLog(userID:number, type:number, activity:string) {
    try {

        if (typeof userID !== 'number' || (typeof type !== 'number' && typeof type !== 'string')) {
            return NextResponse.json({ success: false, error: 'Invalid input.' }, { status: 400 });
        }

        if (!activity) {
            return NextResponse.json({ success: false, error: 'Invalid activity type.' }, { status: 400 });
        }

        const result = await query(
            'INSERT INTO log (userID, type, activity) VALUES (?, ?, ?)',
            [userID, type, activity]
        );

        return NextResponse.json({ success: true, message: 'Log entry added successfully.', result });
    } catch (error) {
        console.error('Error inserting log entry:', error);
        return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 });
    }
}
export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { userID, type, activity } = body;

        if (typeof userID !== 'number' || (typeof type !== 'number' && typeof type !== 'string')) {
            return NextResponse.json({ success: false, error: 'Invalid input.' }, { status: 400 });
        }

        if (typeof type === 'string') {
            const numericType = activityToType[type.toLowerCase()];
            if (numericType === undefined) {
                return NextResponse.json({ success: false, error: 'Invalid activity type.' }, { status: 400 });
            }
            type = numericType;
        }

        if (!activity) {
            return NextResponse.json({ success: false, error: 'Invalid activity type.' }, { status: 400 });
        }

        const result = await query(
            'INSERT INTO log (userID, type, activity) VALUES (?, ?, ?)',
            [userID, type, activity]
        );

        return NextResponse.json({ success: true, message: 'Log entry added successfully.', result });
    } catch (error) {
        console.error('Error inserting log entry:', error);
        return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 });
    }
}