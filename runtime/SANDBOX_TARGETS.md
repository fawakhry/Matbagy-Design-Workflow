# Matbagy Runtime Sandbox Targets

Status: `ACTIVE_SANDBOX / NON_PRODUCTION`

## GitHub
- Repository: `fawakhry/Matbagy-Design-Workflow`
- Sandbox branch: `sandbox/runtime-v06`
- Allowed write prefix: `runtime-sandbox/`
- Canonical Cases path is outside the sandbox boundary and must never be targeted by sandbox writes.

## Google Drive
- Project root ID: `1kP_JAO-ZOJltX9FCkAsylxYAfRar-RQV`
- Sandbox folder: `99_Runtime_Sandbox`
- Sandbox folder ID: `1pTM4Xw98qnd1XoPKpBDVel21CXCQpZoF`
- Runtime sandbox writes must target this folder exactly unless a later sandbox child is explicitly verified.

## Live smoke verification — 2026-09-12

### GitHub
- Temporary marker was created under `runtime-sandbox/` on `sandbox/runtime-v06`.
- Marker readback matched.
- Marker was deleted successfully.
- Canonical branch/Cases were not touched by the smoke write.

### Drive
- Temporary folder `SMOKE_RUNTIME_V06` was created under `99_Runtime_Sandbox`.
- Metadata readback confirmed the expected parent folder ID.
- Temporary folder was deleted successfully.

## Boundary

These are sandbox targets only. They do not authorize production writes, production AI credentials, or deployment to a public runtime.
