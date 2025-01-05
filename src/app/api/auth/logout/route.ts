import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { insertLog } from '../../log/route';
import { JWTPayload, jwtVerify, JWTVerifyResult } from 'jose';

export async function POST(req: NextRequest) {
  try {
    console.log(req)
    const token = (await cookies()).get('token')?.value;

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT secret key is not set.');
    }

    if (!token) {
      return NextResponse.json({ error: 'No token found. Please log in.' }, { status: 400 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

    // Type-safe payload
    const { payload }: JWTVerifyResult<JWTPayload> = await jwtVerify(token, secret);
    const userID: number = payload?.userID as number;
    const fName = payload?.fName;
    const lName = payload?.lName;

    if (!userID || isNaN(userID)) {
      throw new Error('Invalid user ID in token payload');
    }

    const activity = `${fName} ${lName} logged out`;

    // Insert log
    await insertLog(userID, 2, activity);

    // Delete token cookie by setting an expired date
    const cookie = (await cookies());
    cookie.delete('token');

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
