/** Provider contracts + safe mocks. No external API calls. */

export class MockChatGPTProvider {
  constructor(name = 'mock-chatgpt') { this.name = name; }
  async respond(packet) {
    return {
      provider: 'CHATGPT',
      source_type: 'CHATGPT_OPINION',
      verdict: 'ADVISORY',
      summary: `Mock ChatGPT reviewed ${packet.case.case_id}`,
      recommendation: 'Continue according to must_keep/must_avoid and documented evidence.',
      confidence: 'TEST_ONLY',
    };
  }
}

export class MockGeminiProvider {
  constructor(name = 'mock-gemini') { this.name = name; }
  async respond(packet) {
    return {
      provider: 'GEMINI',
      source_type: 'GEMINI_OPINION',
      verdict: 'PASS_WITHOUT_VISUAL_IO',
      visual_analysis: 'Mock provider: no real image bytes were inspected.',
      must_keep_check: packet.case.must_keep,
      must_avoid_check: packet.case.must_avoid,
      recommendation: 'Use a live visual provider only after server-side credentials and asset retrieval are configured.',
      confidence: 'TEST_ONLY',
    };
  }
}

export function validateProviderResponse(response, expectedProvider) {
  const errors = [];
  if (!response || typeof response !== 'object') errors.push('provider response must be an object');
  if (response?.provider !== expectedProvider) errors.push(`provider must be ${expectedProvider}`);
  const expectedSource = expectedProvider === 'GEMINI' ? 'GEMINI_OPINION' : 'CHATGPT_OPINION';
  if (response?.source_type !== expectedSource) errors.push(`source_type must be ${expectedSource}`);
  return { valid: errors.length === 0, errors };
}
