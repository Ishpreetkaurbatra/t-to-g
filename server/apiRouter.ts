import { Router } from 'express';
import { validate } from './middleware/validate.ts';
import {
  trendSearchSchema,
  trendAnalyzeSchema,
  businessMatchSchema,
  businessPlanSchema,
  businessProfileUpdateSchema,
  expertReviewSchema,
  experimentCreateSchema,
  experimentResultSchema,
} from './validators/index.ts';

import { HealthController } from './controllers/healthController.ts';
import { TrendController } from './controllers/trendController.ts';
import { BusinessController } from './controllers/businessController.ts';
import { PlanController } from './controllers/planController.ts';
import { AlertController } from './controllers/alertController.ts';
import { ExperimentController } from './controllers/experimentController.ts';
import { SystemController } from './controllers/systemController.ts';

export const apiRouter = Router();

// ==========================================
// 1. HEALTH & SYSTEM DIAGNOSTICS
// ==========================================
apiRouter.get('/health', HealthController.getHealth);
apiRouter.get('/status', HealthController.getStatus);

// ==========================================
// 2. TREND ENDPOINTS
// ==========================================
// List trends (with query params: category, momentum, search)
apiRouter.get('/trends', TrendController.getTrends);

// Search trends with structured JSON payload & pagination
apiRouter.post('/trends/search', validate({ body: trendSearchSchema }), TrendController.searchTrends);

// Analyze a trend with AI Engine
apiRouter.post('/trends/analyze', validate({ body: trendAnalyzeSchema }), TrendController.analyzeTrend);

// Retrieve trend alerts (both /trends/alerts and /alerts are supported)
apiRouter.get('/trends/alerts', TrendController.getAlerts);

// Single trend by ID
apiRouter.get('/trends/:id', TrendController.getTrendById);

// Save/bookmark trend toggle
apiRouter.post('/trends/:id/save', TrendController.toggleSaveTrend);

// ==========================================
// 3. BUSINESS OPPORTUNITY & PLANNING
// ==========================================
// Business profile
apiRouter.get('/business/profile', BusinessController.getProfile);
apiRouter.put('/business/profile', validate({ body: businessProfileUpdateSchema }), BusinessController.updateProfile);

// Business Opportunity Matching
apiRouter.post('/business/match', validate({ body: businessMatchSchema }), BusinessController.matchOpportunities);

// Generate/create Business Action Plan
apiRouter.post('/business/plan', validate({ body: businessPlanSchema }), BusinessController.createPlan);

// Top ranked opportunities for business
apiRouter.get('/business/opportunities', BusinessController.getOpportunities);

// ==========================================
// 4. ACTION PLANS & EXPERT REVIEWS
// ==========================================
apiRouter.get('/action-plans', PlanController.getActionPlans);
apiRouter.get('/action-plans/:id', PlanController.getActionPlanById);
apiRouter.post('/action-plans', validate({ body: businessPlanSchema }), PlanController.createActionPlan);

apiRouter.get('/expert/pending', PlanController.getPendingReviews);
apiRouter.post('/expert/review', validate({ body: expertReviewSchema }), PlanController.submitExpertReview);

// ==========================================
// 5. SMART ALERTS
// ==========================================
apiRouter.get('/alerts', AlertController.getAlerts);
apiRouter.post('/alerts/:id/dismiss', AlertController.dismissAlert);

// ==========================================
// 6. EXPERIMENTS (TEST → MEASURE → LEARN → ADAPT)
// ==========================================
apiRouter.get('/experiments', ExperimentController.getExperiments);
apiRouter.post('/experiments', validate({ body: experimentCreateSchema }), ExperimentController.createExperiment);
apiRouter.post('/experiments/:id/result', validate({ body: experimentResultSchema }), ExperimentController.updateExperimentResult);

// ==========================================
// 7. SYSTEM SOURCES & ANALYTICS
// ==========================================
apiRouter.get('/sources', SystemController.getSources);
apiRouter.get('/analytics', SystemController.getAnalytics);
apiRouter.post('/demo/reset', SystemController.resetDemo);
