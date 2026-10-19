import test from 'node:test';
import assert from 'node:assert/strict';
import { checkDatabaseHealth } from '../server/services/database/supabaseClient.ts';
import { repository } from '../server/services/database/repository.ts';

test('Database Graceful Fallback', async (t) => {
  await t.test('checkDatabaseHealth returns resilient fallback status when credentials missing', async () => {
    const health = await checkDatabaseHealth();

    assert.ok(health);
    assert.ok(['supabase', 'in-memory-fallback'].includes(health.provider));
    assert.ok(['connected', 'fallback', 'degraded'].includes(health.status));
    assert.ok(health.message);
  });

  await t.test('Repository provides reliable trend data via fallback store', async () => {
    const trends = await repository.getTrends();

    assert.ok(Array.isArray(trends));
    assert.ok(trends.length > 0);
    assert.ok(trends[0].id);
    assert.ok(trends[0].name);
  });

  await t.test('Repository provides reliable business profile via fallback store', async () => {
    const profile = await repository.getBusinessProfile();

    assert.ok(profile);
    assert.ok(profile.id);
    assert.ok(profile.name);
    assert.ok(profile.category);
  });

  await t.test('Repository creates and retrieves action plan in fallback store', async () => {
    const newPlan = await repository.createActionPlan({
      businessId: 'biz-test',
      trendId: 'tr-fallback-test',
      trendName: 'Fallback Test Strategy',
      category: 'Food & Beverage',
      objective: 'Verify repository fallback creation',
      whyThisTrend: 'Testing fallback resilience',
      recommendedAction: 'Execute unit test',
      targetCustomer: 'Developers',
      productServiceIdea: 'Robust code',
      marketingApproach: 'Automated CI',
      channel: 'Terminal',
      pilot: 'Run test suite',
      timeline: 'Instant',
      estimatedEffort: 'Low',
      expectedOpportunity: 'High',
      risks: [],
      successMetrics: ['Tests pass'],
      testMeasureLearn: {
        test: 'Run fallback test',
        measure: 'Assertion result',
        learn: 'Fallback is rock solid',
        adapt: 'Ship with confidence',
      },
      validationStatus: 'PENDING EXPERT REVIEW',
    });

    assert.ok(newPlan.id);
    assert.equal(newPlan.trendName, 'Fallback Test Strategy');

    const fetched = await repository.getActionPlanById(newPlan.id);
    assert.ok(fetched);
    assert.equal(fetched.id, newPlan.id);
  });
});
