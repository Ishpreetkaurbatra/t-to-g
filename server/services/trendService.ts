import { repository } from './database/repository.ts';
import { getAIEngineAdapter } from './ai/index.ts';
import { AppError } from '../middleware/errorHandler.ts';
import type { TrendItem, TrendAnalysisResult } from '../types/index.ts';

export class TrendService {
  public async getTrends(category?: string, momentum?: string, search?: string) {
    return repository.getTrends(category, momentum, search);
  }

  public async searchTrends(params: {
    query?: string;
    category?: string;
    momentum?: string;
    limit?: number;
    offset?: number;
  }) {
    const { query, category, momentum, limit = 20, offset = 0 } = params;
    let trends = await repository.getTrends(category, momentum, query);

    const total = trends.length;
    const paginated = trends.slice(offset, offset + limit);

    return {
      trends: paginated,
      total,
      limit,
      offset,
    };
  }

  public async getTrendById(id: string): Promise<TrendItem> {
    const trend = await repository.getTrendById(id);
    if (!trend) {
      throw new AppError(`Trend with id '${id}' was not found`, 404, 'TREND_NOT_FOUND');
    }
    return trend;
  }

  public async toggleSaveTrend(id: string): Promise<boolean> {
    // Check if trend exists
    await this.getTrendById(id);
    return repository.toggleSaveTrend(id);
  }

  public async analyzeTrend(params: {
    trendId?: string;
    customTrend?: Partial<TrendItem>;
    businessProfileOverride?: any;
  }): Promise<{
    trend: TrendItem;
    business: { id: string; name: string; category: string; location: string };
    analysis: TrendAnalysisResult;
    isMockAi: boolean;
  }> {
    const { trendId, customTrend, businessProfileOverride } = params;

    let trend: TrendItem | null = null;
    if (trendId) {
      trend = await repository.getTrendById(trendId);
    }

    if (!trend && customTrend && customTrend.name && customTrend.category) {
      trend = {
        id: customTrend.id || `custom-${Date.now()}`,
        name: customTrend.name,
        category: customTrend.category,
        source_type: customTrend.source_type || 'User Submitted',
        source_name: customTrend.source_name || 'Direct Input',
        source_url: customTrend.source_url || '',
        detected_at: customTrend.detected_at || new Date().toISOString(),
        location: customTrend.location || 'Regional Market',
        confidence: customTrend.confidence || 85,
        momentum: (customTrend.momentum as any) || 'Rising',
        growth_rate: customTrend.growth_rate || '+25%',
        audience: customTrend.audience || 'Target demographics',
        description: customTrend.description || customTrend.name,
        drivers: customTrend.drivers || ['Consumer lifestyle changes'],
        business_relevance: customTrend.business_relevance || 80,
        opportunity_score: customTrend.opportunity_score || 85,
      };
    }

    if (!trend) {
      throw new AppError(
        'A valid trendId or customTrend object with name and category is required',
        400,
        'INVALID_TREND_INPUT'
      );
    }

    const business = businessProfileOverride || (await repository.getBusinessProfile());
    const aiAdapter = getAIEngineAdapter();

    const analysis = await aiAdapter.analyzeTrend({
      trend: {
        id: trend.id,
        name: trend.name,
        category: trend.category,
        description: trend.description,
        location: trend.location,
        momentum: trend.momentum,
        growthRate: trend.growth_rate,
        confidence: trend.confidence,
        drivers: trend.drivers,
      },
      business: {
        id: business.id,
        name: business.name,
        category: business.category,
        location: `${business.city}, ${business.state}`,
        targetCustomers: business.targetCustomers,
        productsServices: business.productsServices,
        businessSize: business.businessSize,
        channels: business.channels,
        goals: business.goals,
      },
    });

    return {
      trend,
      business: {
        id: business.id,
        name: business.name,
        category: business.category,
        location: `${business.city}, ${business.state}`,
      },
      analysis,
      isMockAi: Boolean(analysis.isMock),
    };
  }

  public async getAlerts() {
    return repository.getAlerts();
  }

  public async dismissAlert(id: string) {
    return repository.dismissAlert(id);
  }
}

export const trendService = new TrendService();
