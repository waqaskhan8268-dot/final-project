import React, { useState } from 'react';
import { Save, Bell, Shield, Key, Cloud, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Settings() {
  const [notifications, setNotifications] = useState({ critical: true, high: true, medium: false, low: false, email: true, slack: false });
  const [scanSchedule, setScanSchedule] = useState('daily');
  const [regions, setRegions] = useState(['us-east-1', 'us-west-2', 'eu-west-1']);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange}
      className={cn('relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200',
        checked ? 'bg-primary/80' : 'bg-muted'
      )}>
      <span className={cn('inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200',
        checked ? 'translate-x-4.5' : 'translate-x-0.5'
      )} />
    </button>
  );

  return (
    <div className="space-y-4 fade-in max-w-2xl">
      {/* Account */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-cyber-cyan" />
          <h2 className="text-sm font-heading font-semibold">Account</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[['Display Name', 'Security Admin'], ['Email', 'admin@cloudsec.io'], ['Role', 'Administrator'], ['Organization', 'CloudSec Corp']].map(([label, val]) => (
            <div key={label}>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</label>
              <input defaultValue={val} className="mt-1 w-full px-3 py-2 text-xs bg-muted/30 border border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50" />
            </div>
          ))}
        </div>
      </div>

      {/* Scan Settings */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-cyber-cyan" />
          <h2 className="text-sm font-heading font-semibold">Scan Configuration</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Scan Schedule</label>
            <div className="flex gap-2 mt-2">
              {['hourly', 'daily', 'weekly'].map(s => (
                <button key={s} onClick={() => setScanSchedule(s)}
                  className={cn('px-3 py-1.5 text-xs rounded-lg border capitalize transition-all',
                    scanSchedule === s ? 'bg-primary/15 border-primary/40 text-cyber-cyan' : 'border-border text-muted-foreground hover:text-foreground'
                  )}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Active Regions</label>
            <div className="flex gap-2 flex-wrap mt-2">
              {['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'].map(r => (
                <button key={r} onClick={() => setRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])}
                  className={cn('px-2.5 py-1 text-[10px] font-mono rounded border transition-all',
                    regions.includes(r) ? 'bg-primary/15 border-primary/40 text-cyber-cyan' : 'border-border text-muted-foreground hover:text-foreground'
                  )}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-cyber-cyan" />
          <h2 className="text-sm font-heading font-semibold">Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { key: 'critical', label: 'Critical Severity Findings' },
            { key: 'high', label: 'High Severity Findings' },
            { key: 'medium', label: 'Medium Severity Findings' },
            { key: 'low', label: 'Low Severity Findings' },
            { key: 'email', label: 'Email Notifications' },
            { key: 'slack', label: 'Slack Notifications' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <span className="text-xs text-foreground">{label}</span>
              <Toggle
                checked={notifications[key as keyof typeof notifications]}
                onChange={() => setNotifications(p => ({ ...p, [key]: !p[key as keyof typeof notifications] }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* API Keys */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-4 h-4 text-cyber-cyan" />
          <h2 className="text-sm font-heading font-semibold">API Keys</h2>
        </div>
        <div className="space-y-2">
          {[['AWS Access Key ID', 'AKIA••••••••••••XXXXX'], ['AWS Secret Key', '••••••••••••••••••••••••••••••••••']].map(([label, val]) => (
            <div key={label}>
              <label className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</label>
              <input defaultValue={val} type="password" className="mt-1 w-full px-3 py-2 text-xs bg-muted/30 border border-border rounded-lg text-foreground font-mono focus:outline-none focus:border-primary/50" />
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSave}
        className={cn(
          'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          saved
            ? 'bg-cyber-green/20 border border-cyber-green/40 text-cyber-green'
            : 'bg-primary/15 border border-primary/40 text-cyber-cyan hover:bg-primary/25'
        )}>
        <Save className="w-4 h-4" />
        {saved ? 'Settings Saved!' : 'Save Settings'}
      </button>
    </div>
  );
}
