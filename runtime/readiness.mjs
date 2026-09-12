import { validateSandboxConfig } from './sandbox-config.mjs';

export function evaluateReadiness({ sandboxConfig, tests = {}, smoke = {}, production = {}, live = {} } = {}) {
  const sandbox = validateSandboxConfig(sandboxConfig || {});
  const blockers = [];
  const warnings = [];

  if (!sandbox.valid) blockers.push(...sandbox.errors.map((x) => `SANDBOX_CONFIG: ${x}`));
  for (const [name, passed] of Object.entries(tests || {})) {
    if (passed !== true) blockers.push(`TEST_NOT_PASS: ${name}`);
  }
  if (smoke.github !== true) blockers.push('SANDBOX_SMOKE_NOT_PASS: github');
  if (smoke.drive !== true) blockers.push('SANDBOX_SMOKE_NOT_PASS: drive');

  if (production.enabled === true) blockers.push('PRODUCTION_MUST_REMAIN_DISABLED_DURING_READINESS');
  if (production.credentialsPresent === true) warnings.push('production credentials are present but must not be activated by this gate');

  const architectureApproved = live.architectureApproved === true;
  const providerSecretsReady = live.providerSecretsReady === true;
  const cloudflareDeployCredentialsReady = live.cloudflareDeployCredentialsReady === true;
  const deployed = live.deployed === true;
  const liveSmokePassed = live.smokePassed === true;

  const sandboxCodeReady = blockers.length === 0;
  const deploymentBlockers = [];
  if (!architectureApproved) deploymentBlockers.push('LIVE_SANDBOX_ARCHITECTURE_NOT_APPROVED');
  if (!providerSecretsReady) deploymentBlockers.push('LIVE_PROVIDER_SECRETS_NOT_READY');
  if (!cloudflareDeployCredentialsReady) deploymentBlockers.push('CLOUDFLARE_DEPLOY_CREDENTIALS_NOT_READY');
  if (!deployed) deploymentBlockers.push('CLOUDFLARE_SANDBOX_NOT_DEPLOYED');
  if (!liveSmokePassed) deploymentBlockers.push('LIVE_SANDBOX_SMOKE_NOT_PASS');

  let nextGate = 'FIX_SANDBOX_BLOCKERS';
  if (sandboxCodeReady && !architectureApproved) nextGate = 'OWNER_DECISION_FOR_LIVE_PROVIDER_AND_DEPLOYMENT';
  else if (sandboxCodeReady && (!providerSecretsReady || !cloudflareDeployCredentialsReady)) nextGate = 'CREDENTIAL_SETUP_AND_CLOUDFLARE_DEPLOY';
  else if (sandboxCodeReady && !deployed) nextGate = 'DEPLOY_CLOUDFLARE_SANDBOX';
  else if (sandboxCodeReady && !liveSmokePassed) nextGate = 'VERIFY_LIVE_SANDBOX';
  else if (sandboxCodeReady) nextGate = 'LIVE_SANDBOX_VERIFIED_PRODUCTION_STILL_DISABLED';

  return {
    ready_for_sandbox_ci: sandboxCodeReady,
    ready_for_live_sandbox_deploy: sandboxCodeReady && architectureApproved && providerSecretsReady && cloudflareDeployCredentialsReady,
    live_sandbox_verified: sandboxCodeReady && architectureApproved && deployed && liveSmokePassed,
    ready_for_production: false,
    production_decision_required: false,
    blockers,
    deployment_blockers: deploymentBlockers,
    warnings,
    next_gate: nextGate,
  };
}
