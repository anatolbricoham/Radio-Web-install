const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { once } = require("node:events");
const { createHash } = require("node:crypto");

const root = path.join(__dirname, "..");
const read = name => fs.readFileSync(path.join(root, name), "utf8");

test("el empaquetado crea artefactos para Debian/Raspberry Pi, Arch, FreeBSD y Windows", () => {
  const build = read("scripts/build-installers.sh");
  for (const marker of [
    "build_deb amd64 x64",
    "build_deb arm64 arm64",
    "build_deb armhf armv7l",
    "arch-source.tar.gz",
    "sha256sum \"$output/bricohams-radio-workspace-${version#v}-arch-source.tar.gz\"",
    "freebsd-amd64.tar.gz",
    "windows-x64.zip",
    "SHASUMS256.txt",
    "sha256sum"
  ]) assert.ok(build.includes(marker), marker);
  assert.match(read(".github/workflows/release-installers.yml"), /tags: \["v\*"\]/);
});

test("los lanzadores locales conservan Node 22+ y el servidor solo local", () => {
  assert.match(read("installers/unix/bricohams-radio"), /process\.versions\.node/);
  // Node 24+ rejects process.exit(boolean): the version probe must exit with a number.
  for (const name of ["installers/unix/bricohams-radio", "installers/freebsd/install.sh"]) {
    assert.doesNotMatch(read(name), /process\.exit\([^)]*< 22\)/, name);
  }
  assert.match(read("installers/unix/bricohams-radio"), /127\.0\.0\.1:8787/);
  assert.doesNotMatch(read("installers/unix/bricohams-radio"), /\/dev\/tcp/);
  assert.match(read("installers/freebsd/install.sh"), /pkg install -y node22/);
  assert.match(read("installers/windows/Start.ps1"), /http:\/\/127\.0\.0\.1:8787/);
  assert.match(read("installers/windows/Install.ps1"), /Programs\\Bricohams Radio Workspace/);
});
test("los instalables incluyen avisos legales, estado de entrega y licencia del runtime incluido", () => {
  const build = read("scripts/build-installers.sh");
  for (const marker of ["LICENSE AUTHORS.md ACKNOWLEDGEMENTS.md SUPPORT.md SECURITY.md",
    "ayuda-entrega.html", 'runtime/node/LICENSE"', 'windows_root/runtime/LICENSE"']) {
    assert(build.includes(marker), marker);
  }
});

test("los instalables incluyen el catalogo y todos los recursos web permitidos", () => {
  const build = read("scripts/build-installers.sh");
  const files = build.match(/app_files=\(([\s\S]*?)\n\)/)[1].trim().split(/\s+/);
  const { ALLOWED_FILES } = require("../server.cjs");
  for (const file of ALLOWED_FILES) {
    if (files.includes(file) || /^ayuda-.+\.(en|de|it|fr)\.html$/.test(file) ||
      /^docs\/atlas\/.+\.(jpg|svg)$/.test(file) || file === "satellite.min.js") continue;
    if (/^data\/channel-templates\/.+\.json$/.test(file)) {
      assert(build.includes('"$root"/data/channel-templates/*.json'));
      continue;
    }
    if (/^precompiled\/[^/]+\.(bin|json|txt)$/.test(file)) {
      assert(build.includes('"$root"/precompiled/*.bin "$root"/precompiled/*.json "$root"/precompiled/*.txt'));
    } else if (/^precompiled\/apps\/[^/]+\.(app|json)$/.test(file)) {
      assert(build.includes('"$root"/precompiled/apps/*.app "$root"/precompiled/apps/*.json'));
    } else if (/^precompiled\/chirp\/[^/]+\.(py|json|txt)$/.test(file)) {
      assert(build.includes('"$root"/precompiled/chirp/*.py "$root"/precompiled/chirp/*.json "$root"/precompiled/chirp/*.txt'));
    } else {
      assert.fail(`Recurso ausente del instalador: ${file}`);
    }
  }
});

