export const CASE_STORE_METHODS = Object.freeze(['findCase', 'upsertCase', 'updateWatch', 'appendAudit']);
export const ASSET_STORE_METHODS = Object.freeze(['linkAvailableAsset']);
export const GITHUB_ADAPTER_METHODS = Object.freeze(['readCase', 'writeCase', 'writeWatch', 'appendAudit']);
export const DRIVE_ADAPTER_METHODS = Object.freeze(['findCaseFolder', 'ensureCaseFolder', 'uploadAsset', 'getAssetMetadata']);

export function assertAdapterContract(adapter, methods, label = 'adapter') {
  if (!adapter || typeof adapter !== 'object') throw new TypeError(`${label} must be an object`);
  const missing = methods.filter((method) => typeof adapter[method] !== 'function');
  if (missing.length) throw new TypeError(`${label} missing methods: ${missing.join(', ')}`);
  return true;
}

export class MockGitHubAdapter {
  constructor() { this.cases = new Map(); this.watch = new Map(); this.audit = []; }
  async readCase(caseId) { return clone(this.cases.get(caseId) || null); }
  async writeCase(caseData) { this.cases.set(caseData.case_id, clone(caseData)); return { ok: true, ref: `mock-github:${caseData.case_id}` }; }
  async writeWatch(record) { this.watch.set(record.case_id, clone(record)); return { ok: true }; }
  async appendAudit(entry) { this.audit.push(clone(entry)); return { ok: true }; }
}

export class MockDriveAdapter {
  constructor() { this.folders = new Map(); this.files = new Map(); this.counter = 0; }
  async findCaseFolder(caseId) { return clone(this.folders.get(caseId) || null); }
  async ensureCaseFolder(caseId) {
    if (!this.folders.has(caseId)) this.folders.set(caseId, { case_id: caseId, drive_case_folder_id: `MOCK_FOLDER_${caseId}` });
    return clone(this.folders.get(caseId));
  }
  async uploadAsset({ caseId, asset }) {
    const folder = await this.ensureCaseFolder(caseId);
    this.counter += 1;
    const record = { case_id: caseId, asset_id: asset.asset_id, drive_case_folder_id: folder.drive_case_folder_id, drive_file_id: `MOCK_FILE_${String(this.counter).padStart(4, '0')}` };
    this.files.set(asset.asset_id, record);
    return clone(record);
  }
  async getAssetMetadata(assetId) { return clone(this.files.get(assetId) || null); }
}

function clone(value) {
  if (value == null) return value;
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
