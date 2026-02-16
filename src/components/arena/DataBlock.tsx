import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface DataBlockProps {
  agentName: string;
  timestamp: string;
  message: string;
  citations?: string[];
  variant: 'short' | 'bull' | 'cio';
}

export function DataBlock({ agentName, timestamp, message, citations, variant }: DataBlockProps) {
  const borderColor = {
    short: 'border-l-arena-short',
    bull: 'border-l-arena-bull',
    cio: 'border-l-arena-cio',
  }[variant];

  return (
    <div
      className={cn(
        'border-l-2 bg-arena-surface/50 p-3 mb-3 rounded-sm animate-fade-in-up',
        borderColor
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-xs font-semibold text-arena-text">{agentName}</span>
        <span className="font-mono text-[10px] text-arena-text-muted">{timestamp}</span>
      </div>
      <p className="text-sm text-arena-text leading-relaxed">{message}</p>
      {citations && citations.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {citations.map((c, i) => (
            <Badge
              key={i}
              variant="secondary"
              className="bg-arena-border text-arena-text-muted text-[10px] font-mono rounded-sm cursor-pointer hover:bg-arena-surface"
            >
              {c}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
