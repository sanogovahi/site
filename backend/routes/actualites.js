import express from 'express';
import { queryAsync, runAsync } from '../db.js';

const router = express.Router();

// GET toutes les actualités
router.get('/', async (req, res) => {
  try {
    const actualites = await queryAsync(
      'SELECT * FROM actualites ORDER BY date_publication DESC LIMIT 20'
    );
    res.json(actualites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET une actualité par ID
router.get('/:id', async (req, res) => {
  try {
    const actualites = await queryAsync(
      'SELECT * FROM actualites WHERE id = ?',
      [req.params.id]
    );
    if (actualites.length === 0) {
      return res.status(404).json({ error: 'Actualité non trouvée' });
    }
    res.json(actualites[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST nouvelle actualité
router.post('/', async (req, res) => {
  try {
    const { titre, contenu, image_url, auteur } = req.body;
    const result = await runAsync(
      'INSERT INTO actualites (titre, contenu, image_url, auteur) VALUES (?, ?, ?, ?)',
      [titre, contenu, image_url, auteur]
    );
    res.status(201).json({ id: result.id, message: 'Actualité créée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT mettre à jour une actualité
router.put('/:id', async (req, res) => {
  try {
    const { titre, contenu, image_url, auteur } = req.body;
    await runAsync(
      'UPDATE actualites SET titre = ?, contenu = ?, image_url = ?, auteur = ? WHERE id = ?',
      [titre, contenu, image_url, auteur, req.params.id]
    );
    res.json({ message: 'Actualité mise à jour' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE une actualité
router.delete('/:id', async (req, res) => {
  try {
    await runAsync('DELETE FROM actualites WHERE id = ?', [req.params.id]);
    res.json({ message: 'Actualité supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
