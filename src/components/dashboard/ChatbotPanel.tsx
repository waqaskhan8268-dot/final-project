import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const botResponses: Record<string, string> = {
  default: "I'm your CloudSec AI assistant. I can help you understand security findings, explain remediation steps, or answer AWS security questions. What would you like to know?",
  mfa: "Enabling MFA for all IAM users is one of the highest-priority actions. Go to IAM → Users → Select user → Security credentials → Assign MFA device. I recommend enforcing it via an IAM policy with the condition `aws:MultiFactorAuthPresent: true`.",
  s3: "Your S3 exposure risk is HIGH. You have a publicly accessible bucket with PII data. Immediate action: Enable S3 Block Public Access at account level, review bucket policies, and enable S3 Access Analyzer. Do you want step-by-step instructions?",
  iam: "Your IAM configuration has several issues: 14 users without MFA, 3 roles with AdministratorAccess, and 1 root account with active API keys. Priority: rotate and delete root API keys first, then enforce MFA. Want a remediation plan?",
  score: "Your current security score is 73/100, rated MODERATE. To reach the SECURE threshold (80+), focus on: 1) Enable MFA for all users (+8 pts), 2) Fix S3 public access (+6 pts), 3) Enable Security Hub (+4 pts). That's +18 points total.",
  help: "I can help with:\n• Explaining security findings\n• Remediation guidance\n• AWS service-specific security\n• Compliance requirements (CIS, SOC2, PCI)\n• Risk prioritization\n\nJust ask me anything!",
};

function getResponse(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('mfa') || m.includes('multi-factor')) return botResponses.mfa;
  if (m.includes('s3') || m.includes('bucket')) return botResponses.s3;
  if (m.includes('iam') || m.includes('permission') || m.includes('role')) return botResponses.iam;
  if (m.includes('score') || m.includes('rating')) return botResponses.score;
  if (m.includes('help') || m.includes('what can')) return botResponses.help;
  return botResponses.default;
}

export default function ChatbotPanel() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', content: "👋 Hi! I'm your CloudSec AI Security Advisor. How can I help you today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', content: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply: Message = { id: Date.now() + 1, role: 'assistant', content: getResponse(input), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(p => [...p, reply]);
      setTyping(false);
    }, 1200);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary/20 border border-primary/40 text-cyber-cyan flex items-center justify-center shadow-lg hover:bg-primary/30 transition-all duration-200 z-50 animate-glow-pulse"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className={cn(
          'fixed bottom-6 right-6 z-50 glass-card border border-primary/20 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden',
          minimized ? 'w-72 h-12' : 'w-80 h-[480px]'
        )}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary/5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-cyber-cyan" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">CloudSec AI</p>
                {!minimized && <p className="text-[9px] text-cyber-green flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyber-green inline-block" />Online</p>}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setMinimized(!minimized)} className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Minimize2 className="w-3 h-3" />
              </button>
              <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-cyber" style={{ height: 'calc(480px - 108px)' }}>
                {messages.map(msg => (
                  <div key={msg.id} className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3 h-3 text-cyber-cyan" />
                      </div>
                    )}
                    <div className={cn(
                      'max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed',
                      msg.role === 'assistant'
                        ? 'bg-muted/40 text-foreground rounded-tl-sm'
                        : 'bg-primary/20 text-cyber-cyan rounded-tr-sm border border-primary/30'
                    )}>
                      <p className="whitespace-pre-line">{msg.content}</p>
                      <p className="text-[9px] text-muted-foreground mt-1">{msg.time}</p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-6 h-6 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                {typing && (
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-cyber-cyan" />
                    </div>
                    <div className="bg-muted/40 rounded-xl px-3 py-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask about security..."
                    className="flex-1 px-3 py-2 text-xs bg-muted/30 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                  <button
                    onClick={sendMessage}
                    className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 text-cyber-cyan flex items-center justify-center hover:bg-primary/30 transition-all duration-200"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {['Security score?', 'Fix MFA', 'S3 risks', 'IAM issues'].map(q => (
                    <button key={q} onClick={() => setInput(q)}
                      className="text-[9px] px-2 py-0.5 rounded-full bg-muted/30 border border-border text-muted-foreground hover:text-cyber-cyan hover:border-primary/30 transition-all">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
