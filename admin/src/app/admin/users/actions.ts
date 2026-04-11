
'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase-server';

export async function blockUser(userId: string) {
  const supabase = createAdminClient();
  await supabase
    .from('profiles')
    .update({ blocked: true, updated_at: new Date().toISOString() })
    .eq('id', userId);
  revalidatePath('/admin/users');
}

export async function unblockUser(userId: string) {
  const supabase = createAdminClient();
  await supabase
    .from('profiles')
    .update({ blocked: false, updated_at: new Date().toISOString() })
    .eq('id', userId);
  revalidatePath('/admin/users');
}
