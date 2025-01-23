import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/userInfo';
import { getMaxRank } from '@/utils/getMaxOrder';
import { deleteFileFromSupabase } from '@/utils/removeFromBucket';

export async function GET(request: Request) {
  try {
    const supabase = createClient();

    // Parse query parameters
    const { searchParams } = new URL(request.url);

    const providedUserId = searchParams.get('userId');
    const isAdmin = searchParams.get('isAdmin');

    // Get the logged-in user's data if no user ID is provided
    const userData = providedUserId ? null : await getUserInfo({ supabase });
    const userId = providedUserId || userData?.id;
    const enabledField = (providedUserId && !isAdmin) ? [true] : [true, false];

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

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { title, before_image_url, after_image_url, before_image_label, after_image_label, targetUserId } = await request.json();

  try {
    const supabase = createClient();

    const userData = await getUserInfo({ supabase });

    if (!((userData.subscription_status === "PRO") || (userData.subscription_status === "PREMIUM PRO") || (new Date(userData.trial_end) > new Date())))
      return NextResponse.json({ error: "Please upgrade membership!" });

    if (targetUserId && userData.role !== "admin")
      return NextResponse.json({ error: "Not authorized" });

    const maxRank = await getMaxRank({ supabase, table: "blog-groups", field: "user_id", value: targetUserId || userData.id }) + 1;

    const { data, error } = await supabase
      .from('galleries')
      .insert([{ title, before_image_url, after_image_url, user_id: targetUserId || userData.id, rank: maxRank, before_image_label, after_image_label }])
      .select("*")
      .single();

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

    // Delete original images if new images uploaded

    const { data: gallery, error: readError } = await supabase
      .from('galleries')
      .select('*')
      .eq('id', updated_data.id)
      .single();

    if (updated_data.before_image_url !== gallery.before_image_url) {
      await deleteFileFromSupabase({ supabase, bucketName: 'gallery-images', fileUrl: gallery.before_image_url });
    }
    if (updated_data.after_image_url !== gallery.after_image_url) {
      await deleteFileFromSupabase({ supabase, bucketName: 'gallery-images', fileUrl: gallery.after_image_url });
    }

    // Update gallery

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

    const { data: gallery, error: getError } = await supabase
      .from('galleries')
      .select('before_image_url, after_image_url')
      .eq('id', id)
      .single()

    // Delete images from bucket

    if (gallery) {
      await deleteFileFromSupabase({ supabase, bucketName: 'gallery-images', fileUrl: gallery.before_image_url });
      await deleteFileFromSupabase({ supabase, bucketName: 'gallery-images', fileUrl: gallery.after_image_url });
    }

    // Delete data from table

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
