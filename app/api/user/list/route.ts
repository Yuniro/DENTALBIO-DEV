import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const { page, limit, filters } = await request.json();

  try {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'You should log in.' }, { status: 400 });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('email', user.email)
      .single();

    if (userError) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (userData.role !== 'admin') {
      return NextResponse.json({ error: 'You are not authorized to access this page' }, { status: 400 });
    }

    const { data, count } = await fetchTableData(page, limit, filters, supabase);

    return NextResponse.json({ data, count });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

const fetchTableData = async (
  page: number,
  limit: number,
  filters: Record<string, any>,
  supabase: SupabaseClient
) => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  let query = supabase.from('users').select('*', { count: 'exact' }).order('created_at', { ascending: true });

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      if (key === 'isVerified') {
        // Use eq for boolean fields
        query = query.eq(key, value === 'true' || value === true);
      } else if (key === 'subscription_status' && value === 'free') {
        // For free subscription, check for null or empty string values
        query = query.or('subscription_status.is.null,subscription_status.eq.');
      } else {
        // Use ilike for string fields
        query = query.ilike(key, `%${value}%`);
      }
    }
  });

  // Apply pagination
  const { data, count, error } = await query.range(start, end);

  if (error) throw error;
  return { data, count };
};