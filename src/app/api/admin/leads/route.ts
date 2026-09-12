import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jwtVerify } from 'jose';

export async function PATCH(req: Request) {
  try {
    // 1. Verify admin token
    const token = req.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret');
    await jwtVerify(token, secret);

    // 2. Parse request
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    // 3. Update Supabase
    const { data, error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Lead update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
