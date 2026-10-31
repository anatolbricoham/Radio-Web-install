const test = require("node:test");
const assert = require("node:assert/strict");
const { once } = require("node:events");
const R = require("../radio-core.js");
require("../runtime-mode.js");
const { createServer } = require("../server.cjs");
require("../planning-core.js");
test("web BrandMeister normaliza grupos con el mismo formato del servidor sin credenciales", () => {
  const result = R.normalizeTalkgroups({ 91: "Worldwide", 214: "Spain", 21401: "Madrid" }, "214");
  assert.deepEqual(result.entries.map(entry => [entry.id, entry.type]), [[214, 0], [21401, 0]]);
  assert.throws(() => R.normalizeTalkgroups({ 214: 1 }, "214"), /invalido/);
  assert.throws(() => R.normalizeTalkgroups({}, "214"), /vacia/);
});

test("runtime: local only when server says so", async () => {
  const ok = body => async () => new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } });
  assert.deepEqual(await R.loadRuntime(ok({ mode: "local" })), { mode: "local" });
  assert.deepEqual(await R.loadRuntime(ok({ mode: "admin" })), { mode: "web" });
  assert.deepEqual(await R.loadRuntime(async () => new Response("nope", { status: 404 })), { mode: "web" });
  assert.deepEqual(await R.loadRuntime(async () => new Response("<html>", { headers: { "content-type": "text/html" } })), { mode: "web" });
  assert.deepEqual(await R.loadRuntime(async () => { throw new TypeError("Failed to fetch"); }), { mode: "web" });
});

test("server serves runtime.json as local", async () => {
  const server = createServer({}, {});
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/runtime.json`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "application/json; charset=utf-8");
    assert.deepEqual(await response.json(), { mode: "local" });
    assert.match(response.headers.get("content-security-policy"), /script-src 'self'/);
  } finally {
    server.close();
  }
});

test("app refuses to run framed and paints the mode badge", () => {
  const app = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "app.js"), "utf8");
  assert.match(app, /window\.top !== window\.self/);
  assert.match(app, /mode-badge/);
  assert.match(app, /Web · GitHub Pages/);
  assert.match(app, /Local · instalado/);
});

test("CHIRP driver downloads as Python source, with intact release bytes", async () => {
  const server = createServer({}, {});
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/precompiled/chirp/f4hwn.chirp.v6.1.0.py`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
    assert.equal(response.headers.get("content-disposition"), 'attachment; filename="f4hwn.chirp.v6.1.0.py"');
    assert.equal(require("node:crypto").createHash("sha256").update(Buffer.from(await response.arrayBuffer())).digest("hex"),
      "ccbf2ec24c5bfb49ab089a2ae0289a305f3ed6812f2de90a36e6186961913462");
  } finally {
    server.close();
  }
});

// Firmware (Task 3)
require("../firmware-catalog.js");
const { createHash } = require("node:crypto");
const f4Repo = "https://github.com/armel/uv-k1-k5v3-firmware-custom";
function f4Image() {
  const data = Buffer.alloc(512);
  data.writeUInt32LE(0x20003000, 0);
  data.writeUInt32LE(0x08002841, 4);
  return data;
}
const fakeRelease = (data = f4Image()) => ({
  tag_name: "v6.2.0", html_url: `${f4Repo}/releases/tag/v6.2.0`, draft: false, prerelease: false,
  assets: [{ name: "f4hwn.labs.v6.2.0.bin", state: "uploaded", size: data.length,
    digest: `sha256:${createHash("sha256").update(data).digest("hex")}`,
    browser_download_url: `${f4Repo}/releases/download/v6.2.0/f4hwn.labs.v6.2.0.bin` }]
});
const gd77ManualEntry = { target: "GD-77", family: "MK22", url: "https://www.opengd77.com/downloads/releases/MK22/",
  expectedSHA256: null, size: null, format: "zip", slotCompatible: false };

