import { useState, useCallback, useRef } from 'react';
import type { Agent, AnalysisState, AnalysisOptions, DebateRound, ConsensusResult } from '@/types/agent';

const AGENTS: Omit<Agent, 'status' | 'progress' | 'finding'>[] = [
  {
    id: 'fundamental',
    name: 'Fundamental Analyst',
    type: 'fundamental',
    icon: '📊',
    color: '#3B82F6',
    currentTask: 'Analyzing financial statements and earnings...',
  },
  {
    id: 'technical',
    name: 'Technical Analyst',
    type: 'technical',
    icon: '📈',
    color: '#10B981',
    currentTask: 'Calculating RSI, MACD, and price patterns...',
  },
  {
    id: 'news',
    name: 'News Monitor',
    type: 'news',
    icon: '📰',
    color: '#F59E0B',
    currentTask: 'Scanning recent news and market sentiment...',
  },
  {
    id: 'risk',
    name: 'Risk Assessor',
    type: 'risk',
    icon: '⚠️',
    color: '#EF4444',
    currentTask: 'Evaluating risk factors and volatility...',
  },
  {
    id: 'portfolio',
    name: 'Portfolio Manager',
    type: 'portfolio',
    icon: '💼',
    color: '#8B5CF6',
    currentTask: 'Optimizing position size and allocation...',
  },
];

const AGENT_FINDINGS: Record<string, string> = {
  fundamental: 'Strong revenue growth of 15% YoY. P/E ratio at 28x is above sector average but justified by growth trajectory. Free cash flow remains robust at $24B quarterly.',
  technical: 'RSI at 65, approaching overbought territory. MACD shows bullish crossover with strong momentum. Key support at $175, resistance at $195. Uptrend intact on all timeframes.',
  news: 'Positive sentiment from recent product launches. Analyst upgrades from 3 major banks. No significant regulatory concerns. Social media sentiment is 72% bullish.',
  risk: 'Moderate concentration risk in consumer electronics. Currency headwinds from strong USD. Supply chain resilience improved. Overall risk score: 6.2/10 (acceptable).',
  portfolio: 'Recommended position size: 5-7% of portfolio. Suggests dollar-cost averaging over 3 entries. Stop-loss at $168 (8% below current). Risk-reward ratio: 2.8:1.',
};

const DEBATE_ROUNDS: DebateRound[] = [
  {
    round: 1,
    title: 'Opening Arguments',
    messages: [
      {
        agentId: 'fundamental',
        agentName: 'Fundamental Analyst',
        agentIcon: '📊',
        agentColor: '#3B82F6',
        message: 'The fundamentals are solid. 15% revenue growth with expanding margins. This company is executing well.',
        position: 'for',
        timestamp: Date.now(),
      },
      {
        agentId: 'risk',
        agentName: 'Risk Assessor',
        agentIcon: '⚠️',
        agentColor: '#EF4444',
        message: 'Valuation concerns remain. At 28x P/E, much of the growth is already priced in. Downside risk is significant.',
        position: 'against',
        timestamp: Date.now(),
      },
    ],
  },
  {
    round: 2,
    title: 'Technical Evidence',
    messages: [
      {
        agentId: 'technical',
        agentName: 'Technical Analyst',
        agentIcon: '📈',
        agentColor: '#10B981',
        message: 'Momentum indicators support the bull case. MACD crossover is a strong buy signal. The trend is your friend here.',
        position: 'for',
        timestamp: Date.now(),
      },
      {
        agentId: 'risk',
        agentName: 'Risk Assessor',
        agentIcon: '⚠️',
        agentColor: '#EF4444',
        message: 'RSI near overbought suggests a pullback is likely. I recommend waiting for a better entry point.',
        position: 'against',
        timestamp: Date.now(),
      },
    ],
  },
  {
    round: 3,
    title: 'Final Deliberation',
    messages: [
      {
        agentId: 'news',
        agentName: 'News Monitor',
        agentIcon: '📰',
        agentColor: '#F59E0B',
        message: 'Sentiment analysis shows 72% bullish readings. Recent analyst upgrades add credibility to the bull case.',
        position: 'for',
        timestamp: Date.now(),
      },
      {
        agentId: 'portfolio',
        agentName: 'Portfolio Manager',
        agentIcon: '💼',
        agentColor: '#8B5CF6',
        message: 'Given the mixed signals, I recommend a measured approach. Build position gradually with defined risk parameters.',
        position: 'neutral',
        timestamp: Date.now(),
      },
    ],
  },
];

