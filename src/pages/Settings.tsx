import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { KiteSettings } from '@/components/settings/KiteSettings';
import { UserPreferences } from '@/components/settings/UserPreferences';
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

  const handleKiteChange = (updates: Partial<FormSettings>) => {
    setFormSettings(prev => ({ ...prev, ...updates }));
  };

  const handlePreferencesChange = (updates: Partial<FormSettings>) => {
    setFormSettings(prev => ({ ...prev, ...updates }));
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
          <KiteSettings
            kiteApiKey={formSettings.kiteApiKey}
            kiteApiSecret={formSettings.kiteApiSecret}
            kiteConnected={formSettings.kiteConnected}
            onChange={handleKiteChange}
          />

          <UserPreferences
            defaultExchange={formSettings.defaultExchange}
            theme={formSettings.theme}
            notificationEnabled={formSettings.notificationEnabled}
            onChange={handlePreferencesChange}
          />

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