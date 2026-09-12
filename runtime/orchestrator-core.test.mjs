import assert from 'node:assert/strict';
import {
  buildPersistPlan,
  buildSharedContextPacket,
  canAiTransitionPhase,
  routeMessage,
  selectArchivalFinal,
  validateCase,
} from './orchestrator-core.mjs';

const baseCase = {
  case_id: 'DESIGN-2026-000015',
  case_phase: 'UNDER_REVIEW',
  customer_approval_status: 'NOT_DOCUMENTED',
  must_keep: ['ملامح الوجه'],
  must_avoid: ['فلاتر'],
  assets: [
    { asset_id: 'DESIGN-2026-000015-A001', asset_binding_status: 'LINKED', drive_file_id: 'drive-1', source_role: 'customer_original' },
    { asset_id: 'DESIGN-2026-000015-A002', asset_binding_status: 'LINKED', drive_file_id: 'drive-2', source_role: 'generated_result' },
  ],
  versions: [
    { version_id: 'V1', result_status: 'SUCCESS', result_asset_id: 'DESIGN-2026-000015-A002', feedback_class: 'LIKED' },
  ],
};

assert.deepEqual(routeMessage('@الكل راجعوا التصميم'), {
  mode: 'BOOM', recipients: ['CHATGPT', 'GEMINI'], max_ai_rounds: 3,
});
assert.equal(routeMessage('@Gemini راجع الصورة').mode, 'GEMINI');
assert.equal(routeMessage('كمل التصميم').mode, 'GPT');

assert.deepEqual(selectArchivalFinal(baseCase), {
  archival_final_status: 'AUTO_SELECTED',
  archival_final_version_id: 'V1',
  archival_final_asset_id: 'DESIGN-2026-000015-A002',
  archival_final_basis: 'LATEST_SUCCESSFUL_NON_REJECTED',
});

const failedLater = {
  ...baseCase,
  versions: [
    ...baseCase.versions,
    { version_id: 'V2', result_status: 'FAILED_NO_RESULT', feedback_class: 'UNKNOWN' },
  ],
};
assert.equal(selectArchivalFinal(failedLater).archival_final_version_id, 'V1');

const rejected = {
  ...baseCase,
  versions: [
    { version_id: 'V1', result_status: 'SUCCESS', result_asset_id: 'A1', feedback_class: 'REJECTED' },
  ],
};
assert.equal(selectArchivalFinal(rejected).archival_final_status, 'NO_VALID_FINAL_ASSET');

const plan = buildPersistPlan(baseCase);
assert.equal(plan.policy, 'AUTO_PERSIST_FIRST');
assert.equal(plan.safe_to_delete_chat, true);
assert.equal(plan.asset_counts.linked, 2);

const packet = buildSharedContextPacket({ caseData: baseCase, userRequest: 'راجع الحفاظ على الملامح', target: 'GEMINI' });
assert.equal(packet.target, 'GEMINI');
assert.equal(packet.case.case_id, baseCase.case_id);
assert.deepEqual(packet.case.must_keep, ['ملامح الوجه']);
assert.equal(packet.assets.length, 2);

assert.equal(validateCase(baseCase).valid, true);
assert.equal(canAiTransitionPhase('OPEN', 'UNDER_REVIEW'), true);
assert.equal(canAiTransitionPhase('UNDER_REVIEW', 'FINAL_APPROVED'), false);
assert.equal(canAiTransitionPhase('UNDER_REVIEW', 'CLOSED'), false);

const badLinked = {
  ...baseCase,
  assets: [{ asset_id: 'DESIGN-2026-000015-A001', asset_binding_status: 'LINKED' }],
};
assert.equal(validateCase(badLinked).valid, false);

console.log('Matbagy Orchestrator Core v0.1 tests: PASS');
