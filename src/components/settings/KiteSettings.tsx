import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, X, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface KiteSettingsProps {
  kiteApiKey: string;
  kiteApiSecret: string;
  kiteConnected: boolean;
  onChange: (updates: { kiteApiKey?: string; kiteApiSecret?: string; kiteConnected?: boolean }) => void;
}

export function KiteSettings({ kiteApiKey, kiteApiSecret, kiteConnected, onChange }: KiteSettingsProps) {
  const handleConnectKite = () => {
    toast({
      title: 'Kite OAuth',
      description: 'Redirecting to Kite for authentication...',
    });
    setTimeout(() => {
      onChange({ kiteConnected: true });
      toast({
        title: 'Connected!',
        description: 'Successfully connected to Kite.',
      });
    }, 2000);
  };

  const handleDisconnectKite = () => {
    onChange({
      kiteConnected: false,
      kiteApiKey: '',
      kiteApiSecret: '',
    });
    toast({
      title: 'Disconnected',
      description: 'Kite connection has been removed.',
    });
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          Kite API Configuration
        </CardTitle>
        <CardDescription>
          Connect your Zerodha Kite account for live trading data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${kiteConnected ? 'bg-accent' : 'bg-destructive'}`} />
            <div>
              <p className="font-medium text-foreground">
                {kiteConnected ? 'Connected' : 'Not Connected'}
              </p>
              <p className="text-sm text-muted-foreground">
                {kiteConnected 
                  ? 'Your Kite account is linked' 
                  : 'Connect your Kite account to enable trading features'}
              </p>
            </div>
          </div>
          {kiteConnected ? (
            <Button variant="outline" onClick={handleDisconnectKite} className="gap-2">
              <X className="w-4 h-4" />
              Disconnect
            </Button>
          ) : (
            <Button onClick={handleConnectKite} className="gap-2 bg-gradient-to-r from-primary to-secondary">
              <ExternalLink className="w-4 h-4" />
              Connect Kite
            </Button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="kite-api-key">Kite API Key</Label>
            <Input
              id="kite-api-key"
              type="password"
              placeholder="Enter your API key"
              className="bg-background/50"
              value={kiteApiKey}
              onChange={(e) => onChange({ kiteApiKey: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="kite-api-secret">Kite API Secret</Label>
            <Input
              id="kite-api-secret"
              type="password"
              placeholder="Enter your API secret"
              className="bg-background/50"
              value={kiteApiSecret}
              onChange={(e) => onChange({ kiteApiSecret: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}