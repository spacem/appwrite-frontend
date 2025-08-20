
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sharedHandler } from './sharedHandler.js';

// Load env vars from .env file

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Example: POST /api/advanced { userId, text }
app.post('/api/advanced', async (req, res) => {
  // Use USER_ID from environment variable for all requests
  const userId = process.env.USER_ID || '';
  const userApiKey = process.env.USER_API_KEY || '';
  const text = req.body.text || '';
  const action = req.body.action || '';
  const appwriteApiKey = process.env.APPWRITE_API_KEY || '';
  try {
    const result = await sharedHandler({ userId, userApiKey, text, action, appwriteApiKey, name: 'Tester' });
    res.json(result);
  } catch (e: any) {
    console.error('Fatal error in /api/advanced:', e);
    res.status(500).json({ error: e?.message || 'Unknown error', details: e?.stack || e });
  }
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, "127.0.0.1", () => {
  console.log(`Local backend listening on http://127.0.0.1:${port}`);
});
