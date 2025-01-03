import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/userInfo';
import { getMaxRankFromGallery } from '@/utils/getMasOrder';
import { deleteFileFromSupabase } from '@/utils/removeFromBucket';

export async function GET(request: Request) {
  try {
    const supabase = createClient();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const providedUserId = searchParams.get('userId');

    // Get the logged-in user's data if no user ID is provided
    const userData = providedUserId ? null : await getUserInfo({ supabase });
    const userId = providedUserId || userData?.id;
    const enabledField = providedUserId ? [true] : [true, false];

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('galleries')
      .select('*')
      .eq('user_id', userId)
      .in('enabled', enabledField)
      .order('rank', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { title, before_image_url, after_image_url } = await request.json();

  try {
    const supabase = createClient();

    const userData = await getUserInfo({ supabase });

    if (!(userData.subscription_status === "pro"))
      return NextResponse.json({ error: "Please upgrade membership!" });

    const maxRank = await getMaxRankFromGallery({ supabase }) + 1;

    const { data, error } = await supabase
      .from('galleries')
      .insert([{ title, before_image_url, after_image_url, user_id: userData.id, rank: maxRank }])
      .select("*")
      .single();;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const updated_data = await request.json();

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('galleries')
      .update(updated_data)
      .eq('id', updated_data.id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    const supabase = createClient();

    const { data: blog, error: getError } = await supabase
      .from('galleries')
      .select('before_image_url, after_image_url')
      .eq('id', id)
      .single()

    if (blog) {
      await deleteFileFromSupabase({ supabase, bucketName: 'gallery-images', fileUrl: blog.before_image_url });
      await deleteFileFromSupabase({ supabase, bucketName: 'gallery-images', fileUrl: blog.after_image_url });
    }

    const { data, error } = await supabase
      .from('galleries')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
