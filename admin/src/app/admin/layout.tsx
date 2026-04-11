import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import Sidebar from '@/components/Sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/');

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Main content shifted right to clear the fixed sidebar */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">
              {profile?.email ?? user.email}
            </span>
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold text-white">
              {(profile?.full_name ?? profile?.email ?? 'A').slice(0, 1).toUpperCase()}
            </div>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
