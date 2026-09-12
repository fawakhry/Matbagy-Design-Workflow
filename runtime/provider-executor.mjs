export class ProviderCircuitOpenError extends Error {
  constructor(providerName) {
    super(`circuit open for provider ${providerName}`);
    this.code = 'CIRCUIT_OPEN';
  }
}

export class ProviderTimeoutError extends Error {
  constructor(providerName, timeoutMs) {
    super(`provider ${providerName} timed out after ${timeoutMs}ms`);
    this.code = 'PROVIDER_TIMEOUT';
  }
}

export class ResilientProviderExecutor {
  constructor({ timeoutMs = 1500, maxRetries = 1, failureThreshold = 3, cooldownMs = 30000, now = () => Date.now(), sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) } = {}) {
    this.timeoutMs = timeoutMs;
    this.maxRetries = maxRetries;
    this.failureThreshold = failureThreshold;
    this.cooldownMs = cooldownMs;
    this.now = now;
    this.sleep = sleep;
    this.state = new Map();
  }

  async execute({ providerName, provider, packet }) {
    const state = this.#getState(providerName);
    if (state.openedAt && this.now() - state.openedAt < this.cooldownMs) throw new ProviderCircuitOpenError(providerName);
    if (state.openedAt && this.now() - state.openedAt >= this.cooldownMs) {
      state.openedAt = 0;
      state.failures = 0;
    }

    let lastError;
    for (let attempt = 0; attempt <= this.maxRetries; attempt += 1) {
      try {
        const result = await withTimeout(Promise.resolve(provider.respond(packet)), this.timeoutMs, () => new ProviderTimeoutError(providerName, this.timeoutMs));
        state.failures = 0;
        state.openedAt = 0;
        return result;
      } catch (error) {
        lastError = error;
        if (attempt < this.maxRetries) await this.sleep(Math.min(25 * (attempt + 1), 100));
      }
    }

    state.failures += 1;
    if (state.failures >= this.failureThreshold) state.openedAt = this.now();
    throw lastError;
  }

  getState(providerName) { return { ...this.#getState(providerName) }; }
  #getState(providerName) {
    if (!this.state.has(providerName)) this.state.set(providerName, { failures: 0, openedAt: 0 });
    return this.state.get(providerName);
  }
}

function withTimeout(promise, timeoutMs, makeError) {
  let timer;
  const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(makeError()), timeoutMs); });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
