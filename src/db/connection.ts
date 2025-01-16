import mysql from "mysql2/promise";

export async function createDBConnection() {
    let connection;
    
    if (process.env.NODE_ENV !== "development") {
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });
    } else {
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST_AIVEN,
            port: parseInt(process.env.MYSQL_PORT_AIVEN || "14629"),
            user: process.env.MYSQL_USER_AIVEN,
            password: process.env.MYSQL_PASSWORD_AIVEN,
            database: process.env.MYSQL_DATABASE_AIVEN,
        });
    }

    return connection;
}
