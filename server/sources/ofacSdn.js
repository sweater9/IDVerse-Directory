// OFAC Specially Designated Nationals list — free bulk CSV, no key.
const SDN_URL = "https://www.treasury.gov/ofac/downloads/sdn.csv";

let cache = { rows: null, fetchedAt: 0 };
const TTL_MS = 60 * 60 * 1000;

// The SDN CSV has no header row and fields can contain embedded commas inside quotes.
function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

async function loadList() {
  if (cache.rows && Date.now() - cache.fetchedAt < TTL_MS) return cache.rows;
  const res = await fetch(SDN_URL, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`OFAC SDN fetch failed: ${res.status}`);
  const text = await res.text();
  const rows = text
    .split(/\r?\n/)
    .filter(Boolean)
    .map(parseCsvLine)
    .map((f) => ({
      uid: f[0],
      name: f[1],
      type: f[2],
      program: f[3],
      remarks: f[11],
    }));
  cache = { rows, fetchedAt: Date.now() };
  return rows;
}

async function screen(name) {
  const q = name.trim().toLowerCase();
  const rows = await loadList();
  const matches = rows
    .filter((r) => r.name && r.name.toLowerCase().includes(q))
    .slice(0, 15)
    .map((r) => ({
      name: r.name,
      detail: [r.type, r.program].filter(Boolean).join(" · "),
    }));
  return {
    id: "ofac-sdn",
    label: "OFAC Specially Designated Nationals",
    method: "api",
    url: `https://sanctionssearch.ofac.treas.gov/`,
    matches,
  };
}

const meta = { id: "ofac-sdn", label: "OFAC Specially Designated Nationals", url: "https://sanctionssearch.ofac.treas.gov/" };
module.exports = { screen, meta };
