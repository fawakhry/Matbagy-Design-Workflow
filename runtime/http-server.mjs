import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { MemoryAssetStore, MemoryCaseStore } from './storage-adapters.mjs';
import { MockChatGPTProvider, MockGeminiProvider } from './providers.mjs';
import { runOrchestrationTurn } from './orchestrator-runtime.mjs';

const MAX_BODY_BYTES = 1024 * 1024;

export function createRuntimeServer(options = {}) {
  const mode = options.mode || process.env.MATBAGY_RUNTIME_MODE || 'TEST';
  if (!['TEST', 'LOCAL'].includes(mode)) {
    throw new Error('Runtime v0.4 refuses to start outside TEST/LOCAL mode');
  }

  const providers = options.providers || {
    CHATGPT: new MockChatGPTProvider(),
    GEMINI: new MockGeminiProvider(),
  };
  const caseStore = options.caseStore || new MemoryCaseStore();
  const assetStore = options.assetStore || new MemoryAssetStore();
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
          version: '0.4',
          mode,
          providers: Object.keys(providers),
          production_integrations: false,
        });
      }

      if (req.method === 'POST' && req.url === '/v1/turn') {
        const idemKey = String(req.headers['idempotency-key'] || '').trim();
        if (idemKey && idempotency.has(idemKey)) {
          return send(res, 200, { ...idempotency.get(idemKey), idempotent_replay: true, request_id: requestId });
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
        });

        const response = { request_id: requestId, idempotent_replay: false, ...result };
        if (idemKey && result.ok) idempotency.set(idemKey, response);
        return send(res, result.ok ? 200 : 422, response);
      }

      return send(res, 404, errorBody('NOT_FOUND', 'route not found', requestId));
    } catch (error) {
      const code = error?.code === 'BODY_TOO_LARGE' ? 'BODY_TOO_LARGE' : 'INTERNAL_ERROR';
      const status = code === 'BODY_TOO_LARGE' ? 413 : 500;
      return send(res, status, errorBody(code, error?.message || 'unknown error', requestId));
    }
  });

  return { server, caseStore, assetStore, providers, mode };
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
    console.log(`Matbagy Runtime v0.4 listening on http://127.0.0.1:${port} (${mode})`);
  });
}