test("web firmware: F4HWN file must match published size and digest", async () => {
  const data = new Uint8Array(4096).fill(7);
  const entry = { target: "UV-K1", family: "quansheng", format: "bin", slotCompatible: true, size: 4096, expectedSHA256: await R.sha256(data) };
  const { manifest } = await R.verifyLocalFirmware(entry, data);
  assert.equal(manifest.publisherHashVerified, true);
  assert.equal(manifest.sha256, entry.expectedSHA256);
  await assert.rejects(R.verifyLocalFirmware(entry, data.slice(0, 4095)), /tamano/i);
  const other = new Uint8Array(4096).fill(8);
  await assert.rejects(R.verifyLocalFirmware(entry, other), /SHA-256/);
});
test("web firmware: OpenGD77 manual file is never marked publisher-verified", async () => {
  const { manifest } = await R.verifyLocalFirmware(gd77ManualEntry, new Uint8Array(2048));
  assert.equal(manifest.publisherHashVerified, false);
  assert.equal(manifest.backupSubstitute, false);
  assert.equal(manifest.manifestFormat, "radio-workspace-firmware-download");
});
test("web firmware: files over 4 MiB are rejected", async () => {
  await assert.rejects(R.verifyLocalFirmware(gd77ManualEntry, new Uint8Array(4 * 1024 * 1024 + 1)), /4 MiB/);
});
test("firmware-core is shared: service and browser parse the same release identically", () => {
  assert.deepEqual(R.firmwareCore.parseF4Release(fakeRelease(), "UV-K1"), require("../firmware-service.cjs").parseF4Release(fakeRelease(), "UV-K1"));
  assert.throws(() => R.firmwareCore.parseF4Release({ ...fakeRelease(), prerelease: true }, "UV-K1"), { status: 502 });
});

test("web firmware: OpenGD77 manual file checks name, model and ZIP signature", async () => {
  const zip = new Uint8Array(2048);
  zip.set([0x50, 0x4b, 3, 4]);
  const ok = await R.verifyLocalFirmware(gd77ManualEntry, zip, "OpenGD77.zip");
  assert.equal(ok.manifest.publisherHashVerified, false);
  await assert.rejects(R.verifyLocalFirmware(gd77ManualEntry, zip, "random.zip"), /nombre/);
  await assert.rejects(R.verifyLocalFirmware(gd77ManualEntry, zip, "OpenGD77S.zip"), /nombre/);
  await assert.rejects(R.verifyLocalFirmware(gd77ManualEntry, new Uint8Array(2048), "OpenGD77.zip"), /ZIP/);
  await assert.rejects(R.verifyLocalFirmware(gd77ManualEntry, new Uint8Array(4 * 1024 * 1024 + 1), "OpenGD77.zip"), /4 MiB/);
});
test("web firmware: every firmware-download access is guarded in web mode", () => {
  const lines = require("node:fs").readFileSync(require("node:path").join(__dirname, "../firmware-catalog.js"), "utf8").split("\n");
  const unguarded = lines.filter(line => /\$\("firmware-download"\)/.test(line) && !/if \(!?(web|\$\("firmware-download"\))\)/.test(line) && !line.includes('<button id="firmware-download"'));
  assert.deepEqual(unguarded, []);
});

