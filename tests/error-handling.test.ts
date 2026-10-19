import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../server/app.ts';

test('Error Handling Middleware', async (t) => {
  await t.test('GET /api/nonexistent-route should return 404 JSON response', async () => {
    const res = await request(app).get('/api/this-route-does-not-exist');

    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'NOT_FOUND');
    assert.ok(res.body.error);
  });

  await t.test('POST /api/trends/search with malformed JSON should return 400 INVALID_JSON', async () => {
    const res = await request(app)
      .post('/api/trends/search')
      .set('Content-Type', 'application/json')
      .send('{ "query": "broken json');

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'INVALID_JSON');
    assert.ok(res.body.error);
  });
});
