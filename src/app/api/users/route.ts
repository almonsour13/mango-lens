import { NextResponse } from 'next/server';
import { query } from '@/lib/db/db';
import { emailExists } from '../auth/signup/route';
import { hash } from 'bcrypt';

export async function GET(req: Request) {
  try {
    const users = await query('SELECT * FROM user') as any[];

    return NextResponse.json({ success: true, users:users });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
export async function POST(req:Request){
  try {
    const { fName, lName, email, password, role } = await req.json();

    const exists = await emailExists(email);
    
    if (exists) {
      return NextResponse.json({ error: 'Email already exists.' }, { status: 409 });
    }

    const hashedPassword = await hash(password, 10);
    const userRole = role === "Admin"? 1 : 2;

    const result = await query(
      'INSERT INTO user (fName, lName, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [fName, lName, email, hashedPassword, userRole]

    ) as any;

    return NextResponse.json({ success: true, message: 'User added successfully.' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    const { userID, fName, lName, role, status } = await req.json();

    const userExists = await query('SELECT * FROM user WHERE userID = ?', [userID]) as any[];

    if (userExists.length === 0) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    console.log(status)
    const userRole = role === "Admin" ? 1 : 2;

    const userStatus = status === "Active" ? 1 : 2;

    const result = await query(
      'UPDATE user SET fName = ?, lName = ?, role = ?, status = ? WHERE userID = ?',
      [fName, lName, userRole, userStatus, userID]
    ) as any;
    
    return NextResponse.json({ success: true, message: 'User updated successfully.' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