require("../planning-core.js");
require("../radioid-csv.js");
const header = "RADIO_ID,CALLSIGN,FIRST_NAME,LAST_NAME,CITY,STATE,COUNTRY\n";
test("RadioID CSV: filters by country/region and keeps provider shape", () => {
  const csv = header + "2141234,EA4ABC,Ana,Lopez,Madrid,Madrid,Spain\n3101234,K1ABC,Bob,Smith,Boston,Massachusetts,United States\n";
  const { entries } = R.parseRadioIdCSV(csv, { country: "Spain" });
  assert.deepEqual(entries, [{ id: 2141234, callsign: "EA4ABC", name: "Ana Lopez", country: "Spain", region: "Madrid", city: "Madrid", source: "https://radioid.net", kind: "private" }]);
  assert.equal(R.parseRadioIdCSV(csv, { country: "spain", region: "madrid" }).entries.length, 1);
  assert.equal(R.parseRadioIdCSV(csv, { country: "spain", region: "Sevilla" }).entries.length, 0);
});
test("RadioID CSV: handles quoted commas and skips invalid ids", () => {
  const csv = header + '2141234,EA4ABC,"Ana, Maria",Lopez,Madrid,Madrid,Spain\n99999999,EA4BAD,X,Y,C,D,Spain\n0,EA4ZERO,X,Y,C,D,Spain\n';
  const { entries, total } = R.parseRadioIdCSV(csv, { country: "Spain" });
  assert.equal(total, 1);
  assert.equal(entries[0].name, "Ana, Maria Lopez");
});
test("RadioID CSV: ids must be plain decimal digits", () => {
  const csv = header + ["0x1F,A,X,Y,C,D,Spain", "1e3,B,X,Y,C,D,Spain", '" 12 ",C,X,Y,C,D,Spain', "12,D,X,Y,C,D,Spain"].join("\n") + "\n";
  const { entries } = R.parseRadioIdCSV(csv, { country: "Spain" });
  assert.deepEqual(entries.map(e => e.id), [12]);
});
test("RadioID CSV: rejects foreign CSV, oversize text, and caps rows", () => {
  assert.throws(() => R.parseRadioIdCSV("a,b,c\n1,2,3\n", { country: "Spain" }), /RadioID/);
  assert.throws(() => R.parseRadioIdCSV("", { country: "Spain" }), /RadioID/);
  assert.throws(() => R.parseRadioIdCSV({ length: 100 * 1024 * 1024 + 1 }, { country: "Spain" }), /100 MiB/);
  const many = header + Array.from({ length: 5001 }, (_, i) => `${2140000 + i},EA${i},A,B,C,D,Spain`).join("\n");
  const result = R.parseRadioIdCSV(many, { country: "Spain" });
  assert.equal(result.entries.length, 5000); assert.equal(result.truncated, true); assert.equal(result.total, 5001);
});
test("profile validates callsign and 7-digit DMR id, and tolerates missing storage", () => {
  assert.throws(() => R.profile.set({ callsign: "e4", dmrId: "2141234" }), /indicativo/i);
  assert.throws(() => R.profile.set({ callsign: "EA4ABC", dmrId: "214123" }), /ID DMR/);
  assert.equal(R.profile.get(), null);
  const store = {};
  globalThis.localStorage = { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = v; }, removeItem: k => { delete store[k]; } };
  try {
    assert.deepEqual(R.profile.set({ callsign: "ea4abc", dmrId: "2141234" }), { callsign: "EA4ABC", dmrId: "2141234" });
    assert.deepEqual(R.profile.get(), { callsign: "EA4ABC", dmrId: "2141234" });
    R.profile.clear();
    assert.equal(R.profile.get(), null);
  } finally { delete globalThis.localStorage; }
});

