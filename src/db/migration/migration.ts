import fs from 'fs/promises';
import { createDBConnection } from '../connection';
import path from 'path';

export async function runMigration() {
    try {
         const connection = await createDBConnection();
         const sqlPath = path.join(process.cwd(),"src/db/migration/sql");
        const files = (await fs.readdir(sqlPath)).filter(file => file.endsWith('.sql'));
        for (const file of files) {
            const sqlContent = await fs.readFile(path.join(sqlPath, file), 'utf-8');
            await connection.query(sqlContent);
        }
        
        // await connection.end();
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
}