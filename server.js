require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");

const app = express();

// ====== MIDDLEWARE ======
app.use(express.static("public"));
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ====== ROUTES ======

// Test route
app.get("/api/ping", (req, res) => {
  res.json({ message: "GhostTrack backend is alive 👻" });
});

// Generic tracker route (IP, phone, or username)
app.post("/api/track", (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  let mode = "";
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(query)) {
    mode = "ip";
  } else if (/^\+?\d{7,15}$/.test(query)) {
    mode = "phone";
  } else {
    mode = "username"; // default to username if not IP/phone
  }

  const py = spawn("/home/water/Documents/GhostTrack/python/venv/bin/python3", [
    "./python/ghosttrack.py",
    "--mode",
    mode,
    "--value",
    query,
  ]);

  let output = "";
  let errorOutput = "";

  py.stdout.on("data", (data) => {
    output += data.toString();
  });

  py.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  py.on("close", (code) => {
    if (code !== 0) {
      return res
        .status(500)
        .json({ error: "Python script failed", details: errorOutput });
    }
    try {
      const parsed = JSON.parse(output);
      res.json(parsed);
    } catch (e) {
      res
        .status(500)
        .json({ error: "Failed to parse Python output", details: output });
    }
  });
});

// Catch-all route
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ====== SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ GhostTrack backend running on http://localhost:${PORT}`);
});
