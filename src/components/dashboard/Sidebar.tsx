import React, { useState, useEffect } from 'react';
import { Shield, BarChart3, AlertTriangle, Brain, FileText, Settings, ChevronLeft, ChevronRight, Activity, Lock, Zap, Globe, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'findings', label: 'Findings', icon: AlertTriangle },
  { id: 'risk-trends', label: 'Risk Trends', icon: Activity },
  { id: 'ai-advisor', label: 'AI Advisor', icon: Brain },
  { id: 'audit-logs', label: 'Audit Logs', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <aside
      className={cn(
        'flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out border-r border-border',
        'bg-sidebar relative z-20',
        collapsed ? 'w-[64px]' : 'w-[220px]'
      )}
      style={{ background: 'hsl(var(--sidebar-background))' }}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 border-b border-border',
        collapsed && 'justify-center px-2'
      )}>
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-cyber-gradient flex items-center justify-center cyber-border">
            <Shield className="w-4 h-4 text-cyber-cyan" />
          </div>
          <div className="absolute inset-0 rounded-lg bg-primary/20 animate-glow-pulse" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <p className="text-xs font-heading font-bold text-cyber-cyan tracking-wider">CLOUD SEC</p>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Audit Advisor</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-cyber">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{ animationDelay: `${i * 60}ms` }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 my-0.5 transition-all duration-200 relative group',
                collapsed ? 'justify-center px-2' : '',
                isActive
                  ? 'text-cyber-cyan'
                  : 'text-muted-foreground hover:text-foreground',
                mounted && 'animate-slide-in-left'
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-cyber-cyan rounded-r-full" />
              )}
              {/* Active background */}
              <span className={cn(
                'absolute inset-1 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary/10 border border-primary/20'
                  : 'group-hover:bg-muted/50'
              )} />
              <Icon className={cn(
                'w-4 h-4 relative z-10 transition-all duration-200 icon-glow flex-shrink-0',
                isActive && 'text-cyber-cyan drop-shadow-[0_0_6px_hsl(var(--cyber-cyan))]'
              )} />
              {!collapsed && (
                <span className={cn(
                  'text-sm font-medium relative z-10 transition-all duration-200',
                  isActive ? 'font-semibold' : ''
                )}>
                  {item.label}
                </span>
              )}
              {/* Tooltip for collapsed */}
              {collapsed && (
                <span className="absolute left-14 bg-card border border-border text-xs text-foreground px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-3 flex justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-lg glass-card flex items-center justify-center hover:border-primary/40 transition-all duration-200 text-muted-foreground hover:text-cyber-cyan"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* User */}
      {!collapsed && (
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-muted/30">
            <div className="w-7 h-7 rounded-full bg-cyber-gradient flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
              SA
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">Security Admin</p>
              <p className="text-[10px] text-muted-foreground truncate">admin@cloudsec.io</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
