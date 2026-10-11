import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { apiRouter } from './server/apiRouter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', apiRouter);

// Serve Vite build in production
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`T→G server running on port ${PORT}`);
});
