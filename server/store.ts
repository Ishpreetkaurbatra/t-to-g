import type {
  TrendItem,
  BusinessProfile,
  SmartAlert,
  ActionPlan,
  Experiment,
} from './demoData.ts';
import {
  DEMO_TRENDS,
  INITIAL_BUSINESS_PROFILE,
  INITIAL_SMART_ALERTS,
  INITIAL_ACTION_PLANS,
  INITIAL_EXPERIMENTS,
} from './demoData.ts';

class DataStore {
  private trends: TrendItem[] = [];
  private businessProfile: BusinessProfile = { ...INITIAL_BUSINESS_PROFILE };
  private alerts: SmartAlert[] = [];
  private actionPlans: ActionPlan[] = [];
  private experiments: Experiment[] = [];

  constructor() {
    this.reset();
  }

  public reset() {
    this.trends = JSON.parse(JSON.stringify(DEMO_TRENDS));
    this.businessProfile = JSON.parse(JSON.stringify(INITIAL_BUSINESS_PROFILE));
    this.alerts = JSON.parse(JSON.stringify(INITIAL_SMART_ALERTS));
    this.actionPlans = JSON.parse(JSON.stringify(INITIAL_ACTION_PLANS));
    this.experiments = JSON.parse(JSON.stringify(INITIAL_EXPERIMENTS));
  }

  // Trends
  public getTrends(category?: string, momentum?: string, search?: string) {
    let result = [...this.trends];
    if (category && category !== 'All') {
      result = result.filter(
        (t) => t.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (momentum && momentum !== 'All') {
      result = result.filter(
        (t) => t.momentum.toLowerCase() === momentum.toLowerCase()
      );
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public getTrendById(id: string) {
    return this.trends.find((t) => t.id === id);
  }

  public toggleSaveTrend(id: string) {
    const trend = this.trends.find((t) => t.id === id);
    if (trend) {
      trend.is_saved = !trend.is_saved;
      return trend.is_saved;
    }
    return false;
  }

  // Business Profile
  public getBusinessProfile() {
    return this.businessProfile;
  }

  public updateBusinessProfile(data: Partial<BusinessProfile>) {
    this.businessProfile = {
      ...this.businessProfile,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    // Recalculate relevance for trends based on updated profile
    this.recalculateRelevance();
    return this.businessProfile;
  }

  private recalculateRelevance() {
    const bizCat = this.businessProfile.category.toLowerCase();
    this.trends = this.trends.map((t) => {
      let relevance = 60;
      if (t.category.toLowerCase() === bizCat) {
        relevance = 88;
      } else if (
        this.businessProfile.preferredCategories.some(
          (c) => c.toLowerCase() === t.category.toLowerCase()
        )
      ) {
        relevance = 76;
      }
      if (t.momentum === 'Rising') relevance += 6;
      if (t.location.toLowerCase().includes(this.businessProfile.state.toLowerCase())) relevance += 5;
      relevance = Math.min(98, Math.max(25, relevance));

      const opp = Math.round((relevance * 0.5) + (t.confidence * 0.3) + (t.momentum === 'Rising' ? 18 : 8));
      return {
        ...t,
        business_relevance: relevance,
        opportunity_score: Math.min(99, opp),
      };
    });
  }

  // Action Plans
  public getActionPlans(status?: string) {
    if (status && status !== 'All') {
      return this.actionPlans.filter((p) => p.validationStatus === status);
    }
    return this.actionPlans;
  }

  public getActionPlanById(id: string) {
    return this.actionPlans.find((p) => p.id === id);
  }

  public createActionPlan(plan: Omit<ActionPlan, 'id' | 'createdAt' | 'updatedAt'>) {
    const newPlan: ActionPlan = {
      ...plan,
      id: `plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.actionPlans.unshift(newPlan);
    return newPlan;
  }

  public submitExpertReview(
    planId: string,
    review: {
      expertId: string;
      expertName: string;
      expertTitle: string;
      decision: 'APPROVED' | 'NEEDS REVISION' | 'REJECTED';
      comment: string;
      riskNote: string;
      suggestedModification: string;
      confidence: number;
    }
  ) {
    const plan = this.actionPlans.find((p) => p.id === planId);
    if (!plan) return null;

    plan.validationStatus = review.decision;
    plan.expertReview = {
      ...review,
      reviewedAt: new Date().toISOString(),
    };
    plan.updatedAt = new Date().toISOString();
    return plan;
  }

  // Alerts
  public getAlerts() {
    return this.alerts.filter((a) => !a.dismissed);
  }

  public dismissAlert(id: string) {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.dismissed = true;
      return true;
    }
    return false;
  }

  // Experiments
  public getExperiments() {
    return this.experiments;
  }

  public createExperiment(exp: Omit<Experiment, 'id' | 'createdAt'>) {
    const newExp: Experiment = {
      ...exp,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.experiments.unshift(newExp);
    return newExp;
  }

  public updateExperimentResult(
    id: string,
    result: {
      whatHappened: string;
      whatWorked: string;
      whatFailed: string;
      whatShouldChange: string;
      adaptAction: string;
    }
  ) {
    const exp = this.experiments.find((e) => e.id === id);
    if (!exp) return null;
    exp.status = 'Completed';
    exp.result = {
      ...result,
      recordedAt: new Date().toISOString(),
    };
    return exp;
  }

  // Top Opportunities
  public getTopOpportunities() {
    return [...this.trends]
      .sort((a, b) => b.opportunity_score - a.opportunity_score)
      .slice(0, 5)
      .map((t) => ({
        trendId: t.id,
        trendName: t.name,
        category: t.category,
        momentum: t.momentum,
        whyItMatters: t.description,
        businessRelevance: t.business_relevance,
        opportunityScore: t.opportunity_score,
        potentialAction: `Test a 14-day localized pilot around ${t.name}`,
        confidence: t.confidence,
      }));
  }

  // Analytics
  public getAnalytics() {
    const approvedCount = this.actionPlans.filter(
      (p) => p.validationStatus === 'APPROVED'
    ).length;
    const pendingCount = this.actionPlans.filter(
      (p) => p.validationStatus === 'PENDING EXPERT REVIEW'
    ).length;
    const totalPlans = this.actionPlans.length;
    const validationRate = totalPlans > 0 ? Math.round((approvedCount / totalPlans) * 100) : 0;

    return {
      trendsAnalyzed: this.trends.length,
      savedTrendsCount: this.trends.filter((t) => t.is_saved).length,
      totalActionPlans: totalPlans,
      approvedPlans: approvedCount,
      pendingValidation: pendingCount,
      validationRate,
      activeExperiments: this.experiments.filter((e) => e.status === 'Running').length,
      completedExperiments: this.experiments.filter((e) => e.status === 'Completed').length,
      categoryDistribution: [
        { category: 'Food & Beverage', count: 8, percentage: 36 },
        { category: 'Retail', count: 4, percentage: 18 },
        { category: 'Local Services', count: 4, percentage: 18 },
        { category: 'Fashion & Beauty', count: 3, percentage: 14 },
        { category: 'Tech & Education', count: 3, percentage: 14 },
      ],
      momentumBreakdown: {
        rising: this.trends.filter((t) => t.momentum === 'Rising').length,
        stable: this.trends.filter((t) => t.momentum === 'Stable').length,
        declining: this.trends.filter((t) => t.momentum === 'Declining').length,
      },
    };
  }
}

export const store = new DataStore();
