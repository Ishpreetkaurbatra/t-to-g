import { Router, Request, Response } from 'express';
import { store } from './store';
import { analyzeTrendWithGemini } from './gemini';
import { TREND_SOURCES } from './demoData';

export const apiRouter = Router();

// TRENDS
apiRouter.get('/trends', (req: Request, res: Response) => {
  const { category, momentum, search } = req.query as {
    category?: string;
    momentum?: string;
    search?: string;
  };
  const trends = store.getTrends(category, momentum, search);
  res.json({ success: true, count: trends.length, data: trends });
});

apiRouter.get('/trends/:id', (req: Request, res: Response) => {
  const trend = store.getTrendById(req.params.id);
  if (!trend) {
    res.status(404).json({ success: false, error: 'Trend not found' });
    return;
  }
  res.json({ success: true, data: trend });
});

apiRouter.post('/trends/:id/save', (req: Request, res: Response) => {
  const isSaved = store.toggleSaveTrend(req.params.id);
  res.json({ success: true, is_saved: isSaved });
});

// TREND INTELLIGENCE & GEMINI INTEGRATION
apiRouter.post('/trends/analyze', async (req: Request, res: Response) => {
  try {
    const { trendId, customTrend } = req.body;
    let trend = trendId ? store.getTrendById(trendId) : null;

    if (!trend && customTrend) {
      trend = customTrend;
    }

    if (!trend) {
      res.status(400).json({ success: false, error: 'Valid trend or trendId required' });
      return;
    }

    const business = store.getBusinessProfile();
    const analysis = await analyzeTrendWithGemini(
      {
        name: trend.name,
        category: trend.category,
        description: trend.description,
        location: trend.location,
        momentum: trend.momentum,
        growthRate: trend.growth_rate,
      },
      {
        name: business.name,
        category: business.category,
        location: `${business.city}, ${business.state}`,
        targetCustomers: business.targetCustomers,
        productsServices: business.productsServices,
        businessSize: business.businessSize,
        channels: business.channels,
        goals: business.goals,
      }
    );

    res.json({
      success: true,
      trend,
      business: {
        id: business.id,
        name: business.name,
        category: business.category,
        location: `${business.city}, ${business.state}`,
      },
      analysis,
    });
  } catch (error: any) {
    console.error('Error analyzing trend:', error);
    res.status(500).json({ success: false, error: error.message || 'Analysis failed' });
  }
});

// BUSINESS PROFILE
apiRouter.get('/business/profile', (_req: Request, res: Response) => {
  const profile = store.getBusinessProfile();
  res.json({ success: true, data: profile });
});

apiRouter.put('/business/profile', (req: Request, res: Response) => {
  const updated = store.updateBusinessProfile(req.body);
  res.json({ success: true, data: updated });
});

apiRouter.get('/business/opportunities', (_req: Request, res: Response) => {
  const opportunities = store.getTopOpportunities();
  res.json({ success: true, data: opportunities });
});

// ACTION PLANS
apiRouter.get('/action-plans', (req: Request, res: Response) => {
  const { status } = req.query as { status?: string };
  const plans = store.getActionPlans(status);
  res.json({ success: true, count: plans.length, data: plans });
});

apiRouter.get('/action-plans/:id', (req: Request, res: Response) => {
  const plan = store.getActionPlanById(req.params.id);
  if (!plan) {
    res.status(404).json({ success: false, error: 'Action plan not found' });
    return;
  }
  res.json({ success: true, data: plan });
});

