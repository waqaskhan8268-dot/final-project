import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronUp, ChevronDown, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const allFindings = [
  { id: 'F001', severity: 'CRITICAL', title: 'Exposed S3 Bucket with PII data', service: 'S3', region: 'us-east-1', status: 'OPEN', discovered: '2026-02-19', cve: 'N/A', description: 'S3 bucket contains sensitive PII data with public read access enabled.' },
  { id: 'F002', severity: 'CRITICAL', title: 'Root account API keys active', service: 'IAM', region: 'Global', status: 'OPEN', discovered: '2026-02-18', cve: 'N/A', description: 'Root account has active API keys which is a security violation.' },
  { id: 'F003', severity: 'HIGH', title: 'IAM role with AdministratorAccess attached to EC2', service: 'IAM', region: 'us-west-2', status: 'OPEN', discovered: '2026-02-18', cve: 'N/A', description: 'EC2 instance has an IAM role with full administrator access permissions.' },
  { id: 'F004', severity: 'HIGH', title: 'Unencrypted RDS instance at rest', service: 'RDS', region: 'eu-west-1', status: 'OPEN', discovered: '2026-02-17', cve: 'N/A', description: 'RDS database instance does not have encryption at rest enabled.' },
  { id: 'F005', severity: 'HIGH', title: 'Security Group allows SSH from 0.0.0.0/0', service: 'EC2', region: 'us-east-1', status: 'OPEN', discovered: '2026-02-17', cve: 'N/A', description: 'Inbound rule allows unrestricted SSH access from the internet.' },
  { id: 'F006', severity: 'MEDIUM', title: 'CloudTrail not enabled in all regions', service: 'CloudTrail', region: 'us-east-2', status: 'OPEN', discovered: '2026-02-16', cve: 'N/A', description: 'CloudTrail is not configured for multi-region logging.' },
  { id: 'F007', severity: 'MEDIUM', title: 'MFA not enforced for IAM users', service: 'IAM', region: 'Global', status: 'OPEN', discovered: '2026-02-16', cve: 'N/A', description: '14 IAM users do not have MFA enabled on their accounts.' },
  { id: 'F008', severity: 'MEDIUM', title: 'ELB access logs disabled', service: 'ELB', region: 'us-east-1', status: 'RESOLVED', discovered: '2026-02-15', cve: 'N/A', description: 'Elastic Load Balancer does not have access logging enabled.' },
  { id: 'F009', severity: 'LOW', title: 'S3 bucket versioning disabled', service: 'S3', region: 'us-west-1', status: 'OPEN', discovered: '2026-02-15', cve: 'N/A', description: 'S3 bucket does not have versioning enabled for data recovery.' },
  { id: 'F010', severity: 'LOW', title: 'VPC flow logs not enabled', service: 'VPC', region: 'ap-southeast-1', status: 'RESOLVED', discovered: '2026-02-14', cve: 'N/A', description: 'VPC does not have flow logs enabled for network monitoring.' },
  { id: 'F011', severity: 'CRITICAL', title: 'Lambda function with wildcard resource permissions', service: 'Lambda', region: 'us-east-1', status: 'OPEN', discovered: '2026-02-19', cve: 'N/A', description: 'Lambda execution role grants access to all resources via wildcard.' },
  { id: 'F012', severity: 'HIGH', title: 'EKS cluster public endpoint accessible', service: 'EKS', region: 'us-east-1', status: 'OPEN', discovered: '2026-02-18', cve: 'CVE-2024-1234', description: 'Kubernetes API server endpoint is publicly accessible without restrictions.' },
];

const severityOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
const severityColors: Record<string, string> = {
  CRITICAL: 'text-cyber-red bg-cyber-red/10 border-cyber-red/30',
  HIGH: 'text-cyber-orange bg-cyber-orange/10 border-cyber-orange/30',
  MEDIUM: 'text-cyber-yellow bg-cyber-yellow/10 border-cyber-yellow/30',
  LOW: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30',
};

type SortKey = 'severity' | 'title' | 'service' | 'status' | 'discovered';

