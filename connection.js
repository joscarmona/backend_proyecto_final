import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "06272013",
  database: "marketplace",
  port: 5432,
  allowExitOnIdle: true,
});

export { pool };

