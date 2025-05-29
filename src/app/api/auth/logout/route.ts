import { JWTPayload, jwtVerify, JWTVerifyResult } from 'jose';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get('token')?.value;
    console.log(token)
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT secret key is not set.');
    }

    if (!token) {
      return NextResponse.json({ error: 'No token found. Please log in.' }, { status: 400 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

    // Type-safe payload
    const { payload }: JWTVerifyResult<JWTPayload> = await jwtVerify(token, secret);
    const userID = payload?.userID;
    console.log(userID)

    const activity = `just logged out`;

    // Insert log
    // await insertLog(userID, 2, activity);

    // Delete token cookie by setting an expired date
    const cookie = (await cookies());
    cookie.delete('token');

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
