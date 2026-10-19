import { z } from 'zod';

export const trendSearchSchema = z.object({
  query: z.string().trim().max(200).optional(),
  category: z.string().trim().optional(),
  momentum: z.enum(['Rising', 'Stable', 'Declining', 'All']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const trendAnalyzeSchema = z
  .object({
    trendId: z.string().trim().min(1).optional(),
    customTrend: z
      .object({
        id: z.string().optional(),
        name: z.string().min(2, 'Trend name must be at least 2 characters'),
        category: z.string().min(2, 'Category must be at least 2 characters'),
        description: z.string().optional(),
        location: z.string().optional(),
        momentum: z.enum(['Rising', 'Stable', 'Declining']).optional(),
        growth_rate: z.string().optional(),
        audience: z.string().optional(),
        drivers: z.array(z.string()).optional(),
        business_relevance: z.number().optional(),
        opportunity_score: z.number().optional(),
      })
      .optional(),
    businessProfile: z
      .object({
        name: z.string().optional(),
        category: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        targetCustomers: z.string().optional(),
        productsServices: z.string().optional(),
        channels: z.array(z.string()).optional(),
        goals: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .refine((data) => Boolean(data.trendId || (data.customTrend && data.customTrend.name)), {
    message: 'Either trendId or customTrend (with name and category) must be provided',
    path: ['trendId'],
  });

export const businessMatchSchema = z.object({
  category: z.string().trim().optional(),
  minScore: z.coerce.number().min(0).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  businessProfile: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
      category: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      targetCustomers: z.string().optional(),
      productsServices: z.string().optional(),
      channels: z.array(z.string()).optional(),
      goals: z.array(z.string()).optional(),
    })
    .optional(),
});

export const businessPlanSchema = z.object({
  trendId: z.string().trim().optional(),
  trendName: z.string().trim().min(2, 'Trend name is required if trendId is not specified').optional(),
  category: z.string().trim().optional(),
  objective: z.string().trim().max(500).optional(),
  whyThisTrend: z.string().trim().max(1000).optional(),
  recommendedAction: z.string().trim().max(1000).optional(),
  targetCustomer: z.string().trim().max(500).optional(),
  productServiceIdea: z.string().trim().max(500).optional(),
  marketingApproach: z.string().trim().max(500).optional(),
  channel: z.string().trim().max(200).optional(),
  pilot: z.string().trim().max(500).optional(),
  timeline: z.string().trim().max(200).optional(),
  estimatedEffort: z.enum(['Low', 'Medium', 'High']).optional(),
  expectedOpportunity: z.enum(['Low', 'Medium', 'High']).optional(),
  risks: z.array(z.string()).optional(),
  successMetrics: z.array(z.string()).optional(),
  testMeasureLearn: z
    .object({
      test: z.string(),
      measure: z.string(),
      learn: z.string(),
      adapt: z.string(),
    })
    .optional(),
}).refine((data) => Boolean(data.trendId || data.trendName), {
  message: 'Either trendId or trendName must be provided',
  path: ['trendName'],
});

export const expertReviewSchema = z.object({
  planId: z.string().min(1, 'planId is required'),
  decision: z.enum(['APPROVED', 'NEEDS REVISION', 'REJECTED'] as const),
  comment: z.string().min(3, 'Review comment must be at least 3 characters'),
  riskNote: z.string().optional(),
  suggestedModification: z.string().optional(),
  confidence: z.coerce.number().min(0).max(100).optional(),
  expertName: z.string().optional(),
  expertTitle: z.string().optional(),
});

export const businessProfileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  category: z.string().min(2).optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  localMarket: z.string().optional(),
  targetCustomers: z.string().optional(),
  productsServices: z.string().optional(),
  businessSize: z.string().optional(),
  channels: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
  preferredCategories: z.array(z.string()).optional(),
});

export const experimentCreateSchema = z.object({
  name: z.string().min(2, 'Experiment name is required'),
  trendName: z.string().min(2, 'Trend name is required'),
  objective: z.string().min(5, 'Objective must be at least 5 characters'),
  hypothesis: z.string().min(5, 'Hypothesis must be at least 5 characters'),
  action: z.string().min(5, 'Action description is required'),
  startDate: z.string().min(4, 'Valid start date required'),
  endDate: z.string().min(4, 'Valid end date required'),
  budget: z.string().optional(),
  successMetric: z.string().min(3, 'Success metric is required'),
  status: z.enum(['Planned', 'Running', 'Completed', 'Paused']).optional(),
  actionPlanId: z.string().optional(),
});

export const experimentResultSchema = z.object({
  whatHappened: z.string().min(3, 'whatHappened is required'),
  whatWorked: z.string().min(3, 'whatWorked is required'),
  whatFailed: z.string().min(3, 'whatFailed is required'),
  whatShouldChange: z.string().min(3, 'whatShouldChange is required'),
  adaptAction: z.string().min(3, 'adaptAction is required'),
});
