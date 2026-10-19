import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../server/app.ts';

test('Trend API Routes', async (t) => {
  let sampleTrendId = '';

  await t.test('GET /api/trends should return array of trends', async () => {
    const res = await request(app).get('/api/trends');

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);

    sampleTrendId = res.body.data[0].id;
    assert.ok(sampleTrendId);
  });

  await t.test('GET /api/trends with category query filter', async () => {
    const res = await request(app).get('/api/trends?category=Food%20%26%20Beverage');

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.every((item: any) => item.category.toLowerCase().includes('food')));
  });

  await t.test('POST /api/trends/search should return matching trends with pagination', async () => {
    const res = await request(app)
      .post('/api/trends/search')
      .send({
        query: 'coffee',
        limit: 5,
        offset: 0,
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(typeof res.body.count, 'number');
    assert.equal(typeof res.body.total, 'number');
    assert.equal(res.body.limit, 5);
    assert.ok(Array.isArray(res.body.data));
  });

  await t.test('GET /api/trends/:id should return single trend details', async () => {
    const res = await request(app).get(`/api/trends/${sampleTrendId}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.id, sampleTrendId);
    assert.ok(res.body.data.name);
    assert.ok(res.body.data.category);
  });

  await t.test('GET /api/trends/:id should return 404 for nonexistent id', async () => {
    const res = await request(app).get('/api/trends/nonexistent-id-99999');

    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'TREND_NOT_FOUND');
  });

  await t.test('POST /api/trends/:id/save should toggle saved status', async () => {
    const res = await request(app).post(`/api/trends/${sampleTrendId}/save`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(typeof res.body.is_saved, 'boolean');
  });

  await t.test('GET /api/trends/alerts should return smart alerts', async () => {
    const res = await request(app).get('/api/trends/alerts');

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length > 0);
  });

  await t.test('POST /api/trends/analyze should return analysis for existing trendId', async () => {
    const res = await request(app)
      .post('/api/trends/analyze')
      .send({ trendId: sampleTrendId });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.trend);
    assert.ok(res.body.business);
    assert.ok(res.body.analysis);
    assert.ok(res.body.analysis.innovative_plan);
    assert.equal(typeof res.body.isMockAi, 'boolean');
  });

  await t.test('POST /api/trends/analyze should process customTrend object', async () => {
    const res = await request(app)
      .post('/api/trends/analyze')
      .send({
        customTrend: {
          name: 'Zero-Waste Artisan Packaging',
          category: 'Retail',
          description: 'High demand for biodegradable compostable shopping boxes.',
          location: 'Bangalore, Karnataka',
          momentum: 'Rising',
        },
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.trend.name, 'Zero-Waste Artisan Packaging');
    assert.ok(res.body.analysis.trend_summary);
  });
});
