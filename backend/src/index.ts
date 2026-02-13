import app from './server';
import { connectDatabase } from './database/connection';
import logger from './utils/logger.utils';

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    logger.info('✓ Database connected successfully');
    app.listen(PORT, () => {
      logger.info(`✓ Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('✗ Database connection failed:', error);
    process.exit(1);
  });
