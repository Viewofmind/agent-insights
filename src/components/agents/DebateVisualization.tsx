import { cn } from '@/lib/utils';
import type { DebateRound, DebateMessage } from '@/types/agent';
import { useEffect, useState } from 'react';
import { Scale } from 'lucide-react';

interface DebateVisualizationProps {
  rounds: DebateRound[];
  currentRound: number;
  isActive: boolean;
}

function DebateBubble({ message, side }: { message: DebateMessage; side: 'left' | 'right' }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={cn(
        'flex gap-3 mb-4',
        side === 'right' ? 'flex-row-reverse animate-slide-in-right' : 'animate-slide-in-left'
      )}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
        style={{
          background: `linear-gradient(135deg, ${message.agentColor}40, ${message.agentColor}20)`,
          boxShadow: `0 2px 10px ${message.agentColor}30`,
        }}
      >
        {message.agentIcon}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[70%] rounded-2xl p-3',
          side === 'left' ? 'rounded-tl-none' : 'rounded-tr-none',
          message.position === 'for'
            ? 'bg-accent/20 border border-accent/30'
            : message.position === 'against'
            ? 'bg-destructive/20 border border-destructive/30'
            : 'bg-muted border border-border'
        )}
      >
        <p className="text-xs font-medium text-muted-foreground mb-1">
          {message.agentName}
        </p>
        <p className="text-sm text-foreground leading-relaxed">{message.message}</p>
      </div>
    </div>
  );
}

export function DebateVisualization({ rounds, currentRound, isActive }: DebateVisualizationProps) {
  const currentRoundData = rounds[currentRound - 1];

  return (
    <div className="glass rounded-xl p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/40 to-secondary/20 flex items-center justify-center">
            🏛️
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Investment Committee</h3>
            <p className="text-sm text-muted-foreground">
              {currentRoundData?.title || 'Deliberation in progress...'}
            </p>
          </div>
        </div>

        {/* Round Indicator */}
        <div className="flex items-center gap-2">
          {rounds.map((_, index) => (
            <div
              key={index}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                index + 1 < currentRound
                  ? 'bg-accent text-accent-foreground'
                  : index + 1 === currentRound
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary/50'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Debate Arena */}
      <div className={cn('relative min-h-[200px]', isActive && 'animate-pulse-subtle')}>
        {/* Position Labels */}
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-2 text-accent">
            <span className="text-lg">📈</span>
            <span className="text-sm font-medium">FOR (Buy)</span>
          </div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2 text-destructive">
            <span className="text-sm font-medium">AGAINST (Sell)</span>
            <span className="text-lg">📉</span>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-2">
          {currentRoundData?.messages.map((message, index) => (
            <DebateBubble
              key={`${message.agentId}-${index}`}
              message={message}
              side={message.position === 'for' ? 'left' : message.position === 'against' ? 'right' : 'left'}
            />
          ))}
        </div>

        {/* Moderator */}
        {isActive && (
          <div className="mt-4 p-3 bg-secondary/10 border border-secondary/30 rounded-lg animate-pop-in">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚖️</span>
              <span className="text-sm font-medium text-secondary">Moderator</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 italic">
              "Let's hear from the Risk Assessor on this matter..."
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
