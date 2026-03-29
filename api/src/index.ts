import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { connectDB } from './db.js';
import contracts from './contracts.js';

const app = new Hono();

app.use(
  '/api/*',
  cors({
    origin: (process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:4173').split(','),
    allowHeaders: ['Content-Type', 'x-password'],
    allowMethods: ['GET', 'POST', 'DELETE'],
  })
);

app.route('/api/contracts', contracts);
app.get('/health', (c) => c.json({ ok: true }));

const PORT = Number(process.env.PORT ?? 3000);

connectDB()
  .then(() =>
    serve({ fetch: app.fetch, port: PORT }, () =>
      console.log(`Pact API → http://localhost:${PORT}`)
    )
  )
  .catch((err) => {
    console.error('Startup failed:', err);
    process.exit(1);
  });
