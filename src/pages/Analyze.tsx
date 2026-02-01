import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AgentCard } from '@/components/agents/AgentCard';
import { DebateVisualization } from '@/components/agents/DebateVisualization';
import { ConsensusSection } from '@/components/agents/ConsensusSection';
import { useAnalysis } from '@/hooks/useAnalysis';
import { Search, Play, RotateCcw, Bot } from 'lucide-react';
import type { AnalysisOptions } from '@/types/agent';

const defaultOptions: AnalysisOptions = {
  fundamental: true,
  technical: true,
  news: true,
  risk: true,
  valuation: true,
};

export default function Analyze() {
  const [stockSymbol, setStockSymbol] = useState('AAPL');
  const [options, setOptions] = useState<AnalysisOptions>(defaultOptions);
  const { state, startAnalysis, resetAnalysis } = useAnalysis();

  const handleStartAnalysis = () => {
    if (!stockSymbol.trim()) return;
    startAnalysis(stockSymbol.toUpperCase(), options);
  };

  const handleReset = () => {
    resetAnalysis();
    setStockSymbol('');
    setOptions(defaultOptions);
  };

  const updateOption = (key: keyof AnalysisOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Controls */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  Stock Analysis
                </CardTitle>
                <CardDescription>
                  Enter a stock symbol to start AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="symbol">Stock Symbol</Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., AAPL, GOOGL, TSLA"
                    value={stockSymbol}
                    onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                    disabled={state.isAnalyzing}
                    className="mt-1.5 bg-background/50"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Analysis Options</Label>
                  {[
                    { key: 'fundamental' as const, label: 'Fundamental Analysis', icon: '📊' },
                    { key: 'technical' as const, label: 'Technical Analysis', icon: '📈' },
                    { key: 'news' as const, label: 'News Sentiment', icon: '📰' },
                    { key: 'risk' as const, label: 'Risk Assessment', icon: '⚠️' },
                    { key: 'valuation' as const, label: 'Valuation', icon: '💼' },
                  ].map((option) => (
                    <div key={option.key} className="flex items-center gap-3">
                      <Checkbox
                        id={option.key}
                        checked={options[option.key]}
                        onCheckedChange={() => updateOption(option.key)}
                        disabled={state.isAnalyzing}
                      />
                      <Label
                        htmlFor={option.key}
                        className="flex items-center gap-2 cursor-pointer text-sm"
                      >
                        <span>{option.icon}</span>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleStartAnalysis}
                    disabled={state.isAnalyzing || !stockSymbol.trim()}
                    className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    {state.isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start Analysis
                      </>
                    )}
                  </Button>
                  {(state.isAnalyzing || state.consensus) && (
                    <Button variant="outline" size="icon" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Progress */}
            {state.isAnalyzing && (
              <Card className="glass border-border/50 animate-fade-in-up">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Analyzing {state.stock}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        Phase: {state.currentPhase}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {['agents', 'debate', 'consensus'].map((phase, index) => (
                      <div
                        key={phase}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          state.currentPhase === phase
                            ? 'bg-primary animate-pulse'
                            : ['agents', 'debate', 'consensus'].indexOf(state.currentPhase) > index
                            ? 'bg-accent'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>

          {/* Center Panel - Agent Visualization */}
          <div className="flex-1 space-y-6">
            {state.currentPhase === 'idle' && !state.consensus && (
              <Card className="glass border-border/50 min-h-[400px] flex items-center justify-center">
                <CardContent className="text-center py-16">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                    <Bot className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Enter a stock symbol and click "Start Analysis" to watch our AI agents 
                    collaborate on investment research in real-time.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Agent Cards */}
            {state.agents.length > 0 && state.currentPhase !== 'idle' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Agent Analysis</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {state.agents.map((agent, index) => (
                    <AgentCard key={agent.id} agent={agent} delay={index * 400} />
                  ))}
                </div>
              </div>
            )}

            {/* Debate Section */}
            {state.currentPhase === 'debate' && state.debateRounds.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Investment Committee Debate</h2>
                <DebateVisualization
                  rounds={state.debateRounds}
                  currentRound={state.debateRounds.length}
                  isActive={state.isAnalyzing}
                />
              </div>
            )}

            {/* Consensus Section */}
            {state.currentPhase === 'consensus' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {state.consensus ? 'Final Recommendation' : 'Building Consensus...'}
                </h2>
                {state.consensus ? (
                  <ConsensusSection result={state.consensus} />
                ) : (
                  <ConsensusSection
                    result={{
                      recommendation: 'BUY',
                      confidence: 0,
                      priceTarget: 0,
                      currentPrice: 0,
                      reasons: [],
                      votes: { buy: 0, hold: 0, sell: 0 },
                    }}
                    isBuilding
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
