import { useState, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import type { Agent, AnalysisState, AnalysisOptions, DebateRound, ConsensusResult } from '@/types/agent';
import type { StockAnalysisResponse } from '@/types/api';

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

function getAgentFinding(type: string, result: StockAnalysisResponse): string {
  switch (type) {
    case 'fundamental':
      return result.fundamental_analysis || 'Fundamental analysis complete';
    case 'technical':
      return result.technical_analysis || 'Technical analysis complete';
    case 'news':
      return result.news_analysis || 'News sentiment analysis complete';
    case 'risk':
      return result.risk_assessment || 'Risk assessment complete';
    case 'portfolio':
      return result.recommendation_reasoning || 'Portfolio recommendation ready';
    default:
      return 'Analysis complete';
  }
}

function mapRecommendation(rec: string): 'BUY' | 'HOLD' | 'SELL' {
  const normalized = rec?.toUpperCase();
  if (normalized === 'BUY') return 'BUY';
  if (normalized === 'SELL') return 'SELL';
  return 'HOLD';
}

function generateDebateRounds(result: StockAnalysisResponse): DebateRound[] {
  const rounds: DebateRound[] = [];

  // Round 1: Opening Arguments
  rounds.push({
    round: 1,
    title: 'Opening Arguments',
    messages: [
      {
        agentId: 'fundamental',
        agentName: 'Fundamental Analyst',
        agentIcon: '📊',
        agentColor: '#3B82F6',
        message: result.fundamental_analysis || 'Analyzing fundamental metrics...',
        position: result.recommendation === 'Buy' ? 'for' : result.recommendation === 'Sell' ? 'against' : 'neutral',
        timestamp: Date.now(),
      },
      {
        agentId: 'risk',
        agentName: 'Risk Assessor',
        agentIcon: '⚠️',
        agentColor: '#EF4444',
        message: result.risk_assessment || 'Evaluating risk factors...',
        position: 'neutral',
        timestamp: Date.now(),
      },
    ],
  });

  // Round 2: Technical Evidence
  rounds.push({
    round: 2,
    title: 'Technical Evidence',
    messages: [
      {
        agentId: 'technical',
        agentName: 'Technical Analyst',
        agentIcon: '📈',
        agentColor: '#10B981',
        message: result.technical_analysis || 'Technical indicators analysis...',
        position: result.recommendation === 'Buy' ? 'for' : result.recommendation === 'Sell' ? 'against' : 'neutral',
        timestamp: Date.now(),
      },
      {
        agentId: 'news',
        agentName: 'News Monitor',
        agentIcon: '📰',
        agentColor: '#F59E0B',
        message: result.news_analysis || 'News sentiment analysis...',
        position: result.recommendation === 'Buy' ? 'for' : result.recommendation === 'Sell' ? 'against' : 'neutral',
        timestamp: Date.now(),
      },
    ],
  });

  // Round 3: Final Deliberation
  rounds.push({
    round: 3,
    title: 'Final Deliberation',
    messages: [
      {
        agentId: 'portfolio',
        agentName: 'Portfolio Manager',
        agentIcon: '💼',
        agentColor: '#8B5CF6',
        message: result.recommendation_reasoning || 'Preparing final recommendation...',
        position: 'neutral',
        timestamp: Date.now(),
      },
    ],
  });

  return rounds;
}

function calculateVotes(result: StockAnalysisResponse): { buy: number; hold: number; sell: number } {
  const confidence = result.confidence_score || 0.5;
  const rec = result.recommendation;

  if (rec === 'Buy') {
    if (confidence > 0.8) return { buy: 4, hold: 1, sell: 0 };
    if (confidence > 0.6) return { buy: 3, hold: 2, sell: 0 };
    return { buy: 3, hold: 1, sell: 1 };
  } else if (rec === 'Sell') {
    if (confidence > 0.8) return { buy: 0, hold: 1, sell: 4 };
    if (confidence > 0.6) return { buy: 0, hold: 2, sell: 3 };
    return { buy: 1, hold: 1, sell: 3 };
  } else {
    return { buy: 1, hold: 3, sell: 1 };
  }
}

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
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const startAnalysis = useCallback(async (stock: string, options: AnalysisOptions) => {
    clearTimeouts();
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

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

    // Start visual simulation for agents
    selectedAgents.forEach((agent, index) => {
      const thinkTimeout = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          agents: prev.agents.map((a) =>
            a.id === agent.id ? { ...a, status: 'thinking' as const, progress: 10 } : a
          ),
        }));
      }, index * 400);
      timeoutsRef.current.push(thinkTimeout);

      const analyzeTimeout = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          agents: prev.agents.map((a) =>
            a.id === agent.id ? { ...a, status: 'analyzing' as const, progress: 30 } : a
          ),
        }));
      }, index * 400 + 500);
      timeoutsRef.current.push(analyzeTimeout);

      // Slow progress while waiting for API
      [40, 50, 60].forEach((progress, pIndex) => {
        const progressTimeout = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            agents: prev.agents.map((a) =>
              a.id === agent.id && a.status === 'analyzing' ? { ...a, progress } : a
            ),
          }));
        }, index * 400 + 1000 + pIndex * 2000);
        timeoutsRef.current.push(progressTimeout);
      });
    });

    try {
      // Call real backend API
      const result = await api.analyzeStock(stock, options);

      // Clear animation timeouts
      clearTimeouts();

      // Update agents to complete with real findings
      const completedAgents = selectedAgents.map((agent) => ({
        ...agent,
        status: 'complete' as const,
        progress: 100,
        finding: getAgentFinding(agent.type, result),
      }));

      setState((prev) => ({
        ...prev,
        agents: completedAgents,
        currentPhase: 'debate',
      }));

      // Animate debate rounds
      const debateRounds = generateDebateRounds(result);
      
      debateRounds.forEach((round, index) => {
        const roundTimeout = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            debateRounds: [...prev.debateRounds, round],
          }));
        }, index * 1500);
        timeoutsRef.current.push(roundTimeout);
      });

      // Show consensus after debate
      const consensusTimeout = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          currentPhase: 'consensus',
        }));
      }, debateRounds.length * 1500 + 1000);
      timeoutsRef.current.push(consensusTimeout);

      // Final result
      const resultTimeout = setTimeout(() => {
        const consensus: ConsensusResult = {
          recommendation: mapRecommendation(result.recommendation),
          confidence: Math.round((result.confidence_score || 0.5) * 100),
          priceTarget: result.target_price || 0,
          currentPrice: result.current_price || 0,
          reasons: [
            result.fundamental_analysis,
            result.technical_analysis,
            result.news_analysis,
            result.risk_assessment,
            result.recommendation_reasoning,
          ].filter(Boolean) as string[],
          votes: calculateVotes(result),
        };

        setState((prev) => ({
          ...prev,
          isAnalyzing: false,
          consensus,
        }));

        toast({
          title: 'Analysis Complete',
          description: `${stock} analysis finished in ${result.execution_time_seconds?.toFixed(1) || '?'}s`,
        });
      }, debateRounds.length * 1500 + 2500);
      timeoutsRef.current.push(resultTimeout);

    } catch (error) {
      console.error('Analysis failed:', error);
      clearTimeouts();
      
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        currentPhase: 'idle',
        agents: prev.agents.map((a) => ({ ...a, status: 'idle' as const, progress: 0 })),
      }));

      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Unable to connect to backend API',
        variant: 'destructive',
      });
    }
  }, [clearTimeouts]);

  const resetAnalysis = useCallback(() => {
    clearTimeouts();
    abortControllerRef.current?.abort();
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