const CONSENSUS_RESULT: ConsensusResult = {
  recommendation: 'BUY',
  confidence: 78,
  priceTarget: 195,
  currentPrice: 178.50,
  reasons: [
    'Strong fundamental performance with 15% YoY revenue growth',
    'Bullish technical setup with MACD crossover confirmation',
    'Positive market sentiment and analyst upgrades',
    'Acceptable risk profile with clear support levels',
    'Favorable risk-reward ratio of 2.8:1',
  ],
  votes: {
    buy: 3,
    hold: 1,
    sell: 1,
  },
};

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    stock: '',
    isAnalyzing: false,
    currentPhase: 'idle',
    agents: [],
    debateRounds: [],
    consensus: undefined,
  });

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const startAnalysis = useCallback((stock: string, options: AnalysisOptions) => {
    clearTimeouts();

    // Initialize agents based on selected options
    const selectedAgents = AGENTS.filter((agent) => {
      if (agent.type === 'fundamental') return options.fundamental;
      if (agent.type === 'technical') return options.technical;
      if (agent.type === 'news') return options.news;
      if (agent.type === 'risk') return options.risk;
      if (agent.type === 'portfolio') return options.valuation;
      return true;
    }).map((agent) => ({
      ...agent,
      status: 'idle' as const,
      progress: 0,
      currentTask: agent.currentTask.replace('...', ` for ${stock}...`),
    }));

    setState({
      stock,
      isAnalyzing: true,
      currentPhase: 'agents',
      agents: selectedAgents,
      debateRounds: [],
      consensus: undefined,
    });

    // Simulate agent analysis with staggered timing
    selectedAgents.forEach((agent, index) => {
      // Start thinking
      const thinkTimeout = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          agents: prev.agents.map((a) =>
            a.id === agent.id ? { ...a, status: 'thinking' as const, progress: 10 } : a
          ),
        }));
      }, index * 800);
      timeoutsRef.current.push(thinkTimeout);

      // Start analyzing
      const analyzeTimeout = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          agents: prev.agents.map((a) =>
            a.id === agent.id ? { ...a, status: 'analyzing' as const, progress: 30 } : a
          ),
        }));
      }, index * 800 + 1000);
      timeoutsRef.current.push(analyzeTimeout);

      // Progress updates
      [50, 70, 90].forEach((progress, pIndex) => {
        const progressTimeout = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            agents: prev.agents.map((a) =>
              a.id === agent.id ? { ...a, progress } : a
            ),
          }));
        }, index * 800 + 1500 + pIndex * 500);
        timeoutsRef.current.push(progressTimeout);
      });

      // Complete
      const completeTimeout = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          agents: prev.agents.map((a) =>
            a.id === agent.id
              ? { ...a, status: 'complete' as const, progress: 100, finding: AGENT_FINDINGS[agent.id] }
              : a
          ),
        }));
      }, index * 800 + 3500);
      timeoutsRef.current.push(completeTimeout);
    });

    // Start debate phase
    const debateStartTimeout = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        currentPhase: 'debate',
        debateRounds: [DEBATE_ROUNDS[0]],
      }));
    }, selectedAgents.length * 800 + 4500);
    timeoutsRef.current.push(debateStartTimeout);

    // Add debate rounds progressively
    DEBATE_ROUNDS.slice(1).forEach((round, index) => {
      const roundTimeout = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          debateRounds: [...prev.debateRounds, round],
        }));
      }, selectedAgents.length * 800 + 6500 + index * 3000);
      timeoutsRef.current.push(roundTimeout);
    });

    // Start consensus phase
    const consensusStartTimeout = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        currentPhase: 'consensus',
      }));
    }, selectedAgents.length * 800 + 6500 + (DEBATE_ROUNDS.length - 1) * 3000 + 2000);
    timeoutsRef.current.push(consensusStartTimeout);

    // Show final result
    const resultTimeout = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        consensus: CONSENSUS_RESULT,
      }));
    }, selectedAgents.length * 800 + 6500 + (DEBATE_ROUNDS.length - 1) * 3000 + 4000);
    timeoutsRef.current.push(resultTimeout);
  }, [clearTimeouts]);

  const resetAnalysis = useCallback(() => {
    clearTimeouts();
    setState({
      stock: '',
      isAnalyzing: false,
      currentPhase: 'idle',
      agents: [],
      debateRounds: [],
      consensus: undefined,
    });
  }, [clearTimeouts]);

  return {
    state,
    startAnalysis,
    resetAnalysis,
  };
}
