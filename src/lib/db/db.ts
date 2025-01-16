import { createDBConnection } from "@/db/connection";

export async function query(sqlQuery: string, params: (string | number | Buffer)[] = []) {
    const connection = await createDBConnection();

    try {
        const [results] = params.length
            ? await connection.execute(sqlQuery, params)
            : await connection.execute(sqlQuery);
        return results;
    } finally {
        await connection.end();
    }
}
