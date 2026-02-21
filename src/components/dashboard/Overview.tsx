import React from 'react';
import { AlertTriangle, ShieldAlert, TrendingUp, Server, Brain, ArrowRight } from 'lucide-react';
import SecurityScoreRing from './SecurityScoreRing';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const miniTrendData = [
  { day: 'Mon', score: 68 }, { day: 'Tue', score: 72 }, { day: 'Wed', score: 65 },
  { day: 'Thu', score: 78 }, { day: 'Fri', score: 74 }, { day: 'Sat', score: 69 }, { day: 'Sun', score: 73 },
];

const riskCards = [
  { label: 'Critical Issues', value: 7, icon: ShieldAlert, color: 'cyber-red', tab: 'findings', description: 'Require immediate attention' },
  { label: 'Active Alerts', value: 23, icon: AlertTriangle, color: 'cyber-yellow', tab: 'findings', description: 'Across all services' },
  { label: 'Vulnerable Services', value: 5, icon: Server, color: 'cyber-orange', tab: 'findings', description: 'Exposed endpoints' },
  { label: 'AI Suggestions', value: 12, icon: Brain, color: 'cyber-cyan', tab: 'ai-advisor', description: 'Optimization tips' },
];

const recentFindings = [
  { severity: 'CRITICAL', title: 'Exposed S3 Bucket with PII data', service: 'S3', time: '2m ago' },
  { severity: 'HIGH', title: 'IAM role with excessive permissions', service: 'IAM', time: '18m ago' },
  { severity: 'HIGH', title: 'Unencrypted RDS instance detected', service: 'RDS', time: '45m ago' },
  { severity: 'MEDIUM', title: 'Security Group port 22 open to 0.0.0.0/0', service: 'EC2', time: '1h ago' },
  { severity: 'MEDIUM', title: 'CloudTrail logging disabled in us-east-2', service: 'CloudTrail', time: '2h ago' },
];

const severityColors: Record<string, string> = {
  CRITICAL: 'text-cyber-red bg-cyber-red/10 border-cyber-red/30',
  HIGH: 'text-cyber-orange bg-cyber-orange/10 border-cyber-orange/30',
  MEDIUM: 'text-cyber-yellow bg-cyber-yellow/10 border-cyber-yellow/30',
  LOW: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30',
};

interface OverviewProps {
  onNavigate: (tab: string) => void;
}

export default function Overview({ onNavigate }: OverviewProps) {
  return (
    <div className="space-y-6 fade-in">
      {/* Top row: Score + Risk level + Quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Security Score */}
        <div
          className="glass-card-hover rounded-xl p-5 cursor-pointer col-span-1"
          onClick={() => onNavigate('risk-trends')}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground tracking-wider uppercase font-medium">Security Score</p>
              <p className="text-xs text-muted-foreground mt-0.5">Click to view trends</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-6">
            <SecurityScoreRing score={73} size={110} />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-green" />
                <span className="text-xs text-muted-foreground">Low: 18</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-yellow" />
                <span className="text-xs text-muted-foreground">Medium: 31</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-orange" />
                <span className="text-xs text-muted-foreground">High: 16</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyber-red" />
                <span className="text-xs text-muted-foreground">Critical: 7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk level */}
        <div className="glass-card rounded-xl p-5 relative overflow-hidden col-span-1 cursor-pointer border border-cyber-red/30"
          style={{ background: 'linear-gradient(135deg, hsl(var(--card)), hsl(0 30% 8%))' }}
          onClick={() => onNavigate('findings')}
        >
          <div className="absolute inset-0 animate-shimmer" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground tracking-wider uppercase">Risk Level</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyber-red/15 border border-cyber-red/30">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-red opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyber-red" />
                </span>
                <span className="text-[10px] font-bold text-cyber-red">HIGH</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <AlertTriangle className="w-10 h-10 text-cyber-red animate-float" />
              <div>
                <p className="text-2xl font-heading font-bold text-cyber-red">HIGH</p>
                <p className="text-xs text-muted-foreground">7 critical unresolved</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {['IAM', 'S3', 'EC2', 'RDS'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="h-1.5 rounded-full flex-1 bg-muted/50">
                    <div className="h-1.5 rounded-full bg-cyber-red" style={{ width: `${[85, 60, 45, 30][i]}%`, transition: 'width 1s ease' }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-12">{s}: {[85, 60, 45, 30][i]}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mini trend chart */}
        <div className="glass-card-hover rounded-xl p-5 col-span-1 cursor-pointer" onClick={() => onNavigate('risk-trends')}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-muted-foreground tracking-wider uppercase">7-Day Score Trend</p>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={miniTrendData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--cyber-cyan))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--cyber-cyan))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
              />
              <Area type="monotone" dataKey="score" stroke="hsl(var(--cyber-cyan))" strokeWidth={2} fill="url(#scoreGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {riskCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => onNavigate(card.tab)}
              className="glass-card-hover rounded-xl p-4 text-left group"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-3', `bg-${card.color}/10`)}>
                <Icon className={cn('w-4 h-4', `text-${card.color}`)} />
              </div>
              <p className={cn('text-2xl font-heading font-bold', `text-${card.color}`)}>{card.value}</p>
              <p className="text-xs font-medium text-foreground mt-0.5">{card.label}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{card.description}</p>
            </button>
          );
        })}
      </div>

      {/* Recent Findings */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-heading font-semibold text-foreground">Recent Findings</h2>
          <button onClick={() => onNavigate('findings')} className="text-xs text-cyber-cyan hover:text-cyber-cyan/80 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {recentFindings.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-all duration-200 cursor-pointer group">
              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border', severityColors[f.severity])}>
                {f.severity}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{f.title}</p>
                <p className="text-[10px] text-muted-foreground">{f.service}</p>
              </div>
              <span className="text-[10px] text-muted-foreground flex-shrink-0">{f.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
