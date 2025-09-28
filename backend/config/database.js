const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

// Create Prisma client instance
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.info('Query: ' + e.query);
    logger.info('Params: ' + e.params);
    logger.info('Duration: ' + e.duration + 'ms');
  });
}

// Log database errors
prisma.$on('error', (e) => {
  logger.error('Database error:', e);
});

// Log database info
prisma.$on('info', (e) => {
  logger.info('Database info:', e);
});

// Log database warnings
prisma.$on('warn', (e) => {
  logger.warn('Database warning:', e);
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;