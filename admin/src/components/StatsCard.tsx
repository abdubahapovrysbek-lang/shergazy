interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accent: 'violet' | 'emerald' | 'amber' | 'blue' | 'rose';
  trend?: { value: string; up: boolean };
}

const ACCENT = {
  violet: { bg: 'bg-brand-500/10', border: 'border-brand-500/20', icon: 'text-brand-400', value: 'text-brand-300' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400', value: 'text-emerald-300' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'text-amber-400', value: 'text-amber-300' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-400', value: 'text-blue-300' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: 'text-rose-400', value: 'text-rose-300' },
};

export default function StatsCard({ title, value, subtitle, icon, accent, trend }: StatsCardProps) {
  const c = ACCENT[accent];
  return (
    <div className={`card p-5 border ${c.border}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center ${c.icon}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
      <p className={`text-3xl font-bold ${c.value}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
