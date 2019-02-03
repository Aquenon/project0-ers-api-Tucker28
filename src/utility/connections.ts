import { Pool } from 'pg';

export const connectionPool = new Pool({
  user: process.env.PostgreSQLUser,
  host: process.env.PostgreSQLHost,
  database: process.env.PostgreSQLDB,
  password: process.env.PostgreSQLPassword,
  port: 5432,
  max: 5
});