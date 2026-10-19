import { app } from '../server/app.ts';
import { apiRouter } from '../server/apiRouter.ts';

// In serverless environments, path may have /api stripped
app.use('/', apiRouter);

export default app;
