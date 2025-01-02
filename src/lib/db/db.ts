import mysql from 'mysql2/promise';

export async function query(sql: string, params: any[] = []) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  try {
    const [results] = params.length
      ? await connection.execute(sql, params)
      : await connection.execute(sql);

    return results;
  } finally {
    await connection.end();
  }
}
// import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   connectionLimit: 10,
// });

// export async function query(sql: string, params: any[] = []) {
//   if (params.length === 0) {
//       const [results] = await pool.query(sql); // Use query instead of execute
//       return results;
//   } else {
//       const [results] = await pool.query(sql, params);
//       return results;
//   }
// }

