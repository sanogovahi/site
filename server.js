import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import commissariatsRoutes from './backend/routes/commissariats.js';
import actualitesRoutes from './backend/routes/actualites.js';
import contactRoutes from './backend/routes/contact.js';
import declarationsRoutes from './backend/routes/declarations.js';
import urgencesRoutes from './backend/routes/urgences.js';

// Middleware
import { initializeDatabase } from './backend/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialiser la base de données
await initializeDatabase();

// Routes API
app.use('/api/commissariats', commissariatsRoutes);
app.use('/api/actualites', actualitesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/declarations', declarationsRoutes);
app.use('/api/urgences', urgencesRoutes);

// Route index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});

export default app;
