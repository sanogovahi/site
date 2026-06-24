import express from 'express';
import { queryAsync, runAsync } from '../db.js';

const router = express.Router();

// GET tous les commissariats
router.get('/', async (req, res) => {
  try {
    const commissariats = await queryAsync('SELECT * FROM commissariats');
    res.json(commissariats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET un commissariat par ID
router.get('/:id', async (req, res) => {
  try {
    const commissariats = await queryAsync('SELECT * FROM commissariats WHERE id = ?', [req.params.id]);
    if (commissariats.length === 0) {
      return res.status(404).json({ error: 'Commissariat non trouvé' });
    }
    res.json(commissariats[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET commissariats par recherche
router.get('/recherche/:query', async (req, res) => {
  try {
    const query = `%${req.params.query}%`;
    const commissariats = await queryAsync(
      'SELECT * FROM commissariats WHERE nom LIKE ? OR adresse LIKE ? OR ville LIKE ?',
      [query, query, query]
    );
    res.json(commissariats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST nouveau commissariat (admin)
router.post('/', async (req, res) => {
  try {
    const { nom, adresse, telephone, email, latitude, longitude, horaires } = req.body;
    const result = await runAsync(
      'INSERT INTO commissariats (nom, adresse, telephone, email, latitude, longitude, horaires) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, adresse, telephone, email, latitude, longitude, horaires]
    );
    res.status(201).json({ id: result.id, message: 'Commissariat créé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT mettre à jour un commissariat
router.put('/:id', async (req, res) => {
  try {
    const { nom, adresse, telephone, email, latitude, longitude, horaires } = req.body;
    await runAsync(
      'UPDATE commissariats SET nom = ?, adresse = ?, telephone = ?, email = ?, latitude = ?, longitude = ?, horaires = ? WHERE id = ?',
      [nom, adresse, telephone, email, latitude, longitude, horaires, req.params.id]
    );
    res.json({ message: 'Commissariat mis à jour' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE un commissariat
router.delete('/:id', async (req, res) => {
  try {
    await runAsync('DELETE FROM commissariats WHERE id = ?', [req.params.id]);
    res.json({ message: 'Commissariat supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
