import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { 
  Bot, 
  LineChart, 
  Briefcase, 
  TrendingUp, 
  TrendingDown,
  Minus,
  ArrowRight,
  Sparkles,
  Activity
} from 'lucide-react';
import type { RecentAnalysis } from '@/types/agent';

const recentAnalyses: RecentAnalysis[] = [
  { id: '1', stock: 'AAPL', date: '2 hours ago', recommendation: 'BUY', confidence: 78, status: 'completed' },
  { id: '2', stock: 'GOOGL', date: '5 hours ago', recommendation: 'HOLD', confidence: 62, status: 'completed' },
  { id: '3', stock: 'TSLA', date: '1 day ago', recommendation: 'SELL', confidence: 71, status: 'completed' },
  { id: '4', stock: 'MSFT', date: '2 days ago', recommendation: 'BUY', confidence: 85, status: 'completed' },
  { id: '5', stock: 'NVDA', date: '3 days ago', recommendation: 'BUY', confidence: 92, status: 'completed' },
];

const getRecommendationBadge = (recommendation: string) => {
  switch (recommendation) {
    case 'BUY':
      return <Badge className="bg-[#e8f5f1] text-[#2e8b6d] border-[#2e8b6d]/20 hover:bg-[#d5ebe5]"><TrendingUp className="w-3 h-3 mr-1" /> BUY</Badge>;
    case 'SELL':
      return <Badge className="bg-[#fce8e8] text-[#e57373] border-[#e57373]/20 hover:bg-[#f8d4d4]"><TrendingDown className="w-3 h-3 mr-1" /> SELL</Badge>;
    default:
      return <Badge className="bg-[#fef3e2] text-[#d4a654] border-[#d4a654]/20 hover:bg-[#fce9cc]"><Minus className="w-3 h-3 mr-1" /> HOLD</Badge>;
  }
};

export default function Index() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      
      <main className="container px-4 py-8">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e8f5f1] mb-6 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-[#2e8b6d]" />
              <span className="text-sm text-[#2e8b6d] font-medium">Powered by Multi-Agent AI</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up text-[#2d3e50]" style={{ animationDelay: '100ms' }}>
              AI-Powered
              <br />
              <span className="text-[#2e8b6d]">Investment Research</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Watch AI agents analyze, debate, and reach consensus on investment decisions in real-time. 
              The future of stock research is collaborative intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <Link to="/analyze">
                <Button size="lg" className="gap-2 bg-[#2e8b6d] hover:bg-[#267a5f] text-white">
                  <Bot className="w-5 h-5" />
                  Analyze Stock
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button size="lg" variant="outline" className="gap-2 border-[#2d3e50] text-[#2d3e50] hover:bg-[#2d3e50]/5">
                  <Briefcase className="w-5 h-5" />
                  Portfolio Review
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <Link to="/analyze" className="group">
            <Card className="bg-white border border-border shadow-soft hover:shadow-card transition-all duration-300 h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-[#e8f5f1] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LineChart className="w-6 h-6 text-[#2e8b6d]" />
                </div>
                <CardTitle className="text-[#2d3e50]">Analyze Stock</CardTitle>
                <CardDescription>
                  Run comprehensive AI analysis on any stock with real-time agent collaboration
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/portfolio" className="group">
            <Card className="bg-white border border-border shadow-soft hover:shadow-card transition-all duration-300 h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-[#eef2f7] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-[#2d3e50]" />
                </div>
                <CardTitle className="text-[#2d3e50]">Portfolio Review</CardTitle>
                <CardDescription>
                  Get AI-powered insights and rebalancing recommendations for your portfolio
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <div className="group cursor-pointer">
            <Card className="bg-white border border-border shadow-soft hover:shadow-card transition-all duration-300 h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-[#fef3e2] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6 text-[#d4a654]" />
                </div>
                <CardTitle className="text-[#2d3e50]">Market Screen</CardTitle>
                <CardDescription>
                  Scan the market for opportunities using AI-driven screening criteria
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Recent Analyses */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#2d3e50]">Recent Analyses</h2>
              <p className="text-muted-foreground">Latest stock research by our AI agents</p>
            </div>
            <Link to="/analyze">
              <Button variant="ghost" className="gap-2 text-[#2e8b6d] hover:text-[#267a5f] hover:bg-[#e8f5f1]">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <Card className="bg-white border border-border shadow-soft">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentAnalyses.map((analysis, index) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between p-4 hover:bg-[#fafafa] transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#eef2f7] flex items-center justify-center">
                        <span className="text-lg font-bold text-[#2d3e50]">{analysis.stock.slice(0, 2)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#2d3e50]">{analysis.stock}</h3>
                        <p className="text-sm text-muted-foreground">{analysis.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {getRecommendationBadge(analysis.recommendation)}
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-[#2d3e50]">{analysis.confidence}%</p>
                        <p className="text-xs text-muted-foreground">confidence</p>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0 text-[#2e8b6d] hover:bg-[#e8f5f1]">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Agent Overview */}
        <section className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#2d3e50] mb-2">Meet Your AI Agents</h2>
            <p className="text-muted-foreground">Specialized experts working together for better investment decisions</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: '📊', name: 'Fundamental Analyst', color: '#3d7ab5', bgColor: '#e8f0f7', desc: 'Financial statements & earnings' },
              { icon: '📈', name: 'Technical Analyst', color: '#2e8b6d', bgColor: '#e8f5f1', desc: 'Charts & price patterns' },
              { icon: '📰', name: 'News Monitor', color: '#d4a654', bgColor: '#fef3e2', desc: 'Market sentiment & news' },
              { icon: '⚠️', name: 'Risk Assessor', color: '#e57373', bgColor: '#fce8e8', desc: 'Risk factors & volatility' },
              { icon: '💼', name: 'Portfolio Manager', color: '#7c6bb5', bgColor: '#f0eef7', desc: 'Position sizing & allocation' },
            ].map((agent, index) => (
              <Card 
                key={agent.name}
                className="bg-white border border-border shadow-soft hover:shadow-card transition-all group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4 text-center">
                  <div 
                    className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: agent.bgColor }}
                  >
                    {agent.icon}
                  </div>
                  <h3 className="font-medium text-[#2d3e50] text-sm mb-1">{agent.name}</h3>
                  <p className="text-xs text-muted-foreground">{agent.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}