test("Linux y FreeBSD comparten un unico lanzador y Windows reemplaza la app al actualizar", () => {
  const build = read("scripts/build-installers.sh");
  assert.equal(build.match(/installers\/unix\/bricohams-radio"/g).length, 3);
  assert.ok(!fs.existsSync(path.join(root, "installers/freebsd/bricohams-radio")));
  const launcher = read("installers/unix/bricohams-radio");
  for (const dir of ["/opt/bricohams-radio-workspace", "/usr/local/libexec/bricohams-radio-workspace"]) {
    assert.ok(launcher.includes(dir), dir);
  }
  assert.ok(read("installers/freebsd/install.sh").includes("/usr/local/libexec/bricohams-radio-workspace"));
  assert.match(read("installers/windows/Install.ps1"), /Remove-Item -Path \$appTarget -Recurse -Force/);
  const workflow = read(".github/workflows/release-installers.yml");
  for (const run of workflow.split(/\n\s+run: /).slice(1)) {
    assert.doesNotMatch(run.split(/\n\s+- /)[0], /\$\{\{\s*inputs\./, "inputs must reach run scripts through env");
  }
});

test("la documentación da instrucciones por sistema y explica la generación por release", () => {
  const readme = read("README.md");
  const deployment = read("docs/DEPLOYMENT.md");
  for (const platform of ["Debian", "Raspberry Pi", "Arch Linux", "FreeBSD", "Windows 11"]) {
    assert.ok(readme.includes(platform), platform);
    assert.ok(deployment.includes(platform), platform);
  }
  assert.match(deployment, /crea y sube una etiqueta `v\*`/);
});

test("las guias locales cubren integridad, arquitectura, parada y persistencia", () => {
  const deployment = read("docs/DEPLOYMENT.md");
  for (const marker of [
    "Get-FileHash", "SHA256SUMS", "dpkg --print-architecture", "ARMv6",
    "makepkg -si", "su -c './install.sh'", "ExecutionPolicy Bypass",
    "Get-NetTCPConnection", "Stop-Process -Id <PID>", "sudo apt remove",
    "sudo pacman -R", "Desinstalar no elimina las copias del navegador"
  ]) assert.ok(deployment.includes(marker), marker);
  const help = read("ayuda.html");
  for (const platform of ["Windows 11", "Debian", "Ubuntu", "Raspberry Pi", "Arch Linux", "FreeBSD"]) {
    assert.ok(help.includes(platform), platform);
  }
  assert.match(help, /releases\/latest/);
  assert.doesNotMatch(help, /próximamente en paquetes/);
});

test("Studio se incluye fijado por commit y SHA-256, sin versionar su HTML con firmware", () => {
  const lock = JSON.parse(read("studio.lock.json"));
  assert.equal(lock.repository, "Brico-Hams/Bricohams-Studio");
  assert.match(lock.commit, /^[0-9a-f]{40}$/);
  assert.match(lock.sha256, /^[0-9a-f]{64}$/);
  assert.ok(lock.scriptHashes.length > 0 && lock.scriptHashes.every(hash => /^sha256-[A-Za-z0-9+/]{43}=$/.test(hash)));
  assert.match(read(".gitignore"), /^studio\.html$/m);
  const build = read("scripts/build-installers.sh");
  assert.ok(build.indexOf('node "$root/scripts/fetch-studio.cjs"') < build.indexOf("stage_app()"));
  for (const file of ["studio.html", "studio.lock.json", "studio-pin.cjs"]) assert.ok(build.includes(` ${file}`), file);
});

test("los hashes CSP de Studio cubren solo scripts ejecutables y rechazan scripts externos", () => {
  const { scriptHashes } = require("../studio-pin.cjs");
  const html = '<script type="application/x-bricohams-firmware">AAAA</script><script>run()</script><script type="text/plain">x</script>';
  const expected = `sha256-${createHash("sha256").update("run()").digest("base64")}`;
  assert.deepEqual(scriptHashes(html), [expected]);
  assert.throws(() => scriptHashes('<script src="https://evil.test/x.js"></script>'), /externos/);
  assert.throws(() => scriptHashes("<p>sin scripts</p>"), /sin scripts/);
});

test("el servidor local sirve Studio solo si coincide con el lock y con una CSP por hashes", async t => {
  const { createServer } = require("../server.cjs");
  const { sha256, scriptHashes } = require("../studio-pin.cjs");
  const dir = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "studio-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const html = Buffer.from("<!doctype html><title>Studio</title><script>document.title='ok'</script>");
  const file = path.join(dir, "studio.html");
  const lock = { commit: "0".repeat(40), bytes: html.length, sha256: sha256(html), scriptHashes: scriptHashes(html.toString()) };
  const server = createServer(undefined, undefined, { file, lock });
  server.listen(0, "127.0.0.1"); await once(server, "listening");
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
  const url = `http://127.0.0.1:${server.address().port}/studio.html`;
  assert.equal((await fetch(url)).status, 404);
  fs.writeFileSync(file, html);
  const response = await fetch(url);
  assert.equal(response.status, 200);
  const csp = response.headers.get("content-security-policy");
  assert.ok(csp.includes(`script-src '${lock.scriptHashes[0]}';`), csp);
  assert.match(csp, /connect-src 'none'/);
  assert.doesNotMatch(csp, /script-src[^;]*unsafe-inline/);
  assert.equal(await response.text(), html.toString());
  fs.writeFileSync(file, Buffer.concat([html, Buffer.from("<script>steal()</script>")]));
  assert.equal((await fetch(url)).status, 500);
});
