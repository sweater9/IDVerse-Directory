// OpenCorporates OpenRefine reconciliation endpoint — free, no key, rate-limited.
async function screen(name) {
  const url = `https://opencorporates.com/reconcile?query=${encodeURIComponent(name)}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(10000),
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`OpenCorporates fetch failed: ${res.status}`);
  const data = await res.json();
  const matches = (data?.result || []).slice(0, 10).map((r) => ({
    name: r.name,
    detail: (r.type || []).map((t) => t.name).join(", "),
  }));
  return {
    id: "opencorporates",
    label: "OpenCorporates",
    method: "api",
    url: `https://opencorporates.com/companies?q=${encodeURIComponent(name)}`,
    matches,
  };
}

const meta = { id: "opencorporates", label: "OpenCorporates", url: "https://opencorporates.com" };
module.exports = { screen, meta };
