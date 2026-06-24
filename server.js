import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import commissariatsRoutes from './backend/routes/commissariats.js';
import actualitesRoutes from './backend/routes/actualites.js';
import contactRoutes from './backend/routes/contact.js';
import declarationsRoutes from './backend/routes/declarations.js';
import urgencesRoutes from './backend/routes/urgences.js';
import { initializeDatabase } from './backend/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Site Provisoire DEFINITIF')));

await initializeDatabase();

app.use('/api/commissariats', commissariatsRoutes);
app.use('/api/actualites', actualitesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/declarations', declarationsRoutes);
app.use('/api/urgences', urgencesRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Site Provisoire DEFINITIF', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});

export default app;