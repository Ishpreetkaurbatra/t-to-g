import type {
  IAIEngineAdapter,
  TrendAnalysisRequest,
  OpportunityMatchRequest,
  ActionPlanGenerationRequest,
  AIEngineStatus,
} from './interface.ts';
import type {
  TrendAnalysisResult,
  BusinessMatchResult,
  ActionPlan,
} from '../../types/index.ts';
import { config } from '../../config.ts';

export class HttpAIEngineAdapter implements IAIEngineAdapter {
  private baseUrl: string;
  private apiKey: string;
  private timeoutMs: number;

  constructor(
    baseUrl: string = config.AI_ENGINE_URL,
    apiKey: string = config.AI_ENGINE_API_KEY,
    timeoutMs: number = config.AI_ENGINE_TIMEOUT_MS
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.timeoutMs = timeoutMs;
  }

  public getStatus(): AIEngineStatus {
    const isConfigured = Boolean(this.baseUrl);
    return {
      provider: 'http',
      status: isConfigured ? 'ready' : 'unconfigured',
      isMock: false,
      endpoint: this.baseUrl || undefined,
      message: isConfigured
        ? `Connected to external AI Engine microservice at ${this.baseUrl}`
        : 'External AI Engine URL not configured. Set AI_ENGINE_URL in .env.',
    };
  }

  private async fetchWithTimeout(endpoint: string, payload: any): Promise<any> {
    if (!this.baseUrl) {
      throw new Error('AI_ENGINE_URL is not configured. Set AI_ENGINE_URL in your environment or use mock provider.');
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI Engine service returned ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error(`AI Engine request to ${endpoint} timed out after ${this.timeoutMs}ms`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  public async analyzeTrend(req: TrendAnalysisRequest): Promise<TrendAnalysisResult> {
    const result = await this.fetchWithTimeout('/analyze', req);
    return {
      ...result,
      isMock: false,
      engine: 'external-http-engine',
    };
  }

  public async matchOpportunities(req: OpportunityMatchRequest): Promise<BusinessMatchResult> {
    const result = await this.fetchWithTimeout('/match', req);
    return {
      ...result,
      isMock: false,
      engine: 'external-http-engine',
    };
  }

  public async generatePlan(req: ActionPlanGenerationRequest): Promise<ActionPlan> {
    const result = await this.fetchWithTimeout('/plan', req);
    return {
      ...result,
      id: result.id || `plan-ai-${Date.now()}`,
      createdAt: result.createdAt || new Date().toISOString(),
      updatedAt: result.updatedAt || new Date().toISOString(),
    };
  }
}
