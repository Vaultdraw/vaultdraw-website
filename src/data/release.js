// The current release. A new release changes this one line; everything else is derived.
const CURRENT = { version: "0.1.2", sizeMB: 57 };

const REPO = "https://github.com/Vaultdraw/vaultdraw";
const download = (file) => `${REPO}/releases/download/v${CURRENT.version}/${file}`;
const dmgName = `Vaultdraw_${CURRENT.version}_universal.dmg`;

// Homebrew: the cask in the Vaultdraw/homebrew-tap repo installs the app and the vaultdraw command.
const TAP = "vaultdraw/tap/vaultdraw";

export const RELEASE = {
  ...CURRENT,
  repo: REPO,
  dmgName,
  dmgUrl: download(dmgName),
  sumsUrl: download("SHA256SUMS"),
  pageUrl: `${REPO}/releases/tag/v${CURRENT.version}`,
  allUrl: `${REPO}/releases`,
  macs: "Apple Silicon & Intel",
  brew: {
    tapUrl: "https://github.com/Vaultdraw/homebrew-tap",
    install: `brew install --cask ${TAP}`,
    upgrade: "brew upgrade --cask vaultdraw",
    uninstall: "brew uninstall --cask vaultdraw",
    zap: "brew uninstall --zap --cask vaultdraw",
  },
  /** Fix for "damaged" or a vaultdraw command that stops with Killed: 9. */
  unquarantine: "xattr -dr com.apple.quarantine /Applications/Vaultdraw.app",
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
  brew_install: RELEASE.brew.install,
  brew_upgrade: RELEASE.brew.upgrade,
  brew_uninstall: RELEASE.brew.uninstall,
  brew_zap: RELEASE.brew.zap,
  tap_url: RELEASE.brew.tapUrl,
  unquarantine: RELEASE.unquarantine,
};
