import type {
  TrendItem,
  BusinessProfile,
  SmartAlert,
  ActionPlan,
  Experiment,
} from '../demoData.ts';

export type {
  TrendItem,
  BusinessProfile,
  SmartAlert,
  ActionPlan,
  Experiment,
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  code?: string;
  details?: any;
  meta?: Record<string, any>;
}

export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down';
  service: string;
  uptime: number;
  timestamp: string;
  version: string;
  environment: string;
}

export interface DependencyStatusResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  dependencies: {
    database: {
      provider: 'supabase' | 'in-memory-fallback';
      status: 'connected' | 'fallback' | 'error';
      message: string;
    };
    aiEngine: {
      provider: 'mock' | 'http' | 'gemini';
      status: 'ready' | 'mock-active' | 'unconfigured' | 'error';
      isMock: boolean;
      endpoint?: string;
      message: string;
    };
  };
  system: {
    nodeVersion: string;
    memoryUsageMB: number;
    platform: string;
  };
}

export interface TrendAnalysisResult {
  trend_summary: string;
  drivers: string[];
  target_audience: string[];
  business_relevance: number;
  opportunity_score: number;
  market_risk: string;
  competition_risk: string;
  adoption_risk: string;
  execution_risk: string;
  business_opportunity: string;
  recommended_actions: string[];
  innovative_plan: {
    objective: string;
    why_this_trend: string;
    recommended_action: string;
    target_customer: string;
    product_service_idea: string;
    marketing_approach: string;
    channel: string;
    pilot: string;
    timeline: string;
    estimated_effort: 'Low' | 'Medium' | 'High';
    expected_opportunity: 'Low' | 'Medium' | 'High';
    risks: string[];
    success_metrics: string[];
    test_measure_learn: {
      test: string;
      measure: string;
      learn: string;
      adapt: string;
    };
  };
  confidence: number;
  isMock?: boolean;
  engine?: string;
  disclaimer?: string;
}

export interface BusinessMatchItem {
  trendId: string;
  trendName: string;
  category: string;
  momentum: 'Rising' | 'Stable' | 'Declining';
  relevanceScore: number;
  opportunityScore: number;
  customerMatchScore: number;
  marketTimingScore: number;
  whyItMatters: string;
  potentialAction: string;
  confidence: number;
}

export interface BusinessMatchResult {
  businessId: string;
  businessName: string;
  category: string;
  location: string;
  matchedCount: number;
  matches: BusinessMatchItem[];
  isMock?: boolean;
  engine?: string;
}
