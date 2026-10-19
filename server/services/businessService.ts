import { repository } from './database/repository.ts';
import { getAIEngineAdapter } from './ai/index.ts';
import { AppError } from '../middleware/errorHandler.ts';
import type { BusinessProfile, ActionPlan, BusinessMatchResult } from '../types/index.ts';

export class BusinessService {
  public async getProfile(): Promise<BusinessProfile> {
    return repository.getBusinessProfile();
  }

  public async updateProfile(data: Partial<BusinessProfile>): Promise<BusinessProfile> {
    return repository.updateBusinessProfile(data);
  }

  public async matchOpportunities(params: {
    businessProfile?: Partial<BusinessProfile>;
    category?: string;
    minScore?: number;
    limit?: number;
  }): Promise<BusinessMatchResult> {
    const defaultProfile = await repository.getBusinessProfile();
    const activeProfile: BusinessProfile = {
      ...defaultProfile,
      ...(params.businessProfile || {}),
    };

    const trends = await repository.getTrends(params.category);
    const aiAdapter = getAIEngineAdapter();

    return aiAdapter.matchOpportunities({
      trends,
      business: activeProfile,
      minScore: params.minScore ?? 50,
      limit: params.limit ?? 10,
    });
  }

  public async createPlan(params: {
    trendId?: string;
    trendName?: string;
    category?: string;
    objective?: string;
    whyThisTrend?: string;
    recommendedAction?: string;
    targetCustomer?: string;
    productServiceIdea?: string;
    marketingApproach?: string;
    channel?: string;
    pilot?: string;
    timeline?: string;
    estimatedEffort?: 'Low' | 'Medium' | 'High';
    expectedOpportunity?: 'Low' | 'Medium' | 'High';
    risks?: string[];
    successMetrics?: string[];
    testMeasureLearn?: {
      test: string;
      measure: string;
      learn: string;
      adapt: string;
    };
  }): Promise<ActionPlan> {
    const business = await repository.getBusinessProfile();

    let trendName = params.trendName;
    let trendCategory = params.category || business.category;
    let trendDesc = params.whyThisTrend;

    if (params.trendId && (!trendName || !trendCategory)) {
      const existing = await repository.getTrendById(params.trendId);
      if (existing) {
        trendName = trendName || existing.name;
        trendCategory = trendCategory || existing.category;
        trendDesc = trendDesc || existing.description;
      }
    }

    if (!trendName) {
      throw new AppError('trendName or valid trendId is required to generate an action plan', 400, 'MISSING_TREND_INFO');
    }

    const aiAdapter = getAIEngineAdapter();
    const generated = await aiAdapter.generatePlan({
      trend: {
        id: params.trendId,
        name: trendName,
        category: trendCategory,
        description: trendDesc,
      },
      business,
      customRequirements: {
        objective: params.objective,
        timeline: params.timeline,
        pilot: params.pilot,
        channel: params.channel,
        estimatedEffort: params.estimatedEffort,
        expectedOpportunity: params.expectedOpportunity,
        risks: params.risks,
        successMetrics: params.successMetrics,
      },
    });

    // Merge any explicit overrides provided by caller
    const finalPlan = await repository.createActionPlan({
      businessId: business.id,
      trendId: params.trendId || generated.trendId || 'tr-custom',
      trendName: trendName,
      category: trendCategory,
      objective: params.objective || generated.objective,
      whyThisTrend: params.whyThisTrend || generated.whyThisTrend,
      recommendedAction: params.recommendedAction || generated.recommendedAction,
      targetCustomer: params.targetCustomer || generated.targetCustomer,
      productServiceIdea: params.productServiceIdea || generated.productServiceIdea,
      marketingApproach: params.marketingApproach || generated.marketingApproach,
      channel: params.channel || generated.channel,
      pilot: params.pilot || generated.pilot,
      timeline: params.timeline || generated.timeline,
      estimatedEffort: params.estimatedEffort || generated.estimatedEffort,
      expectedOpportunity: params.expectedOpportunity || generated.expectedOpportunity,
      risks: params.risks || generated.risks,
      successMetrics: params.successMetrics || generated.successMetrics,
      testMeasureLearn: params.testMeasureLearn || generated.testMeasureLearn,
      validationStatus: 'PENDING EXPERT REVIEW',
    });

    return finalPlan;
  }

  public async getActionPlans(status?: string): Promise<ActionPlan[]> {
    return repository.getActionPlans(status);
  }

  public async getActionPlanById(id: string): Promise<ActionPlan> {
    const plan = await repository.getActionPlanById(id);
    if (!plan) {
      throw new AppError(`Action plan with id '${id}' not found`, 404, 'PLAN_NOT_FOUND');
    }
    return plan;
  }

  public async submitExpertReview(
    planId: string,
    review: {
      expertId?: string;
      expertName?: string;
      expertTitle?: string;
      decision: 'APPROVED' | 'NEEDS REVISION' | 'REJECTED';
      comment: string;
      riskNote?: string;
      suggestedModification?: string;
      confidence?: number;
    }
  ): Promise<ActionPlan> {
    const updated = await repository.submitExpertReview(planId, {
      expertId: review.expertId || 'exp-current',
      expertName: review.expertName || 'Dr. Vikram Malhotra, Retail Growth Strategist',
      expertTitle: review.expertTitle || 'Senior Partner, Apex Advisory (18+ yrs)',
      decision: review.decision,
      comment: review.comment,
      riskNote: review.riskNote || 'Monitor inventory turns and supply timelines.',
      suggestedModification: review.suggestedModification || 'Include customer tasting rating cards at checkout.',
      confidence: review.confidence || 92,
    });

    if (!updated) {
      throw new AppError(`Action plan with id '${planId}' not found`, 404, 'PLAN_NOT_FOUND');
    }

    return updated;
  }

  public async getOpportunities() {
    return repository.getTopOpportunities();
  }

  public async getExperiments() {
    return repository.getExperiments();
  }

  public async createExperiment(expData: any) {
    const business = await repository.getBusinessProfile();
    return repository.createExperiment({
      ...expData,
      businessId: business.id,
    });
  }

  public async updateExperimentResult(id: string, resultData: any) {
    const updated = await repository.updateExperimentResult(id, resultData);
    if (!updated) {
      throw new AppError(`Experiment with id '${id}' not found`, 404, 'EXPERIMENT_NOT_FOUND');
    }
    return updated;
  }

  public async getAnalytics() {
    return repository.getAnalytics();
  }

  public resetDemoData() {
    repository.reset();
  }
}

export const businessService = new BusinessService();
