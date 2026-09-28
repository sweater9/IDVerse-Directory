const path = require("path");
const express = require("express");
const { screenName } = require("./screen");

const app = express();
const PORT = process.env.PORT || 3000;

// Basic per-IP rate limit so a shared public deploy can't be used to hammer
// the upstream sources (they're free public services, not ours to abuse).
const hits = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const record = hits.get(ip) || { count: 0, windowStart: now };
  if (now - record.windowStart > WINDOW_MS) {
    record.count = 0;
    record.windowStart = now;
  }
  record.count += 1;
  hits.set(ip, record);
  if (record.count > MAX_PER_WINDOW) {
    return res.status(429).json({ error: "Too many screening requests — wait a minute and try again." });
  }
  next();
}

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/screen", rateLimit, async (req, res) => {
  const name = (req.query.q || "").toString().trim();
  if (name.length < 2) {
    return res.status(400).json({ error: "Provide a name of at least 2 characters." });
  }
  if (name.length > 100) {
    return res.status(400).json({ error: "Name is too long." });
  }
  try {
    const report = await screenName(name);
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: "Screening failed unexpectedly.", detail: String(err?.message || err) });
  }
});

app.listen(PORT, () => {
  console.log(`IDVerse Directory server listening on port ${PORT}`);
});
