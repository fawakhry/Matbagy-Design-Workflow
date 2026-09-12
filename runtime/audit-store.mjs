import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export class MemoryAuditStore {
  constructor() { this.entries = []; }
  async append(entry) {
    const record = normalize(entry);
    this.entries.push(record);
    return record;
  }
  async list() { return this.entries.map((x) => structuredCloneSafe(x)); }
}

export class JsonlAuditStore {
  constructor(filePath, { mode = process.env.MATBAGY_RUNTIME_MODE || 'TEST' } = {}) {
    if (!filePath) throw new Error('audit filePath is required');
    if (!['TEST', 'LOCAL'].includes(mode)) throw new Error('JsonlAuditStore is local/test only');
    this.filePath = filePath;
    this.mode = mode;
  }
  async append(entry) {
    const record = normalize(entry);
    await mkdir(dirname(this.filePath), { recursive: true });
    await appendFile(this.filePath, `${JSON.stringify(record)}\n`, 'utf8');
    return record;
  }
  async list() {
    try {
      const text = await readFile(this.filePath, 'utf8');
      return text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
    } catch (error) {
      if (error?.code === 'ENOENT') return [];
      throw error;
    }
  }
}

function normalize(entry = {}) {
  return {
    audit_version: 'MATBAGY_AUDIT_V1',
    at: entry.at || new Date().toISOString(),
    ...structuredCloneSafe(entry),
  };
}
function structuredCloneSafe(value) {
  if (value == null) return value;
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
