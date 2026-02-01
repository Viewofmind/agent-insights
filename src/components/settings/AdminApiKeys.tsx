import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot, Database, Key, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface MaskedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  id: string;
}

function MaskedInput({ value, onChange, placeholder, id }: MaskedInputProps) {
  const [visible, setVisible] = useState(false);
  const displayValue = value && !visible 
    ? '•'.repeat(Math.max(0, value.length - 4)) + value.slice(-4) 
    : value;

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        className="bg-background/50 pr-10"
        value={visible ? value : displayValue}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
        onClick={() => setVisible(!visible)}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </Button>
    </div>
  );
}

interface LlmKeysState {
  openaiApiKey: string;
  anthropicApiKey: string;
}

interface DataServicesState {
  firecrawlApiKey: string;
  openbbToken: string;
  newsapiKey: string;
}

interface SystemConfigState {
  defaultModel: string;
  rateLimitPerMinute: number;
  maxAgentsPerAnalysis: number;
}

interface AdminApiKeysProps {
  llmKeys: LlmKeysState;
  dataServices: DataServicesState;
  systemConfig: SystemConfigState;
  onLlmKeysChange: (updates: Partial<LlmKeysState>) => void;
  onDataServicesChange: (updates: Partial<DataServicesState>) => void;
  onSystemConfigChange: (updates: Partial<SystemConfigState>) => void;
}

export function AdminApiKeys({
  llmKeys,
  dataServices,
  systemConfig,
  onLlmKeysChange,
  onDataServicesChange,
  onSystemConfigChange,
}: AdminApiKeysProps) {
  const [loading, setLoading] = useState(false);

  const handleSaveLlmKeys = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          id: 'default',
          openai_api_key: llmKeys.openaiApiKey || null,
          anthropic_api_key: llmKeys.anthropicApiKey || null,
        } as never);

      if (error) throw error;
      toast({ title: 'LLM API Keys saved successfully' });
    } catch (error) {
      console.error('Error saving LLM keys:', error);
      toast({ title: 'Error saving keys', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDataServices = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          id: 'default',
          firecrawl_api_key: dataServices.firecrawlApiKey || null,
          openbb_token: dataServices.openbbToken || null,
          newsapi_key: dataServices.newsapiKey || null,
        } as never);

      if (error) throw error;
      toast({ title: 'Data services saved successfully' });
    } catch (error) {
      console.error('Error saving data services:', error);
      toast({ title: 'Error saving settings', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSystemConfig = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          id: 'default',
          default_model: systemConfig.defaultModel,
          rate_limit_per_minute: systemConfig.rateLimitPerMinute,
          max_agents_per_analysis: systemConfig.maxAgentsPerAnalysis,
        } as never);

      if (error) throw error;
      toast({ title: 'System configuration saved successfully' });
    } catch (error) {
      console.error('Error saving system config:', error);
      toast({ title: 'Error saving configuration', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* LLM API Keys */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            LLM API Keys
          </CardTitle>
          <CardDescription>
            Configure API keys for AI language models
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <MaskedInput
                id="openai-key"
                placeholder="sk-..."
                value={llmKeys.openaiApiKey}
                onChange={(value) => onLlmKeysChange({ openaiApiKey: value })}
              />
              <p className="text-xs text-muted-foreground">Used for GPT-4 powered analysis</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="anthropic-key">Anthropic API Key</Label>
              <MaskedInput
                id="anthropic-key"
                placeholder="sk-ant-..."
                value={llmKeys.anthropicApiKey}
                onChange={(value) => onLlmKeysChange({ anthropicApiKey: value })}
              />
              <p className="text-xs text-muted-foreground">Used for Claude models</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveLlmKeys} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save LLM Keys
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Services */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-secondary" />
            Data Services
          </CardTitle>
          <CardDescription>
            Configure external data service API keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firecrawl-key">Firecrawl API Key</Label>
              <MaskedInput
                id="firecrawl-key"
                placeholder="fc-..."
                value={dataServices.firecrawlApiKey}
                onChange={(value) => onDataServicesChange({ firecrawlApiKey: value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openbb-token">OpenBB Token</Label>
              <MaskedInput
                id="openbb-token"
                placeholder="Your token"
                value={dataServices.openbbToken}
                onChange={(value) => onDataServicesChange({ openbbToken: value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newsapi-key">NewsAPI Key</Label>
              <MaskedInput
                id="newsapi-key"
                placeholder="Your API key"
                value={dataServices.newsapiKey}
                onChange={(value) => onDataServicesChange({ newsapiKey: value })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveDataServices} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Data Services
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-accent" />
            System Configuration
          </CardTitle>
          <CardDescription>
            Configure system-wide analysis settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="default-model">Default Model</Label>
              <Select
                value={systemConfig.defaultModel}
                onValueChange={(value) => onSystemConfigChange({ defaultModel: value })}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate-limit">Rate Limit (per minute)</Label>
              <Input
                id="rate-limit"
                type="number"
                className="bg-background/50"
                value={systemConfig.rateLimitPerMinute}
                onChange={(e) => onSystemConfigChange({ rateLimitPerMinute: parseInt(e.target.value) || 60 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-agents">Max Agents per Analysis</Label>
              <Input
                id="max-agents"
                type="number"
                className="bg-background/50"
                value={systemConfig.maxAgentsPerAnalysis}
                onChange={(e) => onSystemConfigChange({ maxAgentsPerAnalysis: parseInt(e.target.value) || 5 })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveSystemConfig} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}