import { unlink } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Contract } from './models/contract.js';

const __dir      = dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = join(__dir, '../../data/uploads');

const INTERVAL_MS = 24 * 60 * 60 * 1000;

async function runCleanup(): Promise<void> {
  const expired = await Contract.find({
    status:    { $ne: 'completed' },
    expiresAt: { $lte: new Date() },
  });

  if (expired.length === 0) return;

  for (const contract of expired) {
    for (const file of contract.files) {
      await unlink(join(UPLOADS_DIR, file.filename)).catch(() => { /* already gone */ });
    }
    await contract.deleteOne();
  }

  console.log(`[cleanup] Supprimé ${expired.length} contrat(s) expiré(s).`);
}

export function startCleanup(): void {
  runCleanup().catch((err) => console.error('[cleanup] Erreur initiale:', err));
  setInterval(() => {
    runCleanup().catch((err) => console.error('[cleanup] Erreur:', err));
  }, INTERVAL_MS);
}
