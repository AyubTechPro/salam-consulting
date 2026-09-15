import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jwtVerify } from 'jose';

async function verifyAdmin(req: Request) {
  const token = req.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret');
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const { data, error } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ partners: data });
}

export async function POST(req: Request) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, logo_url, website_url } = body;
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const { data, error } = await supabase
      .from('partners')
      .insert([{ name, logo_url, website_url }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, partner: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const { error } = await supabase.from('partners').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
