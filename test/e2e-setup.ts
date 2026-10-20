import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Runs once before the e2e suite (tests run in band, so process.env is shared with them).
// Uses a dedicated `<db>_e2e` database and resets it, so the dev data is never touched.
export default function setup() {
  const envFile = join(__dirname, '..', '.env');
  if (existsSync(envFile)) {
    for (const line of readFileSync(envFile, 'utf8').split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"#\n]*)"?/);
      if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].trim();
    }
  }

  // CI sets E2E_DATABASE_URL; locally, reuse the docker database from the host.
  // shortcut: assumes the compose host name is `db`, set E2E_DATABASE_URL otherwise
  const url =
    process.env.E2E_DATABASE_URL ??
    process.env.DATABASE_URL?.replace('@db:', '@localhost:').replace(/\/([^/?]+)(\?|$)/, '/$1_e2e$2');
  if (!url) throw new Error('Set E2E_DATABASE_URL or DATABASE_URL to run the e2e tests');

  process.env.DATABASE_URL = url;
  process.env.JWT_SECRET ??= 'e2e-secret';
  execSync('npx prisma migrate reset --force --skip-seed --skip-generate', {
    env: process.env,
    stdio: 'ignore',
  });
}
