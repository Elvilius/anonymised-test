import mongoose from 'mongoose';
import { SyncService } from './src/sync.service';

import 'dotenv/config';

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);

    if (process.argv[2] === 'full-reindex') {
      console.info('Start full-reindex');
      await SyncService.reindex();
      console.info('End full-reindex');
      process.exit(0);
    } else {
      console.info('Start sync');
      SyncService.start();
    }

    process.on('SIGINT', async () => {
      await SyncService.stop();
      await mongoose.connection.close();
      console.info('Stop sync service');
      process.exit(0);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
