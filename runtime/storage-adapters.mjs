import { buildPersistPlan, normalizeCase, validateCase } from './orchestrator-core.mjs';

/**
 * Interface-compatible in-memory adapters for Matbagy Runtime v0.2.
 * No network or production data access.
 */
export class MemoryCaseStore {
  constructor(seed = []) {
    this.cases = new Map();
    this.watch = new Map();
    this.audit = [];
    for (const item of seed) this.cases.set(item.case_id, structuredCloneSafe(item));
  }

  async findCase(caseId) {
    return structuredCloneSafe(this.cases.get(caseId) || null);
  }

  async upsertCase(caseData) {
    const normalized = normalizeCase(caseData);
    this.cases.set(normalized.case_id, structuredCloneSafe(normalized));
    this.audit.push({ action: 'UPSERT_CASE', case_id: normalized.case_id, at: nowIso() });
    return structuredCloneSafe(normalized);
  }

  async updateWatch(caseData) {
    const normalized = normalizeCase(caseData);
    const record = {
      case_id: normalized.case_id,
      case_phase: normalized.case_phase,
      approval_status: normalized.approval_status,
      updated_at: nowIso(),
    };
    this.watch.set(normalized.case_id, record);
    this.audit.push({ action: 'UPDATE_WATCH', case_id: normalized.case_id, at: record.updated_at });
    return structuredCloneSafe(record);
  }

  async appendAudit(entry) {
    this.audit.push({ ...structuredCloneSafe(entry), at: entry.at || nowIso() });
  }
}

export class MemoryAssetStore {
  constructor() {
    this.assets = new Map();
    this.counter = 0;
    this.audit = [];
  }

  async linkAvailableAsset({ caseId, asset }) {
    if (!asset?.asset_id) throw new Error('asset_id is required');
    const existing = this.assets.get(asset.asset_id);
    if (existing) return structuredCloneSafe(existing);

    if (asset.asset_binding_status === 'LINKED' && asset.drive_file_id) {
      const record = { ...structuredCloneSafe(asset), case_id: caseId };
      this.assets.set(asset.asset_id, record);
      return structuredCloneSafe(record);
    }

    if (asset.available_for_upload !== true) {
      return {
        ...structuredCloneSafe(asset),
        case_id: caseId,
        asset_binding_status: asset.asset_binding_status === 'MISSING' ? 'MISSING' : 'PENDING_UPLOAD',
        drive_file_id: null,
      };
    }

    this.counter += 1;
    const record = {
      ...structuredCloneSafe(asset),
      case_id: caseId,
      asset_binding_status: 'LINKED',
      drive_file_id: `MOCK_DRIVE_${String(this.counter).padStart(4, '0')}`,
    };
    this.assets.set(asset.asset_id, record);
    this.audit.push({ action: 'MOCK_LINK_ASSET', case_id: caseId, asset_id: asset.asset_id, at: nowIso() });
    return structuredCloneSafe(record);
  }
}

export async function persistCaseWithAdapters({ caseData, caseStore, assetStore }) {
  if (!caseStore || !assetStore) throw new Error('caseStore and assetStore are required');

  const validation = validateCase(caseData);
  if (!validation.valid) {
    return { ok: false, stage: 'VALIDATION', validation };
  }

  const source = structuredCloneSafe(caseData);
  const linkedAssets = [];
  for (const asset of Array.isArray(source.assets) ? source.assets : []) {
    linkedAssets.push(await assetStore.linkAvailableAsset({ caseId: source.case_id, asset }));
  }

  const persistedInput = { ...source, assets: linkedAssets };
  const normalized = normalizeCase(persistedInput);
  const saved = await caseStore.upsertCase(normalized);
  const watch = await caseStore.updateWatch(saved);
  const plan = buildPersistPlan(saved);

  await caseStore.appendAudit({
    action: 'AUTO_PERSIST_COMPLETED',
    case_id: saved.case_id,
    archival_final_status: plan.archival_final_status,
    archival_final_asset_id: plan.archival_final_asset_id,
  });

  return {
    ok: true,
    case: saved,
    watch,
    persist_plan: plan,
    verification: {
      linked_asset_count: plan.asset_counts.linked,
      pending_asset_count: plan.asset_counts.pending,
      missing_asset_count: plan.asset_counts.missing,
      safe_to_delete_chat: plan.safe_to_delete_chat,
    },
  };
}

function structuredCloneSafe(value) {
  if (value == null) return value;
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}
