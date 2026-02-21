import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const logs = [
  { id: 'LOG-001', timestamp: '2026-02-19 14:32:17', user: 'admin@cloudsec.io', action: 'ScanInitiated', resource: 'Full Account Scan', ip: '192.168.1.100', status: 'SUCCESS' },
  { id: 'LOG-002', timestamp: '2026-02-19 14:31:05', user: 'iam-role/lambda-scan', action: 'S3:ListBuckets', resource: 'All S3 Buckets', ip: 'AWS Internal', status: 'SUCCESS' },
  { id: 'LOG-003', timestamp: '2026-02-19 13:58:44', user: 'jsmith@company.io', action: 'FindingResolved', resource: 'F-0087: ELB Access Logs', ip: '10.0.0.45', status: 'SUCCESS' },
  { id: 'LOG-004', timestamp: '2026-02-19 13:45:22', user: 'api-gateway-prod', action: 'PolicyUpdated', resource: 'IAM Policy: ReadOnly-Dev', ip: 'AWS Internal', status: 'SUCCESS' },
  { id: 'LOG-005', timestamp: '2026-02-19 12:30:11', user: 'unknown', action: 'ConsoleLogin', resource: 'AWS Console', ip: '203.0.113.45', status: 'FAILED' },
  { id: 'LOG-006', timestamp: '2026-02-19 11:15:33', user: 'admin@cloudsec.io', action: 'ExportReport', resource: 'Security Report PDF', ip: '192.168.1.100', status: 'SUCCESS' },
  { id: 'LOG-007', timestamp: '2026-02-19 10:02:44', user: 'ci-deploy-role', action: 'EC2:RunInstances', resource: 'i-0abc1234567890ef0', ip: 'AWS Internal', status: 'SUCCESS' },
  { id: 'LOG-008', timestamp: '2026-02-19 09:44:18', user: 'unknown', action: 'S3:GetObject', resource: 'prod-data-bucket/users.csv', ip: '45.33.32.156', status: 'DENIED' },
  { id: 'LOG-009', timestamp: '2026-02-19 08:30:00', user: 'scheduler-role', action: 'AutoScan', resource: 'Scheduled Daily Scan', ip: 'AWS Internal', status: 'SUCCESS' },
  { id: 'LOG-010', timestamp: '2026-02-18 23:15:02', user: 'unknown', action: 'RootLogin', resource: 'AWS Console Root', ip: '87.116.11.200', status: 'FAILED' },
];

const statusColors: Record<string, string> = {
  SUCCESS: 'text-cyber-green bg-cyber-green/10 border-cyber-green/30',
  FAILED: 'text-cyber-red bg-cyber-red/10 border-cyber-red/30',
  DENIED: 'text-cyber-orange bg-cyber-orange/10 border-cyber-orange/30',
};

export default function AuditLogs() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = logs.filter(l => {
    const matchSearch = !search || l.action.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()) || l.resource.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4 fade-in">
      <div className="glass-card rounded-xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-muted/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex gap-1.5">
          {['ALL', 'SUCCESS', 'FAILED', 'DENIED'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn('px-3 py-2 text-xs rounded-lg border font-medium transition-all duration-200',
                statusFilter === s ? 'bg-primary/15 border-primary/40 text-cyber-cyan' : 'border-border text-muted-foreground hover:text-foreground'
              )}>
              {s}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg glass-card border-border text-muted-foreground hover:text-cyber-cyan transition-colors">
          <Download className="w-3 h-3" /> Export
        </button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-heading font-semibold">{filtered.length} Log Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Timestamp</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">User / Principal</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Action</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Resource</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Source IP</th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => (
                <tr key={log.id} className="border-b border-border/50 hover:bg-muted/15 transition-colors">
                  <td className="px-4 py-3 font-mono text-muted-foreground whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3 text-foreground max-w-[160px] truncate">{log.user}</td>
                  <td className="px-4 py-3 text-cyber-cyan font-medium">{log.action}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{log.resource}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{log.ip}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border', statusColors[log.status])}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
