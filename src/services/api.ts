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

export const api = {
  // Trends
  async getTrends(params?: { category?: string; momentum?: string; search?: string }): Promise<TrendItem[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.momentum) query.set('momentum', params.momentum);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`/api/trends?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch trends');
    const data = await res.json();
    return data.data;
  },

  async getTrend(id: string): Promise<TrendItem> {
    const res = await fetch(`/api/trends/${id}`);
    if (!res.ok) throw new Error('Failed to fetch trend details');
    const data = await res.json();
    return data.data;
  },

  async toggleSaveTrend(id: string): Promise<boolean> {
    const res = await fetch(`/api/trends/${id}/save`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to toggle save');
    const data = await res.json();
    return data.is_saved;
  },

  // Trend Intelligence & AI Reasoning
  async analyzeTrend(trendId: string, customTrend?: Partial<TrendItem>): Promise<{
    trend: TrendItem;
    business: { id: string; name: string; category: string; location: string };
    analysis: TrendAnalysis;
  }> {
    const res = await fetch('/api/trends/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trendId, customTrend }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to analyze trend');
    }
    return res.json();
  },

  // Business Profile
  async getBusinessProfile(): Promise<BusinessProfile> {
    const res = await fetch('/api/business/profile');
    if (!res.ok) throw new Error('Failed to fetch business profile');
    const data = await res.json();
    return data.data;
  },

  async updateBusinessProfile(profile: Partial<BusinessProfile>): Promise<BusinessProfile> {
    const res = await fetch('/api/business/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update business profile');
    const data = await res.json();
    return data.data;
  },

  async getOpportunities(): Promise<OpportunityItem[]> {
    const res = await fetch('/api/business/opportunities');
    if (!res.ok) throw new Error('Failed to fetch opportunities');
    const data = await res.json();
    return data.data;
  },

  // Action Plans
  async getActionPlans(status?: string): Promise<ActionPlan[]> {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`/api/action-plans${query}`);
    if (!res.ok) throw new Error('Failed to fetch action plans');
    const data = await res.json();
    return data.data;
  },

  async createActionPlan(plan: Partial<ActionPlan>): Promise<ActionPlan> {
    const res = await fetch('/api/action-plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    if (!res.ok) throw new Error('Failed to create action plan');
    const data = await res.json();
    return data.data;
  },

  // Expert Review
  async getPendingExpertPlans(): Promise<ActionPlan[]> {
    const res = await fetch('/api/expert/pending');
    if (!res.ok) throw new Error('Failed to fetch pending expert plans');
    const data = await res.json();
    return data.data;
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
    const res = await fetch('/api/expert/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    if (!res.ok) throw new Error('Failed to submit expert review');
    const data = await res.json();
    return data.data;
  },

  // Smart Alerts
  async getAlerts(): Promise<SmartAlert[]> {
    const res = await fetch('/api/alerts');
    if (!res.ok) throw new Error('Failed to fetch alerts');
    const data = await res.json();
    return data.data;
  },

  async dismissAlert(id: string): Promise<boolean> {
    const res = await fetch(`/api/alerts/${id}/dismiss`, { method: 'POST' });
    if (!res.ok) return false;
    const data = await res.json();
    return data.success;
  },

  // Experiments
  async getExperiments(): Promise<Experiment[]> {
    const res = await fetch('/api/experiments');
    if (!res.ok) throw new Error('Failed to fetch experiments');
    const data = await res.json();
    return data.data;
  },

  async createExperiment(experiment: Partial<Experiment>): Promise<Experiment> {
    const res = await fetch('/api/experiments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(experiment),
    });
    if (!res.ok) throw new Error('Failed to create experiment');
    const data = await res.json();
    return data.data;
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
    const res = await fetch(`/api/experiments/${id}/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    });
    if (!res.ok) throw new Error('Failed to record experiment result');
    const data = await res.json();
    return data.data;
  },

  // Trend Sources
  async getSources(): Promise<TrendSource[]> {
    const res = await fetch('/api/sources');
    if (!res.ok) throw new Error('Failed to fetch sources');
    const data = await res.json();
    return data.data;
  },

  // Analytics
  async getAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics');
    if (!res.ok) throw new Error('Failed to fetch analytics');
    const data = await res.json();
    return data.data;
  },

  // Demo Reset
  async resetDemo(): Promise<boolean> {
    const res = await fetch('/api/demo/reset', { method: 'POST' });
    return res.ok;
  },
};
