import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'default_secret_for_development_only'
    );
    
    const alg = 'HS256';
    
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    const response = NextResponse.json({ success: true });
    
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
