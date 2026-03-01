import { query, connectDatabase } from '../database/connection';

const fixSchema = async () => {
    try {
        await connectDatabase();
        console.log("Connected to database. Applying fixes...");

        // 1. Make seller_id nullable in houses
        await query('ALTER TABLE houses MODIFY COLUMN seller_id CHAR(36) NULL');
        console.log("Successfully made houses.seller_id nullable.");

        // 2. Make seller_id nullable in accommodations
        await query('ALTER TABLE accommodations MODIFY COLUMN seller_id CHAR(36) NULL');
        console.log("Successfully made accommodations.seller_id nullable.");

        // 3. Make seller_id nullable in vehicles
        await query('ALTER TABLE vehicles MODIFY COLUMN seller_id CHAR(36) NULL');
        console.log("Successfully made vehicles.seller_id nullable.");

        process.exit(0);
    } catch (error) {
        console.error("Failed to apply database fixes:", error);
        process.exit(1);
    }
};

fixSchema();
