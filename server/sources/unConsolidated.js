// UN Security Council Consolidated Sanctions List — free public XML, no key.
const UN_URL = "https://scsanctions.un.org/resources/xml/en/consolidated.xml";

let cache = { entries: null, fetchedAt: 0 };
const TTL_MS = 60 * 60 * 1000;

function extractAll(tag, xml) {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "g");
  const out = [];
  let m;
  while ((m = re.exec(xml))) out.push(m[1]);
  return out;
}

async function loadList() {
  if (cache.entries && Date.now() - cache.fetchedAt < TTL_MS) return cache.entries;
  const res = await fetch(UN_URL, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`UN list fetch failed: ${res.status}`);
  const xml = await res.text();
  const individualBlocks = extractAll("INDIVIDUAL", xml);
  const entityBlocks = extractAll("ENTITY", xml);

  const decode = (s) =>
    (s || "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .trim();

  const individuals = individualBlocks.map((block) => {
    const first = decode((block.match(/<FIRST_NAME>([\s\S]*?)<\/FIRST_NAME>/) || [])[1]);
    const second = decode((block.match(/<SECOND_NAME>([\s\S]*?)<\/SECOND_NAME>/) || [])[1]);
    const third = decode((block.match(/<THIRD_NAME>([\s\S]*?)<\/THIRD_NAME>/) || [])[1]);
    const name = [first, second, third].filter(Boolean).join(" ");
    return { name, type: "Individual" };
  });
  const entities = entityBlocks.map((block) => {
    const name = decode((block.match(/<FIRST_NAME>([\s\S]*?)<\/FIRST_NAME>/) || [])[1]);
    return { name, type: "Entity" };
  });

  cache = { entries: [...individuals, ...entities], fetchedAt: Date.now() };
  return cache.entries;
}

async function screen(name) {
  const q = name.trim().toLowerCase();
  const entries = await loadList();
  const matches = entries
    .filter((e) => e.name && e.name.toLowerCase().includes(q))
    .slice(0, 15)
    .map((e) => ({ name: e.name, detail: e.type }));
  return {
    id: "un-consolidated",
    label: "UN Security Council Consolidated List",
    method: "api",
    url: "https://main.un.org/securitycouncil/en/content/un-sc-consolidated-list",
    matches,
  };
}

const meta = { id: "un-consolidated", label: "UN Security Council Consolidated List", url: "https://main.un.org/securitycouncil/en/content/un-sc-consolidated-list" };
module.exports = { screen, meta };
