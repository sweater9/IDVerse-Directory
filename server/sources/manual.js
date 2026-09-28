// Sources with no public API and no scrape-friendly public search page
// (bot-protected, login-gated, or paginated in a way that can't be queried
// by URL). These are surfaced as a direct search link instead of a live
// result so the report is honest about what was actually checked.
const MANUAL_SOURCES = [
  {
    id: "eu-sanctions-map",
    label: "EU Sanctions Map",
    url: "https://www.sanctionsmap.eu/#/main",
  },
  {
    id: "world-bank-debarred",
    label: "World Bank Debarred Firms & Individuals",
    url: "https://projects.worldbank.org/en/projects-operations/procurement/debarred-firms",
  },
  {
    id: "uk-companies-house",
    label: "UK Companies House",
    url: (name) => `https://find-and-update.company-information.service.gov.uk/search?q=${encodeURIComponent(name)}`,
  },
  {
    id: "icij-offshore-leaks",
    label: "ICIJ Offshore Leaks Database",
    url: (name) => `https://offshoreleaks.icij.org/search?q=${encodeURIComponent(name)}`,
  },
  {
    id: "fincen-enforcement",
    label: "FinCEN Enforcement Actions",
    url: "https://www.fincen.gov/news-room/enforcement-actions",
  },
  {
    id: "dilisense",
    label: "dilisense",
    url: (name) => `https://dilisense.com/search?q=${encodeURIComponent(name)}`,
  },
  {
    id: "pepchecker",
    label: "PepChecker",
    url: "https://pepchecker.com",
  },
];

async function screenAll(name) {
  return MANUAL_SOURCES.map((s) => ({
    id: s.id,
    label: s.label,
    method: "manual",
    url: typeof s.url === "function" ? s.url(name) : s.url,
    matches: [],
    note: "No automated check available — bot-protected, login-gated, or without a queryable public endpoint. Opens a direct search.",
  }));
}

module.exports = { screenAll };
