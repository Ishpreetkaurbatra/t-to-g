import {
  TrendItem,
  BusinessProfile,
  ActionPlan,
  SmartAlert,
  Experiment,
  OpportunityItem,
  TrendSource,
  TrendAnalysis,
} from '../types';
import {
  DEMO_TRENDS,
  INITIAL_BUSINESS_PROFILE,
  INITIAL_SMART_ALERTS,
  INITIAL_ACTION_PLANS,
  INITIAL_EXPERIMENTS,
  TREND_SOURCES,
} from '../../server/demoData.ts';

// In-memory / local cache for resilient fallback if backend is unreachable
let localTrends: TrendItem[] = [...DEMO_TRENDS];
let localBusinessProfile: BusinessProfile = { ...INITIAL_BUSINESS_PROFILE };
let localAlerts: SmartAlert[] = [...INITIAL_SMART_ALERTS];
let localPlans: ActionPlan[] = [...INITIAL_ACTION_PLANS];
let localExperiments: Experiment[] = [...INITIAL_EXPERIMENTS];

export const api = {
  // Trends
  async getTrends(params?: { category?: string; momentum?: string; search?: string }): Promise<TrendItem[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.set('category', params.category);
      if (params?.momentum) query.set('momentum', params.momentum);
      if (params?.search) query.set('search', params.search);

      const res = await fetch(`/api/trends?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          localTrends = data.data;
          return data.data;
        }
      }
    } catch {
      // Fallback to local data
    }

    let result = [...localTrends];
    if (params?.category && params.category !== 'All') {
      result = result.filter((t) => t.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.momentum && params.momentum !== 'All') {
      result = result.filter((t) => t.momentum.toLowerCase() === params.momentum!.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q)
      );
    }
    return result;
  },

  async getTrend(id: string): Promise<TrendItem> {
    try {
      const res = await fetch(`/api/trends/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback to local data
    }
    const found = localTrends.find((t) => t.id === id);
    if (!found) throw new Error('Trend not found');
    return found;
  },

  async toggleSaveTrend(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/trends/${id}/save`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        return data.is_saved;
      }
    } catch {
      // Fallback
    }
    const trend = localTrends.find((t) => t.id === id);
    if (trend) {
      trend.is_saved = !trend.is_saved;
      return trend.is_saved;
    }
    return false;
  },

  // Trend Intelligence & AI Reasoning
  async analyzeTrend(trendId: string, customTrend?: Partial<TrendItem>): Promise<{
    trend: TrendItem;
    business: { id: string; name: string; category: string; location: string };
    analysis: TrendAnalysis;
  }> {
    try {
      const res = await fetch('/api/trends/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trendId, customTrend }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to local heuristic
    }

    const trend = (trendId ? localTrends.find((t) => t.id === trendId) : null) || (customTrend as TrendItem) || localTrends[0];
    const biz = localBusinessProfile;

    const analysisFallback: TrendAnalysis = {
      trend_summary: `Strong ${trend.momentum} momentum in ${trend.category}. High potential to capture localized demand.`,
      drivers: trend.drivers && trend.drivers.length > 0 ? trend.drivers : ['Customer demand', 'Emerging lifestyle shift'],
      target_audience: ['Young Professionals', 'College Students', 'Health-conscious families'],
      business_relevance: trend.business_relevance || 88,
      opportunity_score: trend.opportunity_score || 85,
      market_risk: 'Medium - fast consumer adoption curve requires early testing',
      competition_risk: 'Low to Medium - limited organized competition in the local vicinity',
      adoption_risk: 'Low - strong willingness to pay for premium quality',
      execution_risk: 'Low - uses existing equipment and staffing workflows',
      business_opportunity: `Introduce ${trend.name} to establish a competitive differentiator with high gross margins.`,
      recommended_actions: [
        'Launch a 14-day low-risk tasting counter pilot',
        'Promote with short-form Reels and geo-targeted social stories',
        'Gather feedback and convert popular variants to permanent menu',
      ],
      innovative_plan: {
        objective: `Validate consumer demand for ${trend.name} within 14 days`,
        why_this_trend: `Aligns with the ${trend.growth_rate} growth rate and target customer demographics.`,
        recommended_action: `Counter display tasting flight and promotional introductory combo`,
        target_customer: biz.targetCustomers || 'Local college students and young professionals',
        product_service_idea: `Signature craft edition of ${trend.name} with local touch`,
        marketing_approach: 'Sample tastings at checkout and Instagram geo-tagged reels',
        channel: 'Dine-in counter and takeaway grab-and-go cooler',
        pilot: '14-day batch of 25 units per day',
        timeline: '2 weeks test period',
        estimated_effort: 'Low',
        expected_opportunity: 'High',
        risks: ['Ingredient consistency', 'Initial pricing sensitivity'],
        success_metrics: ['Daily sell-through rate > 80%', 'Repeat customer rate > 25%'],
        test_measure_learn: {
          test: `Produce 25 units daily of ${trend.name} for 14 days`,
          measure: 'Track units sold, customer feedback rating, and average ticket size',
          learn: 'Identify most requested flavor profiles and price thresholds',
          adapt: 'Scale the best seller and phase out slower moving variants',
        },
      },
      confidence: 90,
    };

    return {
      trend,
      business: {
        id: biz.id,
        name: biz.name,
        category: biz.category,
        location: `${biz.city}, ${biz.state}`,
      },
      analysis: analysisFallback,
    };
  },

  // Business Profile
  async getBusinessProfile(): Promise<BusinessProfile> {
    try {
      const res = await fetch('/api/business/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          localBusinessProfile = data.data;
          return data.data;
        }
      }
    } catch {
      // Fallback
    }
    return localBusinessProfile;
  },

  async updateBusinessProfile(profile: Partial<BusinessProfile>): Promise<BusinessProfile> {
    try {
      const res = await fetch('/api/business/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          localBusinessProfile = data.data;
          return data.data;
        }
      }
    } catch {
      // Fallback
    }
    localBusinessProfile = { ...localBusinessProfile, ...profile, updatedAt: new Date().toISOString() };
    return localBusinessProfile;
  },

  async getOpportunities(): Promise<OpportunityItem[]> {
    try {
      const res = await fetch('/api/business/opportunities');
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }
    return localTrends.map((t, idx) => ({
      trendId: t.id,
      trendName: t.name,
      category: t.category,
      momentum: t.momentum,
      whyItMatters: `High growth (${t.growth_rate}) with strong local customer alignment.`,
      businessRelevance: t.business_relevance || 85,
      opportunityScore: t.opportunity_score || 88,
      potentialAction: idx % 2 === 0 ? 'Launch Pilot Test' : 'Prepare Supply Chain',
      confidence: t.confidence || 90,
    }));
  },

  // Action Plans
  async getActionPlans(status?: string): Promise<ActionPlan[]> {
    try {
      const query = status ? `?status=${encodeURIComponent(status)}` : '';
      const res = await fetch(`/api/action-plans${query}`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          localPlans = data.data;
          return data.data;
        }
      }
    } catch {
      // Fallback
    }
    if (status) {
      return localPlans.filter((p) => p.validationStatus.toLowerCase() === status.toLowerCase());
    }
    return localPlans;
  },

  async createActionPlan(plan: Partial<ActionPlan>): Promise<ActionPlan> {
    try {
      const res = await fetch('/api/action-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }
    const newPlan: ActionPlan = {
      id: `plan-${Date.now()}`,
      businessId: localBusinessProfile.id,
      trendId: plan.trendId || 'tr-01',
      trendName: plan.trendName || 'Custom Trend',
      category: plan.category || 'Food & Beverage',
      objective: plan.objective || '14-day small pilot test',
      whyThisTrend: plan.whyThisTrend || 'High customer relevance and margin potential',
      recommendedAction: plan.recommendedAction || 'Launch tasting flight at counter',
      targetCustomer: plan.targetCustomer || 'Regular café visitors and college students',
      productServiceIdea: plan.productServiceIdea || 'Trial tasting sample pack',
      marketingApproach: plan.marketingApproach || 'Checkout table tent card & Instagram story',
      channel: plan.channel || 'Counter Dine-in & Takeaway',
      pilot: plan.pilot || '25 packs/day for 14 days',
      timeline: plan.timeline || '14 days',
      estimatedEffort: plan.estimatedEffort || 'Low',
      expectedOpportunity: plan.expectedOpportunity || 'High',
      risks: plan.risks || ['Supply chain lead time', 'Customer initial hesitation'],
      successMetrics: plan.successMetrics || ['Sell-through > 80%', 'Repeat purchases > 20%'],
      testMeasureLearn: plan.testMeasureLearn || {
        test: 'Run counter tasting for 14 days',
        measure: 'Track sell-through and customer remarks',
        learn: 'Identify favorite variants',
        adapt: 'Scale the best seller',
      },
      validationStatus: plan.validationStatus || 'AI GENERATED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...plan,
    } as ActionPlan;

    localPlans.unshift(newPlan);
    return newPlan;
  },

  // Expert Review
  async getPendingExpertPlans(): Promise<ActionPlan[]> {
    try {
      const res = await fetch('/api/expert/pending');
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }
    return localPlans.filter(
      (p) =>
        p.validationStatus === 'PENDING EXPERT REVIEW' ||
        p.validationStatus === 'AI GENERATED' ||
        !p.expertReview
    );
  },

  async submitExpertReview(review: {
    planId: string;
    decision: 'APPROVED' | 'NEEDS REVISION' | 'REJECTED';
    comment: string;
    riskNote: string;
    suggestedModification: string;
    confidence: number;
    expertName?: string;
    expertTitle?: string;
  }): Promise<ActionPlan> {
    try {
      const res = await fetch('/api/expert/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }

    const plan = localPlans.find((p) => p.id === review.planId);
    if (!plan) throw new Error('Plan not found');

    plan.validationStatus = review.decision === 'APPROVED' ? 'APPROVED' : review.decision === 'REJECTED' ? 'REJECTED' : 'NEEDS REVISION';
    plan.expertReview = {
      expertId: 'usr-chef-arjun',
      expertName: review.expertName || 'Chef Arjun Mehta',
      expertTitle: review.expertTitle || 'Senior Hospitality Advisor',
      decision: review.decision,
      comment: review.comment,
      riskNote: review.riskNote,
      suggestedModification: review.suggestedModification,
      confidence: review.confidence,
      reviewedAt: new Date().toISOString(),
    };
    return plan;
  },

  // Smart Alerts
  async getAlerts(): Promise<SmartAlert[]> {
    try {
      const res = await fetch('/api/alerts');
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          localAlerts = data.data;
          return data.data;
        }
      }
    } catch {
      // Fallback
    }
    return localAlerts;
  },

  async dismissAlert(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/alerts/${id}/dismiss`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        return data.success;
      }
    } catch {
      // Fallback
    }
    localAlerts = localAlerts.filter((a) => a.id !== id);
    return true;
  },

  // Experiments
  async getExperiments(): Promise<Experiment[]> {
    try {
      const res = await fetch('/api/experiments');
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          localExperiments = data.data;
          return data.data;
        }
      }
    } catch {
      // Fallback
    }
    return localExperiments;
  },

  async createExperiment(experiment: Partial<Experiment>): Promise<Experiment> {
    try {
      const res = await fetch('/api/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experiment),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }

    const newExp: Experiment = {
      id: `exp-${Date.now()}`,
      actionPlanId: experiment.actionPlanId || 'plan-01',
      name: experiment.name || 'New Experiment',
      businessId: localBusinessProfile.id,
      trendName: experiment.trendName || 'Emerging Trend',
      objective: experiment.objective || 'Test consumer demand',
      hypothesis: experiment.hypothesis || 'If we test this, customers will respond positively.',
      action: experiment.action || '14-day sample batch',
      startDate: experiment.startDate || new Date().toISOString().split('T')[0],
      endDate: experiment.endDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      budget: experiment.budget || '₹3,500',
      successMetric: experiment.successMetric || 'Over 70% sell-through rate',
      status: 'Running',
      createdAt: new Date().toISOString(),
      ...experiment,
    } as Experiment;

    localExperiments.unshift(newExp);
    return newExp;
  },

  async recordExperimentResult(
    id: string,
    result: {
      whatHappened: string;
      whatWorked: string;
      whatFailed: string;
      whatShouldChange: string;
      adaptAction: string;
    }
  ): Promise<Experiment> {
    try {
      const res = await fetch(`/api/experiments/${id}/result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }

    const exp = localExperiments.find((e) => e.id === id);
    if (!exp) throw new Error('Experiment not found');

    exp.status = 'Completed';
    exp.result = {
      ...result,
      recordedAt: new Date().toISOString(),
    };
    return exp;
  },

  // Trend Sources
  async getSources(): Promise<TrendSource[]> {
    try {
      const res = await fetch('/api/sources');
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }
    return TREND_SOURCES as TrendSource[];
  },

  // Analytics
  async getAnalytics(): Promise<any> {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }
    return {
      totalTrendsMonitored: localTrends.length,
      highOpportunityCount: localTrends.filter((t) => t.opportunity_score >= 80).length,
      activeAlertsCount: localAlerts.length,
      actionPlansCount: localPlans.length,
      validatedPlansCount: localPlans.filter((p) => p.validationStatus === 'APPROVED').length,
      activeExperimentsCount: localExperiments.filter((e) => e.status === 'Running').length,
      completedExperimentsCount: localExperiments.filter((e) => e.status === 'Completed').length,
    };
  },

  // Demo Reset
  async resetDemo(): Promise<boolean> {
    try {
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    localTrends = [...DEMO_TRENDS];
    localBusinessProfile = { ...INITIAL_BUSINESS_PROFILE };
    localAlerts = [...INITIAL_SMART_ALERTS];
    localPlans = [...INITIAL_ACTION_PLANS];
    localExperiments = [...INITIAL_EXPERIMENTS];
    return true;
  },
};
