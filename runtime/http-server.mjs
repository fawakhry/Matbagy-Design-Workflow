import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { MemoryAssetStore, MemoryCaseStore } from './storage-adapters.mjs';
import { MockChatGPTProvider, MockGeminiProvider } from './providers.mjs';
import { runOrchestrationTurn } from './orchestrator-runtime.mjs';
import { createDefaultTestAuth } from './auth.mjs';
import { MemoryAuditStore } from './audit-store.mjs';
import { ResilientProviderExecutor } from './provider-executor.mjs';
import { MemoryRateLimiter } from './rate-limit.mjs';

const MAX_BODY_BYTES = 1024 * 1024;

export function createRuntimeServer(options = {}) {
  const mode = options.mode || process.env.MATBAGY_RUNTIME_MODE || 'TEST';
  if (!['TEST', 'LOCAL'].includes(mode)) throw new Error('Runtime v0.5 refuses to start outside TEST/LOCAL mode');

  const providers = options.providers || {
    CHATGPT: new MockChatGPTProvider(),
    GEMINI: new MockGeminiProvider(),
  };
  const caseStore = options.caseStore || new MemoryCaseStore();
  const assetStore = options.assetStore || new MemoryAssetStore();
  const auth = options.auth || createDefaultTestAuth();
  const auditStore = options.auditStore || new MemoryAuditStore();
  const providerExecutor = options.providerExecutor || new ResilientProviderExecutor();
  const rateLimiter = options.rateLimiter || new MemoryRateLimiter({ limit: 30, windowMs: 60000 });
  const idempotency = new Map();

  const server = http.createServer(async (req, res) => {
    const requestId = String(req.headers['x-request-id'] || randomUUID());
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.setHeader('x-request-id', requestId);

    try {
      if (req.method === 'GET' && req.url === '/health') {
        return send(res, 200, {
          ok: true,
          service: 'matbagy-runtime',
          version: '0.5',
          mode,
          providers: Object.keys(providers),
          auth: 'TEST_BOUNDARY',
          persistent_audit_interface: true,
          production_integrations: false,
        });
      }

      if (req.method === 'POST' && req.url === '/v1/turn') {
        const authResult = auth.authenticate(req.headers);
        if (!authResult.ok) {
          res.setHeader('www-authenticate', `Bearer realm="${auth.realm || 'matbagy-test'}"`);
          await auditStore.append({ action: 'AUTH_REJECTED', request_id: requestId, code: authResult.code });
          return send(res, authResult.status || 401, errorBody(authResult.code, 'authentication failed', requestId));
        }
        if (!auth.requireRole(authResult.principal, 'operator')) {
          await auditStore.append({ action: 'AUTH_FORBIDDEN', request_id: requestId, subject: authResult.principal.subject });
          return send(res, 403, errorBody('FORBIDDEN', 'operator role required', requestId));
        }

        const limit = rateLimiter.consume(authResult.principal.subject || 'unknown');
        res.setHeader('x-ratelimit-remaining', String(limit.remaining));
        if (!limit.allowed) {
          await auditStore.append({ action: 'RATE_LIMITED', request_id: requestId, subject: authResult.principal.subject });
          return send(res, 429, errorBody('RATE_LIMITED', 'test rate limit exceeded', requestId));
        }

        const idemKey = String(req.headers['idempotency-key'] || '').trim();
        if (idemKey && idempotency.has(idemKey)) {
          const replay = { ...idempotency.get(idemKey), idempotent_replay: true, request_id: requestId };
          await auditStore.append({ action: 'IDEMPOTENT_REPLAY', request_id: requestId, idempotency_key: idemKey, subject: authResult.principal.subject });
          return send(res, 200, replay);
        }

        const body = await readJson(req);
        if (!body?.caseData || typeof body?.userRequest !== 'string') {
          return send(res, 400, errorBody('INVALID_REQUEST', 'caseData and userRequest are required', requestId));
        }

        const result = await runOrchestrationTurn({
          userRequest: body.userRequest,
          caseData: body.caseData,
          providers,
          caseStore,
          assetStore,
          providerExecutor,
          auditStore,
          actor: { subject: authResult.principal.subject, roles: authResult.principal.roles },
        });

        const response = { request_id: requestId, idempotent_replay: false, ...result };
        if (idemKey && result.ok) idempotency.set(idemKey, response);
        await auditStore.append({ action: 'HTTP_TURN_COMPLETED', request_id: requestId, case_id: body.caseData.case_id, ok: result.ok, subject: authResult.principal.subject });
        return send(res, result.ok ? 200 : 422, response);
      }

      return send(res, 404, errorBody('NOT_FOUND', 'route not found', requestId));
    } catch (error) {
      let code = 'INTERNAL_ERROR';
      let status = 500;
      if (error?.code === 'BODY_TOO_LARGE') { code = 'BODY_TOO_LARGE'; status = 413; }
      else if (error?.code === 'INVALID_JSON') { code = 'INVALID_JSON'; status = 400; }
      await auditStore.append({ action: 'HTTP_ERROR', request_id: requestId, code, message: error?.message || 'unknown error' });
      return send(res, status, errorBody(code, error?.message || 'unknown error', requestId));
    }
  });

  return { server, caseStore, assetStore, providers, auth, auditStore, providerExecutor, rateLimiter, mode };
}

async function readJson(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > MAX_BODY_BYTES) {
      const error = new Error('request body exceeds 1 MB');
      error.code = 'BODY_TOO_LARGE';
      throw error;
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error('invalid JSON');
    error.code = 'INVALID_JSON';
    throw error;
  }
}

function errorBody(code, message, requestId) {
  return { ok: false, error: { code, message }, request_id: requestId };
}

function send(res, status, body) {
  res.statusCode = status;
  res.end(JSON.stringify(body));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 8787);
  const { server, mode } = createRuntimeServer();
  server.listen(port, '127.0.0.1', () => {
    console.log(`Matbagy Runtime v0.5 listening on http://127.0.0.1:${port} (${mode})`);
  });
}