export default function Findings() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('severity');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<typeof allFindings[0] | null>(null);

  const toggleSeverity = (s: string) => {
    setSeverityFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    let data = allFindings;
    if (search) data = data.filter(f => f.title.toLowerCase().includes(search.toLowerCase()) || f.service.toLowerCase().includes(search.toLowerCase()));
    if (severityFilter.length) data = data.filter(f => severityFilter.includes(f.severity));
    if (statusFilter !== 'ALL') data = data.filter(f => f.status === statusFilter);
    return [...data].sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === 'severity') { va = String(severityOrder.indexOf(a.severity)); vb = String(severityOrder.indexOf(b.severity)); }
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [search, severityFilter, statusFilter, sortKey, sortDir]);

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp className={cn('w-2.5 h-2.5', sortKey === k && sortDir === 'asc' ? 'text-cyber-cyan' : 'text-muted-foreground/40')} />
      <ChevronDown className={cn('w-2.5 h-2.5 -mt-1', sortKey === k && sortDir === 'desc' ? 'text-cyber-cyan' : 'text-muted-foreground/40')} />
    </span>
  );

  return (
    <div className="space-y-4 fade-in">
      {/* Filters */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search findings..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-muted/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>
          {/* Status filter */}
          <div className="flex gap-1.5">
            {['ALL', 'OPEN', 'RESOLVED'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn('px-3 py-2 text-xs rounded-lg border font-medium transition-all duration-200',
                  statusFilter === s ? 'bg-primary/15 border-primary/40 text-cyber-cyan' : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
                )}>
                {s}
              </button>
            ))}
          </div>
        </div>
        {/* Severity filters */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Filter className="w-3 h-3" /> Severity:</span>
          {severityOrder.map(s => (
            <button key={s} onClick={() => toggleSeverity(s)}
              className={cn('px-2.5 py-1 text-[10px] font-bold rounded border transition-all duration-200',
                severityColors[s],
                severityFilter.includes(s) ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-80'
              )}>
              {s}
            </button>
          ))}
          {severityFilter.length > 0 && (
            <button onClick={() => setSeverityFilter([])} className="px-2.5 py-1 text-[10px] text-muted-foreground hover:text-foreground">Clear</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-heading font-semibold">{filtered.length} Findings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                {[
                  { key: 'severity', label: 'Severity' },
                  { key: 'title', label: 'Finding' },
                  { key: 'service', label: 'Service' },
                  { key: 'status', label: 'Status' },
                  { key: 'discovered', label: 'Discovered' },
                ].map(col => (
                  <th key={col.key} onClick={() => handleSort(col.key as SortKey)}
                    className="text-left px-4 py-3 text-muted-foreground font-medium cursor-pointer hover:text-foreground transition-colors select-none">
                    <span className="flex items-center gap-1">{col.label}<SortIcon k={col.key as SortKey} /></span>
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={f.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => setSelected(selected?.id === f.id ? null : f)}>
                  <td className="px-4 py-3">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border', severityColors[f.severity])}>{f.severity}</span>
                  </td>
                  <td className="px-4 py-3 max-w-[280px]">
                    <p className="font-medium text-foreground truncate">{f.title}</p>
                    <p className="text-muted-foreground text-[10px]">{f.id} · {f.region}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{f.service}</td>
                  <td className="px-4 py-3">
                    <span className={cn('flex items-center gap-1.5',
                      f.status === 'OPEN' ? 'text-cyber-orange' : 'text-cyber-green')}>
                      {f.status === 'RESOLVED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{f.discovered}</td>
                  <td className="px-4 py-3">
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-cyber-cyan transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="glass-card rounded-xl p-5 border border-primary/20 animate-fade-in">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border mr-2', severityColors[selected.severity])}>{selected.severity}</span>
              <span className="text-[10px] text-muted-foreground">{selected.id}</span>
            </div>
            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground text-xs">✕ Close</button>
          </div>
          <h3 className="font-heading font-semibold text-foreground mb-2">{selected.title}</h3>
          <p className="text-xs text-muted-foreground mb-3">{selected.description}</p>
          <div className="grid grid-cols-3 gap-3">
            {[['Service', selected.service], ['Region', selected.region], ['Status', selected.status]].map(([k, v]) => (
              <div key={k} className="bg-muted/30 rounded-lg p-2">
                <p className="text-[10px] text-muted-foreground">{k}</p>
                <p className="text-xs font-medium text-foreground">{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
