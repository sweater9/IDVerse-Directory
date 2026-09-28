// SEC EDGAR full-text search — free public JSON API, no key.
async function screen(name) {
  const url = `https://efts.sec.gov/LATEST/search-index?q=${encodeURIComponent(
    `"${name}"`
  )}&forms=&dateRange=custom`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(10000),
    headers: { Accept: "application/json", "User-Agent": "IDVerse-Directory research@idverse.example" },
  });
  if (!res.ok) throw new Error(`SEC EDGAR fetch failed: ${res.status}`);
  const data = await res.json();
  const hits = (data?.hits?.hits || []).slice(0, 10);
  const matches = hits.map((h) => ({
    name: h?._source?.display_names?.[0] || name,
    detail: [h?._source?.forms?.[0], h?._source?.file_date].filter(Boolean).join(" · "),
  }));
  return {
    id: "sec-edgar",
    label: "SEC EDGAR Full-Text Search",
    method: "api",
    url: `https://www.sec.gov/edgar/search/#/q=${encodeURIComponent(name)}`,
    matches,
  };
}

const meta = { id: "sec-edgar", label: "SEC EDGAR Full-Text Search", url: "https://www.sec.gov/edgar/search/" };
module.exports = { screen, meta };
