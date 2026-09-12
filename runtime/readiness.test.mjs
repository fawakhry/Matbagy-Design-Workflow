import assert from 'node:assert/strict';
import { evaluateReadiness } from './readiness.mjs';

const base = {
  sandboxConfig: {
    mode: 'SANDBOX',
    githubBranch: 'sandbox/runtime-v06',
    githubPathPrefix: 'runtime-sandbox/',
    driveSandboxFolderId: 'sandbox-drive',
    canonicalDriveRootId: 'root-drive',
  },
  tests: { core: true, storage: true, runtime: true, http: true, v05: true, v06: true, liveProviders: true, cloudPersistence: true },
  smoke: { github: true, drive: true },
  production: { enabled: false, credentialsPresent: false },
};

const approvedMissingCredentials = evaluateReadiness({
  ...base,
  live: {
    architectureApproved: true,
    providerSecretsReady: false,
    cloudflareDeployCredentialsReady: false,
    deployed: false,
    smokePassed: false,
  },
});
assert.equal(approvedMissingCredentials.ready_for_sandbox_ci, true);
assert.equal(approvedMissingCredentials.ready_for_live_sandbox_deploy, false);
assert.equal(approvedMissingCredentials.ready_for_production, false);
assert.equal(approvedMissingCredentials.production_decision_required, false);
assert.equal(approvedMissingCredentials.next_gate, 'CREDENTIAL_SETUP_AND_CLOUDFLARE_DEPLOY');

const readyToDeploy = evaluateReadiness({
  ...base,
  live: {
    architectureApproved: true,
    providerSecretsReady: true,
    cloudflareDeployCredentialsReady: true,
    deployed: false,
    smokePassed: false,
  },
});
assert.equal(readyToDeploy.ready_for_live_sandbox_deploy, true);
assert.equal(readyToDeploy.next_gate, 'DEPLOY_CLOUDFLARE_SANDBOX');

const verified = evaluateReadiness({
  ...base,
  live: {
    architectureApproved: true,
    providerSecretsReady: true,
    cloudflareDeployCredentialsReady: true,
    deployed: true,
    smokePassed: true,
  },
});
assert.equal(verified.live_sandbox_verified, true);
assert.equal(verified.ready_for_production, false);
assert.equal(verified.next_gate, 'LIVE_SANDBOX_VERIFIED_PRODUCTION_STILL_DISABLED');

const bad = evaluateReadiness({
  sandboxConfig: { mode: 'SANDBOX', githubBranch: 'main', driveSandboxFolderId: 'x' },
  tests: { core: false },
  smoke: { github: false, drive: true },
  live: { architectureApproved: true },
});
assert.equal(bad.ready_for_sandbox_ci, false);
assert.ok(bad.blockers.length >= 3);
assert.equal(bad.next_gate, 'FIX_SANDBOX_BLOCKERS');

console.log('Matbagy Runtime readiness gate tests: PASS');
