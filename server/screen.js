const ofacSdn = require("./sources/ofacSdn");
const unConsolidated = require("./sources/unConsolidated");
const interpol = require("./sources/interpol");
const gleif = require("./sources/gleif");
const secEdgar = require("./sources/secEdgar");
const openCorporates = require("./sources/openCorporates");
const openSanctions = require("./sources/openSanctions");
const ukSanctions = require("./sources/ukSanctions");
const manual = require("./sources/manual");

const LIVE_SOURCES = [ofacSdn, unConsolidated, interpol, gleif, secEdgar, openCorporates, openSanctions, ukSanctions];

async function screenName(name) {
  const liveResults = await Promise.allSettled(LIVE_SOURCES.map((s) => s.screen(name)));

  const results = liveResults.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    const meta = LIVE_SOURCES[i].meta;
    return {
      id: meta.id,
      label: meta.label,
      url: meta.url,
      method: "error",
      matches: [],
      error: String(r.reason?.message || r.reason || "request failed"),
    };
  });

  const manualResults = await manual.screenAll(name);

  return {
    query: name,
    checkedAt: new Date().toISOString(),
    sources: [...results, ...manualResults],
  };
}

module.exports = { screenName };
