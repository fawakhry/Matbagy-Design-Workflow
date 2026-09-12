import assert from 'node:assert/strict';
import {
  DriveSandboxWriter,
  GitHubSandboxWriter,
  GoogleOAuthRefreshAccessTokenProvider,
  createSandboxPersistenceFromEnv,
  persistSandboxEvidence,
} from './cloud-sandbox-persistence.mjs';

const calls = [];
const fetchImpl = async (url, init = {}) => {
  calls.push({ url: String(url), init });
  if (String(url).includes('oauth2.googleapis.com/token')) {
    return new Response(JSON.stringify({ access_token: 'google-access', expires_in: 3600 }), { status: 200 });
  }
  if (String(url).includes('googleapis.com/upload/drive')) {
    return new Response(JSON.stringify({ id: 'drive-file-1', name: 'evidence.json', parents: ['drive-sandbox'], webViewLink: 'https://drive.google.com/file/d/drive-file-1/view' }), { status: 200 });
  }
  if (String(url).includes('api.github.com/repos/')) {
    return new Response(JSON.stringify({ commit: { sha: 'commit-1' }, content: { sha: 'blob-1', html_url: 'https://github.com/example' } }), { status: 201 });
  }
  return new Response('{}', { status: 404 });
};

const github = new GitHubSandboxWriter({
  token: 'gh-test',
  repository: 'fawakhry/Matbagy-Design-Workflow',
  branch: 'sandbox/runtime-v06',
  pathPrefix: 'runtime-sandbox/',
  fetchImpl,
});
const ghResult = await github.putJson('live-runs/test.json', { ok: true });
assert.equal(ghResult.provider, 'GITHUB');
assert.equal(ghResult.branch, 'sandbox/runtime-v06');
assert.equal(ghResult.path, 'runtime-sandbox/live-runs/test.json');
assert.equal(ghResult.commit_sha, 'commit-1');

const accessTokenProvider = new GoogleOAuthRefreshAccessTokenProvider({
  clientId: 'client-id',
  clientSecret: 'client-secret',
  refreshToken: 'refresh-token',
  fetchImpl,
});
const drive = new DriveSandboxWriter({
  folderId: 'drive-sandbox',
  expectedSandboxFolderId: 'drive-sandbox',
  accessTokenProvider,
  fetchImpl,
});
const driveResult = await drive.putJson('evidence.json', { ok: true });
assert.equal(driveResult.provider, 'GOOGLE_DRIVE');
assert.equal(driveResult.file_id, 'drive-file-1');
assert.equal(driveResult.parent_folder_id, 'drive-sandbox');

const disabled = createSandboxPersistenceFromEnv({ SANDBOX_PERSISTENCE_ENABLED: 'false' }, { fetchImpl });
assert.equal(disabled.enabled, false);

const env = {
  SANDBOX_PERSISTENCE_ENABLED: 'true',
  MATBAGY_RUNTIME_MODE: 'SANDBOX',
  GITHUB_SANDBOX_BRANCH: 'sandbox/runtime-v06',
  GITHUB_SANDBOX_PREFIX: 'runtime-sandbox/',
  DRIVE_SANDBOX_FOLDER_ID: 'drive-sandbox',
  CANONICAL_DRIVE_ROOT_ID: 'drive-root',
  GITHUB_REPOSITORY: 'fawakhry/Matbagy-Design-Workflow',
  GITHUB_SANDBOX_TOKEN: 'gh-test',
  GOOGLE_OAUTH_CLIENT_ID: 'client-id',
  GOOGLE_OAUTH_CLIENT_SECRET: 'client-secret',
  GOOGLE_OAUTH_REFRESH_TOKEN: 'refresh-token',
};
const persistence = createSandboxPersistenceFromEnv(env, { fetchImpl });
assert.equal(persistence.enabled, true);
const persisted = await persistSandboxEvidence({ requestId: 'req-test', payload: { case_id: 'DESIGN-2026-000015' }, persistence });
assert.equal(persisted.enabled, true);
assert.equal(persisted.writes.length, 2);

assert.throws(() => new GitHubSandboxWriter({ token: 'x', repository: 'a/b', branch: 'main' }), /sandbox/);
assert.throws(() => new DriveSandboxWriter({ folderId: 'wrong', expectedSandboxFolderId: 'expected', accessTokenProvider }), /sandbox/i);
assert.ok(calls.some((x) => x.url.includes('api.github.com/repos/')));
assert.ok(calls.some((x) => x.url.includes('oauth2.googleapis.com/token')));
assert.ok(calls.some((x) => x.url.includes('googleapis.com/upload/drive')));

console.log('Matbagy Cloud Sandbox persistence tests: PASS');
