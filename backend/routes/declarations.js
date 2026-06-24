import express from 'express';
import { queryAsync, runAsync } from '../db.js';
import { sendDeclarationEmail } from '../email.js';

const router = express.Router();

// GET toutes les déclarations (admin)
router.get('/', async (req, res) => {
  try {
    const declarations = await queryAsync(
      'SELECT * FROM declarations ORDER BY created_at DESC'
    );
    res.json(declarations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET une déclaration par ID
router.get('/:id', async (req, res) => {
  try {
    const declarations = await queryAsync(
      'SELECT * FROM declarations WHERE id = ?',
      [req.params.id]
    );
    if (declarations.length === 0) {
      return res.status(404).json({ error: 'Déclaration non trouvée' });
    }
    res.json(declarations[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST nouvelle déclaration
router.post('/', async (req, res) => {
  try {
    const { type, nom, email, telephone, description, lieu, date_incident } = req.body;
    
    const result = await runAsync(
      'INSERT INTO declarations (type, nom, email, telephone, description, lieu, date_incident) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [type, nom, email, telephone, description, lieu, date_incident]
    );

    // Envoyer email de confirmation
    await sendDeclarationEmail(email, nom, result.id);

    res.status(201).json({ id: result.id, message: 'Déclaration enregistrée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT mettre à jour le statut
router.put('/:id', async (req, res) => {
  try {
    const { statut } = req.body;
    await runAsync(
      'UPDATE declarations SET statut = ? WHERE id = ?',
      [statut, req.params.id]
    );
    res.json({ message: 'Déclaration mise à jour' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
