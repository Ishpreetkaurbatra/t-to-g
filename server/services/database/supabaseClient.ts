import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../../config.ts';

let client: SupabaseClient | null = null;
let connectionAttempted = false;
let isConnected = false;
let lastCheckError: string | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client;

  if (config.SUPABASE_URL && (config.SUPABASE_SERVICE_ROLE_KEY || config.SUPABASE_ANON_KEY)) {
    try {
      const key = config.SUPABASE_SERVICE_ROLE_KEY || config.SUPABASE_ANON_KEY;
      client = createClient(config.SUPABASE_URL, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      return client;
    } catch (err: any) {
      lastCheckError = err.message || 'Failed to initialize Supabase client';
      return null;
    }
  }

  return null;
}

export async function checkDatabaseHealth(): Promise<{
  provider: 'supabase' | 'in-memory-fallback';
  status: 'connected' | 'fallback' | 'error';
  message: string;
}> {
  const sb = getSupabaseClient();
  if (!sb) {
    return {
      provider: 'in-memory-fallback',
      status: 'fallback',
      message: 'Supabase credentials not configured in environment; running on resilient in-memory data fallback.',
    };
  }

  try {
    // Quick probe to test connectivity
    const { error } = await sb.from('trends').select('id').limit(1);
    if (error) {
      lastCheckError = error.message;
      isConnected = false;
      return {
        provider: 'supabase',
        status: 'degraded' as any,
        message: `Supabase reachable but query returned error: ${error.message}. Using development fallback store.`,
      };
    }
    isConnected = true;
    lastCheckError = null;
    return {
      provider: 'supabase',
      status: 'connected',
      message: 'Successfully connected to Supabase PostgreSQL database.',
    };
  } catch (err: any) {
    lastCheckError = err.message || 'Database connection error';
    isConnected = false;
    return {
      provider: 'in-memory-fallback',
      status: 'fallback',
      message: `Supabase ping failed (${err.message || 'connection error'}). Using in-memory fallback.`,
    };
  }
}
