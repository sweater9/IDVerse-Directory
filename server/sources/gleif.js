// GLEIF Global LEI Index — free public JSON API, no key.
async function screen(name) {
  const url = `https://api.gleif.org/api/v1/lei-records?filter[entity.legalName]=${encodeURIComponent(
    name
  )}&page[size]=10`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(10000),
    headers: { Accept: "application/vnd.api+json" },
  });
  if (!res.ok) throw new Error(`GLEIF fetch failed: ${res.status}`);
  const data = await res.json();
  const matches = (data?.data || []).map((rec) => ({
    name: rec?.attributes?.entity?.legalName?.name,
    detail: [rec?.attributes?.entity?.legalAddress?.country, rec?.attributes?.lei]
      .filter(Boolean)
      .join(" · "),
  }));
  return {
    id: "gleif-lei",
    label: "GLEIF Global LEI Index",
    method: "api",
    url: "https://search.gleif.org",
    matches,
  };
}

const meta = { id: "gleif-lei", label: "GLEIF Global LEI Index", url: "https://search.gleif.org" };
module.exports = { screen, meta };
