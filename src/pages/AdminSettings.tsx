import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, Loader2 } from 'lucide-react';
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
import { toast } from '@/hooks/use-toast';
import { AdminApiKeys } from '@/components/settings/AdminApiKeys';
import type { User, AppRole, AdminSettings as AdminSettingsType } from '@/types/database';

export default function AdminSettings() {
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
        .maybeSingle();

      if (error) {
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
          <AdminApiKeys
            llmKeys={llmKeys}
            dataServices={dataServices}
            systemConfig={systemConfig}
            onLlmKeysChange={(updates) => setLlmKeys(prev => ({ ...prev, ...updates }))}
            onDataServicesChange={(updates) => setDataServices(prev => ({ ...prev, ...updates }))}
            onSystemConfigChange={(updates) => setSystemConfig(prev => ({ ...prev, ...updates }))}
          />

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