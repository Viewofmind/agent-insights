import type { AnalysisOptions } from '@/types/agent';
import type { StockAnalysisResponse, PortfolioMonitorResponse } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://167.99.113.70:8000';

export const api = {
  baseUrl: API_BASE_URL,

  async analyzeStock(symbol: string, options: AnalysisOptions): Promise<StockAnalysisResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/workflows/stock-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol,
        depth: 'comprehensive',
        include_valuation: options.valuation,
        model: 'gpt-4o-mini',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Analysis failed: ${error}`);
    }

    return response.json();
  },

  async monitorPortfolio(portfolioId: string, symbols: string[]): Promise<PortfolioMonitorResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/workflows/portfolio-monitor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portfolio_id: portfolioId, symbols }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Portfolio monitoring failed: ${error}`);
    }

    return response.json();
  },
};
