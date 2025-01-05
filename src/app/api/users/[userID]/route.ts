import { NextResponse } from 'next/server'
import { query } from '@/lib/db/db'


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
export async function GET(request: Request, { params }: { params:Promise< { userID: string }> }) {
    const { userID } = await params;
    console.log(userID)
    try {
        const userDetails = await query('SELECT userID, fName, lName, email, role, status, createdAt FROM user WHERE userID = ?', [userID]) as User[]
    
        if (userDetails.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        userDetails[0].status = userDetails[0].status === '1' ? 'Admin' : 'User';
        userDetails[0].role = userDetails[0].role === '1' ? 'Active' : 'Inactive';

        const images = await query('SELECT imageID, imageData, status, uploadedAt FROM image i WHERE i.userID = ?', [userID]) as Image[]

        const logs = await query('SELECT * FROM log l WHERE l.userID = ?', [userID]) as Log[]
        
        const userData = {
            details:userDetails[0],
            images,
            logs
        }

        return NextResponse.json(userData)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}