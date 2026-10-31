const test = require("node:test");
const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const R = require("../radio-core.js");
require("../f4hwn-options.js");
require("../custom-firmware-ui.js");

const sha = bytes => createHash("sha256").update(bytes).digest("hex");
const file = (name, text) => ({ name, bytes: new TextEncoder().encode(text) });

test("las nueve imagenes publicadas enlazan el modulo CHIRP oficial de su version, intacto y con licencia", () => {
  const root = path.join(__dirname, "..");
  const read = name => fs.readFileSync(path.join(root, name), "utf8");
  const manifest = JSON.parse(read("precompiled/chirp/manifest.json"));
  const catalog = JSON.parse(read("precompiled/catalog.json"));
  assert.equal(catalog.entries.length, 9);
  for (const entry of catalog.entries) assert.equal(entry.version, manifest.firmwareVersion, entry.id);
  const bytes = fs.readFileSync(path.join(root, manifest.path));
  assert.equal(sha(bytes), "ccbf2ec24c5bfb49ab089a2ae0289a305f3ed6812f2de90a36e6186961913462");
  assert.equal(sha(bytes), manifest.sha256);
  assert.equal(manifest.modified, false);
  assert.equal(manifest.source, "https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/download/v6.1.0/f4hwn.chirp.v6.1.0.py");
  assert.equal(manifest.license, "GPL-2.0-or-later");
  assert.match(read(manifest.licensePath), /Version 2, June 1991/);
  assert.match(read(manifest.noticePath), /Jacek Lipkowski/);
  assert.ok(bytes.toString("utf8").includes(`MODEL = "${manifest.model}"`));
  const panel = read("precompiled-catalog.js");
  assert.ok(panel.includes(`href="${manifest.path}" download`));
  assert.match(panel, /UV-K5 generico/);
  assert.match(panel, /descarga de nuevo desde la radio/);
  assert.match(panel, /migra sus canales por CSV/);
  const { ALLOWED_FILES } = require("../server.cjs");
  for (const asset of [manifest.path, manifest.licensePath, manifest.noticePath, "precompiled/chirp/manifest.json"])
    assert.ok(ALLOWED_FILES.includes(asset), `El servidor y Pages deben distribuir ${asset}`);
});

test("el catalogo F4HWN fija el commit y Labs admite apps", () => {
  const catalog = R.F4HWN_OPTIONS;
  assert.match(catalog.upstream.commit, /^[0-9a-f]{40}$/);
  for (const preset of ["Fusion", "FieldOps", "Transfer", "Labs", "Max", "Custom"]) assert.ok(catalog.presets[preset], preset);
  assert.equal(catalog.presets.Labs.options.ENABLE_FEAT_F4HWN_OVERLAY_APPS, true);
});

test("la peticion solo lleva cambios reales sobre la edicion, en formato ON/OFF", () => {
  const catalog = { presets: { Labs: { options: { ENABLE_A: true, ENABLE_B: false } } } };
  assert.equal(R.customFirmwareRequest(catalog, "Labs", {}), "");
  assert.equal(R.customFirmwareRequest(catalog, "Labs", { ENABLE_A: true, ENABLE_B: true }), "ENABLE_B=ON");
  assert.equal(R.customFirmwareRequest(catalog, "Labs", { ENABLE_A: false, ENABLE_X: true }), "ENABLE_A=OFF");
  assert.throws(() => R.customFirmwareRequest(catalog, "Nope", {}), /desconocida/);
});

test("cada modulo local genera una imagen FieldOps separada, con Beacon y VOX OFF", () => {
  const { readArguments } = require("../scripts/build-bricohams.cjs");
  for (const name of ["ardf", "satellite", "spectrum"]) {
    const command = R.bricohamsModuleCommand(name);
    const tokens = command.match(/'[^']*'|\S+/g).map(token => token.replace(/^'|'$/g, ""));
    const args = readArguments(tokens.slice(4));
    assert.deepEqual(args.modules, [name]);
    assert.equal(args.preset, "FieldOps");
    assert.deepEqual(args.source.split("\\"), ["..", "Multiboot", "Fusion61"]);
    assert.deepEqual(args.output.split("\\"), [".", "firmware-builds", `${name}-beta`]);
    assert.deepEqual(args.options, ["ENABLE_FEAT_F4HWN_BEACON=OFF", "ENABLE_VOX=OFF"]);
  }
  for (const bad of ["", "karina", "ardf;satellite", null, ["ardf"]])
    assert.throws(() => R.bricohamsModuleCommand(bad), /desconocido/);
});

test("una compilacion solo se acepta si cada archivo coincide con SHA256SUMS", async () => {
  const bin = new Uint8Array(1024).fill(7);
  const info = JSON.stringify({ format: "bricohams-firmware-build", firmware: "f4hwn.labs.bin", preset: "Labs", options: [], upstream: { tag: "v6.3.0" } });
  const sums = `${sha(bin)}  f4hwn.labs.bin\n${sha(new TextEncoder().encode(info))}  build-info.json\n`;
  const ok = await R.verifyCustomBuild([file("SHA256SUMS", sums), { name: "f4hwn.labs.bin", bytes: bin }, file("build-info.json", info)]);
  assert.equal(ok.firmware.name, "f4hwn.labs.bin");
  assert.equal(ok.info.preset, "Labs");
  const tampered = bin.slice(); tampered[0] ^= 1;
  await assert.rejects(R.verifyCustomBuild([file("SHA256SUMS", sums), { name: "f4hwn.labs.bin", bytes: tampered }, file("build-info.json", info)]), /distinto/);
  await assert.rejects(R.verifyCustomBuild([file("SHA256SUMS", sums), { name: "f4hwn.labs.bin", bytes: bin }]), /Falta build-info/);
  const unsigned = `${sha(bin)}  f4hwn.labs.bin
`;
  await assert.rejects(R.verifyCustomBuild([file("SHA256SUMS", unsigned), { name: "f4hwn.labs.bin", bytes: bin }, file("build-info.json", info)]), /no esta en SHA256SUMS/);
  await assert.rejects(R.verifyCustomBuild([{ name: "f4hwn.labs.bin", bytes: bin }]), /Falta SHA256SUMS/);
  await assert.rejects(R.verifyCustomBuild([file("SHA256SUMS", "not a sum line")]), /no valida/);
});
test("la imagen seleccionada corresponde a build-info, no al primer binario del manifiesto", async () => {
  const other = file("other.bin", "other firmware");
  const intended = file("intended.bin", "intended firmware");
  const info = file("build-info.json", JSON.stringify({
    format: "bricohams-firmware-build", firmware: intended.name, preset: "Labs", options: [], upstream: { tag: "v6.3.0" }
  }));
  const files = [other, intended, info];
  const sums = file("SHA256SUMS", files.map(item => `${sha(item.bytes)}  ${item.name}`).join("\n"));
  const result = await R.verifyCustomBuild([sums, ...files]);
  assert.equal(result.firmware.name, intended.name);
  assert.deepEqual(result.firmware.bytes, intended.bytes);
  await assert.rejects(R.verifyCustomBuild([sums, ...files, other]), /duplicados/);
  await assert.rejects(R.verifyCustomBuild([file("SHA256SUMS", `${sha(other.bytes)}  other.bin\n`), other]), /Falta build-info/);
  await assert.rejects(R.verifyCustomBuild([file("SHA256SUMS", `${sha(other.bytes)}  other.bin\n${sha(other.bytes)}  other.bin\n`), other]), /duplicado/);
});
