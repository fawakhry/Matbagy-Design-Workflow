import assert from 'node:assert/strict';
import { MemoryAssetStore, MemoryCaseStore } from './storage-adapters.mjs';
import { MockChatGPTProvider, MockGeminiProvider } from './providers.mjs';
import { runOrchestrationTurn } from './orchestrator-runtime.mjs';

const caseData = {
  case_id: 'DESIGN-2026-000015',
  case_phase: 'UNDER_REVIEW',
  approval_status: 'NOT_CONFIRMED',
  customer_approval_status: 'NOT_DOCUMENTED',
  must_keep: ['ملامح الوجه'],
  must_avoid: ['فلاتر'],
  assets: [
    { asset_id: 'DESIGN-2026-000015-A001', source_role: 'customer_original', asset_binding_status: 'LINKED', drive_file_id: 'MOCK_EXISTING_1' },
  ],
  versions: [],
};

const caseStore = new MemoryCaseStore();
const assetStore = new MemoryAssetStore();
const providers = {
  CHATGPT: new MockChatGPTProvider(),
  GEMINI: new MockGeminiProvider(),
};

const boom = await runOrchestrationTurn({
  userRequest: '@الكل راجعوا التصميم',
  caseData,
  providers,
  caseStore,
  assetStore,
});
assert.equal(boom.ok, true);
assert.equal(boom.routing.mode, 'BOOM');
assert.equal(boom.outputs.length, 2);
assert.equal(boom.outputs[0].source_type, 'CHATGPT_OPINION');
assert.equal(boom.outputs[1].source_type, 'GEMINI_OPINION');
assert.equal(boom.persistence.case.case_phase, 'UNDER_REVIEW');
assert.equal(boom.authority, 'ADVISORY_ONLY');

const gptOnly = await runOrchestrationTurn({
  userRequest: 'كمل',
  caseData,
  providers,
  caseStore: new MemoryCaseStore(),
  assetStore: new MemoryAssetStore(),
});
assert.equal(gptOnly.routing.mode, 'GPT');
assert.equal(gptOnly.outputs.length, 1);
assert.equal(gptOnly.outputs[0].provider, 'CHATGPT');

console.log('Matbagy Orchestrator Runtime v0.3 tests: PASS');