// Satellites (Task 5)
require("../planning-core.js");
const { buildSatellites } = require("../scripts/fetch-satellites.cjs");
const issTle = [
  "1 25544U 98067A   26291.78980200  .00007771  00000-0  14938-3 0  9994",
  "2 25544  51.6325  48.4339 0006764 280.4294  79.5932 15.48929442590914"
];
// Same orbit with another NORAD and a recomputed checksum: valid for the validator, not a real satellite.
function tleFor(norad) {
  return issTle.map(line => {
    const body = line.slice(0, 2) + String(norad).padStart(5, "0") + line.slice(7, 68);
    let sum = 0;
    for (const char of body) sum += /\d/.test(char) ? Number(char) : char === "-" ? 1 : 0;
    return body + (sum % 10);
  });
}
function fakeDataService({ ok = [], fail = [] }) {
  return {
    async satellite({ norad }) {
      if (!ok.includes(norad)) throw new Error("offline");
      const [tle1, tle2] = tleFor(norad);
      return { norad, name: `SAT-${norad}`, tle1, tle2, source: `https://db.satnogs.org/api/tle/?norad_cat_id=${norad}` };
    },
    async transmitters({ norad }) {
      if (!ok.includes(norad)) throw new Error("offline");
      return { norad, entries: [{ id: `tx-${norad}`, name: "FM", mode: "FM", downlink: 145800000 }] };
    }
  };
}
const satNow = Date.parse("2026-10-21T05:00:00Z");
test("satellites: builds file, falls back per satellite to previous, fails when nothing valid", async () => {
  const all = [25544, 27607, 43017, 43678];
  const previous = await buildSatellites({ dataService: fakeDataService({ ok: all }), now: satNow });
  const file = await buildSatellites({ dataService: fakeDataService({ ok: [25544] }), previous, now: satNow });
  assert.equal(file.satellites.length, 4);
  assert.equal(file.satellites.find(s => s.norad === 25544).stale, false);
  assert.equal(file.satellites.find(s => s.norad === 27607).stale, true);
  assert.equal(R.validateSatellitesFile(file).satellites.length, 4);
  await assert.rejects(buildSatellites({ dataService: fakeDataService({}), previous: null, now: satNow }), /satelite/i);
  const corrupt = { ...previous, format: "other" };
  await assert.rejects(buildSatellites({ dataService: fakeDataService({}), previous: corrupt, now: satNow }), /satelite/i);
});
test("satellites file validation and age warning", async () => {
  const validFile = await buildSatellites({ dataService: fakeDataService({ ok: [25544] }), now: satNow });
  assert.throws(() => R.validateSatellitesFile({ format: "x" }), /formato/i);
  assert.throws(() => R.validateSatellitesFile({ ...validFile, version: 2 }), /formato/i);
  const entry = validFile.satellites[0];
  assert.throws(() => R.validateSatelliteEntry({ ...entry, tle1: entry.tle1.replace("25544", "99999") }, satNow), /TLE/);
  const [other1, other2] = tleFor(99999);
  assert.throws(() => R.validateSatelliteEntry({ ...entry, tle1: other1, tle2: other2 }, satNow), /NORAD/);
  assert.throws(() => R.validateSatelliteEntry({ ...entry, stale: "no" }, satNow), /registro/);
  assert.equal(R.satelliteAgeWarning(validFile, Date.parse(validFile.fetchedAt) + 6 * 864e5), null);
  assert.match(R.satelliteAgeWarning(validFile, Date.parse(validFile.fetchedAt) + 8 * 864e5), /7 dias|7 días/);
});
test("satellites: expired previous entries are dropped, one bad entry does not hide the rest", async () => {
  const all = [25544, 27607, 43017, 43678];
  const previous = await buildSatellites({ dataService: fakeDataService({ ok: all }), now: satNow });
  const later = satNow + 8 * 864e5; // previous TLE epochs are now older than 7 days
  await assert.rejects(buildSatellites({ dataService: fakeDataService({}), previous, now: later }), /satelite/i);
  const mixed = structuredClone(previous);
  mixed.satellites[1].tle1 = "garbage";
  const file = await buildSatellites({ dataService: fakeDataService({ ok: [25544] }), previous: mixed, now: satNow });
  assert.deepEqual(file.satellites.map(s => s.norad).sort(), [25544, 43017, 43678]);
  // client path
  const web = structuredClone(previous);
  web.satellites[1].tle1 = "garbage";
  assert.equal(R.pickSatellite(web, "25544").norad, 25544);
  assert.equal(R.pickSatellite(web, "43017").norad, 43017);
  assert.throws(() => R.pickSatellite(web, "27607"), /Datos del satelite 27607 no validos/);
  assert.throws(() => R.pickSatellite(web, "12345"), /no incluido/);
  assert.throws(() => R.pickSatellite({ format: "other", version: 1, satellites: [] }, "25544"), /formato/i);
  assert.throws(() => R.pickSatellite("<html>", "25544"), /formato/i);
});

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { ALLOWED_FILES: allowed } = require("../server.cjs");
const { build } = require("../scripts/build-pages.cjs");
const read = name => fs.readFileSync(path.join(__dirname, "..", name), "utf8");

