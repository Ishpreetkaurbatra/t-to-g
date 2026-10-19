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
import { analyzeTrendWithGemini } from '../../gemini.ts';
import { config } from '../../config.ts';

export class GeminiAIEngineAdapter implements IAIEngineAdapter {
  public getStatus(): AIEngineStatus {
    const isConfigured = Boolean(config.GEMINI_API_KEY);
    return {
      provider: 'gemini',
      status: isConfigured ? 'ready' : 'unconfigured',
      isMock: false,
      message: isConfigured
        ? 'Gemini Generative AI client configured and ready.'
        : 'GEMINI_API_KEY is not configured in .env.',
    };
  }

  public async analyzeTrend(req: TrendAnalysisRequest): Promise<TrendAnalysisResult> {
    const analysis = await analyzeTrendWithGemini(
      {
        name: req.trend.name,
        category: req.trend.category,
        description: req.trend.description,
        location: req.trend.location,
        momentum: req.trend.momentum,
        growthRate: req.trend.growthRate,
      },
      {
        name: req.business.name,
        category: req.business.category,
        location: req.business.location,
        targetCustomers: req.business.targetCustomers,
        productsServices: req.business.productsServices,
        businessSize: req.business.businessSize,
        channels: req.business.channels,
        goals: req.business.goals,
      }
    );

    return {
      ...analysis,
      isMock: false,
      engine: 'gemini-3.8-flash',
    };
  }

  public async matchOpportunities(req: OpportunityMatchRequest): Promise<BusinessMatchResult> {
    const { trends, business, minScore = 50, limit = 5 } = req;
    const bizCat = business.category.toLowerCase();

    const matches = trends
      .map((t) => {
        const catMatch = t.category.toLowerCase() === bizCat;
        const relevance = catMatch ? 92 : business.preferredCategories?.some((c) => c.toLowerCase() === t.category.toLowerCase()) ? 78 : 62;
        const momentumBonus = t.momentum === 'Rising' ? 10 : 4;
        const opportunity = Math.min(99, Math.round(relevance * 0.6 + t.confidence * 0.3 + momentumBonus));
        const customerMatch = Math.min(95, relevance - 5 + (t.audience ? 10 : 0));
        const timingScore = t.momentum === 'Rising' ? 95 : 75;

        return {
          trendId: t.id,
          trendName: t.name,
          category: t.category,
          momentum: t.momentum,
          relevanceScore: relevance,
          opportunityScore: opportunity,
          customerMatchScore: customerMatch,
          marketTimingScore: timingScore,
          whyItMatters: t.description,
          potentialAction: `Adopt ${t.name} to capture localized demand with ${business.name}`,
          confidence: t.confidence,
        };
      })
      .filter((m) => m.opportunityScore >= minScore)
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, limit);

    return {
      businessId: business.id,
      businessName: business.name,
      category: business.category,
      location: `${business.city}, ${business.state}`,
      matchedCount: matches.length,
      matches,
      isMock: false,
      engine: 'gemini-augmented-matcher',
    };
  }

  public async generatePlan(req: ActionPlanGenerationRequest): Promise<ActionPlan> {
    const analysis = await this.analyzeTrend({
      trend: {
        id: req.trend.id,
        name: req.trend.name,
        category: req.trend.category,
        description: req.trend.description || '',
        location: `${req.business.city}, ${req.business.state}`,
        momentum: 'Rising',
      },
      business: {
        id: req.business.id,
        name: req.business.name,
        category: req.business.category,
        location: `${req.business.city}, ${req.business.state}`,
        targetCustomers: req.business.targetCustomers,
        productsServices: req.business.productsServices,
        businessSize: req.business.businessSize,
        channels: req.business.channels,
        goals: req.business.goals,
      },
    });

    const p = analysis.innovative_plan;
    const now = new Date().toISOString();

    return {
      id: `plan-gemini-${Date.now()}`,
      businessId: req.business.id,
      trendId: req.trend.id || 'tr-custom',
      trendName: req.trend.name,
      category: req.trend.category || req.business.category,
      objective: req.customRequirements?.objective || p.objective,
      whyThisTrend: p.why_this_trend,
      recommendedAction: p.recommended_action,
      targetCustomer: req.business.targetCustomers || p.target_customer,
      productServiceIdea: p.product_service_idea,
      marketingApproach: p.marketing_approach,
      channel: req.customRequirements?.channel || p.channel,
      pilot: req.customRequirements?.pilot || p.pilot,
      timeline: req.customRequirements?.timeline || p.timeline,
      estimatedEffort: req.customRequirements?.estimatedEffort || p.estimated_effort,
      expectedOpportunity: req.customRequirements?.expectedOpportunity || p.expected_opportunity,
      risks: req.customRequirements?.risks || p.risks,
      successMetrics: req.customRequirements?.successMetrics || p.success_metrics,
      testMeasureLearn: {
        test: p.test_measure_learn.test,
        measure: p.test_measure_learn.measure,
        learn: p.test_measure_learn.learn,
        adapt: p.test_measure_learn.adapt,
      },
      validationStatus: 'PENDING EXPERT REVIEW',
      createdAt: now,
      updatedAt: now,
    };
  }
}
