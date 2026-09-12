import { validateSandboxConfig } from './sandbox-config.mjs';

export function evaluateReadiness({ sandboxConfig, tests = {}, smoke = {}, production = {} } = {}) {
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

  return {
    ready_for_sandbox_ci: blockers.length === 0,
    ready_for_production: false,
    production_decision_required: blockers.length === 0,
    blockers,
    warnings,
    next_gate: blockers.length === 0 ? 'OWNER_DECISION_FOR_LIVE_PROVIDER_AND_DEPLOYMENT' : 'FIX_SANDBOX_BLOCKERS',
  };
}
