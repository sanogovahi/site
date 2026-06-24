import express from 'express';
import { queryAsync, runAsync } from '../db.js';
import { sendDeclarationEmail } from '../email.js';

const router = express.Router();

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

router.post('/', async (req, res) => {
  try {
    const { type, nom, email, telephone, description, lieu, date_incident } = req.body;
    
    if (!type || !nom || !email || !description) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }
    
    const result = await runAsync(
      'INSERT INTO declarations (type, nom, email, telephone, description, lieu, date_incident) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [type, nom, email, telephone, description, lieu, date_incident]
    );

    await sendDeclarationEmail(email, nom, result.id);

    res.status(201).json({ id: result.id, message: 'Déclaration enregistrée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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