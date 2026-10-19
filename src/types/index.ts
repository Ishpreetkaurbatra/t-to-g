export type UserRole = 'business_owner' | 'expert' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  title?: string;
}

export interface TrendItem {
  id: string;
  name: string;
  category: string;
  source_type: string;
  source_name: string;
  source_url: string;
  detected_at: string;
  location: string;
  confidence: number;
  momentum: 'Rising' | 'Stable' | 'Declining';
  growth_rate: string;
  audience: string;
  description: string;
  drivers: string[];
  business_relevance: number;
  opportunity_score: number;
  is_saved?: boolean;
  image?: string;
  shortHeadline?: string;
  actionPrompt?: string;
  trendStatus?: 'RISING' | 'EMERGING' | 'FAST GROWING' | 'WATCH' | 'LOCAL SIGNAL';
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  country: string;
  state: string;
  city: string;
  localMarket: string;
  targetCustomers: string;
  productsServices: string;
  businessSize: string;
  channels: string[];
  goals: string[];
  preferredCategories: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TrendAnalysis {
  trend_summary: string;
  drivers: string[];
  target_audience: string[];
  business_relevance: number;
  opportunity_score: number;
  market_risk: string;
  competition_risk: string;
  adoption_risk: string;
  execution_risk: string;
  business_opportunity: string;
  recommended_actions: string[];
  innovative_plan: {
    objective: string;
    why_this_trend: string;
    recommended_action: string;
    target_customer: string;
    product_service_idea: string;
    marketing_approach: string;
    channel: string;
    pilot: string;
    timeline: string;
    estimated_effort: 'Low' | 'Medium' | 'High';
    expected_opportunity: 'Low' | 'Medium' | 'High';
    risks: string[];
    success_metrics: string[];
    test_measure_learn: {
      test: string;
      measure: string;
      learn: string;
      adapt: string;
    };
  };
  confidence: number;
}

export interface SmartAlert {
  id: string;
  trendId: string;
  trendName: string;
  category: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  businessFit: number;
  potential: 'HIGH' | 'MODERATE' | 'LOW';
  headline: string;
  whyItMatters: string;
  recommendedNextStep: string;
  detectedAt: string;
  dismissed: boolean;
  saved: boolean;
}

export interface ActionPlan {
  id: string;
  businessId: string;
  trendId: string;
  trendName: string;
  category: string;
  objective: string;
  whyThisTrend: string;
  recommendedAction: string;
  targetCustomer: string;
  productServiceIdea: string;
  marketingApproach: string;
  channel: string;
  pilot: string;
  timeline: string;
  estimatedEffort: 'Low' | 'Medium' | 'High';
  expectedOpportunity: 'Low' | 'Medium' | 'High';
  risks: string[];
  successMetrics: string[];
  testMeasureLearn: {
    test: string;
    measure: string;
    learn: string;
    adapt: string;
  };
  validationStatus: 'AI GENERATED' | 'PENDING EXPERT REVIEW' | 'APPROVED' | 'NEEDS REVISION' | 'REJECTED';
  expertReview?: {
    expertId: string;
    expertName: string;
    expertTitle: string;
    decision: 'APPROVED' | 'NEEDS REVISION' | 'REJECTED';
    comment: string;
    riskNote: string;
    suggestedModification: string;
    confidence: number;
    reviewedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Experiment {
  id: string;
  actionPlanId: string;
  name: string;
  businessId: string;
  trendName: string;
  objective: string;
  hypothesis: string;
  action: string;
  startDate: string;
  endDate: string;
  budget: string;
  successMetric: string;
  status: 'Planned' | 'Running' | 'Completed' | 'Paused';
  result?: {
    whatHappened: string;
    whatWorked: string;
    whatFailed: string;
    whatShouldChange: string;
    adaptAction: string;
    recordedAt: string;
  };
  createdAt: string;
}

export interface OpportunityItem {
  trendId: string;
  trendName: string;
  category: string;
  momentum: 'Rising' | 'Stable' | 'Declining';
  whyItMatters: string;
  businessRelevance: number;
  opportunityScore: number;
  potentialAction: string;
  confidence: number;
}

export interface TrendSource {
  id: string;
  category: string;
  name: string;
  status: string;
  mockActive: boolean;
  sampleFrequency: string;
  description: string;
}
