import assert from 'node:assert/strict';
import { evaluateReadiness } from './readiness.mjs';

const good = evaluateReadiness({
  sandboxConfig: {
    mode: 'SANDBOX',
    githubBranch: 'sandbox/runtime-v06',
    githubPathPrefix: 'runtime-sandbox/',
    driveSandboxFolderId: 'sandbox-drive',
    canonicalDriveRootId: 'root-drive',
  },
  tests: { core: true, storage: true, runtime: true, http: true, v05: true, v06: true },
  smoke: { github: true, drive: true },
  production: { enabled: false, credentialsPresent: false },
});
assert.equal(good.ready_for_sandbox_ci, true);
assert.equal(good.ready_for_production, false);
assert.equal(good.production_decision_required, true);
assert.equal(good.next_gate, 'OWNER_DECISION_FOR_LIVE_PROVIDER_AND_DEPLOYMENT');

const bad = evaluateReadiness({
  sandboxConfig: { mode: 'SANDBOX', githubBranch: 'main', driveSandboxFolderId: 'x' },
  tests: { core: false },
  smoke: { github: false, drive: true },
});
assert.equal(bad.ready_for_sandbox_ci, false);
assert.ok(bad.blockers.length >= 3);
console.log('Matbagy Runtime readiness gate tests: PASS');
