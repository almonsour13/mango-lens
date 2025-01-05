import { createDBConnection } from "@/db/connection";

export async function query(sqlQuery: string, params: (string | number | Buffer<ArrayBuffer>)[] = []) {
    const connection = await createDBConnection();
    console.log(process.env.NODE_ENV);

    try {
        const [results] = params.length
            ? await connection.execute(sqlQuery, params)
            : await connection.execute(sqlQuery);
        return results;
    } finally {
        await connection.end();
    }
}
