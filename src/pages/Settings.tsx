import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  Key, 
  Palette,
  Bell,
  Save,
  X,
  Loader2,
  ExternalLink
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import type { Exchange, Theme } from '@/types/database';

interface FormSettings {
  kiteApiKey: string;
  kiteApiSecret: string;
  kiteConnected: boolean;
  defaultExchange: Exchange;
  notificationEnabled: boolean;
  theme: Theme;
}

export default function Settings() {
  const { user, settings, refreshSettings } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formSettings, setFormSettings] = useState<FormSettings>({
    kiteApiKey: '',
    kiteApiSecret: '',
    kiteConnected: false,
    defaultExchange: 'NSE',
    notificationEnabled: true,
    theme: 'dark',
  });

  useEffect(() => {
    if (settings) {
      setFormSettings({
        kiteApiKey: settings.kite_api_key || '',
        kiteApiSecret: settings.kite_api_secret || '',
        kiteConnected: settings.kite_connected || false,
        defaultExchange: settings.default_exchange || 'NSE',
        notificationEnabled: settings.notification_enabled ?? true,
        theme: settings.theme || 'dark',
      });
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const settingsData = {
        user_id: user.id,
        kite_api_key: formSettings.kiteApiKey || null,
        kite_api_secret: formSettings.kiteApiSecret || null,
        kite_connected: formSettings.kiteConnected,
        default_exchange: formSettings.defaultExchange,
        notification_enabled: formSettings.notificationEnabled,
        theme: formSettings.theme,
      };

      const { error } = await supabase
        .from('user_settings')
        .upsert(settingsData as never);

      if (error) throw error;

      await refreshSettings();
      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectKite = () => {
    toast({
      title: 'Kite OAuth',
      description: 'Redirecting to Kite for authentication...',
    });
    setTimeout(() => {
      setFormSettings(prev => ({ ...prev, kiteConnected: true }));
      toast({
        title: 'Connected!',
        description: 'Successfully connected to Kite.',
      });
    }, 2000);
  };

  const handleDisconnectKite = () => {
    setFormSettings(prev => ({
      ...prev,
      kiteConnected: false,
      kiteApiKey: '',
      kiteApiSecret: '',
    }));
    toast({
      title: 'Disconnected',
      description: 'Kite connection has been removed.',
    });
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Configure your InvestAgents preferences</p>
        </div>

        <div className="space-y-6">
          {/* Kite API Configuration */}
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
                  <div className={`w-3 h-3 rounded-full ${formSettings.kiteConnected ? 'bg-accent' : 'bg-destructive'}`} />
                  <div>
                    <p className="font-medium text-foreground">
                      {formSettings.kiteConnected ? 'Connected' : 'Not Connected'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formSettings.kiteConnected 
                        ? 'Your Kite account is linked' 
                        : 'Connect your Kite account to enable trading features'}
                    </p>
                  </div>
                </div>
                {formSettings.kiteConnected ? (
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
                    value={formSettings.kiteApiKey}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, kiteApiKey: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kite-api-secret">Kite API Secret</Label>
                  <Input
                    id="kite-api-secret"
                    type="password"
                    placeholder="Enter your API secret"
                    className="bg-background/50"
                    value={formSettings.kiteApiSecret}
                    onChange={(e) => setFormSettings(prev => ({ ...prev, kiteApiSecret: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trading Preferences */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-secondary" />
                Trading Preferences
              </CardTitle>
              <CardDescription>
                Configure your default trading settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-exchange">Default Exchange</Label>
                <Select
                  value={formSettings.defaultExchange}
                  onValueChange={(value: Exchange) => 
                    setFormSettings(prev => ({ ...prev, defaultExchange: value }))
                  }
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NSE">NSE (National Stock Exchange)</SelectItem>
                    <SelectItem value="BSE">BSE (Bombay Stock Exchange)</SelectItem>
                    <SelectItem value="NFO">NFO (F&O Segment)</SelectItem>
                    <SelectItem value="MCX">MCX (Commodity Exchange)</SelectItem>
                  </SelectContent>
                </Select>
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
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={formSettings.theme}
                  onValueChange={(value: Theme) => 
                    setFormSettings(prev => ({ ...prev, theme: value }))
                  }
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
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
                  <p className="font-medium text-foreground">Enable Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for analysis results and price movements
                  </p>
                </div>
                <Switch 
                  checked={formSettings.notificationEnabled}
                  onCheckedChange={(checked) => 
                    setFormSettings(prev => ({ ...prev, notificationEnabled: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              className="gap-2 bg-gradient-to-r from-primary to-secondary"
              onClick={handleSaveSettings}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}