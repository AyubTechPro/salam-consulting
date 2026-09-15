import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jwtVerify } from 'jose';

export async function POST(req: Request) {
  try {
    // 1. Verify admin token
    const token = req.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret');
    await jwtVerify(token, secret);

    // 2. Parse request
    const { id, text } = await req.json();
    if (!id || !text) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    // 3. Fetch current notes
    const { data: lead, error: fetchError } = await supabase
      .from('leads')
      .select('notes')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching lead notes:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
    }

    const currentNotes = lead.notes || [];
    const newNote = {
      id: crypto.randomUUID(),
      text,
      created_at: new Date().toISOString()
    };

    // 4. Update Supabase
    const { data, error } = await supabase
      .from('leads')
      .update({ notes: [...currentNotes, newNote] })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, note: newNote });
  } catch (error) {
    console.error('Lead note add error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
