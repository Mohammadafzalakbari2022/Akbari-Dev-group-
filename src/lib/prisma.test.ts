import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveDatabaseUrl } from './prisma';

test('prefers DATABASE_URL when present', () => {
  assert.equal(resolveDatabaseUrl({ DATABASE_URL: 'db://primary', POSTGRES_URL: 'db://fallback' }), 'db://primary');
});

test('falls back to Postgres env vars', () => {
  assert.equal(resolveDatabaseUrl({ POSTGRES_PRISMA_URL: 'db://postgres' }), 'db://postgres');
});

test('returns null when no database URL is available', () => {
  assert.equal(resolveDatabaseUrl({}), null);
});
