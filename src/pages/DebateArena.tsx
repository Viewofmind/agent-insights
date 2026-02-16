import { useMemo } from 'react';
import { CommandTerminal } from '@/components/arena/CommandTerminal';
import { AgentPanel } from '@/components/arena/AgentPanel';
import { CIOConsole } from '@/components/arena/CIOConsole';
import { useAnalysis } from '@/hooks/useAnalysis';
import type { ArgumentMessage } from '@/components/arena/ArgumentStream';
import type { AnalysisOptions } from '@/types/agent';

const defaultOptions: AnalysisOptions = {
  fundamental: true,
  technical: true,
  news: true,
  risk: true,
  valuation: true,
};

function formatTimestamp(ts?: number) {
  if (!ts) return new Date().toLocaleTimeString('en-US', { hour12: false });
  return new Date(ts).toLocaleTimeString('en-US', { hour12: false });
}

export default function DebateArena() {
  const { state, startAnalysis, resetAnalysis } = useAnalysis();

  const handleCommand = (symbol: string) => {
    if (state.isAnalyzing) return;
    if (state.consensus) resetAnalysis();
    startAnalysis(symbol, defaultOptions);
  };

  // Map agents and debate data into the 3-panel structure
  const { shortMessages, bullMessages, cioMessages } = useMemo(() => {
    const shortMsgs: ArgumentMessage[] = [];
    const bullMsgs: ArgumentMessage[] = [];
    const cioMsgs: ArgumentMessage[] = [];

    // Map individual agent findings
    for (const agent of state.agents) {
      if (!agent.finding) continue;

      const msg: ArgumentMessage = {
        id: `agent-${agent.id}`,
        agentName: agent.name,
        message: agent.finding,
        timestamp: formatTimestamp(),
        citations: extractCitations(agent.finding),
      };

      if (agent.type === 'risk' || agent.type === 'news') {
        shortMsgs.push(msg);
      } else if (agent.type === 'fundamental' || agent.type === 'technical') {
        bullMsgs.push(msg);
      } else {
        cioMsgs.push(msg);
      }
    }

    // Map debate rounds
    for (const round of state.debateRounds) {
      for (const dmsg of round.messages) {
        const msg: ArgumentMessage = {
          id: `debate-${dmsg.agentId}-${dmsg.timestamp}`,
          agentName: dmsg.agentName,
          message: dmsg.message,
          timestamp: formatTimestamp(dmsg.timestamp),
          citations: extractCitations(dmsg.message),
        };

        if (dmsg.position === 'against') {
          shortMsgs.push(msg);
        } else if (dmsg.position === 'for') {
          bullMsgs.push(msg);
        } else {
          cioMsgs.push(msg);
        }
      }
    }

    // Add consensus reasoning to CIO
    if (state.consensus) {
      for (const reason of state.consensus.reasons) {
        cioMsgs.push({
          id: `consensus-${reason.slice(0, 20)}`,
          agentName: 'CIO Synthesis',
          message: reason,
          timestamp: formatTimestamp(),
          citations: extractCitations(reason),
        });
      }
    }

    return { shortMessages: shortMsgs, bullMessages: bullMsgs, cioMessages: cioMsgs };
  }, [state.agents, state.debateRounds, state.consensus]);

  const convictionScore = state.consensus?.confidence ?? (state.isAnalyzing ? 0 : 0);
  const recommendation = state.consensus?.recommendation ?? '';

  return (
    <div className="flex flex-col h-screen bg-arena-bg text-arena-text font-sans overflow-hidden">
      {/* Command Header */}
      <CommandTerminal
        currentStock={state.stock}
        isActive={state.isAnalyzing}
        onCommand={handleCommand}
      />

      {/* 3-Column Debate Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px_1fr] gap-[2px] bg-arena-border p-[2px] overflow-hidden">
        {/* Left: Activist Short */}
        <AgentPanel
          title="Agent: Activist Short"
          subtitle="Objective: Find accounting loopholes & risks"
          variant="short"
          messages={shortMessages}
          isActive={state.isAnalyzing}
        />

        {/* Center: CIO Judge */}
        <CIOConsole
          convictionScore={convictionScore}
          recommendation={recommendation}
          messages={cioMessages}
          isActive={state.isAnalyzing}
        />

        {/* Right: Permabull */}
        <AgentPanel
          title="Agent: Permabull"
          subtitle="Objective: Project TAM & margin expansion"
          variant="bull"
          messages={bullMessages}
          isActive={state.isAnalyzing}
        />
      </main>
    </div>
  );
}

/** Extract potential citation-like terms from analysis text */
function extractCitations(text: string): string[] {
  const patterns = [
    /\b(P\/E|EPS|ROE|ROA|EBITDA|FCF|DCF)\b/gi,
    /\b(RSI|MACD|SMA|EMA|VWAP)\b/gi,
    /\b(Q[1-4]\s*\d{4}|FY\d{2,4})\b/gi,
    /\b(Revenue|Earnings|Margin|Debt|Cash Flow)\b/gi,
  ];

  const found = new Set<string>();
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) matches.forEach((m) => found.add(m.toUpperCase()));
  }

  return Array.from(found).slice(0, 5);
}
