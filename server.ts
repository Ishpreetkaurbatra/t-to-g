import { app } from './server/app.ts';
import { config, getSafeConfigDiagnostics } from './server/config.ts';

const PORT = config.PORT;

const server = app.listen(PORT, () => {
  const diag = getSafeConfigDiagnostics();
  console.log(`\n==================================================`);
  console.log(`  🚀 T→G (Trend to Growth) Backend Running`);
  console.log(`  📡 Port:        http://localhost:${PORT}`);
  console.log(`  🩺 Health:      http://localhost:${PORT}/api/health`);
  console.log(`  📊 Status:      http://localhost:${PORT}/api/status`);
  console.log(`  🤖 AI Provider: ${diag.aiEngine.provider} (isMock: ${!diag.aiEngine.hasApiKey && !diag.aiEngine.hasExternalUrl})`);
  console.log(`  💾 Database:    ${diag.database.provider}`);
  console.log(`  🌍 Environment: ${diag.nodeEnv}`);
  console.log(`==================================================\n`);
});

// Graceful shutdown handling
const shutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Gracefully closing server...`);
  server.close(() => {
    console.log('Server closed successfully.');
    process.exit(0);
  });

  // Force close if graceful shutdown hangs
  setTimeout(() => {
    console.error('Forcefully terminating process after timeout.');
    process.exit(1);
  }, 5000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export { server };
