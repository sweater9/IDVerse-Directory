// INTERPOL public Red Notices API — free, no key. Covers a small fraction
// of active notices (most are law-enforcement-only), so treat as supplementary.
async function screen(name) {
  const parts = name.trim().split(/\s+/);
  const params = new URLSearchParams({ resultPerPage: "10" });
  if (parts.length > 1) {
    params.set("forename", parts.slice(0, -1).join(" "));
    params.set("name", parts[parts.length - 1]);
  } else {
    params.set("name", name.trim());
  }
  const url = `https://ws-public.interpol.int/notices/v1/red?${params.toString()}`;

  const res = await fetch(url, {
    signal: AbortSignal.timeout(10000),
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`INTERPOL fetch failed: ${res.status}`);
  const data = await res.json();
  const notices = (data?._embedded?.notices || []).slice(0, 10);
  const matches = notices.map((n) => ({
    name: [n.forename, n.name].filter(Boolean).join(" "),
    detail: n.nationalities ? n.nationalities.join(", ") : undefined,
  }));
  return {
    id: "interpol-red",
    label: "INTERPOL Red Notices (public)",
    method: "api",
    url: "https://www.interpol.int/en/How-we-work/Notices/Red-Notices/View-Red-Notices",
    matches,
    note: "Public view only — under 5% of active Red Notices are published here.",
  };
}

const meta = { id: "interpol-red", label: "INTERPOL Red Notices (public)", url: "https://www.interpol.int/en/How-we-work/Notices/Red-Notices/View-Red-Notices" };
module.exports = { screen, meta };
