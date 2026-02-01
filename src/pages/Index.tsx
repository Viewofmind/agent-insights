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
  Activity,
  Zap
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
      return <Badge className="bg-accent/20 text-accent border-accent/30 hover:bg-accent/30"><TrendingUp className="w-3 h-3 mr-1" /> BUY</Badge>;
    case 'SELL':
      return <Badge className="bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30"><TrendingDown className="w-3 h-3 mr-1" /> SELL</Badge>;
    default:
      return <Badge className="bg-yellow/20 text-yellow border-yellow/30 hover:bg-yellow/30"><Minus className="w-3 h-3 mr-1" /> HOLD</Badge>;
  }
};

export default function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container px-4 py-8">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background glow effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          </div>

          <div className="relative text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Powered by Multi-Agent AI</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <span className="text-gradient">AI-Powered</span>
              <br />
              Investment Research
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              Watch AI agents analyze, debate, and reach consensus on investment decisions in real-time. 
              The future of stock research is collaborative intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <Link to="/analyze">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity glow-blue">
                  <Bot className="w-5 h-5" />
                  Analyze Stock
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button size="lg" variant="outline" className="gap-2">
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
            <Card className="glass border-border/50 hover:border-primary/50 transition-all duration-300 group-hover:glow-blue h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LineChart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Analyze Stock</CardTitle>
                <CardDescription>
                  Run comprehensive AI analysis on any stock with real-time agent collaboration
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/portfolio" className="group">
            <Card className="glass border-border/50 hover:border-secondary/50 transition-all duration-300 group-hover:glow-purple h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Portfolio Review</CardTitle>
                <CardDescription>
                  Get AI-powered insights and rebalancing recommendations for your portfolio
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <div className="group cursor-pointer">
            <Card className="glass border-border/50 hover:border-accent/50 transition-all duration-300 group-hover:glow-green h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Market Screen</CardTitle>
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
              <h2 className="text-2xl font-bold text-foreground">Recent Analyses</h2>
              <p className="text-muted-foreground">Latest stock research by our AI agents</p>
            </div>
            <Link to="/analyze">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <Card className="glass border-border/50">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentAnalyses.map((analysis, index) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="text-lg font-bold text-foreground">{analysis.stock.slice(0, 2)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{analysis.stock}</h3>
                        <p className="text-sm text-muted-foreground">{analysis.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {getRecommendationBadge(analysis.recommendation)}
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-foreground">{analysis.confidence}%</p>
                        <p className="text-xs text-muted-foreground">confidence</p>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Meet Your AI Agents</h2>
            <p className="text-muted-foreground">Specialized experts working together for better investment decisions</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: '📊', name: 'Fundamental Analyst', color: '#3B82F6', desc: 'Financial statements & earnings' },
              { icon: '📈', name: 'Technical Analyst', color: '#10B981', desc: 'Charts & price patterns' },
              { icon: '📰', name: 'News Monitor', color: '#F59E0B', desc: 'Market sentiment & news' },
              { icon: '⚠️', name: 'Risk Assessor', color: '#EF4444', desc: 'Risk factors & volatility' },
              { icon: '💼', name: 'Portfolio Manager', color: '#8B5CF6', desc: 'Position sizing & allocation' },
            ].map((agent, index) => (
              <Card 
                key={agent.name}
                className="glass border-border/50 hover:border-primary/30 transition-all group animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4 text-center">
                  <div 
                    className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                    style={{ 
                      background: `linear-gradient(135deg, ${agent.color}30, ${agent.color}10)`,
                      boxShadow: `0 4px 20px ${agent.color}20`,
                    }}
                  >
                    {agent.icon}
                  </div>
                  <h3 className="font-medium text-foreground text-sm mb-1">{agent.name}</h3>
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
