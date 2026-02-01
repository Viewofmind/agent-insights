import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield,
  Key, 
  Bot,
  Database,
  Users,
  Save,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import type { User, AppRole, AdminSettings as AdminSettingsType } from '@/types/database';

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

export default function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  
  const [llmKeys, setLlmKeys] = useState({
    openaiApiKey: '',
    anthropicApiKey: '',
  });

  const [dataServices, setDataServices] = useState({
    firecrawlApiKey: '',
    openbbToken: '',
    newsapiKey: '',
  });

  const [systemConfig, setSystemConfig] = useState({
    defaultModel: 'gpt-4o-mini',
    rateLimitPerMinute: 60,
    maxAgentsPerAnalysis: 5,
  });

  useEffect(() => {
    fetchAdminSettings();
    fetchUsers();
  }, []);

  const fetchAdminSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching admin settings:', error);
        return;
      }

      if (data) {
        const settings = data as unknown as AdminSettingsType;
        setLlmKeys({
          openaiApiKey: settings.openai_api_key || '',
          anthropicApiKey: settings.anthropic_api_key || '',
        });
        setDataServices({
          firecrawlApiKey: settings.firecrawl_api_key || '',
          openbbToken: settings.openbb_token || '',
          newsapiKey: settings.newsapi_key || '',
        });
        setSystemConfig({
          defaultModel: settings.default_model || 'gpt-4o-mini',
          rateLimitPerMinute: settings.rate_limit_per_minute || 60,
          maxAgentsPerAnalysis: settings.max_agents_per_analysis || 5,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers((data || []) as unknown as User[]);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

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

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole } as never)
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast({ title: 'User role updated' });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({ title: 'Error updating role', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !isActive } as never)
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: !isActive } : u));
      toast({ title: `User ${isActive ? 'deactivated' : 'activated'}` });
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({ title: 'Error updating user', variant: 'destructive' });
    }
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'super_admin': return 'default';
      case 'admin': return 'secondary';
      case 'analyst': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Configure system-wide settings and manage users
          </p>
        </div>

        <div className="space-y-6">
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
                    onChange={(value) => setLlmKeys(prev => ({ ...prev, openaiApiKey: value }))}
                  />
                  <p className="text-xs text-muted-foreground">Used for GPT-4 powered analysis</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                  <MaskedInput
                    id="anthropic-key"
                    placeholder="sk-ant-..."
                    value={llmKeys.anthropicApiKey}
                    onChange={(value) => setLlmKeys(prev => ({ ...prev, anthropicApiKey: value }))}
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
                    onChange={(value) => setDataServices(prev => ({ ...prev, firecrawlApiKey: value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openbb-token">OpenBB Token</Label>
                  <MaskedInput
                    id="openbb-token"
                    placeholder="Your token"
                    value={dataServices.openbbToken}
                    onChange={(value) => setDataServices(prev => ({ ...prev, openbbToken: value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newsapi-key">NewsAPI Key</Label>
                  <MaskedInput
                    id="newsapi-key"
                    placeholder="Your API key"
                    value={dataServices.newsapiKey}
                    onChange={(value) => setDataServices(prev => ({ ...prev, newsapiKey: value }))}
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
                    onValueChange={(value) => 
                      setSystemConfig(prev => ({ ...prev, defaultModel: value }))
                    }
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
                    onChange={(e) => 
                      setSystemConfig(prev => ({ ...prev, rateLimitPerMinute: parseInt(e.target.value) || 60 }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-agents">Max Agents per Analysis</Label>
                  <Input
                    id="max-agents"
                    type="number"
                    className="bg-background/50"
                    value={systemConfig.maxAgentsPerAnalysis}
                    onChange={(e) => 
                      setSystemConfig(prev => ({ ...prev, maxAgentsPerAnalysis: parseInt(e.target.value) || 5 }))
                    }
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

          {/* User Management */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user roles and access
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.email}</TableCell>
                            <TableCell>{user.full_name || '-'}</TableCell>
                            <TableCell>
                              <Badge variant={getRoleBadgeVariant(user.role)}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.is_active ? 'default' : 'destructive'}>
                                {user.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Select
                                  value={user.role}
                                  onValueChange={(value: AppRole) => handleRoleChange(user.id, value)}
                                >
                                  <SelectTrigger className="w-32 h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="analyst">Analyst</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="super_admin">Super Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleActive(user.id, user.is_active)}
                                  className={user.is_active ? 'text-destructive' : 'text-accent'}
                                >
                                  {user.is_active ? 'Deactivate' : 'Activate'}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}