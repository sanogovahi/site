import express from 'express';
import { queryAsync, runAsync } from '../db.js';
import {
  sendContactEmail,
  sendNotificationToDGPN
} from '../email.js';
import { validateContact, handleValidationErrors } from '../validators.js';

const router = express.Router();

// GET tous les contacts (admin)
router.get('/', async (req, res, next) => {
  try {
    const contacts = await queryAsync(
      'SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100'
    );
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
});

// POST enregistrer contact
router.post('/', validateContact, handleValidationErrors, async (req, res, next) => {
  try {
    const { nom, email, sujet, message, telephone } = req.body;

    const result = await runAsync(
      'INSERT INTO contacts (nom, email, sujet, message, telephone) VALUES (?, ?, ?, ?, ?)',
      [nom, email, sujet, message, telephone || null]
    );

    // Envoyer email de confirmation
    await sendContactEmail(email, nom, sujet);

    res.status(201).json({
      success: true,
      id: result.id,
      message: 'Message enregistré et confirmation envoyée'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
