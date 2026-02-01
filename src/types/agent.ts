export type AgentType = 'fundamental' | 'technical' | 'news' | 'risk' | 'portfolio';

export type AgentStatus = 'idle' | 'thinking' | 'analyzing' | 'complete';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  icon: string;
  color: string;
  status: AgentStatus;
  currentTask: string;
  progress: number;
  finding?: string;
}

export interface DebateMessage {
  agentId: string;
  agentName: string;
  agentIcon: string;
  agentColor: string;
  message: string;
  position: 'for' | 'against' | 'neutral';
  timestamp: number;
}

export interface DebateRound {
  round: number;
  title: string;
  messages: DebateMessage[];
}

export type RecommendationType = 'BUY' | 'HOLD' | 'SELL';

export interface ConsensusResult {
  recommendation: RecommendationType;
  confidence: number;
  priceTarget: number;
  currentPrice: number;
  reasons: string[];
  votes: {
    buy: number;
    hold: number;
    sell: number;
  };
}

export interface AnalysisState {
  stock: string;
  isAnalyzing: boolean;
  currentPhase: 'idle' | 'agents' | 'debate' | 'consensus';
  agents: Agent[];
  debateRounds: DebateRound[];
  consensus?: ConsensusResult;
}

export interface AnalysisOptions {
  fundamental: boolean;
  technical: boolean;
  news: boolean;
  risk: boolean;
  valuation: boolean;
}

export interface RecentAnalysis {
  id: string;
  stock: string;
  date: string;
  recommendation: RecommendationType;
  confidence: number;
  status: 'completed' | 'in-progress' | 'failed';
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  value: number;
  allocation: number;
}
