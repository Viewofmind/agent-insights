export type AppRole = 'user' | 'analyst' | 'admin' | 'super_admin';
export type Exchange = 'NSE' | 'BSE' | 'NFO' | 'MCX';
export type Theme = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: AppRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  user_id: string;
  kite_api_key: string | null;
  kite_api_secret: string | null;
  kite_access_token: string | null;
  kite_connected: boolean;
  default_exchange: Exchange;
  notification_enabled: boolean;
  theme: Theme;
  created_at: string;
  updated_at: string;
}

export interface AdminSettings {
  id: string;
  openai_api_key: string | null;
  anthropic_api_key: string | null;
  firecrawl_api_key: string | null;
  openbb_token: string | null;
  newsapi_key: string | null;
  default_model: string;
  rate_limit_per_minute: number;
  max_agents_per_analysis: number;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Partial<User> & { id: string; email: string };
        Update: Partial<User>;
      };
      user_settings: {
        Row: UserSettings;
        Insert: Partial<UserSettings> & { user_id: string };
        Update: Partial<UserSettings>;
      };
      admin_settings: {
        Row: AdminSettings;
        Insert: Partial<AdminSettings> & { id: string };
        Update: Partial<AdminSettings>;
      };
      user_roles: {
        Row: UserRole;
        Insert: { user_id: string; role: AppRole };
        Update: { role?: AppRole };
      };
    };
    Functions: {
      has_role: {
        Args: { _user_id: string; _role: AppRole };
        Returns: boolean;
      };
    };
  };
}