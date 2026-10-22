// The current release. A new release changes this one line; everything else is derived.
const CURRENT = { version: "0.1.1", sizeMB: 57 };

const REPO = "https://github.com/Vaultdraw/vaultdraw";
const download = (file) => `${REPO}/releases/download/v${CURRENT.version}/${file}`;
const dmgName = `Vaultdraw_${CURRENT.version}_universal.dmg`;

export const RELEASE = {
  ...CURRENT,
  repo: REPO,
  dmgName,
  dmgUrl: download(dmgName),
  sumsUrl: download("SHA256SUMS"),
  pageUrl: `${REPO}/releases/tag/v${CURRENT.version}`,
  allUrl: `${REPO}/releases`,
  macs: "Apple Silicon & Intel",
};

/** Values Markdown can use as {{name}} (see scripts/remark-release.mjs). */
export const RELEASE_TOKENS = {
  version: RELEASE.version,
  size_mb: String(RELEASE.sizeMB),
  dmg_name: RELEASE.dmgName,
  dmg_url: RELEASE.dmgUrl,
  sums_url: RELEASE.sumsUrl,
  release_url: RELEASE.pageUrl,
  releases_url: RELEASE.allUrl,
};
