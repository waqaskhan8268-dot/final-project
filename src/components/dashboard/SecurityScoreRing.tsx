import React from 'react';
import { cn } from '@/lib/utils';

interface SecurityScoreRingProps {
  score: number;
  size?: number;
}

export default function SecurityScoreRing({ score, size = 120 }: SecurityScoreRingProps) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return 'hsl(var(--cyber-green))';
    if (score >= 60) return 'hsl(var(--cyber-yellow))';
    if (score >= 40) return 'hsl(var(--cyber-orange))';
    return 'hsl(var(--cyber-red))';
  };

  const getLabel = () => {
    if (score >= 80) return { text: 'SECURE', cls: 'text-cyber-green' };
    if (score >= 60) return { text: 'MODERATE', cls: 'text-cyber-yellow' };
    if (score >= 40) return { text: 'AT RISK', cls: 'text-cyber-orange' };
    return { text: 'CRITICAL', cls: 'text-cyber-red' };
  };

  const isCritical = score < 40;
  const color = getColor();
  const label = getLabel();

  return (
    <div className={cn('relative flex flex-col items-center', isCritical && 'critical-pulse')}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="8"
        />
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          filter="url(#glow)"
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-heading font-bold text-foreground">{score}</span>
        <span className={cn('text-[9px] font-bold tracking-widest', label.cls)}>{label.text}</span>
      </div>
    </div>
  );
}
