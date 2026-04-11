
export const dynamic = 'force-dynamic';

import { createAdminClient } from '@/lib/supabase-server';
import StatsCard from '@/components/StatsCard';

async function getStats() {
  const supabase = createAdminClient();

  const [
    { count: totalUsers },
    { count: premiumUsers },
    { count: trialUsers },
    { count: freeUsers },
    { data: recentUsers },
    { count: totalQuizSets },
    { count: totalFlashcardSets },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'premium'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'trial'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'free'),
    supabase.from('profiles').select('id, email, full_name, subscription_status, blocked, created_at')
      .order('created_at', { ascending: false }).limit(6),
    supabase.from('quiz_sets').select('*', { count: 'exact', head: true }),
    supabase.from('flashcard_sets').select('*', { count: 'exact', head: true }),
  ]);

  const mrr = ((premiumUsers ?? 0) * 0.99).toFixed(2);

  return {
    totalUsers: totalUsers ?? 0,
    premiumUsers: premiumUsers ?? 0,
    trialUsers: trialUsers ?? 0,
    freeUsers: freeUsers ?? 0,
    mrr,
    recentUsers: recentUsers ?? [],
    totalQuizSets: totalQuizSets ?? 0,
    totalFlashcardSets: totalFlashcardSets ?? 0,
  };
}

const STATUS_BADGE: Record<string, string> = {
  premium: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  trial:   'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  free:    'bg-gray-700/50 text-gray-400 border border-gray-700',
  expired: 'bg-red-500/15 text-red-400 border border-red-500/20',
};

export default async function AdminDashboard() {
  const stats = await getStats();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Subscription breakdown percentages
  const total = stats.totalUsers || 1;
  const premiumPct = Math.round((stats.premiumUsers / total) * 100);
  const trialPct   = Math.round((stats.trialUsers / total) * 100);
  const freePct    = 100 - premiumPct - trialPct;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">{today}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          subtitle="Registered accounts"
          accent="violet"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          }
        />
        <StatsCard
          title="Active Subscribers"
          value={stats.premiumUsers.toLocaleString()}
          subtitle="Premium plan"
          accent="emerald"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          }
        />
        <StatsCard
          title="Trial Users"
          value={stats.trialUsers.toLocaleString()}
          subtitle="7-day free trial"
          accent="blue"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          }
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${stats.mrr}`}
          subtitle="MRR at $0.99/user"
          accent="amber"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Subscription breakdown */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-5">
            Subscription Breakdown
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Premium', count: stats.premiumUsers, pct: premiumPct, color: 'bg-amber-500' },
              { label: 'Trial',   count: stats.trialUsers,   pct: trialPct,   color: 'bg-blue-500' },
              { label: 'Free',    count: stats.freeUsers,    pct: freePct,    color: 'bg-gray-600' },
            ].map(row => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-300 font-medium">{row.label}</span>
                  <span className="text-gray-500">{row.count} users · {row.pct}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${row.color} rounded-full transition-all duration-700`}
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-800 grid grid-cols-2 gap-3">
            <div className="bg-gray-800/60 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Quiz Sets</p>
              <p className="text-xl font-bold text-white">{stats.totalQuizSets}</p>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Flashcard Sets</p>
              <p className="text-xl font-bold text-white">{stats.totalFlashcardSets}</p>
            </div>
          </div>
        </div>

        {/* Recent sign-ups */}
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Recent Sign-ups
            </h2>
            <a href="/admin/users" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
              View all →
            </a>
          </div>
          <div className="space-y-1">
            {stats.recentUsers.length === 0 && (
              <p className="text-gray-500 text-sm py-4 text-center">No users yet.</p>
            )}
            {stats.recentUsers.map((u: any) => {
              const initials = (u.full_name ?? u.email ?? 'U')
                .split(' ').map((w: string) => w[0] ?? '').join('').toUpperCase().slice(0, 2);
              const joined = new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <div key={u.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg table-row-hover">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400 flex-shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 font-medium truncate">{u.full_name ?? '—'}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                  <span className={`badge ${STATUS_BADGE[u.subscription_status] ?? STATUS_BADGE.free} capitalize`}>
                    {u.subscription_status}
                  </span>
                  {u.blocked && (
                    <span className="badge bg-red-500/15 text-red-400 border border-red-500/20">Blocked</span>
                  )}
                  <span className="text-xs text-gray-600 flex-shrink-0">{joined}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
