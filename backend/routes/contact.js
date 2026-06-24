import express from 'express';
import { queryAsync, runAsync } from '../db.js';
import { sendContactEmail } from '../email.js';

const router = express.Router();

// GET tous les messages de contact (admin)
router.get('/', async (req, res) => {
  try {
    const contacts = await queryAsync(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    );
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST nouveau message de contact
router.post('/', async (req, res) => {
  try {
    const { nom, email, sujet, message, telephone } = req.body;

    // Validation basique
    if (!nom || !email || !sujet || !message) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    const result = await runAsync(
      'INSERT INTO contacts (nom, email, sujet, message, telephone) VALUES (?, ?, ?, ?, ?)',
      [nom, email, sujet, message, telephone]
    );

    // Envoyer email de confirmation
    await sendContactEmail(email, nom, sujet);

    res.status(201).json({ id: result.id, message: 'Message enregistré' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
