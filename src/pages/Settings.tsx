import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  Key, 
  Bot, 
  Palette,
  Bell,
  Shield,
  Save
} from 'lucide-react';

export default function Settings() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Configure your InvestAgents preferences</p>
        </div>

        <div className="space-y-6">
          {/* API Configuration */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Connect your AI providers for enhanced analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-..."
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">Used for GPT-4 powered analysis</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alpha-vantage">Alpha Vantage API Key</Label>
                <Input
                  id="alpha-vantage"
                  type="password"
                  placeholder="Your API key"
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">Used for real-time market data</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="news-api">News API Key</Label>
                <Input
                  id="news-api"
                  type="password"
                  placeholder="Your API key"
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground">Used for news sentiment analysis</p>
              </div>
            </CardContent>
          </Card>

          {/* Model Selection */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-secondary" />
                AI Model Selection
              </CardTitle>
              <CardDescription>
                Choose which AI models power your agents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: 'GPT-4 Turbo', desc: 'Best quality, slower', selected: true },
                  { name: 'GPT-4', desc: 'High quality, balanced', selected: false },
                  { name: 'GPT-3.5 Turbo', desc: 'Fast, cost effective', selected: false },
                  { name: 'Ollama (Local)', desc: 'Private, requires setup', selected: false },
                ].map((model) => (
                  <div
                    key={model.name}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      model.selected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{model.name}</span>
                      {model.selected && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{model.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agent Preferences */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-accent" />
                Agent Preferences
              </CardTitle>
              <CardDescription>
                Customize how agents analyze and collaborate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Enable Debate Mode</p>
                  <p className="text-sm text-muted-foreground">Allow agents to debate before reaching consensus</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Detailed Analysis</p>
                  <p className="text-sm text-muted-foreground">Include comprehensive technical indicators</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Risk-Adjusted Recommendations</p>
                  <p className="text-sm text-muted-foreground">Factor in your risk tolerance for recommendations</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Auto-refresh Portfolio</p>
                  <p className="text-sm text-muted-foreground">Update prices every 5 minutes during market hours</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-yellow" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Use dark theme (recommended)</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Reduce Animations</p>
                  <p className="text-sm text-muted-foreground">Minimize motion for accessibility</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Compact Mode</p>
                  <p className="text-sm text-muted-foreground">Show more information in less space</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-destructive" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Analysis Complete</p>
                  <p className="text-sm text-muted-foreground">Notify when analysis finishes</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Price Alerts</p>
                  <p className="text-sm text-muted-foreground">Alert when watched stocks hit targets</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Weekly Portfolio Summary</p>
                  <p className="text-sm text-muted-foreground">Receive weekly AI portfolio review</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="gap-2 bg-gradient-to-r from-primary to-secondary">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
