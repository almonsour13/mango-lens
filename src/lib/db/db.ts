import { createDBConnection } from "@/db/connection";
import { runMigration } from "@/db/migration/migration";
import mysql from "mysql2/promise";

export async function query(sqlQuery: string, params: any[] = []) {
    const connection = await createDBConnection();
    console.log(process.env.NODE_ENV)
    // runMigration();
    try {
        const [results] = params.length
            ? await connection.execute(sqlQuery, params)
            : await connection.execute(sqlQuery);
        console.log(results)
        return results;
    } finally {
        await connection.end();
    }
}
