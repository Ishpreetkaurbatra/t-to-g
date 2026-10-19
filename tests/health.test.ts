import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../server/app.ts';

test('Health & Status Endpoints', async (t) => {
  await t.test('GET /api/health should return 200 with service availability', async () => {
    const res = await request(app).get('/api/health');

    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.service, 'T→G Backend API');
    assert.equal(typeof res.body.uptime, 'number');
    assert.ok(res.body.timestamp);
    assert.ok(res.body.version);
    assert.ok(res.body.environment);
  });

  await t.test('GET /api/status should return 200 with actual dependency status', async () => {
    const res = await request(app).get('/api/status');

    assert.equal(res.status, 200);
    assert.ok(['healthy', 'degraded'].includes(res.body.status));
    assert.ok(res.body.dependencies);
    assert.ok(res.body.dependencies.database);
    assert.ok(['supabase', 'in-memory-fallback'].includes(res.body.dependencies.database.provider));
    assert.ok(['connected', 'fallback', 'degraded'].includes(res.body.dependencies.database.status));

    assert.ok(res.body.dependencies.aiEngine);
    assert.ok(['mock', 'http', 'gemini'].includes(res.body.dependencies.aiEngine.provider));
    assert.equal(typeof res.body.dependencies.aiEngine.isMock, 'boolean');

    assert.ok(res.body.system);
    assert.ok(res.body.system.nodeVersion);
    assert.equal(typeof res.body.system.memoryUsageMB, 'number');
  });
});
