"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sync_service_1 = require("./src/sync.service");
require("dotenv/config");
const start = async () => {
    try {
        await mongoose_1.default.connect(process.env.DB_URI);
        if (process.argv[2] === 'full-reindex') {
            console.info('Start full-reindex');
            await sync_service_1.SyncService.reindex();
            console.info('End full-reindex');
            process.exit(0);
        }
        else {
            console.info('Start sync');
            sync_service_1.SyncService.start();
        }
        process.on('SIGINT', async () => {
            await sync_service_1.SyncService.stop();
            await mongoose_1.default.connection.close();
            console.info('Stop sync service');
            process.exit(0);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=main.js.map