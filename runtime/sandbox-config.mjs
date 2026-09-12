export const DEFAULT_SANDBOX_PATH_PREFIX = 'runtime-sandbox/';

export function validateSandboxConfig(config = {}) {
  const errors = [];
  const githubBranch = String(config.githubBranch || '').trim();
  const githubPathPrefix = normalizePrefix(config.githubPathPrefix || DEFAULT_SANDBOX_PATH_PREFIX);
  const driveSandboxFolderId = String(config.driveSandboxFolderId || '').trim();
  const canonicalDriveRootId = String(config.canonicalDriveRootId || '').trim();
  const mode = String(config.mode || '').trim().toUpperCase();

  if (mode !== 'SANDBOX') errors.push('mode must be SANDBOX');
  if (!githubBranch.startsWith('sandbox/')) errors.push('githubBranch must start with sandbox/');
  if (!githubPathPrefix.startsWith('runtime-sandbox/')) errors.push('githubPathPrefix must stay under runtime-sandbox/');
  if (!driveSandboxFolderId) errors.push('driveSandboxFolderId is required');
  if (canonicalDriveRootId && driveSandboxFolderId === canonicalDriveRootId) {
    errors.push('driveSandboxFolderId must not equal canonical Drive root');
  }

  return {
    valid: errors.length === 0,
    errors,
    normalized: {
      mode,
      githubBranch,
      githubPathPrefix,
      driveSandboxFolderId,
      canonicalDriveRootId: canonicalDriveRootId || null,
    },
  };
}

export function assertSandboxPath(path, prefix = DEFAULT_SANDBOX_PATH_PREFIX) {
  const value = String(path || '').replace(/^\/+/, '');
  const safePrefix = normalizePrefix(prefix);
  if (!value || value.includes('..')) throw sandboxError('UNSAFE_PATH', 'sandbox path is invalid');
  if (!value.startsWith(safePrefix)) throw sandboxError('OUTSIDE_SANDBOX_PATH', `path must stay under ${safePrefix}`);
  return value;
}

export function assertSandboxFolder(targetFolderId, expectedSandboxFolderId) {
  const target = String(targetFolderId || '').trim();
  const expected = String(expectedSandboxFolderId || '').trim();
  if (!target || !expected || target !== expected) {
    throw sandboxError('OUTSIDE_SANDBOX_DRIVE', 'Drive write target must equal configured sandbox folder');
  }
  return target;
}

function normalizePrefix(value) {
  const clean = String(value || '').replace(/^\/+/, '').replace(/\/+$/, '');
  return clean ? `${clean}/` : '';
}

function sandboxError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}
