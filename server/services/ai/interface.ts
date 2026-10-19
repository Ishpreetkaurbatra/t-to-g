import type {
  TrendItem,
  BusinessProfile,
  ActionPlan,
  TrendAnalysisResult,
  BusinessMatchResult,
} from '../../types/index.ts';

export interface TrendAnalysisRequest {
  trend: {
    id?: string;
    name: string;
    category: string;
    description: string;
    location: string;
    momentum: string;
    growthRate?: string;
    confidence?: number;
    drivers?: string[];
  };
  business: {
    id?: string;
    name: string;
    category: string;
    location: string;
    targetCustomers: string;
    productsServices: string;
    businessSize: string;
    channels: string[];
    goals: string[];
  };
}

export interface OpportunityMatchRequest {
  trends: TrendItem[];
  business: BusinessProfile;
  minScore?: number;
  limit?: number;
}

export interface ActionPlanGenerationRequest {
  trend: {
    id?: string;
    name: string;
    category: string;
    description?: string;
  };
  business: BusinessProfile;
  customRequirements?: {
    objective?: string;
    timeline?: string;
    pilot?: string;
    channel?: string;
    estimatedEffort?: 'Low' | 'Medium' | 'High';
    expectedOpportunity?: 'Low' | 'Medium' | 'High';
    risks?: string[];
    successMetrics?: string[];
  };
}

export interface AIEngineStatus {
  provider: 'mock' | 'http' | 'gemini';
  status: 'ready' | 'mock-active' | 'unconfigured' | 'error';
  isMock: boolean;
  endpoint?: string;
  message: string;
  contractDocumentationUrl?: string;
}

/**
 * Clean, pluggable AI Engine Adapter interface.
 * Teammates can implement this interface in any language/microservice by pointing
 * the backend to their service URL or supplying an adapter.
 */
export interface IAIEngineAdapter {
  analyzeTrend(request: TrendAnalysisRequest): Promise<TrendAnalysisResult>;
  matchOpportunities(request: OpportunityMatchRequest): Promise<BusinessMatchResult>;
  generatePlan(request: ActionPlanGenerationRequest): Promise<ActionPlan>;
  getStatus(): AIEngineStatus;
}
