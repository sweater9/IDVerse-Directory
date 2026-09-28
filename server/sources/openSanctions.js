// OpenSanctions public search page — no free-tier API key wired in, so this
// scrapes the public HTML results page (best-effort; layout can change).
async function screen(name) {
  const url = `https://www.opensanctions.org/search/?q=${encodeURIComponent(name)}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(10000),
    headers: { "User-Agent": "Mozilla/5.0 (IDVerse-Directory research tool)" },
  });
  if (!res.ok) throw new Error(`OpenSanctions fetch failed: ${res.status}`);
  const html = await res.text();

  // Entity result cards link to /entities/<id>/ and carry the display name
  // as the anchor text; pull up to 10 unique (name, href) pairs.
  const re = /<a[^>]+href="(\/entities\/[^"]+)"[^>]*>\s*([^<]{2,120})\s*<\/a>/g;
  const seen = new Set();
  const matches = [];
  let m;
  while ((m = re.exec(html)) && matches.length < 10) {
    const label = m[2].trim();
    if (!label || seen.has(label)) continue;
    seen.add(label);
    matches.push({ name: label });
  }

  return {
    id: "opensanctions",
    label: "OpenSanctions",
    method: "scrape",
    url,
    matches,
  };
}

const meta = { id: "opensanctions", label: "OpenSanctions", url: "https://www.opensanctions.org" };
module.exports = { screen, meta };
