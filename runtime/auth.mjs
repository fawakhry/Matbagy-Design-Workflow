export class StaticTokenAuth {
  constructor(entries = {}, { realm = 'matbagy-test' } = {}) {
    this.realm = realm;
    this.tokens = new Map(Object.entries(entries));
  }

  authenticate(headers = {}) {
    const raw = String(headers.authorization || headers.Authorization || '').trim();
    const match = raw.match(/^Bearer\s+(.+)$/i);
    if (!match) return { ok: false, code: 'AUTH_REQUIRED', status: 401 };
    const principal = this.tokens.get(match[1]);
    if (!principal) return { ok: false, code: 'INVALID_TOKEN', status: 401 };
    return { ok: true, principal: structuredCloneSafe(principal) };
  }

  requireRole(principal, role) {
    const roles = Array.isArray(principal?.roles) ? principal.roles : [];
    return roles.includes(role);
  }
}

export function createDefaultTestAuth() {
  return new StaticTokenAuth({
    'matbagy-local-test-token': {
      subject: 'local-test-operator',
      roles: ['operator'],
      environment: 'TEST_ONLY',
    },
  });
}

function structuredCloneSafe(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
