import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`================================================================`);
  console.log(` Livestock Health Early-Warning & Surveillance Platform Backend`);
  console.log(` Listening on port: ${env.PORT}`);
  console.log(` Environment: ${env.NODE_ENV}`);
  console.log(` Healthcheck: http://localhost:${env.PORT}/health`);
  console.log(`================================================================`);
});

const handleShutdown = () => {
  console.log('Initiating graceful shutdown...');
  server.close(() => {
    console.log('Server closed successfully.');
    process.exit(0);
  });
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
