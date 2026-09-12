import assert from 'node:assert/strict';
import { MemoryAssetStore, MemoryCaseStore, persistCaseWithAdapters } from './storage-adapters.mjs';

const caseStore = new MemoryCaseStore();
const assetStore = new MemoryAssetStore();

const input = {
  case_id: 'DESIGN-2026-000015',
  case_phase: 'UNDER_REVIEW',
  approval_status: 'NOT_CONFIRMED',
  customer_approval_status: 'NOT_DOCUMENTED',
  assets: [
    {
      asset_id: 'DESIGN-2026-000015-A001',
      source_role: 'customer_original',
      asset_binding_status: 'PENDING_UPLOAD',
      available_for_upload: true,
    },
    {
      asset_id: 'DESIGN-2026-000015-A002',
      source_role: 'generated_result',
      asset_binding_status: 'PENDING_UPLOAD',
      available_for_upload: true,
    },
  ],
  versions: [
    {
      version_id: 'V1',
      result_status: 'SUCCESS',
      result_asset_id: 'DESIGN-2026-000015-A002',
      feedback_class: 'LIKED',
    },
  ],
};

const result = await persistCaseWithAdapters({ caseData: input, caseStore, assetStore });
assert.equal(result.ok, true);
assert.equal(result.case.assets[0].asset_binding_status, 'LINKED');
assert.match(result.case.assets[0].drive_file_id, /^MOCK_DRIVE_/);
assert.equal(result.persist_plan.archival_final_asset_id, 'DESIGN-2026-000015-A002');
assert.equal(result.verification.safe_to_delete_chat, true);
assert.equal((await caseStore.findCase('DESIGN-2026-000015')).case_id, 'DESIGN-2026-000015');
assert.equal(caseStore.watch.get('DESIGN-2026-000015').case_phase, 'UNDER_REVIEW');
assert.ok(caseStore.audit.some((x) => x.action === 'AUTO_PERSIST_COMPLETED'));

console.log('Matbagy Storage Adapter v0.2 tests: PASS');
