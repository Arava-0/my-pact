import { Hono } from 'hono';
import { createHash, randomBytes } from 'crypto';
import { mkdirSync, existsSync } from 'fs';
import { writeFile, readFile, unlink } from 'fs/promises';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Contract } from './models/contract.js';

const __dir      = dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = join(__dir, '../../data/uploads');

if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });

const MAX_FILE_SIZE   = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES   = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

const router = new Hono();

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return randomBytes(8).toString('hex');
}

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = randomBytes(8);
  let p1 = '', p2 = '';
  for (let i = 0; i < 4; i++) p1 += chars[bytes[i] % chars.length];
  for (let i = 4; i < 8; i++) p2 += chars[bytes[i] % chars.length];
  return `${p1}-${p2}`;
}

function hashPassword(pwd: string): string {
  return createHash('sha256').update(`pact:${pwd}`).digest('hex');
}

function verifyPassword(plain: string, hash: string): boolean {
  return hashPassword(plain) === hash;
}

async function authenticate(id: string, password: string) {
  const contract = await Contract.findById(id);
  if (!contract) return { contract: null, err: 'Not found' as const };
  if (!verifyPassword(password, contract.passwordHash)) return { contract: null, err: 'Unauthorized' as const };
  return { contract, err: null };
}

// ── Routes ───────────────────────────────────────────────────────────────────

// POST /api/contracts
router.post('/', async (c) => {
  const body = await c.req.json();

  if (!body.type || typeof body.data !== 'object' || body.data === null) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  const id = generateId();
  const password = generatePassword();

  await new Contract({
    _id:          id,
    passwordHash: hashPassword(password),
    type:         body.type,
    data:         body.data,
  }).save();

  return c.json({ id, password });
});

// GET /api/contracts/:id
router.get('/:id', async (c) => {
  const { contract, err } = await authenticate(c.req.param('id'), c.req.header('x-password') ?? '');
  if (!contract) return c.json({ error: err }, err === 'Not found' ? 404 : 401);
  return c.json(contract.toJSON());
});

// POST /api/contracts/:id/sign
router.post('/:id/sign', async (c) => {
  const { contract, err } = await authenticate(c.req.param('id'), c.req.header('x-password') ?? '');
  if (!contract) return c.json({ error: err }, err === 'Not found' ? 404 : 401);
  if (contract.status === 'completed') return c.json({ error: 'Contract already completed' }, 400);

  const ip  = c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? 'unknown';
  const now = new Date();
  const { party } = (await c.req.json()) as { party: 'party1' | 'party2' };

  if (party === 'party1') {
    if (contract.party1SignedAt) return c.json({ error: 'Party 1 already signed' }, 400);
    contract.party1SignedAt = now;
    contract.party1SignedIp = ip;
    contract.status = 'party1_signed';
  } else if (party === 'party2') {
    if (contract.status !== 'party1_signed') return c.json({ error: 'Party 1 must sign first' }, 400);
    if (contract.party2SignedAt) return c.json({ error: 'Party 2 already signed' }, 400);
    contract.party2SignedAt = now;
    contract.party2SignedIp = ip;
    contract.status         = 'completed';
    contract.completedAt    = now;
  } else {
    return c.json({ error: 'party must be "party1" or "party2"' }, 400);
  }

  await contract.save();
  return c.json(contract.toJSON());
});

// POST /api/contracts/:id/files
router.post('/:id/files', async (c) => {
  const { contract, err } = await authenticate(c.req.param('id'), c.req.header('x-password') ?? '');
  if (!contract) return c.json({ error: err }, err === 'Not found' ? 404 : 401);
  if (contract.status === 'completed') return c.json({ error: 'Cannot add files to a completed contract' }, 400);

  const formData = await c.req.formData();
  const file = formData.get('file') as File | null;

  if (!file)                           return c.json({ error: 'No file provided' }, 400);
  if (file.size > MAX_FILE_SIZE)        return c.json({ error: 'File too large (max 10 MB)' }, 400);
  if (!ALLOWED_TYPES.has(file.type))    return c.json({ error: 'Type non autorisé (JPEG, PNG, WebP, PDF)' }, 400);

  const fileId   = generateId();
  const ext      = extname(file.name) || (file.type === 'application/pdf' ? '.pdf' : '.jpg');
  const filename = `${fileId}${ext}`;

  await writeFile(join(UPLOADS_DIR, filename), Buffer.from(await file.arrayBuffer()));

  contract.files.push({ id: fileId, originalName: file.name, filename, mimetype: file.type, size: file.size, uploadedAt: new Date() });
  await contract.save();
  return c.json(contract.toJSON());
});

// GET /api/contracts/:id/files/:fileId
router.get('/:id/files/:fileId', async (c) => {
  const { contract, err } = await authenticate(c.req.param('id'), c.req.header('x-password') ?? '');
  if (!contract) return c.json({ error: err }, err === 'Not found' ? 404 : 401);

  const meta = contract.files.find(f => f.id === c.req.param('fileId'));
  if (!meta) return c.json({ error: 'File not found' }, 404);

  try {
    const data = await readFile(join(UPLOADS_DIR, meta.filename));
    return new Response(data, {
      headers: {
        'Content-Type':        meta.mimetype,
        'Content-Disposition': `inline; filename="${meta.originalName}"`,
        'Content-Length':      String(meta.size),
      },
    });
  } catch {
    return c.json({ error: 'File missing on disk' }, 404);
  }
});

// DELETE /api/contracts/:id/files/:fileId
router.delete('/:id/files/:fileId', async (c) => {
  const { contract, err } = await authenticate(c.req.param('id'), c.req.header('x-password') ?? '');
  if (!contract) return c.json({ error: err }, err === 'Not found' ? 404 : 401);
  if (contract.status === 'completed') return c.json({ error: 'Cannot remove files from a completed contract' }, 400);

  const idx = contract.files.findIndex(f => f.id === c.req.param('fileId'));
  if (idx === -1) return c.json({ error: 'File not found' }, 404);

  const [meta] = contract.files.splice(idx, 1);
  await unlink(join(UPLOADS_DIR, meta.filename)).catch(() => {/* already gone */});
  await contract.save();
  return c.json(contract.toJSON());
});

export default router;
