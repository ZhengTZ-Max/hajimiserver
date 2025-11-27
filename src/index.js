require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

const PORT = process.env.PORT || 5000;
const THIRD_PARTY_BASE =
  process.env.THIRD_PARTY_BASE || 'https://jsonplaceholder.typicode.com/posts';

/**
 * Allow cross-origin requests. Supports comma separated whitelist via env.
 */
const allowedOrigins = (process.env.CORS_ORIGINS || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

/**
 * Example route that proxies a third-party API.
 * - Supports optional ?id= query to fetch a single resource.
 * - Prevents CORS issues by making the call server-side.
 */
app.get('/api/posts', async (req, res) => {
  const { id } = req.query;
  const targetUrl = id ? `${THIRD_PARTY_BASE}/${id}` : THIRD_PARTY_BASE;

  try {
    const response = await axios.get(targetUrl, { timeout: 5000 });
    res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 502;
    res.status(status).json({
      message: 'Failed to fetch third-party data',
      detail: error.message,
    });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

