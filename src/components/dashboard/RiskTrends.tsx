import React from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const trendData = [
  { month: 'Aug', critical: 12, high: 28, medium: 45, low: 20, score: 58 },
  { month: 'Sep', critical: 10, high: 25, medium: 40, low: 18, score: 62 },
  { month: 'Oct', critical: 15, high: 30, medium: 42, low: 22, score: 55 },
  { month: 'Nov', critical: 8, high: 20, medium: 38, low: 15, score: 68 },
  { month: 'Dec', critical: 9, high: 22, medium: 35, low: 14, score: 70 },
  { month: 'Jan', critical: 11, high: 24, medium: 37, low: 16, score: 66 },
  { month: 'Feb', critical: 7, high: 16, medium: 31, low: 18, score: 73 },
];

const serviceRisk = [
  { name: 'IAM', risk: 85 }, { name: 'S3', risk: 62 }, { name: 'EC2', risk: 45 },
  { name: 'RDS', risk: 55 }, { name: 'Lambda', risk: 38 }, { name: 'EKS', risk: 70 },
];

const customTooltip = {
  contentStyle: {
    background: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    fontSize: '11px',
    color: 'hsl(var(--foreground))'
  }
};

export default function RiskTrends() {
  return (
    <div className="space-y-4 fade-in">
      {/* Score over time */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-sm font-heading font-semibold mb-4">Security Score Over Time</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="scoreArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--cyber-cyan))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--cyber-cyan))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} domain={[40, 100]} />
            <Tooltip {...customTooltip} />
            <Area type="monotone" dataKey="score" stroke="hsl(var(--cyber-cyan))" strokeWidth={2.5} fill="url(#scoreArea)" dot={{ fill: 'hsl(var(--cyber-cyan))', r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Findings by severity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-heading font-semibold mb-4">Findings by Severity (7 months)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...customTooltip} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="critical" stroke="hsl(var(--cyber-red))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="high" stroke="hsl(var(--cyber-orange))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="medium" stroke="hsl(var(--cyber-yellow))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="low" stroke="hsl(var(--cyber-cyan))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-heading font-semibold mb-4">Risk Score by Service</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={serviceRisk} layout="vertical">
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--cyber-cyan))" />
                  <stop offset="100%" stopColor="hsl(var(--cyber-purple))" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...customTooltip} />
              <Bar dataKey="risk" fill="url(#barGrad)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Avg Resolution Time', value: '4.2 days', color: 'text-cyber-cyan' },
          { label: 'Issues Resolved (30d)', value: '+23%', color: 'text-cyber-green' },
          { label: 'New Issues (30d)', value: '-15%', color: 'text-cyber-green' },
          { label: 'SLA Compliance', value: '94.7%', color: 'text-cyber-yellow' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <p className={`text-xl font-heading font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
