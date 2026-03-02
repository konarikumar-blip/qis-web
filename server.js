/* ═══════════════════════════════════════════════════════
   QIS College of Engineering & Technology
   server.js  —  Express Backend API
   Port: 3000
   ═══════════════════════════════════════════════════════ */

"use strict";

const express = require("express");
const path    = require("path");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve frontend ────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

// ── In-Memory Stores ──────────────────────────────────────
const users = [
  { id: 1, name: "Demo Student", email: "student@qiscet.edu.in", password: "qis2024",   role: "student", rollNo: "23A91A0501" },
  { id: 2, name: "Admin",        email: "admin@qiscet.edu.in",   password: "admin2024", role: "admin",   rollNo: "ADMIN001"   },
];

const programs = [
  { id: 1, level: "B.Tech", name: "Computer Science & Engineering",       seats: 120, duration: "4 years", specializations: ["AI/ML","Cybersecurity","Full-Stack"] },
  { id: 2, level: "B.Tech", name: "Electronics & Communication Engg.",    seats: 60,  duration: "4 years", specializations: ["VLSI","Embedded","IoT"] },
  { id: 3, level: "B.Tech", name: "Electrical & Electronics Engineering", seats: 60,  duration: "4 years", specializations: ["Power Systems","Control","Renewables"] },
  { id: 4, level: "B.Tech", name: "Mechanical Engineering",               seats: 60,  duration: "4 years", specializations: ["CAD/CAM","Robotics","Manufacturing"] },
  { id: 5, level: "B.Tech", name: "Civil Engineering",                    seats: 60,  duration: "4 years", specializations: ["Structural","Geotechnics","Urban Planning"] },
  { id: 6, level: "B.Tech", name: "Information Technology",               seats: 60,  duration: "4 years", specializations: ["Networks","Databases","Enterprise Apps"] },
  { id: 7, level: "M.Tech", name: "Computer Science & Engineering",       seats: 18,  duration: "2 years", specializations: ["ML","HPC","Distributed Systems"] },
  { id: 8, level: "MBA",    name: "Technology Management",                seats: 60,  duration: "2 years", specializations: ["Tech Leadership","Product Mgmt","Finance"] },
];

const contacts = [];

// ── ROUTES ────────────────────────────────────────────────

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", server: "QIS CET API", timestamp: new Date().toISOString() });
});

// College info
app.get("/api/college", (req, res) => {
  res.json({
    name:          "QIS College of Engineering and Technology",
    shortName:     "QIS CET",
    established:   2004,
    location:      "Ongole, Prakasam Dt, Andhra Pradesh – 523272",
    affiliation:   "JNTUK",
    approvals:     ["AICTE", "NAAC", "ISO 9001:2015"],
    campus:        "30 Acres",
    students:      "5000+",
    faculty:       "200+",
    labs:          "30+",
    library:       "50,000+ volumes",
    contact:       { phone: "+91 8592 123456", email: "info@qiscet.edu.in" },
    placementRate: "95%",
    avgCTC:        "₹6.8 LPA",
    highestCTC:    "₹24 LPA",
  });
});

// Programs
app.get("/api/programs", (req, res) => {
  const level = req.query.level;
  const data  = level ? programs.filter(p => p.level.toLowerCase() === level.toLowerCase()) : programs;
  res.json({ count: data.length, programs: data });
});

// Placement stats
app.get("/api/placement", (req, res) => {
  res.json({
    placementRate: "95%",
    avgCTC:        "₹6.8 LPA",
    highestCTC:    "₹24 LPA",
    companies:     150,
    topRecruiters: ["TCS","Wipro","Infosys","HCL","Cognizant","Accenture","IBM","Capgemini","Deloitte","Tech Mahindra"],
    batches: [
      { year: 2024, placed: 95, avgCTC: 6.8, highCTC: 24  },
      { year: 2023, placed: 92, avgCTC: 6.2, highCTC: 20  },
      { year: 2022, placed: 90, avgCTC: 5.8, highCTC: 18  },
    ],
  });
});

// Sign up
app.post("/api/signup", (req, res) => {
  const { name, email, password, rollNo } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ error: "Email already registered." });
  }
  // NOTE: Hash passwords with bcrypt in production!
  const newUser = { id: users.length + 1, name, email, password, rollNo: rollNo || null, role: "student" };
  users.push(newUser);
  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ message: "Account created successfully.", user: safeUser });
});

// Sign in
app.post("/api/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }
  const { password: _, ...safeUser } = user;
  res.json({ message: "Login successful.", user: safeUser });
  // NOTE: Issue JWT tokens in production!
});

// Users list (admin only in production)
app.get("/api/users", (req, res) => {
  const safe = users.map(({ password: _, ...u }) => u);
  res.json({ count: safe.length, users: safe });
});

// Contact form
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }
  const entry = { id: contacts.length + 1, name, email, subject: subject || "General Inquiry", message, createdAt: new Date().toISOString() };
  contacts.push(entry);
  res.status(201).json({ message: "Message received. We'll get back to you shortly.", id: entry.id });
});

// View contacts (admin only in production)
app.get("/api/contact", (req, res) => {
  res.json({ count: contacts.length, contacts });
});

// Catch-all → index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── START ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("\n ╔═══════════════════════════════════════════╗");
  console.log(` ║  QIS CET Server running on port ${PORT}      ║`);
  console.log(" ║  http://localhost:3000                    ║");
  console.log(" ╚═══════════════════════════════════════════╝\n");
});

module.exports = app;
