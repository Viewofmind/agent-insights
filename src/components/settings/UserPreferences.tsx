import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Palette, Bell } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Exchange, Theme } from '@/types/database';

interface UserPreferencesProps {
  defaultExchange: Exchange;
  theme: Theme;
  notificationEnabled: boolean;
  onChange: (updates: { defaultExchange?: Exchange; theme?: Theme; notificationEnabled?: boolean }) => void;
}

export function UserPreferences({ defaultExchange, theme, notificationEnabled, onChange }: UserPreferencesProps) {
  return (
    <>
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
              value={defaultExchange}
              onValueChange={(value: Exchange) => onChange({ defaultExchange: value })}
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
              value={theme}
              onValueChange={(value: Theme) => onChange({ theme: value })}
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
              checked={notificationEnabled}
              onCheckedChange={(checked) => onChange({ notificationEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}