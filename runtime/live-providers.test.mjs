import assert from 'node:assert/strict';
import { LiveGeminiProvider, LiveOpenAIProvider, extractGeminiText, extractOpenAIText } from './live-providers.mjs';
import { validateEnv } from './cloudflare-worker.mjs';

const packet = {
  case: { case_id: 'DESIGN-2026-000015', must_keep: ['ملامح الوجه'], must_avoid: ['فلاتر'] },
  user_request: 'راجع التصميم',
};

let openAiRequest;
const openai = new LiveOpenAIProvider({
  apiKey: 'test-openai',
  model: 'gpt-test',
  fetchImpl: async (url, init) => {
    openAiRequest = { url, init };
    return new Response(JSON.stringify({
      id: 'resp_test',
      model: 'gpt-test',
      output: [{ content: [{ type: 'output_text', text: JSON.stringify({ verdict: 'PASS', summary: 'ok', recommendation: 'continue', confidence: 'HIGH' }) }] }],
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  },
});
const openAiResult = await openai.respond(packet);
assert.equal(openAiResult.provider, 'CHATGPT');
assert.equal(openAiResult.source_type, 'CHATGPT_OPINION');
assert.equal(openAiResult.verdict, 'PASS');
assert.match(openAiRequest.url, /api\.openai\.com\/v1\/responses$/);
assert.equal(openAiRequest.init.headers.Authorization, 'Bearer test-openai');

let geminiRequest;
const gemini = new LiveGeminiProvider({
  apiKey: 'test-gemini',
  model: 'gemini-test',
  fetchImpl: async (url, init) => {
    geminiRequest = { url, init };
    return new Response(JSON.stringify({
      id: 'int_test',
      model: 'gemini-test',
      steps: [{ type: 'model_output', content: [{ type: 'text', text: JSON.stringify({ verdict: 'NEEDS_CHANGE', summary: 'check', recommendation: 'adjust', confidence: 'MEDIUM' }) }] }],
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  },
});
const geminiResult = await gemini.respond(packet);
assert.equal(geminiResult.provider, 'GEMINI');
assert.equal(geminiResult.source_type, 'GEMINI_OPINION');
assert.equal(geminiResult.verdict, 'NEEDS_CHANGE');
assert.match(geminiRequest.url, /generativelanguage\.googleapis\.com\/v1beta\/interactions$/);
assert.equal(geminiRequest.init.headers['x-goog-api-key'], 'test-gemini');

assert.equal(extractOpenAIText({ output_text: 'x' }), 'x');
assert.equal(extractGeminiText({ steps: [{ type: 'model_output', content: [{ type: 'text', text: 'y' }] }] }), 'y');

const env = {
  MATBAGY_RUNTIME_MODE: 'SANDBOX',
  OPENAI_API_KEY: 'x',
  GEMINI_API_KEY: 'y',
  RUNTIME_BEARER_TOKEN: 'z',
  GITHUB_SANDBOX_BRANCH: 'sandbox/runtime-v06',
  GITHUB_SANDBOX_PREFIX: 'runtime-sandbox/',
  DRIVE_SANDBOX_FOLDER_ID: 'sandbox-folder',
  CANONICAL_DRIVE_ROOT_ID: 'canonical-folder',
};
assert.equal(validateEnv(env).ok, true);
assert.equal(validateEnv({ ...env, GITHUB_SANDBOX_BRANCH: 'main' }).ok, false);
assert.equal(validateEnv({ ...env, OPENAI_API_KEY: '' }).ok, false);

console.log('Matbagy Live AI Sandbox provider tests: PASS');
