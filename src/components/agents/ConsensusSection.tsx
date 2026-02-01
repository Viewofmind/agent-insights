import { cn } from '@/lib/utils';
import type { ConsensusResult } from '@/types/agent';
import { TrendingUp, TrendingDown, Minus, Target, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface ConsensusSectionProps {
  result: ConsensusResult;
  isBuilding?: boolean;
}

export function ConsensusSection({ result, isBuilding = false }: ConsensusSectionProps) {
  const totalVotes = result.votes.buy + result.votes.hold + result.votes.sell;
  const buyPercent = (result.votes.buy / totalVotes) * 100;
  const holdPercent = (result.votes.hold / totalVotes) * 100;
  const sellPercent = (result.votes.sell / totalVotes) * 100;

  const getRecommendationStyle = () => {
    switch (result.recommendation) {
      case 'BUY':
        return {
          bg: 'bg-gradient-to-br from-accent/20 to-accent/10',
          border: 'border-accent/50',
          text: 'text-accent',
          icon: TrendingUp,
          glow: 'glow-green',
        };
      case 'SELL':
        return {
          bg: 'bg-gradient-to-br from-destructive/20 to-destructive/10',
          border: 'border-destructive/50',
          text: 'text-destructive',
          icon: TrendingDown,
          glow: 'glow-purple',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-yellow/20 to-yellow/10',
          border: 'border-yellow/50',
          text: 'text-yellow',
          icon: Minus,
          glow: '',
        };
    }
  };

  const style = getRecommendationStyle();
  const Icon = style.icon;

  if (isBuilding) {
    return (
      <div className="glass rounded-xl p-6 animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-lg font-medium text-foreground">Building Consensus...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-celebration">
      {/* Main Recommendation Card */}
      <div
        className={cn(
          'glass rounded-2xl p-6 border-2',
          style.bg,
          style.border,
          style.glow
        )}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Recommendation Badge */}
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'w-20 h-20 rounded-2xl flex items-center justify-center',
                style.bg
              )}
            >
              <Icon className={cn('w-10 h-10', style.text)} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                Recommendation
              </p>
              <h2 className={cn('text-4xl font-bold', style.text)}>
                {result.recommendation}
              </h2>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Confidence</p>
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${result.confidence * 2.51} 251`}
                  className={style.text}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn('text-2xl font-bold', style.text)}>
                  {result.confidence}%
                </span>
              </div>
            </div>
          </div>

          {/* Price Target */}
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground mb-1">Price Target</p>
            <p className={cn('text-3xl font-bold', style.text)}>
              ${result.priceTarget.toFixed(2)}
            </p>
            <div className="flex items-center gap-1 justify-center md:justify-end mt-1">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                from ${result.currentPrice.toFixed(2)}
              </span>
            </div>
            <p className={cn('text-sm font-medium', style.text)}>
              {(((result.priceTarget - result.currentPrice) / result.currentPrice) * 100).toFixed(1)}% upside
            </p>
          </div>
        </div>
      </div>

      {/* Vote Breakdown */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Agent Votes</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-16 text-sm text-accent">Buy</span>
            <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-1000"
                style={{ width: `${buyPercent}%` }}
              />
            </div>
            <span className="w-8 text-sm text-muted-foreground text-right">
              {result.votes.buy}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-16 text-sm text-yellow">Hold</span>
            <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow rounded-full transition-all duration-1000"
                style={{ width: `${holdPercent}%` }}
              />
            </div>
            <span className="w-8 text-sm text-muted-foreground text-right">
              {result.votes.hold}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-16 text-sm text-destructive">Sell</span>
            <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-destructive rounded-full transition-all duration-1000"
                style={{ width: `${sellPercent}%` }}
              />
            </div>
            <span className="w-8 text-sm text-muted-foreground text-right">
              {result.votes.sell}
            </span>
          </div>
        </div>
      </div>

      {/* Key Reasons */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Key Reasons</h3>
        <ul className="space-y-3">
          {result.reasons.map((reason, index) => (
            <li key={index} className="flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1 bg-primary hover:bg-primary/90">
          Export Report
        </Button>
        <Button variant="outline" className="flex-1">
          Share Analysis
        </Button>
        <Button variant="outline" className="flex-1">
          Add to Watchlist
        </Button>
      </div>
    </div>
  );
}
