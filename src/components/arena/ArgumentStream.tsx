import { ScrollArea } from '@/components/ui/scroll-area';
import { DataBlock } from './DataBlock';

export interface ArgumentMessage {
  id: string;
  agentName: string;
  message: string;
  timestamp: string;
  citations?: string[];
}

interface ArgumentStreamProps {
  messages: ArgumentMessage[];
  variant: 'short' | 'bull' | 'cio';
}

export function ArgumentStream({ messages, variant }: ArgumentStreamProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <p className="font-mono text-xs text-arena-text-muted animate-pulse-soft">
          Awaiting analysis...
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      {messages.map((msg) => (
        <DataBlock
          key={msg.id}
          agentName={msg.agentName}
          timestamp={msg.timestamp}
          message={msg.message}
          citations={msg.citations}
          variant={variant}
        />
      ))}
    </ScrollArea>
  );
}
