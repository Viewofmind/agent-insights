import { Bot } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Agent } from '@/types/agent';
import { useEffect, useState } from 'react';

interface AgentCardProps {
  agent: Agent;
  delay?: number;
}

export function AgentCard({ agent, delay = 0 }: AgentCardProps) {
  const [visible, setVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Typing effect for current task
  useEffect(() => {
    if (agent.status === 'idle' || !agent.currentTask) {
      setDisplayedText('');
      return;
    }

    let index = 0;
    setDisplayedText('');
    
    const interval = setInterval(() => {
      if (index < agent.currentTask.length) {
        setDisplayedText(agent.currentTask.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [agent.currentTask, agent.status]);

  if (!visible) return null;

  const getStatusColor = () => {
    switch (agent.status) {
      case 'thinking':
        return 'text-yellow';
      case 'analyzing':
        return 'text-primary';
      case 'complete':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (agent.status) {
      case 'thinking':
        return 'Thinking...';
      case 'analyzing':
        return 'Analyzing...';
      case 'complete':
        return 'Complete';
      default:
        return 'Idle';
    }
  };

  return (
    <div
      className={cn(
        'glass rounded-xl p-4 transition-all duration-500 animate-fade-in-up',
        agent.status === 'analyzing' && 'ring-1 ring-primary/50 glow-blue',
        agent.status === 'complete' && 'ring-1 ring-accent/50 glow-green'
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3">
        {/* Agent Avatar */}
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0',
            'bg-gradient-to-br shadow-lg'
          )}
          style={{
            background: `linear-gradient(135deg, ${agent.color}40, ${agent.color}20)`,
            boxShadow: `0 4px 20px ${agent.color}30`,
          }}
        >
          {agent.icon}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground truncate">{agent.name}</h3>
            <span
              className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full',
                getStatusColor()
              )}
            >
              {getStatusText()}
            </span>
          </div>

          {/* Current Task with Typing Effect */}
          {agent.status !== 'idle' && agent.status !== 'complete' && (
            <p className="text-sm text-muted-foreground mb-3 h-5">
              "{displayedText}
              <span className="animate-pulse">|</span>"
            </p>
          )}

          {/* Progress Bar */}
          {agent.status !== 'idle' && (
            <div className="space-y-1">
              <Progress
                value={agent.progress}
                className="h-1.5"
              />
              <p className="text-xs text-muted-foreground text-right">
                {agent.progress}%
              </p>
            </div>
          )}

          {/* Finding Speech Bubble */}
          {agent.status === 'complete' && agent.finding && (
            <div className="mt-3 animate-pop-in">
              <div className="relative">
                <div className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-muted" />
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">💬</span>
                    <p className="text-sm text-foreground leading-relaxed">
                      {agent.finding}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
