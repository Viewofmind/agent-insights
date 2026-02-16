import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { ArgumentStream, type ArgumentMessage } from './ArgumentStream';

interface CIOConsoleProps {
  convictionScore: number;
  recommendation: string;
  messages: ArgumentMessage[];
  isActive: boolean;
}

export function CIOConsole({ convictionScore, recommendation, messages, isActive }: CIOConsoleProps) {
  const scoreColor = convictionScore >= 70
    ? 'text-arena-bull'
    : convictionScore >= 40
    ? 'text-arena-cio'
    : 'text-arena-short';

  return (
    <section className="bg-arena-surface border-t-4 border-arena-cio flex flex-col relative z-10 shadow-2xl">
      {/* Panel Header */}
      <div className="p-4 border-b border-arena-border bg-arena-cio/5">
        <div className="flex items-center justify-between">
          <h2 className="text-arena-cio font-bold font-mono uppercase text-sm tracking-wider">
            Agent: Chief Inv. Officer
          </h2>
          {isActive && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-arena-cio animate-pulse" />
              <span className="font-mono text-[10px] text-arena-text-muted uppercase">Live</span>
            </div>
          )}
        </div>
        <p className="text-xs text-arena-text-muted mt-1 font-mono">Objective: Fact-check &amp; Synthesis</p>
      </div>

      {/* Conviction Score Widget */}
      <div className="p-6 border-b border-arena-border flex flex-col items-center justify-center bg-arena-bg">
        <span className="text-[10px] text-arena-text-muted font-mono mb-2 uppercase tracking-widest">
          Live Conviction Score
        </span>
        <div className={cn('text-5xl font-light tracking-tighter transition-colors', scoreColor)}>
          {convictionScore}
          <span className="text-2xl text-arena-text-muted">/100</span>
        </div>
        <Progress
          value={convictionScore}
          className="h-1 w-full mt-4 bg-arena-border [&>div]:bg-arena-cio"
        />
        {recommendation && (
          <span className={cn(
            'mt-3 font-mono text-xs font-bold uppercase tracking-widest',
            recommendation === 'BUY' ? 'text-arena-bull' : recommendation === 'SELL' ? 'text-arena-short' : 'text-arena-cio'
          )}>
            {recommendation}
          </span>
        )}
      </div>

      {/* CIO Feed */}
      <ArgumentStream messages={messages} variant="cio" />
    </section>
  );
}
