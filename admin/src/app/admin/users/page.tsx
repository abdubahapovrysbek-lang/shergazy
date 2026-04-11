
export const dynamic = 'force-dynamic';

import { createAdminClient } from '@/lib/supabase-server';
import UsersClient from './UsersClient';

export default async function UsersPage() {
  const supabase = createAdminClient();
  const { data: users } = await supabase
    .from('profiles')
    .select('id, email, full_name, subscription_status, blocked, created_at, has_used_trial, role')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {users?.length ?? 0} registered account{users?.length !== 1 ? 's' : ''}
        </p>
      </div>
      <UsersClient initialUsers={users ?? []} />
    </div>
  );
}
