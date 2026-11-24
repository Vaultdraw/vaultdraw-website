// The current release. A new release changes this one line; everything else is derived.
// PLACEHOLDER: sizeMB (57) is the 0.1.2 DMG size; replace with the real 0.2.0 DMG size at publish time.
const CURRENT = { version: "0.2.0", sizeMB: 57 };

// Set to false if the arm64 Linux files do not ship in the release: every arm64 link and row disappears.
// CI builds the Linux bundles on x86_64 only (.github/workflows/release.yml), so no arm64 files ship.
const SHIP_ARM64 = false;

const REPO = "https://github.com/Vaultdraw/vaultdraw";
const download = (file) => `${REPO}/releases/download/v${CURRENT.version}/${file}`;
const dmgName = `Vaultdraw_${CURRENT.version}_universal.dmg`;

// Linux files in the release. One row per file; an arm64 row is dropped when SHIP_ARM64 is false.
const LINUX_FILES = [
  { arch: "x86_64", format: "deb", file: `Vaultdraw_${CURRENT.version}_amd64.deb` },
  { arch: "x86_64", format: "rpm", file: `Vaultdraw-${CURRENT.version}-1.x86_64.rpm` },
  { arch: "x86_64", format: "AppImage", file: `Vaultdraw_${CURRENT.version}_amd64.AppImage` },
  { arch: "arm64", format: "deb", file: `Vaultdraw_${CURRENT.version}_arm64.deb` },
  { arch: "arm64", format: "rpm", file: `Vaultdraw-${CURRENT.version}-1.aarch64.rpm` },
  { arch: "arm64", format: "AppImage", file: `Vaultdraw_${CURRENT.version}_aarch64.AppImage` },
]
  .filter((f) => SHIP_ARM64 || f.arch !== "arm64")
  .map((f) => ({ ...f, url: download(f.file) }));

const linuxFile = (arch, format) => LINUX_FILES.find((f) => f.arch === arch && f.format === format);
const x64 = (format) => linuxFile("x86_64", format).file;

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
  linux: {
    archs: SHIP_ARM64 ? "x86_64 and arm64" : "x86_64",
    files: LINUX_FILES,
    aur: { name: "vaultdraw-bin", install: "yay -S vaultdraw-bin", installParu: "paru -S vaultdraw-bin" },
    installDeb: `sudo apt install ./${x64("deb")}`,
    installRpm: `sudo dnf install ./${x64("rpm")}`,
    runAppImage: `chmod +x ${x64("AppImage")}\n./${x64("AppImage")}`,
    checksum: "sha256sum -c --ignore-missing SHA256SUMS",
    uninstallDeb: "sudo apt remove vaultdraw",
    uninstallRpm: "sudo dnf remove vaultdraw",
    uninstallAur: "sudo pacman -Rns vaultdraw-bin",
  },
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
  linux_archs: RELEASE.linux.archs,
  deb_name: x64("deb"),
  rpm_name: x64("rpm"),
  appimage_name: x64("AppImage"),
  linux_install_deb: RELEASE.linux.installDeb,
  linux_install_rpm: RELEASE.linux.installRpm,
  linux_run_appimage: RELEASE.linux.runAppImage,
  linux_checksum: RELEASE.linux.checksum,
  linux_uninstall_deb: RELEASE.linux.uninstallDeb,
  linux_uninstall_rpm: RELEASE.linux.uninstallRpm,
  linux_uninstall_aur: RELEASE.linux.uninstallAur,
  aur_install: RELEASE.linux.aur.install,
  aur_install_paru: RELEASE.linux.aur.installParu,
  tap_url: RELEASE.brew.tapUrl,
  unquarantine: RELEASE.unquarantine,
};
