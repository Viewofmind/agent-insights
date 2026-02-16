import { cn } from '@/lib/utils';
import { ArgumentStream, type ArgumentMessage } from './ArgumentStream';

interface AgentPanelProps {
  title: string;
  subtitle: string;
  variant: 'short' | 'bull';
  messages: ArgumentMessage[];
  isActive: boolean;
}

export function AgentPanel({ title, subtitle, variant, messages, isActive }: AgentPanelProps) {
  const accentColor = variant === 'short' ? 'border-arena-short' : 'border-arena-bull';
  const textColor = variant === 'short' ? 'text-arena-short' : 'text-arena-bull';

  return (
    <section className={cn('bg-arena-panel flex flex-col relative border-t-4', accentColor)}>
      {/* Panel Header */}
      <div className="p-4 border-b border-arena-border bg-arena-surface/30">
        <div className="flex items-center justify-between">
          <h2 className={cn('font-bold font-mono uppercase text-sm tracking-wider', textColor)}>
            {title}
          </h2>
          {isActive && (
            <div className="flex items-center gap-1.5">
              <div className={cn('w-1.5 h-1.5 rounded-full animate-pulse', variant === 'short' ? 'bg-arena-short' : 'bg-arena-bull')} />
              <span className="font-mono text-[10px] text-arena-text-muted uppercase">Live</span>
            </div>
          )}
        </div>
        <p className="text-xs text-arena-text-muted mt-1 font-mono">{subtitle}</p>
      </div>

      {/* Scrollable Argument Feed */}
      <ArgumentStream messages={messages} variant={variant} />
    </section>
  );
}
