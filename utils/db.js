import { Pool } from "pg";

const pool = new Pool({
  user: "postgres.iudcyamjdnruggrbzbkz",
  host: "aws-0-us-west-1.pooler.supabase.com",
  database: "postgres",
  password: "HdXxNzHlXNSuhSQk",
  port: 6543,
});

export default pool;
