import test from 'node:test';
import assert from 'node:assert/strict';
import { MockAIEngineAdapter } from '../server/services/ai/mockAdapter.ts';
import { HttpAIEngineAdapter } from '../server/services/ai/httpAdapter.ts';
import { getAIEngineAdapter, getAIEngineStatus } from '../server/services/ai/index.ts';

test('AI Engine Adapter Interface & Mock Isolation', async (t) => {
  await t.test('Mock adapter reports status as mock-active with isMock = true', () => {
    const mock = new MockAIEngineAdapter();
    const status = mock.getStatus();

    assert.equal(status.provider, 'mock');
    assert.equal(status.status, 'mock-active');
    assert.equal(status.isMock, true);
    assert.ok(status.message.includes('Mock AI Engine'));
  });

  await t.test('Mock adapter returns results clearly stamped with isMock and disclaimer', async () => {
    const mock = new MockAIEngineAdapter();
    const res = await mock.analyzeTrend({
      trend: {
        name: 'Artisan Micro-Bakery',
        category: 'Food & Beverage',
        description: 'Rising interest in sourdough and localized flour.',
        location: 'Delhi NCR',
        momentum: 'Rising',
      },
      business: {
        name: 'FreshBite Café',
        category: 'Food & Beverage',
        location: 'Delhi, India',
        targetCustomers: 'Young professionals',
        productsServices: 'Café & Bakery',
        businessSize: 'Small (1-10)',
        channels: ['Storefront', 'Instagram'],
        goals: ['Increase revenue'],
      },
    });

    assert.equal(res.isMock, true);
    assert.equal(res.engine, 'mock-ai-engine');
    assert.ok(res.disclaimer?.includes('MOCK RESULT'));
    assert.ok(res.trend_summary.includes('[MOCK'));
  });

  await t.test('Http adapter correctly indicates unconfigured state when URL is missing', () => {
    const http = new HttpAIEngineAdapter('', '', 5000);
    const status = http.getStatus();

    assert.equal(status.provider, 'http');
    assert.equal(status.status, 'unconfigured');
    assert.equal(status.isMock, false);
    assert.ok(status.message.includes('not configured'));
  });

  await t.test('Http adapter throws helpful error on analyzeTrend when URL is missing', async () => {
    const http = new HttpAIEngineAdapter('', '', 5000);
    await assert.rejects(
      async () => {
        await http.analyzeTrend({
          trend: { name: 'Test', category: 'Test', description: '', location: '', momentum: 'Rising' },
          business: { name: 'Test', category: 'Test', location: '', targetCustomers: '', productsServices: '', businessSize: '', channels: [], goals: [] },
        });
      },
      {
        message: /AI_ENGINE_URL is not configured/,
      }
    );
  });

  await t.test('getAIEngineAdapter returns active singleton implementing IAIEngineAdapter', () => {
    const adapter = getAIEngineAdapter();
    assert.ok(adapter);
    assert.equal(typeof adapter.analyzeTrend, 'function');
    assert.equal(typeof adapter.matchOpportunities, 'function');
    assert.equal(typeof adapter.generatePlan, 'function');
    assert.equal(typeof adapter.getStatus, 'function');

    const status = getAIEngineStatus();
    assert.ok(status.provider);
  });
});
