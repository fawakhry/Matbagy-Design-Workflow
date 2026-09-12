import { buildSharedContextPacket, routeMessage, validateCase } from './orchestrator-core.mjs';
import { persistCaseWithAdapters } from './storage-adapters.mjs';
import { validateProviderResponse } from './providers.mjs';

/**
 * Executes one local orchestration turn with injected providers/stores.
 * Provider implementations may be mocks or future server-side adapters.
 */
export async function runOrchestrationTurn({
  userRequest,
  caseData,
  providers,
  caseStore,
  assetStore,
} = {}) {
  const validation = validateCase(caseData);
  if (!validation.valid) return { ok: false, stage: 'VALIDATION', validation };

  const routing = routeMessage(userRequest);
  const outputs = [];
  const errors = [];

  for (const recipient of routing.recipients) {
    const provider = providers?.[recipient];
    if (!provider || typeof provider.respond !== 'function') {
      errors.push(`missing provider: ${recipient}`);
      continue;
    }

    const packet = buildSharedContextPacket({
      caseData,
      userRequest,
      target: recipient,
    });
    const response = await provider.respond(packet);
    const providerValidation = validateProviderResponse(response, recipient);
    if (!providerValidation.valid) {
      errors.push(...providerValidation.errors);
      continue;
    }
    outputs.push(response);
  }

  const persistence = await persistCaseWithAdapters({ caseData, caseStore, assetStore });
  if (!persistence.ok) {
    return { ok: false, stage: 'PERSISTENCE', routing, outputs, errors, persistence };
  }

  await caseStore.appendAudit({
    action: 'ORCHESTRATION_TURN',
    case_id: caseData.case_id,
    mode: routing.mode,
    providers: outputs.map((x) => x.provider),
    provider_errors: errors,
  });

  return {
    ok: errors.length === 0,
    stage: errors.length ? 'PARTIAL_PROVIDER_RESULT' : 'COMPLETED',
    routing,
    outputs,
    errors,
    persistence,
    authority: 'ADVISORY_ONLY',
  };
}
