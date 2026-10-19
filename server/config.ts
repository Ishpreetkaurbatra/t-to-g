import dotenv from 'dotenv';

dotenv.config();

export interface ServerConfig {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  CORS_ORIGIN: string | string[];
  REQUEST_TIMEOUT_MS: number;
  AI_ENGINE_PROVIDER: 'mock' | 'http' | 'gemini';
  AI_ENGINE_URL: string;
  AI_ENGINE_API_KEY: string;
  AI_ENGINE_TIMEOUT_MS: number;
  GEMINI_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const getCorsOrigins = (originEnv?: string): string | string[] => {
  if (!originEnv || originEnv === '*') return '*';
  if (originEnv.includes(',')) {
    return originEnv.split(',').map((o) => o.trim()).filter(Boolean);
  }
  return originEnv.trim();
};

export const config: ServerConfig = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: (process.env.NODE_ENV as any) || 'development',
  CORS_ORIGIN: getCorsOrigins(process.env.CORS_ORIGIN),
  REQUEST_TIMEOUT_MS: parseInt(process.env.REQUEST_TIMEOUT_MS || '15000', 10),
  AI_ENGINE_PROVIDER: (process.env.AI_ENGINE_PROVIDER as any) || (process.env.GEMINI_API_KEY ? 'gemini' : 'mock'),
  AI_ENGINE_URL: process.env.AI_ENGINE_URL || '',
  AI_ENGINE_API_KEY: process.env.AI_ENGINE_API_KEY || '',
  AI_ENGINE_TIMEOUT_MS: parseInt(process.env.AI_ENGINE_TIMEOUT_MS || '10000', 10),
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};

/**
 * Returns safe diagnostic information about configuration without exposing credentials.
 */
export function getSafeConfigDiagnostics() {
  return {
    nodeEnv: config.NODE_ENV,
    port: config.PORT,
    timeoutMs: config.REQUEST_TIMEOUT_MS,
    corsOrigin: config.CORS_ORIGIN,
    aiEngine: {
      provider: config.AI_ENGINE_PROVIDER,
      isConfigured: Boolean(
        config.AI_ENGINE_PROVIDER === 'mock' ||
        (config.AI_ENGINE_PROVIDER === 'http' && config.AI_ENGINE_URL) ||
        (config.AI_ENGINE_PROVIDER === 'gemini' && config.GEMINI_API_KEY)
      ),
      hasExternalUrl: Boolean(config.AI_ENGINE_URL),
      hasApiKey: Boolean(config.AI_ENGINE_API_KEY || config.GEMINI_API_KEY),
      timeoutMs: config.AI_ENGINE_TIMEOUT_MS,
    },
    database: {
      provider: config.SUPABASE_URL ? 'supabase' : 'in-memory-fallback',
      hasUrl: Boolean(config.SUPABASE_URL),
      hasAnonKey: Boolean(config.SUPABASE_ANON_KEY),
    },
  };
}
