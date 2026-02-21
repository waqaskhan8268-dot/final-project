import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import Overview from '@/components/dashboard/Overview';
import Findings from '@/components/dashboard/Findings';
import RiskTrends from '@/components/dashboard/RiskTrends';
import AIAdvisor from '@/components/dashboard/AIAdvisor';
import AuditLogs from '@/components/dashboard/AuditLogs';
import Settings from '@/components/dashboard/Settings';
import ChatbotPanel from '@/components/dashboard/ChatbotPanel';

type TabId = 'overview' | 'findings' | 'risk-trends' | 'ai-advisor' | 'audit-logs' | 'settings';

const sections: Record<TabId, React.ComponentType<any>> = {
  overview: Overview,
  findings: Findings,
  'risk-trends': RiskTrends,
  'ai-advisor': AIAdvisor,
  'audit-logs': AuditLogs,
  settings: Settings,
};

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [contentKey, setContentKey] = useState(0);

  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab as TabId);
      setContentKey(k => k + 1);
    }
  };

  const ActiveSection = sections[activeTab];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header activeTab={activeTab} />
        <main className="flex-1 overflow-y-auto scrollbar-cyber p-5">
          <div key={contentKey} className="max-w-6xl mx-auto">
            <ActiveSection onNavigate={handleTabChange} />
          </div>
        </main>
      </div>

      {/* Floating chatbot */}
      <ChatbotPanel />
    </div>
  );
}
