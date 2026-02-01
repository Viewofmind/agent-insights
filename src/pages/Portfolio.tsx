import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  AlertTriangle,
  RefreshCw,
  Download,
  Plus
} from 'lucide-react';
import type { PortfolioHolding } from '@/types/agent';

const holdings: PortfolioHolding[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', shares: 50, avgCost: 165.00, currentPrice: 178.50, change: 2.35, changePercent: 1.33, value: 8925.00, allocation: 28.5 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 25, avgCost: 340.00, currentPrice: 378.20, change: -1.80, changePercent: -0.47, value: 9455.00, allocation: 30.2 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 30, avgCost: 135.00, currentPrice: 141.50, change: 0.85, changePercent: 0.60, value: 4245.00, allocation: 13.6 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 15, avgCost: 420.00, currentPrice: 485.30, change: 8.40, changePercent: 1.76, value: 7279.50, allocation: 23.3 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 8, avgCost: 155.00, currentPrice: 172.80, change: -0.50, changePercent: -0.29, value: 1382.40, allocation: 4.4 },
];

const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
const totalGain = holdings.reduce((sum, h) => sum + (h.currentPrice - h.avgCost) * h.shares, 0);
const totalGainPercent = (totalGain / (totalValue - totalGain)) * 100;

const aiRecommendations = [
  { type: 'rebalance', message: 'MSFT allocation is high at 30.2%. Consider trimming to reduce concentration risk.', priority: 'medium' },
  { type: 'opportunity', message: 'NVDA showing strong momentum. Consider adding on pullbacks below $470.', priority: 'low' },
  { type: 'risk', message: 'Portfolio is tech-heavy (95%+). Add diversification with healthcare or financials.', priority: 'high' },
];

export default function Portfolio() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container px-4 py-8">
        {/* Portfolio Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Value</p>
              <p className="text-3xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Gain/Loss</p>
              <p className={`text-3xl font-bold ${totalGain >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {totalGain >= 0 ? '+' : ''}${totalGain.toFixed(2)}
              </p>
              <p className={`text-sm ${totalGain >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%
              </p>
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Positions</p>
              <p className="text-3xl font-bold text-foreground">{holdings.length}</p>
            </CardContent>
          </Card>
          <Card className="glass border-border/50">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Risk Score</p>
              <p className="text-3xl font-bold text-yellow">6.8/10</p>
              <p className="text-sm text-muted-foreground">Moderate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Holdings Table */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Holdings</CardTitle>
                  <CardDescription>Your current stock positions</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </Button>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Position
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Symbol</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Shares</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Price</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Change</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Value</th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">Allocation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdings.map((holding) => (
                        <tr key={holding.symbol} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                <span className="text-sm font-bold">{holding.symbol.slice(0, 2)}</span>
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{holding.symbol}</p>
                                <p className="text-xs text-muted-foreground">{holding.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right text-foreground">{holding.shares}</td>
                          <td className="p-4 text-right text-foreground">${holding.currentPrice.toFixed(2)}</td>
                          <td className="p-4 text-right">
                            <div className={`flex items-center justify-end gap-1 ${holding.change >= 0 ? 'text-accent' : 'text-destructive'}`}>
                              {holding.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              <span>{holding.change >= 0 ? '+' : ''}{holding.changePercent.toFixed(2)}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-right font-medium text-foreground">${holding.value.toLocaleString()}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary rounded-full" 
                                  style={{ width: `${holding.allocation}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-12">{holding.allocation}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Allocation Chart */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                      {holdings.map((holding, index) => {
                        const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
                        const startAngle = holdings.slice(0, index).reduce((sum, h) => sum + h.allocation, 0) * 3.6;
                        const angle = holding.allocation * 3.6;
                        const x1 = 80 + 60 * Math.cos((startAngle * Math.PI) / 180);
                        const y1 = 80 + 60 * Math.sin((startAngle * Math.PI) / 180);
                        const x2 = 80 + 60 * Math.cos(((startAngle + angle) * Math.PI) / 180);
                        const y2 = 80 + 60 * Math.sin(((startAngle + angle) * Math.PI) / 180);
                        const largeArc = angle > 180 ? 1 : 0;
                        
                        return (
                          <path
                            key={holding.symbol}
                            d={`M 80 80 L ${x1} ${y1} A 60 60 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={colors[index]}
                            className="hover:opacity-80 transition-opacity cursor-pointer"
                          />
                        );
                      })}
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  {holdings.map((holding, index) => {
                    const colors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-yellow', 'bg-destructive'];
                    return (
                      <div key={holding.symbol} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                          <span className="text-foreground">{holding.symbol}</span>
                        </div>
                        <span className="text-muted-foreground">{holding.allocation}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiRecommendations.map((rec, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${
                      rec.priority === 'high' 
                        ? 'bg-destructive/10 border-destructive/30' 
                        : rec.priority === 'medium'
                        ? 'bg-yellow/10 border-yellow/30'
                        : 'bg-accent/10 border-accent/30'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <Badge 
                        variant="outline" 
                        className={`shrink-0 ${
                          rec.priority === 'high' 
                            ? 'border-destructive text-destructive' 
                            : rec.priority === 'medium'
                            ? 'border-yellow text-yellow'
                            : 'border-accent text-accent'
                        }`}
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground mt-2">{rec.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Export Button */}
            <Button variant="outline" className="w-full gap-2">
              <Download className="w-4 h-4" />
              Export Portfolio Report
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