test("pages build copies only the allow-list plus runtime.json and .nojekyll", () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "pages-"));
  build(out);
  const files = fs.readdirSync(out, { recursive: true })
    .map(name => name.replace(/\\/g, "/"))
    .filter(name => fs.statSync(path.join(out, name)).isFile()).sort();
  assert.deepEqual(files, [...allowed, ".nojekyll", "runtime.json"].sort());
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(out, "runtime.json"), "utf8")), { mode: "web" });
  fs.rmSync(out, { recursive: true });
});
test("client code never uses absolute paths", () => {
  for (const name of allowed.filter(n => n.endsWith(".js") && n !== "satellite.min.js")) {
    assert.doesNotMatch(read(name), /fetch\(\s*[`"']\//, name);
    assert.doesNotMatch(read(name), /[`"']\/(api\/|runtime\.json)/, name);
  }
});
test("pages workflow pins actions by SHA and keeps minimal permissions", () => {
  const wf = read(".github/workflows/pages.yml");
  for (const use of wf.matchAll(/uses:\s*(\S+)/g)) assert.match(use[1], /@[0-9a-f]{40}$/, use[1]);
  const [top, jobs] = wf.split(/^jobs:/m);
  assert.match(top, /contents: read/);
  assert.doesNotMatch(top, /pages: write|id-token: write/);
  assert.match(jobs, /pages: write/); assert.match(jobs, /id-token: write/);
  assert.ok(wf.includes("if: github.repository == format('{0}/{0}.github.io', github.repository_owner) || vars.PAGES_SHARED_ORIGIN_ACCEPTED == 'true'"));
  assert.doesNotMatch(wf, /run:.*\$\{\{/);
  assert.doesNotMatch(wf, /secrets\./);
});
test("tests and scripts contain no Windows-only relative path literals", () => {
  const fs = require("node:fs"), path = require("node:path");
  const files = ["tests", "scripts"].flatMap(d => fs.readdirSync(path.join(__dirname, "..", d), { recursive: true })
    .filter(f => /\.(cjs|js|mjs)$/.test(f)).map(f => path.join(__dirname, "..", d, f)));
  const bad = new RegExp("[\"'`]\\.{1,2}" + "\\\\");
  for (const file of files) if (path.basename(file) !== "web-mode.test.cjs") assert.doesNotMatch(fs.readFileSync(file, "utf8"), bad, file);
});

test("planning-ui: every R.profile access is guarded (quansheng.html does not load radioid-csv.js)", () => {
  const lines = require("node:fs").readFileSync(require("node:path").join(__dirname, "../planning-ui.js"), "utf8").split("\n");
  const start = lines.findIndex(line => line.includes("function webMode()"));
  const guard = lines.findIndex((line, i) => i > start && line.includes('!R.profile) return;'));
  assert.ok(start > 0 && guard > start);
  const bad = lines.map((line, i) => ({ line, n: i })).filter(({ line, n }) => /R\.profile\.(get|set|clear)/.test(line) &&
    !(n > guard) && !/web && R\.profile \?/.test(line));
  assert.deepEqual(bad, []);
  assert.doesNotMatch(require("node:fs").readFileSync(require("node:path").join(__dirname, "../quansheng.html"), "utf8"), /radioid-csv/);
});
