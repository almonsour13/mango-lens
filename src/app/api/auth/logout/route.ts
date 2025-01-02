import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { insertLog } from '../../log/route';
import { jwtVerify } from 'jose';

export async function POST(request: NextRequest) {
  try {
    
    const token =  (await cookies()).get('token')?.value;

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT secret key is not set.');
    }

    if (token) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

      const { payload }: any = await jwtVerify(token, secret);

      const userID = payload?.userID;
      const fName = payload?.fName;
      const lName = payload?.lName;

      if (!userID || isNaN(userID)) {
        throw new Error('Invalid user ID in token payload');
      }

      const activity = `${fName} ${lName} logged out`;
      await insertLog(userID, 2, activity);

      (await cookies()).delete('token');
      
    }

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
