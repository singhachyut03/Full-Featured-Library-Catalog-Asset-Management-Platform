/**
 * LIBRA Server — Node.js Production & Static Asset Server
 * Supports serving the compiled SPA (from /dist) with SPA fallback,
 * provides healthcheck endpoints, and mock REST API routes.
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const distPath = path.join(__dirname, 'dist');

app.use(express.json());

// Healthcheck API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'LIBRA — Smart Library Catalog & Asset Management Platform',
    tagline: 'Discover. Borrow. Track. Return.',
    timestamp: new Date().toISOString()
  });
});

// Check if production build exists
if (fs.existsSync(distPath)) {
  console.log(`[LIBRA Server] Serving production build from: ${distPath}`);
  app.use(express.static(distPath));

  // SPA fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // If not built yet, guide the user
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>LIBRA Platform Server</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #0B132B; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
            .card { background: #162447; padding: 40px; border-radius: 16px; border: 1px solid #315BEA; max-width: 600px; }
            h1 { color: #8DD7FF; margin-bottom: 8px; }
            p { color: #A0AEC0; font-size: 16px; line-height: 1.6; }
            code { background: #1f2a44; padding: 4px 8px; border-radius: 6px; color: #6EDCC5; }
            .btn { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #315BEA; color: white; border-radius: 8px; text-decoration: none; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>LIBRA Server is Running</h1>
            <p>Smart Library Catalog & Asset Management Platform</p>
            <p>To compile the front-end production build, run:<br><code>npm run build</code></p>
            <p>Or for live development server with hot-reload, run:<br><code>npm run dev</code></p>
            <a href="/api/health" class="btn">View API Health Status</a>
          </div>
        </body>
      </html>
    `);
  });
}

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 LIBRA Server is active on http://localhost:${PORT}`);
  console.log(`   Tagline: "Discover. Borrow. Track. Return."`);
  console.log(`====================================================`);
});
