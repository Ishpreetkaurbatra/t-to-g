import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../server/app.ts';

test('Request Validation', async (t) => {
  await t.test('POST /api/trends/search should reject invalid limit values', async () => {
    const res = await request(app)
      .post('/api/trends/search')
      .send({ limit: -5 });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'VALIDATION_ERROR');
    assert.ok(res.body.details.some((d: any) => d.field === 'limit'));
  });

  await t.test('POST /api/trends/analyze should reject empty payload lacking trendId or customTrend', async () => {
    const res = await request(app)
      .post('/api/trends/analyze')
      .send({});

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'VALIDATION_ERROR');
  });

  await t.test('POST /api/business/match should reject invalid minScore > 100', async () => {
    const res = await request(app)
      .post('/api/business/match')
      .send({ minScore: 150 });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'VALIDATION_ERROR');
  });

  await t.test('POST /api/business/plan should reject empty payload lacking trend info', async () => {
    const res = await request(app)
      .post('/api/business/plan')
      .send({ objective: 'Plan without trend' });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'VALIDATION_ERROR');
  });

  await t.test('POST /api/expert/review should reject invalid decision enum', async () => {
    const res = await request(app)
      .post('/api/expert/review')
      .send({
        planId: 'plan-1',
        decision: 'MAYBE_LATER', // Invalid enum
        comment: 'Needs check',
      });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'VALIDATION_ERROR');
  });
});
