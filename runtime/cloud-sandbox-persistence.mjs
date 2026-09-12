import { assertSandboxFolder, assertSandboxPath, validateSandboxConfig } from './sandbox-config.mjs';

const GITHUB_API = 'https://api.github.com';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,parents,webViewLink';

export class GitHubSandboxWriter {
  constructor({ token, repository, branch, pathPrefix = 'runtime-sandbox/', fetchImpl = globalThis.fetch } = {}) {
    if (!token) throw new Error('GITHUB_SANDBOX_TOKEN is required');
    if (!repository || !repository.includes('/')) throw new Error('repository must be owner/name');
    if (!String(branch || '').startsWith('sandbox/')) throw new Error('GitHub sandbox branch must start with sandbox/');
    this.token = token;
    this.repository = repository;
    this.branch = branch;
    this.pathPrefix = pathPrefix;
    this.fetchImpl = fetchImpl;
  }

  async putJson(relativePath, value, message = 'Persist Matbagy sandbox runtime evidence') {
    const fullPath = assertSandboxPath(`${this.pathPrefix}${String(relativePath || '').replace(/^\/+/, '')}`, this.pathPrefix);
    const url = `${GITHUB_API}/repos/${this.repository}/contents/${encodePath(fullPath)}`;
    const response = await this.fetchImpl(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
        'User-Agent': 'matbagy-runtime-sandbox',
      },
      body: JSON.stringify({
        message,
        branch: this.branch,
        content: toBase64Utf8(`${JSON.stringify(value, null, 2)}\n`),
      }),
    });
    const data = await parseResponse(response);
    if (!response.ok) throw httpError('GITHUB_SANDBOX_WRITE_FAILED', response.status, data);
    return {
      provider: 'GITHUB',
      path: fullPath,
      branch: this.branch,
      commit_sha: data?.commit?.sha || null,
      content_sha: data?.content?.sha || null,
      html_url: data?.content?.html_url || null,
    };
  }
}

export class GoogleOAuthRefreshAccessTokenProvider {
  constructor({ clientId, clientSecret, refreshToken, fetchImpl = globalThis.fetch } = {}) {
    if (!clientId || !clientSecret || !refreshToken) throw new Error('Google OAuth clientId/clientSecret/refreshToken are required');
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
    this.fetchImpl = fetchImpl;
    this.cached = null;
  }

  async getAccessToken() {
    const now = Date.now();
    if (this.cached && now < this.cached.expiresAt - 60_000) return this.cached.token;
    const form = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token',
    });
    const response = await this.fetchImpl(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    const data = await parseResponse(response);
    if (!response.ok || !data?.access_token) throw httpError('GOOGLE_OAUTH_REFRESH_FAILED', response.status, data);
    this.cached = {
      token: data.access_token,
      expiresAt: now + Number(data.expires_in || 3600) * 1000,
    };
    return this.cached.token;
  }
}

export class DriveSandboxWriter {
  constructor({ folderId, expectedSandboxFolderId, accessTokenProvider, fetchImpl = globalThis.fetch } = {}) {
    this.folderId = assertSandboxFolder(folderId, expectedSandboxFolderId);
    if (!accessTokenProvider || typeof accessTokenProvider.getAccessToken !== 'function') throw new Error('accessTokenProvider is required');
    this.accessTokenProvider = accessTokenProvider;
    this.fetchImpl = fetchImpl;
  }

  async putJson(fileName, value) {
    const safeName = sanitizeFileName(fileName);
    const token = await this.accessTokenProvider.getAccessToken();
    const boundary = `matbagy_${crypto.randomUUID().replaceAll('-', '')}`;
    const metadata = { name: safeName, parents: [this.folderId], mimeType: 'application/json' };
    const content = `${JSON.stringify(value, null, 2)}\n`;
    const multipart = [
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`,
      `--${boundary}\r\nContent-Type: application/json\r\n\r\n${content}\r\n`,
      `--${boundary}--`,
    ].join('');
    const response = await this.fetchImpl(GOOGLE_DRIVE_UPLOAD_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipart,
    });
    const data = await parseResponse(response);
    if (!response.ok || !data?.id) throw httpError('DRIVE_SANDBOX_WRITE_FAILED', response.status, data);
    return {
      provider: 'GOOGLE_DRIVE',
      file_id: data.id,
      name: data.name || safeName,
      parent_folder_id: this.folderId,
      web_view_link: data.webViewLink || null,
    };
  }
}

export function createSandboxPersistenceFromEnv(env, { fetchImpl = globalThis.fetch } = {}) {
  if (String(env.SANDBOX_PERSISTENCE_ENABLED || '').toLowerCase() !== 'true') {
    return { enabled: false, github: null, drive: null };
  }

  const validation = validateSandboxConfig({
    mode: env.MATBAGY_RUNTIME_MODE,
    githubBranch: env.GITHUB_SANDBOX_BRANCH,
    githubPathPrefix: env.GITHUB_SANDBOX_PREFIX,
    driveSandboxFolderId: env.DRIVE_SANDBOX_FOLDER_ID,
    canonicalDriveRootId: env.CANONICAL_DRIVE_ROOT_ID,
  });
  if (!validation.valid) throw new Error(`invalid sandbox persistence config: ${validation.errors.join('; ')}`);

  const github = new GitHubSandboxWriter({
    token: env.GITHUB_SANDBOX_TOKEN,
    repository: env.GITHUB_REPOSITORY || 'fawakhry/Matbagy-Design-Workflow',
    branch: validation.normalized.githubBranch,
    pathPrefix: validation.normalized.githubPathPrefix,
    fetchImpl,
  });
  const accessTokenProvider = new GoogleOAuthRefreshAccessTokenProvider({
    clientId: env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
    refreshToken: env.GOOGLE_OAUTH_REFRESH_TOKEN,
    fetchImpl,
  });
  const drive = new DriveSandboxWriter({
    folderId: validation.normalized.driveSandboxFolderId,
    expectedSandboxFolderId: validation.normalized.driveSandboxFolderId,
    accessTokenProvider,
    fetchImpl,
  });
  return { enabled: true, github, drive };
}

export async function persistSandboxEvidence({ requestId, payload, persistence }) {
  if (!persistence?.enabled) return { enabled: false, writes: [] };
  const safeId = String(requestId || crypto.randomUUID()).replace(/[^a-zA-Z0-9_-]/g, '_');
  const relative = `live-runs/${safeId}.json`;
  const fileName = `MATBAGY_${safeId}.json`;
  const [github, drive] = await Promise.all([
    persistence.github.putJson(relative, payload),
    persistence.drive.putJson(fileName, payload),
  ]);
  return { enabled: true, writes: [github, drive] };
}

async function parseResponse(response) {
  const text = await response.text();
  try { return text ? JSON.parse(text) : {}; } catch { return { raw: text }; }
}

function httpError(code, status, data) {
  const message = String(data?.error?.message || data?.message || data?.raw || `HTTP ${status}`).slice(0, 500);
  const error = new Error(message);
  error.code = code;
  error.status = status;
  return error;
}

function sanitizeFileName(name) {
  const clean = String(name || 'matbagy-runtime.json').replace(/[\\/:*?"<>|]/g, '_').trim();
  return clean.endsWith('.json') ? clean : `${clean}.json`;
}

function encodePath(path) {
  return String(path).split('/').map(encodeURIComponent).join('/');
}

function toBase64Utf8(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
