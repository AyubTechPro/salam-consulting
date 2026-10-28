import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jwtVerify } from 'jose';

// Valid statuses in the CRM
const VALID_STATUSES = ['new', 'contacted', 'meeting', 'contract', 'mou', 'enrolled', 'rejected'];

function extractAdminToken(req: Request): string | null {
  const cookieHeader = req.headers.get('cookie');
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/);
  return match ? decodeURIComponent(match[1].trim()) : null;
}

export async function PATCH(req: Request) {
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
    const body = await req.json();
    const { id, status, name } = body;
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const updates: { status?: string; name?: string } = {};
    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
      }
      updates.status = status;
    }
    if (name) {
      updates.name = name;
    }

    // 3. Update Supabase
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: data });
  } catch (error) {
    console.error('Lead update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

