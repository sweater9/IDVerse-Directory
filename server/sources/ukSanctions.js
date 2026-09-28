// UK Sanctions List (OFSI/FCDO) — free bulk CSV, no key.
const UK_URL = "https://ofsistorage.blob.core.windows.net/publishlive/ConList.csv";

let cache = { rows: null, fetchedAt: 0 };
const TTL_MS = 60 * 60 * 1000;

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
  const nameIdx = header.findIndex((h) => /Name\s*6/i.test(h) || /^Name$/i.test(h));
  const groupIdx = header.findIndex((h) => /Group\s*ID/i.test(h));
  return lines.slice(1).map((line) => {
    const cells = line.split(",");
    return {
      name: (cells[nameIdx] || "").replace(/"/g, "").trim(),
      groupId: groupIdx >= 0 ? (cells[groupIdx] || "").replace(/"/g, "").trim() : "",
    };
  });
}

async function loadList() {
  if (cache.rows && Date.now() - cache.fetchedAt < TTL_MS) return cache.rows;
  const res = await fetch(UK_URL, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`UK Sanctions fetch failed: ${res.status}`);
  const text = await res.text();
  const rows = parseCsv(text).filter((r) => r.name);
  cache = { rows, fetchedAt: Date.now() };
  return rows;
}

async function screen(name) {
  const q = name.trim().toLowerCase();
  const rows = await loadList();
  const matches = rows
    .filter((r) => r.name.toLowerCase().includes(q))
    .slice(0, 15)
    .map((r) => ({ name: r.name, detail: r.groupId ? `Group ${r.groupId}` : undefined }));
  return {
    id: "uk-sanctions",
    label: "UK Sanctions List (OFSI/FCDO)",
    method: "api",
    url: "https://www.gov.uk/government/publications/the-uk-sanctions-list",
    matches,
  };
}

const meta = { id: "uk-sanctions", label: "UK Sanctions List (OFSI/FCDO)", url: "https://www.gov.uk/government/publications/the-uk-sanctions-list" };
module.exports = { screen, meta };
