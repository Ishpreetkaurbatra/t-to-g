/**
 * Supabase client abstraction for T→G
 * Configured for Supabase PostgreSQL and Supabase Auth.
 * If credentials are not provided, gracefully falls back to the local Express/PostgreSQL API.
 */

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConfigured: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  return {
    supabaseUrl: url,
    supabaseAnonKey: key,
    isConfigured: Boolean(url && key),
  };
};

export const supabaseInfo = {
  version: '2.40.0-ready',
  schemaVersion: '1.0.0',
  tablesCovered: [
    'users',
    'businesses',
    'business_profiles',
    'trends',
    'trend_sources',
    'trend_analyses',
    'business_matches',
    'smart_alerts',
    'action_plans',
    'expert_reviews',
    'experiments',
    'experiment_results',
    'saved_trends',
    'notifications',
    'categories',
  ],
  rlsEnabled: true,
};
