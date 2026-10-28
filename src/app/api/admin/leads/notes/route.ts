import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jwtVerify } from 'jose';

function extractAdminToken(req: Request): string | null {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match ? decodeURIComponent(match[1].trim()) : null;
}

export async function POST(req: Request) {
  try {
    // 1. Verify admin token
    const token = extractAdminToken(req);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_for_development_only');
    try {
      await jwtVerify(token, secret);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    const { error } = await supabase
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

