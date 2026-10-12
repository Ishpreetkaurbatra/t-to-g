import express from 'express';
import { apiRouter } from '../server/apiRouter.ts';

const app = express();

app.use(express.json());

// Support both /api/* routes and stripped paths
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
