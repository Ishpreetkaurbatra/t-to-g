import { config } from '../../config.ts';
import type { IAIEngineAdapter, AIEngineStatus } from './interface.ts';
import { MockAIEngineAdapter } from './mockAdapter.ts';
import { HttpAIEngineAdapter } from './httpAdapter.ts';
import { GeminiAIEngineAdapter } from './geminiAdapter.ts';

export * from './interface.ts';
export * from './mockAdapter.ts';
export * from './httpAdapter.ts';
export * from './geminiAdapter.ts';

let adapterInstance: IAIEngineAdapter | null = null;

export function getAIEngineAdapter(): IAIEngineAdapter {
  if (adapterInstance) {
    return adapterInstance;
  }

  const provider = config.AI_ENGINE_PROVIDER.toLowerCase();

  switch (provider) {
    case 'http':
      adapterInstance = new HttpAIEngineAdapter();
      break;
    case 'gemini':
      adapterInstance = new GeminiAIEngineAdapter();
      break;
    case 'mock':
    default:
      adapterInstance = new MockAIEngineAdapter();
      break;
  }

  return adapterInstance;
}

/**
 * Reset adapter instance (useful for unit testing different providers)
 */
export function setAIEngineAdapter(adapter: IAIEngineAdapter | null) {
  adapterInstance = adapter;
}

export function getAIEngineStatus(): AIEngineStatus {
  return getAIEngineAdapter().getStatus();
}
