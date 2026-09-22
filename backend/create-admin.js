/* Run: node create-admin.js <username> <password>
   Creates (or updates) an admin login in the MySQL database. */
require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function main() {
  const [,, username, password] = process.argv;
  if (!username || !password) {
    console.log("Usage: node create-admin.js <username> <password>");
    process.exit(1);
  }
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mk_career"
  });
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO admin_users (username, password_hash) VALUES (?, ?) " +
    "ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)",
    [username, hash]
  );
  console.log(`Admin user "${username}" created/updated.`);
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
