import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../server/app.ts';

test('Business API Routes', async (t) => {
  let createdPlanId = '';

  await t.test('GET /api/business/profile should return current profile', async () => {
    const res = await request(app).get('/api/business/profile');

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.id);
    assert.ok(res.body.data.name);
    assert.ok(res.body.data.category);
  });

  await t.test('PUT /api/business/profile should update profile fields', async () => {
    const res = await request(app)
      .put('/api/business/profile')
      .send({
        businessSize: 'Medium (11-50)',
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.businessSize, 'Medium (11-50)');
  });

  await t.test('POST /api/business/match should process opportunity matching requests', async () => {
    const res = await request(app)
      .post('/api/business/match')
      .send({
        category: 'Food & Beverage',
        minScore: 60,
        limit: 5,
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.businessId);
    assert.ok(Array.isArray(res.body.matches));
    assert.ok(res.body.matches.length > 0);
    assert.ok(res.body.matches[0].opportunityScore >= 60);
    assert.ok(res.body.matches[0].relevanceScore);
  });

  await t.test('POST /api/business/plan should generate and persist an action plan', async () => {
    const res = await request(app)
      .post('/api/business/plan')
      .send({
        trendName: 'Cold Brew Oat Shakerato',
        category: 'Food & Beverage',
        objective: 'Pilot specialty chilled beverage flight for 14 days',
        estimatedEffort: 'Low',
        expectedOpportunity: 'High',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.id);
    assert.equal(res.body.data.trendName, 'Cold Brew Oat Shakerato');
    assert.ok(res.body.data.testMeasureLearn);

    createdPlanId = res.body.data.id;
  });

  await t.test('GET /api/action-plans/:id should return created plan', async () => {
    const res = await request(app).get(`/api/action-plans/${createdPlanId}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.id, createdPlanId);
  });

  await t.test('POST /api/expert/review should submit expert decision', async () => {
    const res = await request(app)
      .post('/api/expert/review')
      .send({
        planId: createdPlanId,
        decision: 'APPROVED',
        comment: 'Strong unit margin economics. Recommended for 14-day counter trial.',
        confidence: 95,
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.validationStatus, 'APPROVED');
    assert.equal(res.body.data.expertReview.decision, 'APPROVED');
  });

  await t.test('GET /api/business/opportunities should return top opportunities', async () => {
    const res = await request(app).get('/api/business/opportunities');

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
  });
});
