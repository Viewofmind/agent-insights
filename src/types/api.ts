export interface StockAnalysisRequest {
  symbol: string;
  depth?: 'quick' | 'standard' | 'comprehensive';
  include_valuation?: boolean;
  model?: string;
}

export interface StockAnalysisResponse {
  symbol: string;
  workflow_id: string;
  recommendation: 'Buy' | 'Hold' | 'Sell';
  confidence_score: number;
  current_price: number | null;
  target_price: number | null;
  fundamental_analysis: string | null;
  technical_analysis: string | null;
  news_analysis: string | null;
  risk_assessment: string | null;
  recommendation_reasoning: string | null;
  execution_time_seconds: number;
  tokens_used: number;
  cost_usd: number;
}

export interface PortfolioMonitorRequest {
  portfolio_id: string;
  symbols: string[];
}

export interface PortfolioMonitorResponse {
  portfolio_id: string;
  analysis: StockAnalysisResponse[];
}
