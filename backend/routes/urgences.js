import express from 'express';
import { queryAsync, runAsync } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const urgences = await queryAsync('SELECT * FROM urgences');
    res.json(urgences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nom, numero, description } = req.body;
    const result = await runAsync(
      'INSERT INTO urgences (nom, numero, description) VALUES (?, ?, ?)',
      [nom, numero, description]
    );
    res.status(201).json({ id: result.id, message: 'Numéro créé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;