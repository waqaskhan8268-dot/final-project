import React, { useState } from 'react';
import { Brain, Zap, CheckCircle, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const suggestions = [
  {
    id: 1, priority: 'CRITICAL', impact: 'HIGH', effort: 'LOW',
    title: 'Enable MFA for all IAM users immediately',
    summary: '14 IAM users are operating without MFA. This is the highest-impact, lowest-effort security improvement you can make today.',
    steps: ['Navigate to IAM → Users', 'For each user without MFA, click "Security credentials"', 'Enable virtual MFA device', 'Enforce MFA via IAM policy condition: aws:MultiFactorAuthPresent'],
    resources: ['CIS AWS Benchmark 1.10', 'AWS IAM Best Practices'],
    estimated_time: '2 hours',
    risk_reduction: '35%'
  },
  {
    id: 2, priority: 'HIGH', impact: 'HIGH', effort: 'MEDIUM',
    title: 'Restrict S3 bucket public access at account level',
    summary: 'Enable S3 Block Public Access settings at the account level to prevent accidental data exposure across all current and future buckets.',
    steps: ['Open S3 console → Block Public Access (account settings)', 'Enable all 4 block public access settings', 'Audit existing bucket policies for s3:GetObject without conditions', 'Set up S3 Access Analyzer'],
    resources: ['AWS S3 Block Public Access', 'S3 Security Best Practices'],
    estimated_time: '1 hour',
    risk_reduction: '28%'
  },
  {
    id: 3, priority: 'HIGH', impact: 'MEDIUM', effort: 'LOW',
    title: 'Enable AWS Security Hub with CIS benchmark',
    summary: 'Security Hub provides centralized security findings. Enabling CIS AWS Foundations benchmark will automate compliance checking.',
    steps: ['Enable Security Hub in primary region', 'Enable CIS AWS Foundations Benchmark standard', 'Set up cross-region aggregation', 'Configure SNS notifications for critical findings'],
    resources: ['AWS Security Hub docs', 'CIS AWS Foundations Benchmark v1.4'],
    estimated_time: '30 minutes',
    risk_reduction: '20%'
  },
  {
    id: 4, priority: 'MEDIUM', impact: 'MEDIUM', effort: 'MEDIUM',
    title: 'Implement least-privilege IAM policies',
    summary: 'Replace overly permissive IAM policies with least-privilege alternatives. Use IAM Access Analyzer to identify unused permissions.',
    steps: ['Run IAM Access Analyzer on all roles', 'Use AWS IAM policy simulator to test permissions', 'Remove unused permissions identified in the last 90 days', 'Implement Service Control Policies (SCPs) in AWS Organizations'],
    resources: ['IAM Access Analyzer', 'AWS Policy Simulator'],
    estimated_time: '8 hours',
    risk_reduction: '40%'
  },
  {
    id: 5, priority: 'MEDIUM', impact: 'LOW', effort: 'LOW',
    title: 'Enable RDS encryption for all databases',
    summary: 'Encrypt all RDS instances at rest using AWS KMS. This requires creating a new encrypted snapshot and restoring.',
    steps: ['Take a manual snapshot of unencrypted RDS instance', 'Copy the snapshot with encryption enabled', 'Restore new encrypted instance from the copy', 'Update application connection strings and decommission old instance'],
    resources: ['RDS Encryption at Rest', 'AWS KMS Best Practices'],
    estimated_time: '4 hours',
    risk_reduction: '15%'
  },
];

const priorityColors: Record<string, string> = {
  CRITICAL: 'text-cyber-red border-cyber-red/40 bg-cyber-red/10',
  HIGH: 'text-cyber-orange border-cyber-orange/40 bg-cyber-orange/10',
  MEDIUM: 'text-cyber-yellow border-cyber-yellow/40 bg-cyber-yellow/10',
  LOW: 'text-cyber-cyan border-cyber-cyan/40 bg-cyber-cyan/10',
};

export default function AIAdvisor() {
  const [expanded, setExpanded] = useState<number | null>(1);

  return (
    <div className="space-y-4 fade-in">
      {/* Header */}
      <div className="glass-card rounded-xl p-5 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-cyber-cyan" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
              AI Security Advisor <Sparkles className="w-4 h-4 text-cyber-yellow" />
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Analyzing your AWS environment across 247 controls. Found <span className="text-cyber-cyan font-medium">12 prioritized recommendations</span> to improve your security posture from 73 → 91.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Score improvement possible', value: '+18 pts', color: 'text-cyber-green' },
            { label: 'Total effort estimate', value: '~15.5h', color: 'text-cyber-cyan' },
            { label: 'Risk reduction', value: '~62%', color: 'text-cyber-yellow' },
          ].map(s => (
            <div key={s.label} className="bg-muted/30 rounded-lg p-3">
              <p className={`text-lg font-heading font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              'glass-card rounded-xl overflow-hidden transition-all duration-300',
              expanded === s.id && 'border border-primary/20'
            )}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <button
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/20 transition-colors"
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center text-xs font-bold text-muted-foreground">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border', priorityColors[s.priority])}>
                    {s.priority}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Impact: <span className="text-foreground">{s.impact}</span></span>
                  <span className="text-[10px] text-muted-foreground">Effort: <span className="text-foreground">{s.effort}</span></span>
                  <span className="text-[10px] text-cyber-green">↑ {s.risk_reduction} risk reduction</span>
                </div>
                <p className="text-xs font-semibold text-foreground">{s.title}</p>
              </div>
              {expanded === s.id ? <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
            </button>

            {expanded === s.id && (
              <div className="px-4 pb-4 space-y-3 animate-fade-in">
                <p className="text-xs text-muted-foreground border-t border-border pt-3">{s.summary}</p>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyber-cyan" /> Remediation Steps
                  </p>
                  <ol className="space-y-1.5">
                    {s.steps.map((step, si) => (
                      <li key={si} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[9px] font-bold text-cyber-cyan mt-0.5">{si + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-2 flex-wrap">
                    {s.resources.map(r => (
                      <span key={r} className="text-[10px] px-2 py-0.5 rounded bg-muted/40 text-muted-foreground border border-border">{r}</span>
                    ))}
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <span className="text-[10px] text-muted-foreground">Est. time: <span className="text-foreground">{s.estimated_time}</span></span>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-xs font-medium text-cyber-cyan hover:bg-primary/20 transition-all duration-200">
                  <CheckCircle className="w-3.5 h-3.5" /> Mark as Resolved
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
