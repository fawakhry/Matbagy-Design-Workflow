import assert from 'node:assert/strict';
import { assertSandboxFolder, assertSandboxPath, validateSandboxConfig } from './sandbox-config.mjs';
import { SandboxHarness } from './sandbox-harness.mjs';

const config = {
  mode: 'SANDBOX',
  githubBranch: 'sandbox/runtime-v06',
  githubPathPrefix: 'runtime-sandbox/',
  driveSandboxFolderId: 'drive-sandbox-1',
  canonicalDriveRootId: 'drive-root-1',
};
assert.equal(validateSandboxConfig(config).valid, true);
assert.equal(validateSandboxConfig({ ...config, githubBranch: 'agent/initial-mvp' }).valid, false);
assert.equal(validateSandboxConfig({ ...config, driveSandboxFolderId: 'drive-root-1' }).valid, false);
assert.equal(assertSandboxPath('runtime-sandbox/a.txt'), 'runtime-sandbox/a.txt');
assert.throws(() => assertSandboxPath('صندوق_مطبعجي/CASES/x.md'), /runtime-sandbox/);
assert.throws(() => assertSandboxPath('runtime-sandbox/../CASES/x.md'));
assert.equal(assertSandboxFolder('drive-sandbox-1', 'drive-sandbox-1'), 'drive-sandbox-1');
assert.throws(() => assertSandboxFolder('drive-root-1', 'drive-sandbox-1'));

class MockGithub {
  constructor(){ this.files = new Map(); }
  async writeText({ branch, path, content }) { this.files.set(`${branch}:${path}`, content); }
  async readText({ branch, path }) { return this.files.get(`${branch}:${path}`); }
  async deletePath({ branch, path }) { this.files.delete(`${branch}:${path}`); }
}
class MockDrive {
  constructor(){ this.folders = new Map(); this.n = 0; }
  async createFolder({ parentFolderId, name }) { const id = `F${++this.n}`; this.folders.set(id,{id,name,parentFolderId}); return this.folders.get(id); }
  async getFolder({ id }) { return this.folders.get(id) || null; }
  async deleteFolder({ id }) { this.folders.delete(id); }
}
const audit = { rows: [], async append(row){ this.rows.push(row); } };
const harness = new SandboxHarness({ config, githubClient: new MockGithub(), driveClient: new MockDrive(), auditStore: audit });
const gh = await harness.runGithubSmoke();
assert.equal(gh.ok, true);
assert.equal(gh.cleanup, 'DELETED');
const dr = await harness.runDriveSmoke({ name: 'smoke' });
assert.equal(dr.ok, true);
assert.equal(dr.cleanup, 'DELETED');
assert.ok(audit.rows.some(x => x.action === 'SANDBOX_GITHUB_SMOKE_PASS'));
assert.ok(audit.rows.some(x => x.action === 'SANDBOX_DRIVE_SMOKE_PASS'));
console.log('Matbagy Runtime v0.6 sandbox harness tests: PASS');
