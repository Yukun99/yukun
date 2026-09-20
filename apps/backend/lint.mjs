import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const files = [
  'index.php',
  'config.example.php',
  ...['src', 'tests'].flatMap((dir) =>
    readdirSync(join(root, dir))
      .filter((file) => file.endsWith('.php'))
      .map((file) => join(dir, file)),
  ),
];

let failed = false;
for (const file of files) {
  const result = spawnSync('php', ['-l', file], { cwd: root, stdio: 'inherit' });
  if (result.error) {
    console.error(
      'php not found on PATH. Install PHP 8.3 (winget install PHP.PHP.8.3) to lint apps/backend.',
    );
    process.exit(1);
  }
  if (result.status !== 0) failed = true;
}
process.exit(failed ? 1 : 0);
