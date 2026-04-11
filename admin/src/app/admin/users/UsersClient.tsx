
'use client';

import { useState, useTransition } from 'react';
import { blockUser, unblockUser } from './actions';

type User = {
  id: string;
  email: string;
  full_name: string | null;
  subscription_status: string;
  blocked: boolean;
  created_at: string;
  has_used_trial: boolean;
  role: string;
};

const STATUS_BADGE: Record<string, string> = {
  premium: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  trial:   'bg-blue-500/15 text-blue-400 border-blue-500/20',
  free:    'bg-gray-700/50 text-gray-400 border-gray-700',
  expired: 'bg-red-500/15 text-red-400 border-red-500/20',
};

export default function UsersClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = q === '' ||
      u.email.toLowerCase().includes(q) ||
      (u.full_name ?? '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || u.subscription_status === statusFilter ||
      (statusFilter === 'blocked' && u.blocked);
    return matchSearch && matchStatus;
  });

  function toggleBlock(user: User) {
    setPendingId(user.id);
    startTransition(async () => {
      if (user.blocked) {
        await unblockUser(user.id);
      } else {
        await blockUser(user.id);
      }
      setUsers(prev =>
        prev.map(u => u.id === user.id ? { ...u, blocked: !u.blocked } : u),
      );
      setPendingId(null);
    });
  }

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="input pl-9"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input w-full sm:w-44"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All status</option>
          <option value="premium">Premium</option>
          <option value="trial">Trial</option>
          <option value="free">Free</option>
          <option value="expired">Expired</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Trial Used</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                  No users match your filters.
                </td>
              </tr>
            )}
            {filtered.map(user => {
              const initials = (user.full_name ?? user.email ?? 'U')
                .split(' ').map((w: string) => w[0] ?? '').join('').toUpperCase().slice(0, 2);
              const joined = new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

              return (
                <tr key={user.id} className={`table-row-hover ${user.blocked ? 'opacity-60' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400 flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-200 font-medium truncate">{user.full_name ?? '—'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        {user.role === 'admin' && (
                          <span className="badge bg-brand-500/15 text-brand-400 border border-brand-500/20 mt-0.5">admin</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`badge border ${STATUS_BADGE[user.subscription_status] ?? STATUS_BADGE.free} capitalize`}>
                        {user.subscription_status}
                      </span>
                      {user.blocked && (
                        <span className="badge bg-red-500/15 text-red-400 border border-red-500/20">Blocked</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className={`text-xs font-medium ${user.has_used_trial ? 'text-gray-400' : 'text-emerald-400'}`}>
                      {user.has_used_trial ? 'Used' : 'Available'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs hidden lg:table-cell">{joined}</td>
                  <td className="px-5 py-3.5 text-right">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => toggleBlock(user)}
                        disabled={isPending && pendingId === user.id}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border
                          ${user.blocked
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20'
                          } disabled:opacity-50`}
                      >
                        {isPending && pendingId === user.id ? '…' : user.blocked ? 'Unblock' : 'Block'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-800 text-xs text-gray-500">
          Showing {filtered.length} of {users.length} users
        </div>
      )}
    </div>
  );
}
