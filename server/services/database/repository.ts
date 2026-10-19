import { store } from '../../store.ts';
import { getSupabaseClient } from './supabaseClient.ts';
import type {
  TrendItem,
  BusinessProfile,
  ActionPlan,
  SmartAlert,
  Experiment,
} from '../../types/index.ts';

export class Repository {
  /**
   * Retrieves trends with optional filtering.
   */
  public async getTrends(category?: string, momentum?: string, search?: string): Promise<TrendItem[]> {
    const sb = getSupabaseClient();
    if (sb) {
      try {
        let query = sb.from('trends').select('*');
        if (category && category !== 'All') {
          query = query.ilike('category_name', category);
        }
        if (momentum && momentum !== 'All') {
          query = query.eq('momentum', momentum);
        }
        if (search) {
          query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((t: any) => ({
            id: t.id,
            name: t.name,
            category: t.category_name || t.category,
            source_type: t.source_type || 'Market Intelligence',
            source_name: t.source_name || 'Supabase Data',
            source_url: t.source_url || '',
            detected_at: t.detected_at || t.created_at,
            location: t.location,
            confidence: t.confidence || 85,
            momentum: t.momentum || 'Rising',
            growth_rate: t.growth_rate || '+25%',
            audience: t.audience || '',
            description: t.description,
            drivers: t.drivers || [],
            business_relevance: t.business_relevance || 80,
            opportunity_score: t.opportunity_score || 85,
            is_saved: t.is_saved || false,
          }));
        }
      } catch {
        // Fall back to memory store on query exception
      }
    }

    return store.getTrends(category, momentum, search);
  }

  public async getTrendById(id: string): Promise<TrendItem | null> {
    const sb = getSupabaseClient();
    if (sb) {
      try {
        const { data, error } = await sb.from('trends').select('*').eq('id', id).maybeSingle();
        if (!error && data) {
          return {
            id: data.id,
            name: data.name,
            category: data.category_name || data.category,
            source_type: data.source_type || 'Market Intelligence',
            source_name: data.source_name || 'Supabase Data',
            source_url: data.source_url || '',
            detected_at: data.detected_at || data.created_at,
            location: data.location,
            confidence: data.confidence,
            momentum: data.momentum,
            growth_rate: data.growth_rate,
            audience: data.audience,
            description: data.description,
            drivers: data.drivers || [],
            business_relevance: data.business_relevance || 80,
            opportunity_score: data.opportunity_score || 85,
            is_saved: data.is_saved || false,
          };
        }
      } catch {
        // Fall back
      }
    }

    return store.getTrendById(id) || null;
  }

  public async toggleSaveTrend(id: string): Promise<boolean> {
    return store.toggleSaveTrend(id);
  }

  public async getBusinessProfile(): Promise<BusinessProfile> {
    const sb = getSupabaseClient();
    if (sb) {
      try {
        const { data, error } = await sb
          .from('businesses')
          .select('*, business_profiles(*)')
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          const profile = data.business_profiles?.[0] || data.business_profiles || {};
          return {
            id: data.id,
            name: data.name,
            category: data.category_name,
            country: data.country || 'India',
            state: data.state,
            city: data.city,
            localMarket: data.local_market || `${data.city} Market`,
            targetCustomers: profile.target_customers || 'Urban youth and families',
            productsServices: profile.products_services || 'Retail services',
            businessSize: data.business_size || 'Small (1-10)',
            channels: profile.channels || ['Storefront', 'WhatsApp'],
            goals: profile.goals || ['Increase revenue', 'Retain customers'],
            preferredCategories: profile.preferred_categories || [data.category_name],
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch {
        // Fall back
      }
    }

    return store.getBusinessProfile();
  }

  public async updateBusinessProfile(data: Partial<BusinessProfile>): Promise<BusinessProfile> {
    return store.updateBusinessProfile(data);
  }

  public async getActionPlans(status?: string): Promise<ActionPlan[]> {
    return store.getActionPlans(status);
  }

  public async getActionPlanById(id: string): Promise<ActionPlan | null> {
    return store.getActionPlanById(id) || null;
  }

  public async createActionPlan(plan: Omit<ActionPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<ActionPlan> {
    return store.createActionPlan(plan);
  }

  public async submitExpertReview(
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
  ): Promise<ActionPlan | null> {
    return store.submitExpertReview(planId, review);
  }

  public async getAlerts(): Promise<SmartAlert[]> {
    return store.getAlerts();
  }

  public async dismissAlert(id: string): Promise<boolean> {
    return store.dismissAlert(id);
  }

  public async getExperiments(): Promise<Experiment[]> {
    return store.getExperiments();
  }

  public async createExperiment(exp: Omit<Experiment, 'id' | 'createdAt'>): Promise<Experiment> {
    return store.createExperiment(exp);
  }

  public async updateExperimentResult(
    id: string,
    result: {
      whatHappened: string;
      whatWorked: string;
      whatFailed: string;
      whatShouldChange: string;
      adaptAction: string;
    }
  ): Promise<Experiment | null> {
    return store.updateExperimentResult(id, result);
  }

  public async getTopOpportunities() {
    return store.getTopOpportunities();
  }

  public async getAnalytics() {
    return store.getAnalytics();
  }

  public reset(): void {
    store.reset();
  }
}

export const repository = new Repository();
