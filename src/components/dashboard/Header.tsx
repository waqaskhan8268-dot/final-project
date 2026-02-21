import React, { useState, useEffect } from 'react';
import { RefreshCw, Bell, Shield } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
}

const tabLabels: Record<string, string> = {
  'overview': 'Dashboard Overview',
  'findings': 'Security Findings',
  'risk-trends': 'Risk Trends',
  'ai-advisor': 'AI Security Advisor',
  'audit-logs': 'Audit Logs',
  'settings': 'Settings',
};

export default function Header({ activeTab }: HeaderProps) {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [notifications] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 1200);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: breadcrumb */}
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyber-cyan" />
          <span className="text-xs text-muted-foreground">CloudSec</span>
          <span className="text-muted-foreground text-xs">/</span>
          <h1 className="text-sm font-heading font-semibold text-foreground">{tabLabels[activeTab]}</h1>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-green" />
            </span>
            <span className="text-xs font-medium text-cyber-green">LIVE</span>
          </div>

          {/* Last updated */}
          <div className="text-xs text-muted-foreground hidden sm:block">
            Updated: <span className="text-foreground font-mono">{formatTime(lastUpdated)}</span>
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-cyber-cyan transition-all duration-200 hover:border-primary/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyber-cyan' : ''}`} />
          </button>

          {/* Notifications */}
          <button className="relative w-8 h-8 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-cyber-cyan transition-all duration-200 hover:border-primary/40">
            <Bell className="w-3.5 h-3.5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyber-red text-white text-[9px] font-bold flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