apiRouter.post('/action-plans', (req: Request, res: Response) => {
  const {
    trendId,
    trendName,
    category,
    objective,
    whyThisTrend,
    recommendedAction,
    targetCustomer,
    productServiceIdea,
    marketingApproach,
    channel,
    pilot,
    timeline,
    estimatedEffort,
    expectedOpportunity,
    risks,
    successMetrics,
    testMeasureLearn,
  } = req.body;

  const business = store.getBusinessProfile();

  const newPlan = store.createActionPlan({
    businessId: business.id,
    trendId: trendId || 'tr-custom',
    trendName: trendName || 'Custom Trend Strategy',
    category: category || business.category,
    objective: objective || `Pilot ${trendName} to drive customer footfall and increase ticket size.`,
    whyThisTrend: whyThisTrend || 'High consumer momentum in regional trade corridor.',
    recommendedAction: recommendedAction || 'Formulate 14-day prototype and feature on VIP channel.',
    targetCustomer: targetCustomer || business.targetCustomers,
    productServiceIdea: productServiceIdea || 'Limited-edition trial bundle',
    marketingApproach: marketingApproach || 'Targeted local social reel + counter display',
    channel: channel || 'In-store + WhatsApp',
    pilot: pilot || 'Daily limited quantity test for 14 days',
    timeline: timeline || '2 weeks setup & pilot',
    estimatedEffort: estimatedEffort || 'Medium',
    expectedOpportunity: expectedOpportunity || 'High',
    risks: risks || ['Supply volatility', 'Adoption friction'],
    successMetrics: successMetrics || ['Sell-through > 75%', 'Repeat purchase > 20%'],
    testMeasureLearn: testMeasureLearn || {
      test: 'Launch 2 variants for 14 days',
      measure: 'Track margin and customer feedback score',
      learn: 'Identify highest demand option',
      adapt: 'Scale top performer to standard catalog',
    },
    validationStatus: 'PENDING EXPERT REVIEW',
  });

  res.status(201).json({ success: true, data: newPlan });
});

// EXPERT REVIEW WORKFLOW
apiRouter.get('/expert/pending', (_req: Request, res: Response) => {
  const pending = store.getActionPlans('PENDING EXPERT REVIEW');
  res.json({ success: true, count: pending.length, data: pending });
});

apiRouter.post('/expert/review', (req: Request, res: Response) => {
  const { planId, decision, comment, riskNote, suggestedModification, confidence, expertName, expertTitle } = req.body;

  if (!planId || !decision) {
    res.status(400).json({ success: false, error: 'planId and decision are required' });
    return;
  }

  const updated = store.submitExpertReview(planId, {
    expertId: 'exp-current-session',
    expertName: expertName || 'Dr. Vikram Malhotra, Retail Growth Strategist',
    expertTitle: expertTitle || 'Senior Partner, Apex Retail Advisory (18+ yrs)',
    decision: decision as 'APPROVED' | 'NEEDS REVISION' | 'REJECTED',
    comment: comment || 'Strategy is sound with clear test boundaries.',
    riskNote: riskNote || 'Monitor supplier turnaround times.',
    suggestedModification: suggestedModification || 'Include tasting survey at cash register.',
    confidence: confidence || 94,
  });

  if (!updated) {
    res.status(404).json({ success: false, error: 'Plan not found' });
    return;
  }

  res.json({ success: true, data: updated });
});

// SMART ALERTS
apiRouter.get('/alerts', (_req: Request, res: Response) => {
  const alerts = store.getAlerts();
  res.json({ success: true, data: alerts });
});

apiRouter.post('/alerts/:id/dismiss', (req: Request, res: Response) => {
  const dismissed = store.dismissAlert(req.params.id);
  res.json({ success: dismissed });
});

// EXPERIMENTS (TEST → MEASURE → LEARN → ADAPT)
apiRouter.get('/experiments', (_req: Request, res: Response) => {
  const experiments = store.getExperiments();
  res.json({ success: true, data: experiments });
});

apiRouter.post('/experiments', (req: Request, res: Response) => {
  const business = store.getBusinessProfile();
  const newExp = store.createExperiment({
    ...req.body,
    businessId: business.id,
  });
  res.status(201).json({ success: true, data: newExp });
});

apiRouter.post('/experiments/:id/result', (req: Request, res: Response) => {
  const updated = store.updateExperimentResult(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Experiment not found' });
    return;
  }
  res.json({ success: true, data: updated });
});

// TREND SOURCES REGISTRY
apiRouter.get('/sources', (_req: Request, res: Response) => {
  res.json({ success: true, data: TREND_SOURCES });
});

// ANALYTICS
apiRouter.get('/analytics', (_req: Request, res: Response) => {
  const analytics = store.getAnalytics();
  res.json({ success: true, data: analytics });
});

// DEMO RESET
apiRouter.post('/demo/reset', (_req: Request, res: Response) => {
  store.reset();
  res.json({ success: true, message: 'Demo data successfully reset to FreshBite Café initial state' });
});
