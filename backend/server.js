/* ===========================================================
   MK CAREER GUIDANCE — Optional backend (Node.js + Express + MySQL)
   This is OPTIONAL. The website itself works without it (using
   localStorage as a demo "database" in the browser). Deploy this
   only if you want a real shared database + secure admin login.

   Setup:
     1. cd backend && npm install
     2. Copy .env.example to .env and fill in your MySQL details
     3. Run schema.sql on your MySQL database once
     4. node create-admin.js   (creates your first admin login)
     5. node server.js         (starts the API on PORT, default 4000)
     6. Deploy this folder to Render / Railway / Hostinger Node hosting
        (GitHub Pages only serves static files, so it can't run this
        server — host the frontend on GitHub Pages and this backend
        somewhere that runs Node.js, then point the frontend's API_BASE
        at that backend's URL)
   =========================================================== */
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mk_career",
  waitForConnections: true,
  connectionLimit: 10
});

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
const PORT = process.env.PORT || 4000;

/* ---------- Public: chatbot lead registration ---------- */
app.post("/api/leads", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "email is required" });

    const [rows] = await pool.query("SELECT id FROM leads WHERE email = ?", [email]);
    let leadId;
    if (rows.length) {
      leadId = rows[0].id;
      await pool.query("UPDATE leads SET last_seen = NOW(), visits = visits + 1 WHERE id = ?", [leadId]);
    } else {
      const [result] = await pool.query("INSERT INTO leads (email) VALUES (?)", [email]);
      leadId = result.insertId;
    }
    res.json({ ok: true, leadId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

/* ---------- Public: save a chat message ---------- */
app.post("/api/leads/:id/messages", async (req, res) => {
  try {
    const { sender, message } = req.body;
    if (!["user", "bot"].includes(sender) || !message) {
      return res.status(400).json({ error: "sender and message are required" });
    }
    await pool.query(
      "INSERT INTO chat_messages (lead_id, sender, message) VALUES (?, ?, ?)",
      [req.params.id, sender, message]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

/* ---------- Public: contact form ---------- */
app.post("/api/contacts", async (req, res) => {
  try {
    const { name, phone, email, topic, message } = req.body;
    if (!name || !phone || !email) {
      return res.status(400).json({ error: "name, phone and email are required" });
    }
    await pool.query(
      "INSERT INTO contacts (name, phone, email, topic, message) VALUES (?, ?, ?, ?, ?)",
      [name, phone, email, topic || null, message || null]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

/* ---------- Admin: login ---------- */
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  try {
    const [rows] = await pool.query("SELECT * FROM admin_users WHERE username = ?", [username]);
    const user = rows[0];
    const ok = user && (await bcrypt.compare(password, user.password_hash));

    await pool.query(
      "INSERT INTO admin_logins (username, success, ip_address) VALUES (?, ?, ?)",
      [username || "(blank)", ok ? 1 : 0, ip]
    );

    if (!ok) return res.status(401).json({ error: "Incorrect username or password" });

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "8h" });
    res.json({ ok: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

/* ---------- Admin auth middleware ---------- */
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Not authorized" });
  }
}

/* ---------- Admin: read data for the dashboard ---------- */
app.get("/api/admin/leads", requireAdmin, async (req, res) => {
  const [leads] = await pool.query("SELECT * FROM leads ORDER BY registered_at DESC");
  res.json(leads);
});
app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
  const [contacts] = await pool.query("SELECT * FROM contacts ORDER BY submitted_at DESC");
  res.json(contacts);
});
app.get("/api/admin/logins", requireAdmin, async (req, res) => {
  const [logins] = await pool.query("SELECT * FROM admin_logins ORDER BY logged_in_at DESC");
  res.json(logins);
});

app.get("/", (req, res) => res.send("MK Career Guidance API is running."));

app.listen(PORT, () => console.log(`MK Career Guidance API running on port ${PORT}`));
