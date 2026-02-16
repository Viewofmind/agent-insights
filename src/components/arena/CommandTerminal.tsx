import { useState, type KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';

interface CommandTerminalProps {
  currentStock: string;
  isActive: boolean;
  onCommand: (symbol: string) => void;
}

export function CommandTerminal({ currentStock, isActive, onCommand }: CommandTerminalProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      // Parse command like "Run DD on AAPL" or just "AAPL"
      const match = input.match(/(?:run\s+dd\s+on\s+)?([A-Za-z]+)/i);
      if (match) {
        onCommand(match[1].toUpperCase());
        setInput('');
      }
    }
  };

  return (
    <header className="h-14 border-b border-arena-border bg-arena-surface flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <span className="font-mono text-arena-bull font-bold tracking-widest text-sm">
          INVEST_AGENTS //
        </span>
        {currentStock && (
          <Badge
            variant="outline"
            className="text-arena-text-muted border-arena-border font-mono text-xs"
          >
            {isActive ? '● ' : ''}LIVE DEBATE: {currentStock}
          </Badge>
        )}
      </div>

      <div className="relative w-1/3 max-w-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="> Run DD on AAPL (Enter)"
          disabled={isActive}
          className="w-full bg-arena-bg border border-arena-border rounded-sm px-4 py-2 font-mono text-sm text-arena-text placeholder:text-arena-text-muted focus:outline-none focus:border-arena-cio disabled:opacity-50 transition-colors"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-arena-bull animate-pulse' : 'bg-arena-text-muted'}`} />
          <span className="font-mono text-[10px] text-arena-text-muted uppercase">
            {isActive ? 'Processing' : 'Ready'}
          </span>
        </div>
      </div>
    </header>
  );
}
