import pg from "pg";
const { Pool } = pg;

// const pool = new Pool({
//   host: "localhost",
//   user: "postgres",
//   // password: "06272013",
//   password: "Postgres4321@",
//   // password: process.env.DB_PASSWORD,
//   // database: process.env.DB_NAME,
//   database: "marketplace",
//   port: 5432,
//   allowExitOnIdle: true,
// });

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  allowExitOnIdle: true,
});

// const pool = new Pool({
//   host: "dpg-d24p4qpr0fns73db3s7g-a",
//   user: "db_marketplace_thzd_user",
//   // password: "06272013",
//   password: "EiyiXdNMLNmpZLbJSi3kn9nSZCcLitF0",
//   database: "db_marketplace_thzd",
//   port: 5432,
//   allowExitOnIdle: true,
// });

export { pool };

