import { assertSandboxFolder, assertSandboxPath, validateSandboxConfig } from './sandbox-config.mjs';

export class SandboxHarness {
  constructor({ config, githubClient, driveClient, auditStore = null } = {}) {
    const validation = validateSandboxConfig(config);
    if (!validation.valid) {
      const error = new Error(`invalid sandbox config: ${validation.errors.join('; ')}`);
      error.code = 'INVALID_SANDBOX_CONFIG';
      error.details = validation.errors;
      throw error;
    }
    this.config = validation.normalized;
    this.githubClient = githubClient;
    this.driveClient = driveClient;
    this.auditStore = auditStore;
  }

  async runGithubSmoke({ path = 'runtime-sandbox/smoke.txt', content = 'matbagy-sandbox-smoke' } = {}) {
    if (!this.githubClient?.writeText || !this.githubClient?.readText || !this.githubClient?.deletePath) {
      throw new Error('githubClient must implement writeText/readText/deletePath');
    }
    const safePath = assertSandboxPath(path, this.config.githubPathPrefix);
    await this.#audit('SANDBOX_GITHUB_WRITE_START', { path: safePath, branch: this.config.githubBranch });
    await this.githubClient.writeText({ branch: this.config.githubBranch, path: safePath, content });
    const readBack = await this.githubClient.readText({ branch: this.config.githubBranch, path: safePath });
    if (String(readBack) !== String(content)) throw new Error('GitHub sandbox readback mismatch');
    await this.githubClient.deletePath({ branch: this.config.githubBranch, path: safePath });
    await this.#audit('SANDBOX_GITHUB_SMOKE_PASS', { path: safePath, branch: this.config.githubBranch });
    return { ok: true, branch: this.config.githubBranch, path: safePath, cleanup: 'DELETED' };
  }

  async runDriveSmoke({ parentFolderId = this.config.driveSandboxFolderId, name = 'runtime-smoke' } = {}) {
    if (!this.driveClient?.createFolder || !this.driveClient?.getFolder || !this.driveClient?.deleteFolder) {
      throw new Error('driveClient must implement createFolder/getFolder/deleteFolder');
    }
    assertSandboxFolder(parentFolderId, this.config.driveSandboxFolderId);
    await this.#audit('SANDBOX_DRIVE_WRITE_START', { parent_folder_id: parentFolderId, name });
    const created = await this.driveClient.createFolder({ parentFolderId, name });
    if (!created?.id) throw new Error('Drive sandbox create did not return id');
    const readBack = await this.driveClient.getFolder({ id: created.id });
    if (!readBack || readBack.id !== created.id || readBack.parentFolderId !== parentFolderId) {
      throw new Error('Drive sandbox readback mismatch');
    }
    await this.driveClient.deleteFolder({ id: created.id });
    await this.#audit('SANDBOX_DRIVE_SMOKE_PASS', { folder_id: created.id, parent_folder_id: parentFolderId });
    return { ok: true, folder_id: created.id, parent_folder_id: parentFolderId, cleanup: 'DELETED' };
  }

  async #audit(action, details) {
    if (this.auditStore?.append) await this.auditStore.append({ action, details, at: new Date().toISOString() });
  }
}
