"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { once } = require("node:events");
const { pages, render, helpImages, optionNames, allOptionNames, resolvePresets, checkOptionCoverage, presetMarkdown,
  LANGS, TRANSLATIONS, localized, checkParity, translatedPath, relink, markdownHeadingIds,
  HELP_LANGS, helpCenterFile, renderHelpCenter } = require("../scripts/build-help.cjs");
const { ALLOWED_FILES, createServer } = require("../server.cjs");
const root = path.join(__dirname, "..");
// Generated docs are stored with LF; a Windows checkout with core.autocrlf turns them into CRLF.
const read = name => fs.readFileSync(path.join(root, name), "utf8").replace(/\r\n/g, "\n");

test("CHIRP help downloads stay local in all five languages", () => {
  for (const lang of HELP_LANGS) {
    const source = lang === "es" ? "AYUDA-QUANSHENG.md" : `i18n/${lang}/AYUDA-QUANSHENG.md`;
    const html = render(read(`docs/${source}`), source, { lang }).body;
    for (const name of ["f4hwn.chirp.v6.1.0.py", "manifest.json", "NOTICE.txt", "COPYING.txt"])
      assert.ok(html.includes(`href="precompiled/chirp/${name}"`), `${lang}: ${name}`);
  }
});

test("cada opcion del catalogo tiene explicacion y las matrices conservan valores y ausencias", () => {
  const text = read("docs/AYUDA-OPCIONES-F4HWN.md");
  checkOptionCoverage(text);
  assert.equal(optionNames().length, 84);
  const rows = [...text.matchAll(/^\| `(DEV|ENABLE_[A-Z0-9_]+)` \|/gm)].map(match => match[1]);
  assert.deepEqual(rows.sort(), allOptionNames());
  assert.throws(() => checkOptionCoverage(""), /Falta explicar/);
  assert.equal(read("docs/F4HWN-PRESETS.md"), presetMarkdown());
  const local = JSON.parse(read("docs/bricohams-options-v6.1.0.json"));
  const { UPSTREAM } = require("../scripts/build-bricohams.cjs");
  assert.equal(local.upstream.commit, UPSTREAM.commit);
  for (const preset of Object.values(local.presets)) {
    assert.equal(preset.options.ENABLE_FEAT_F4HWN_MULTIBOOT, true);
    for (const name of Object.keys(preset.options)) assert.ok(text.includes(`\`${name}\``), name);
  }
});

test("las 18 versiones historicas resuelven herencia sin proyectar opciones nuevas hacia atras", () => {
  const history = JSON.parse(read("docs/f4hwn-history-presets.json"));
  assert.equal(history.versions.length, 18);
  assert.equal(allOptionNames().length, 94);
  for (const version of history.versions) {
    assert.match(version.commit, /^[a-f0-9]{40}$/);
    assert.match(version.sha256, /^[a-f0-9]{64}$/);
    assert.equal(version.status, "verified");
    const resolved = resolvePresets(version.presets);
    assert.ok(resolved.Fusion);
    assert.ok(Object.values(resolved).every(options => Object.values(options).every(value => typeof value === "boolean")));
  }
  const old = resolvePresets(history.versions[0].presets);
  assert.equal(Object.hasOwn(old.Fusion, "ENABLE_FEAT_F4HWN_MULTIBOOT"), false);
  const latest = resolvePresets(history.versions.at(-1).presets);
  const catalog = require("../f4hwn-options.js").F4HWN_OPTIONS;
  for (const [name, preset] of Object.entries(catalog.presets)) {
    for (const [option, enabled] of Object.entries(preset.options)) assert.equal(latest[name][option], enabled, `${name}/${option}`);
  }
  const sample = { configurePresets: [
    { name: "a", hidden: true, cacheVariables: { ENABLE_X: "ON" } },
    { name: "b", hidden: true, cacheVariables: { ENABLE_X: false, ENABLE_Y: "OFF" } },
    { name: "c", inherits: ["a", "b"], cacheVariables: { ENABLE_Z: true } }
  ] };
  assert.deepEqual(resolvePresets(sample), { c: { ENABLE_X: true, ENABLE_Y: false, ENABLE_Z: true } });
  assert.throws(() => resolvePresets({ configurePresets: [{ name: "x", inherits: "x" }] }), /circular/);
});

test("las guias generadas tienen enlaces y anclas resolubles y solo el script local de apariencia", () => {
  for (const lang of LANGS) for (const [source, spanish] of Object.entries(pages)) {
    const file = localized(spanish, lang);
    const markdown = read(lang === "es" ? `docs/${source}` : `docs/i18n/${lang}/${source}`);
    assert.doesNotMatch(markdown, /\]\([^)]*\\/, `Enlace no portable: ${source}`);
    const html = read(file);
    assert.ok(markdown.length > 1000, source);
    assert.match(html, new RegExp(`<html lang="${lang === "en" ? "en-US" : lang}">`));
    for (const code of LANGS) assert.ok(html.includes(`hreflang="${code === "en" ? "en-US" : code}" href="${localized(spanish, code)}"`), `${file}: falta alternativo ${code}`);
    assert.match(html, /Bricohams Radio Workspace<\/title>/);
    const scripts = [...html.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)].map(match => match[0]);
    assert.deepEqual(scripts, ['<script src="appearance.js" defer></script>'], file);
    assert.match(html, /script-src 'self'/, file);
    assert.doesNotMatch(html.replace(scripts[0], ""), /<script|\son\w+=|javascript:|\sstyle=/i, file);
    assert.ok(ALLOWED_FILES.includes(file), file);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, `ID duplicado: ${file}`);
    for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^https?:/.test(link)) continue;
      const [target, anchor] = link.split("#");
      const resolved = target.split("?")[0] || file;
      assert.ok(ALLOWED_FILES.includes(resolved), `${file}: enlace no servido ${link}`);
      assert.ok(fs.existsSync(path.join(root, resolved)), `${file}: enlace roto ${link}`);
      if (anchor) assert.ok(read(resolved).includes(`id="${anchor}"`), `${file}: ancla rota ${link}`);
    }
  }
});

test("la referencia OpenGD77 incluye las familias de identificacion y revisiones de descarga", () => {
  const text = read("ayuda-opengd77-modelos.html").replace(/[^a-z0-9]/gi, "").toUpperCase();
  for (const model of ["GD77", "GD77S", "DM1801", "DM1801A", "RD5R", "MD9600",
    "RT90", "MDUV380", "RT3S", "MDUV390", "DM1701", "RT84", "MD2017",
    "DM1701RGB", "DM32", "UV008", "MD380", "10WPLUS"]) {
    assert.ok(text.includes(model), `modelo/revision sin documentar: ${model}`);
  }
  assert.match(read("ayuda-opengd77.html"), /128 KiB/);
  assert.match(read("ayuda-opengd77.html"), /MCU/);
});

test("las nuevas referencias distinguen Egzumer V1, Karina PY32 y compatibilidad multiboot no demostrada", () => {
  const egzumer = read("docs/AYUDA-EGZUMER.md");
  const pack = read("docs/AYUDA-PACK-DIM0S.md");
  const karina = read("docs/KARINA.md");
  assert.match(egzumer, /7607f0a4bd6203d1f06b70556fc1ce0d7399d6b3/);
  assert.match(egzumer, /Apache License 2\.0/);
  assert.match(egzumer, /no MIT/);
  assert.equal([...egzumer.matchAll(/^\| ENABLE_[A-Z0-9_]+ \| [01] \|/gm)].length, 41);
  assert.match(pack, /52b41c182dd82c1fbdc027dc2da7bbcb02c7d79c/);
  for (const value of ["0x08010AF5", "0x08010B39",
    "81328890f55739d917fe9531feb76179b28db2a80672e1383dfb76917a13ee82",
    "40467077e32273392da6ff735ff69c0e40779c9236477e4ead287add645db4d4"]) {
    assert.ok(pack.includes(value), value);
  }
  assert.match(pack, /No se modifica una/);
  assert.match(karina, /AYUDA-PACK-DIM0S\.md/);
  assert.match(karina, /V3 y UV-K1/);
  assert.doesNotMatch(read("firmware-core.js"), /Dim0s|egzumer/);
});

test("el generador escapa HTML y codigo, renderiza tablas y rechaza enlaces ejecutables", () => {
  const output = render("# Prueba\n\n## Opciones\n\n<script>x</script>\n\n| A | B |\n| --- | --- |\n| `ENABLE_A` | **ON** |\n\n1. Uno\n   continuacion\n2. Dos\n\n```text\n<img onerror=x>\n```", "AYUDA-FIRMWARES.md");
  assert.match(output.body, /&lt;script&gt;x&lt;\/script&gt;/);
  assert.match(output.body, /<th scope="col">A<\/th>/);
  assert.match(output.body, /<code>ENABLE_A<\/code>/);
  assert.match(output.body, /<li>Uno continuacion<\/li>/);
  assert.match(output.body, /&lt;img onerror=x&gt;/);
  assert.throws(() => render("[x](javascript:alert)", "AYUDA-FIRMWARES.md"), /Esquema/);
  assert.throws(() => render("```\nsin cerrar", "AYUDA-FIRMWARES.md"), /sin cerrar/);
  assert.throws(() => render("[x](inexistente.md)", "AYUDA-FIRMWARES.md"), /roto/);
});

test("las imagenes de las guias son locales y llegan a servidor, Pages e instaladores", async () => {
  const images = helpImages();
  assert.ok(images.length >= 12, images.join());
  const installer = read("scripts/build-installers.sh");
  assert.ok(installer.includes('cp "$root"/docs/atlas/*.jpg "$root"/docs/atlas/*.svg'));
  for (const image of images) {
    assert.ok(ALLOWED_FILES.includes(image), `no servida: ${image}`);
    assert.match(image, /^docs\/atlas\/[a-z0-9-]+\.(jpg|svg)$/);
  }
  const output = render("# T\n\n![Mapa](atlas/trama-serie.svg)", "ATLAS-UV-K5-V3.md");
  assert.match(output.body, /<img src="docs\/atlas\/trama-serie\.svg" alt="Mapa" loading="lazy">/);
  assert.throws(() => render("![x](https://example.com/a.png)", "ATLAS-UV-K5-V3.md"), /no permitida/);
  assert.throws(() => render("![x](../package.json)", "ATLAS-UV-K5-V3.md"), /no permitida/);
  assert.throws(() => render("![x](atlas/no-existe.jpg)", "ATLAS-UV-K5-V3.md"), /rota/);
  for (const svg of images.filter(name => name.endsWith(".svg"))) assert.doesNotMatch(read(svg), /<script|\son\w+=|href=/i, svg);
  const server = createServer({}, {});
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    for (const [file, type] of [["docs/atlas/k1-view-a.jpg", "image/jpeg"], ["docs/atlas/bloques-v3.svg", "image/svg+xml"]]) {
      const response = await fetch(`${base}/${file}`);
      assert.equal(response.status, 200, file);
      assert.equal(response.headers.get("content-type"), type);
    }
    assert.equal((await fetch(`${base}/docs/ATLAS-UV-K5-V3.md`)).status, 404);
  } finally { server.close(); }
});

test("el atlas V3 y la puesta en marcha cubren hardware, protocolo y todas las fases", () => {
  const atlas = read("docs/ATLAS-UV-K5-V3.md");
  for (const value of ["PY32F071", "BK4829", "PY25Q16", "0x08002800", "0x1D800", "0x010000", "0x0514", "0x0519",
    "16 6C 14 E6 2E 91 0D 40 21 35 D5 40 13 03 E9 80", "0x0bc11477", "7.00.07", "13.3.rel1", "Apache-2.0"]) {
    assert.ok(atlas.includes(value), value);
  }
  const quansheng = read("docs/AYUDA-QUANSHENG.md");
  for (let phase = 0; phase <= 11; phase++) assert.match(quansheng, new RegExp(`^\\| ${phase}\\. `, "m"), `fase ${phase}`);
  assert.match(quansheng, /## Volver a fabrica y recuperacion/);
  for (const page of ["ayuda.html", "app.js", "README.md"]) {
    assert.ok(read(page).includes("puesta-en-marcha-de-0-a-100"), page);
    assert.ok(/ayuda-atlas-uv-k5-v3\.html|ATLAS-UV-K5-V3\.md/.test(read(page)), page);
  }
});

test("los ejemplos solo incluyen binarios abiertos con licencia y hashes correctos", () => {
  const { createHash } = require("node:crypto");
  const base = path.join(root, "examples", "firmware");
  for (const dir of fs.readdirSync(base)) {
    const files = fs.readdirSync(path.join(base, dir));
    assert.ok(files.includes("LICENSE") && files.includes("SHA256SUMS"), dir);
    const sums = read(`examples/firmware/${dir}/SHA256SUMS`).trim().split("\n").map(line => line.split(/\s+\*?/));
    for (const [hash, name] of sums) {
      assert.equal(createHash("sha256").update(fs.readFileSync(path.join(base, dir, name))).digest("hex"), hash, `${dir}/${name}`);
    }
    for (const file of files.filter(name => /\.(bin|uf2)$/.test(name))) assert.ok(sums.some(([, name]) => name === file), `sin hash: ${file}`);
  }
  assert.match(read("examples/firmware/f4hwn-v6.3.0/LICENSE"), /Apache License/);
  const index = read("docs/BINARIOS-TERCEROS.md");
  for (const value of ["03107b6f600e7fa95105af8324cff349c0f17fe30db249c14d11e79baa8da97a", "21.09.2026.zip",
    "f8484c13c994e920649d7b7bc2b98a98a76cfd0836865e5995a00627fc0c2887", "OpenGD77_DM32_20260704.bin"]) assert.ok(index.includes(value), value);
  assert.doesNotMatch(index, /radio-firmware-archive/, "no se enlaza el repositorio privado");
  for (const page of ["ayuda-ejemplos.html", "ayuda-binarios-terceros.html"]) assert.ok(read("ayuda.html").includes(`href="${page}"`), page);
});

test("iniciacion al satelite y antenas: guia propia, cifras simuladas y piezas STL publicadas", () => {
  const guide = read("docs/INICIACION-SATELITE.md");
  for (const value of ["no es una traducción literal", "PT2VM", "BH Satélite", "ANTENAS-SATELITE.md", "EA5KAO"]) {
    assert.ok(guide.includes(value), `guia: ${value}`);
  }
  const antennas = read("docs/ANTENAS-SATELITE.md");
  assert.ok(antennas.includes("no construido ni medido"));
  for (const name of ["pinza-elemento", "bloque-excitado", "empunadura", "cubo-dipolo-v"]) {
    assert.ok(antennas.includes(`../hardware/antenas/stl/${name}.stl`), name);
    const stl = fs.readFileSync(path.join(root, "hardware/antenas/stl", `${name}.stl`));
    assert.equal(stl.length, 84 + 50 * stl.readUInt32LE(80), `STL binario valido: ${name}`);
  }
  for (const value of ["1011", "969", "904", "1030", "505"]) assert.ok(antennas.includes(value), `cota ${value}`);
  for (const page of ["ayuda-iniciacion-satelite.html", "ayuda-antenas-satelite.html"]) {
    assert.equal(Object.values(pages).filter(target => target === page).length, 1, page);
    assert.ok(read("ayuda.html").includes(`href="${page}"`), page);
    assert.ok(ALLOWED_FILES.includes(page), page);
  }
  for (const id of ["pase-orbital", "doppler", "estacion-bh", "memorias-fm", "antena-yagi", "antena-dipolo-v", "piezas-stl"]) {
    const svg = read(`docs/atlas/sat-${id}.svg`);
    assert.doesNotMatch(svg, /<script|\son[a-z]+=|href=/i, id);
    assert.ok(ALLOWED_FILES.includes(`docs/atlas/sat-${id}.svg`), id);
  }
});

test("DM-32UV, Karina y enlaces de comunidad documentan fuentes, licencias y la ruta de compilacion", () => {
  const dm32 = read("docs/DM32UV-FIRMWARE.md");
  for (const value of ["HR_C7000", "FD6818", "RadioFoundry", "make BOARD=dm32", "hrc7000_codec.py", "serial_loader.py",
    "BFUV32-V2", "0x0300C000", "PTT + SK1", "uso comercial", "OpenGD77_DM32_20260704.bin", "no publica fuentes"]) {
    assert.ok(dm32.includes(value), `DM32: ${value}`);
  }
  assert.doesNotMatch(dm32, /github\.com\/Brico-Hams\/dm32uv-opengd77-port/, "repositorio privado enlazado");
  const karina = read("docs/KARINA.md");
  for (const value of ["## 12. Investigacion de comunidad", "fagci-mod v1.2.1", "PUNKTRACKER", "21.09.2026", "Especificacion funcional"]) {
    assert.ok(karina.includes(value), `Karina: ${value}`);
  }
  const links = read("docs/ENLACES-COMUNIDAD.md");
  assert.match(links, /K5Quan\/Robzyl_K1_/);
  assert.doesNotMatch(links, /disk\.yandex|t\.me\//, "sin descargas directas ni grupos");
  for (const page of ["ayuda-dm32uv.html", "ayuda-enlaces-comunidad.html"]) assert.ok(read("ayuda.html").includes(`href="${page}"`), page);
});

test("las imagenes Bricohams documentan captura RX, multipreset RAM y sus limites Beta", () => {
  for (const name of ["docs/BRICOHAMS-FIRMWARE.md", "ayuda-bricohams.html"]) {
    const text = read(name);
    for (const value of ["--module spectrum", "VFO-PRO", "118044", "13440/16384",
      "WAIT SAMPLES", "ENTER 8 DIGITS", "SPAN OUT OF BAND", "SAVE 2 PRESETS",
      "BLACKLIST FULL", "GAIN LIMIT", "524288", "CSS SEARCH...", "CSS NEEDS FM"]) {
      assert.ok(text.includes(value), `${name}: ${value}`);
    }
    assert.match(text, /no transmite|no transmitir/);
    assert.match(text, /no escriben EEPROM/);
    assert.match(text, /sin ARDF\/Satelites/);
    assert.doesNotMatch(text, /pendientes adaptador y construccion de imagen dedicada/);
  }
});
test("CAT RX documenta protocolo experimental, seguimiento web y limites de hardware", () => {
  for (const name of ["docs/BRICOHAMS-FIRMWARE.md", "ayuda-bricohams.html"]) {
    const text = read(name);
    for (const value of ["CAT RX Bricohams v1", "0x7B00", "0x7B01", "113868",
      "12384/16384", "3000 ms", "CAT TIMEOUT", "CAT READY RX", "no significa aplicado",
      "no es cifrado ni autenticacion", "Seguimiento de pase web implementado",
      "CatPassTracker", "2000 ms", "750 ms", "cliente USB experimental con seguimiento orbital SGP4"]) {
      assert(text.includes(value), `${name}: ${value}`);
    }
  }
});
test("los presets BHSP distinguen archivos locales de persistencia EEPROM", () => {
  for (const name of ["docs/BRICOHAMS-FIRMWARE.md", "ayuda-bricohams.html"]) {
    const text = read(name);
    for (const value of ["Transferencia de presets a archivos implementada", "0x7B10", "0x7B11",
      "208 bytes", "5000 ms", "CRC incorrecto no sustituye la tabla",
      "no equivale a persistencia EEPROM", "no escribe EEPROM", "118044"]) {
      assert(text.includes(value), `${name}: ${value}`);
    }
  }
});
test("estadisticas ARDF explican observaciones manuales, limites y ausencia de GPS", () => {
  for (const name of ["docs/BRICOHAMS-FIRMWARE.md", "ayuda-bricohams.html"]) {
    const text = read(name);
    for (const value of ["Estadisticas ARDF por baliza implementadas", "113960", "12576/16384",
      "0x7B20", "0x7B21", "65535", "connectionSession", "No es deteccion automatica",
      "no un evento por pulsacion ni un recorrido GPS", "no es cifrado/autenticacion"]) {
      assert(text.includes(value), `${name}: ${value}`);
    }
  }
});
test("Android documenta las funciones reales, permisos y limites de la APK", () => {
  for (const name of ["docs/ANDROID.md", "ayuda-android.html"]) {
    const value = read(name);
    for (const marker of ["0.9.0-beta", "SQLite", "WAV PCM", "LoTW", "no ejecutadas",
      "GPS", "No se fusionan sesiones", "rollback", "Cien pruebas host", "instrumentation-", "cancelacion de respaldo/escritura", "no hace rollback", "CelesTrak", "SatNOGS DB", "Natural Earth", "WAV 16 kHz mono", "Grabaciones de pases", "0x7B02", "Editor de canales Quansheng por USB", "0x051D", "D023N", "60 segundos",
      "Estadisticas e historial ARDF", "Haversine", "No es recorrido completo", "222.39016",
      "Captura de microfono Morse y Robot36", "RECORD_AUDIO", "Conceder permiso no graba",
      "2880000", "No se reanuda", "no valida recepcion RF real",
      "Importar ADIF con vista previa", "campos no conservados", "Buscar contactos", "no duplica",
      "SSTV Robot36 desde WAV", "320x240", "VIS", "paridad par", "No admite 44.1 kHz", "15 en los de color",
      "Satelites SGP4 y seguimiento de pases", "Rhino 1.7.15", "satellite.js 6.0.1", "500 ms", "no reanuda",
      "CDC ACM", "usb-serial-for-android 3.9.0", "3000 ms", "0x7B00", "no son cifrado ni autenticacion"]) {
      assert(value.includes(marker), `${name}: ${marker}`);
    }
  }
  assert(read("scripts/build-installers.sh").includes("ayuda-android.html"));
});

test("la auditoria conserva limites fisicos, snapshots distintos y presupuesto RAM real", () => {
  for (const name of ["docs/VALIDACION-INTEGRAL-V3-ANDROID.md", "ayuda-validacion-v3-android.html"]) {
    const text = read(name);
    for (const marker of ["Auditoria en curso", "No se han", "instrumentation-", "2296162",
      "2161962", "4160", "no declara revision linea por", "no un esquema electrico"]) {
      assert(text.includes(marker), `${name}: ${marker}`);
    }
  }
  for (const name of ["docs/BRICOHAMS-FIRMWARE.md", "ayuda-bricohams.html"]) {
    const text = read(name);
    for (const marker of ["8320 bytes", "8192", "no resuelve por si", "paquete y scratch"]) {
      assert(text.includes(marker), `${name}: ${marker}`);
    }
  }
  assert(read("docs/DEPLOYMENT.md").includes("no por ruta"));
  assert(read("docs/DECISIONS.md").includes("no la URL"));
  assert(read("docs/BRANDING.md").includes("--accent: #f7941d"));
});

test("la revision de entrega mantiene cada peticion y distingue objetivos de capacidades", () => {
  const markdown = read("docs/ESTADO-ENTREGA.md");
  const ids = [...markdown.matchAll(/^\| ([A-Z0-9]+-\d+) \|/gm)].map(match => match[1]);
  const expected = ["USB-01", "USB-02", "FW-01", "WEB-01", "FW-02", "FW-03", "FW-04", "FW-05",
    "FW-06", "FW-07", "FW-08", "FW-09", "HELP-01", "HELP-02", "PRO-01", "DATA-01", "DATA-02",
    "DATA-03", "GD77-01", "GD77-02", "ANY-01", "ANY-02", "ANY-03", "ANY-04", "CAT-01", "CAT-02",
    "AND-01", "AND-02", "AND-03", "AND-04", "AND-05", "AND-06", "AND-07", "AND-08",
    "BRAND-01", "BRAND-02", "DOC-01", "REL-01", "REL-02", "REL-03"];
  assert.deepEqual(ids, expected);
  const html = read("ayuda-entrega.html");
  for (const id of expected) assert(html.includes(id), id);
  assert.match(html, /incompleta/);
  assert.match(read("ayuda.html"), /href="ayuda-entrega.html"/);
  assert.doesNotMatch(read("AUTHORS.md"), /Copilot|ChatGPT|inteligencia artificial/i);
  for (const name of ["docs/KARINA.md", "ayuda-karina.html"]) {
    assert(read(name).includes("archivos BHSP"), name);
    assert(!read(name).includes("no tienen persistencia ni transferencia USB"), name);
  }
});

test("ayuda, instaladores y paginas estaticas incluyen todas las guias sin exponer fuentes arbitrarias", async () => {
  const help = read("ayuda.html");
  const installer = read("scripts/build-installers.sh");
  for (const file of Object.values(pages)) {
    assert.ok(help.includes(`href="${file}"`), `entrada ausente: ${file}`);
    assert.ok(installer.includes(file), `instalador omite ${file}`);
  }
  assert.ok(installer.includes("help-docs.css"));
  assert.ok(installer.includes('node "$root/scripts/build-help.cjs"'));
  const server = createServer({}, {});
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    for (const file of [...Object.values(pages), "help-docs.css"]) {
      const response = await fetch(`${base}/${file}`);
      assert.equal(response.status, 200, file);
      assert.equal(await response.text(), fs.readFileSync(path.join(root, file), "utf8"));
      assert.match(response.headers.get("content-type"), file.endsWith(".css") ? /text\/css/ : /text\/html/);
    }
    assert.equal((await fetch(`${base}/docs/AYUDA-FIRMWARES.md`)).status, 404);
  } finally { server.close(); }
});

test("las traducciones en, de, it y fr existen y conservan estructura, codigo, tablas y enlaces del original", () => {
  assert.deepEqual(LANGS, ["es", "en", "de", "it", "fr"]);
  assert.deepEqual(TRANSLATIONS, ["en", "de", "it", "fr"]);
  const documents = [...Object.keys(pages).filter(source => source !== "F4HWN-PRESETS.md").map(source => `docs/${source}`), "README.md"];
  for (const lang of TRANSLATIONS) {
    assert.equal(read(`docs/i18n/${lang}/F4HWN-PRESETS.md`), presetMarkdown(lang));
    checkOptionCoverage(read(`docs/i18n/${lang}/AYUDA-OPCIONES-F4HWN.md`));
    assert.ok(read("README.md").includes(`href="README.${lang}.md"`), `README sin enlace a ${lang}`);
    assert.ok(read("ayuda.html").includes(`href="ayuda-firmwares.${lang}.html"`), `ayuda.html sin enlace a ${lang}`);
    for (const document of documents) {
      const target = translatedPath(document, lang);
      assert.ok(fs.existsSync(path.join(root, target)), `falta traduccion ${target}`);
      assert.deepEqual(checkParity(read(document), path.join(root, document), read(target), path.join(root, target), lang), [], target);
    }
  }
});

test("el indice de referencias incluye todas las guias y sus cinco versiones", () => {
  for (const lang of LANGS) {
    const file = localized("ayuda-referencias.html", lang);
    const html = read(file);
    assert.ok(ALLOWED_FILES.includes(file), file);
    for (const guide of Object.values(pages)) {
      for (const code of LANGS) assert.ok(html.includes(`href="${localized(guide, code)}"`), `${file}: ${guide}/${code}`);
    }
    assert.ok(html.includes("README" + (lang === "es" ? "" : `.${lang}`) + ".md"));
    for (const guide of Object.values(pages)) {
      const body = read(localized(guide, lang));
      assert.ok(body.includes(`href="${file}"`), `${guide}: indice no enlazado`);
      if (lang !== "it") {
        const locale = lang === "en" ? "en-US" : lang;
        assert.ok(body.includes(`href="quansheng.html?lang=${locale}"`));
        assert.ok(body.includes(`href="index.html?lang=${locale}"`));
      }
    }
  }
});

test("las referencias tecnicas y las anclas Markdown se localizan de forma estable", () => {
  const document = "README.md";
  for (const lang of TRANSLATIONS) {
    const target = translatedPath(document, lang);
    const text = read(target);
    for (const source of ["ARCHITECTURE", "BRANDING", "DECISIONS", "DEPLOYMENT"]) {
      assert.ok(text.includes(`](docs/i18n/${lang}/${source}.md`), `${target}: ${source}`);
      assert.ok(!text.includes(`](docs/${source}.md`), `${target}: referencia al original`);
    }
    assert.equal(relink(text, path.join(root, document), path.join(root, target), lang), text);
    const changed = text.replace(/#([^)\s]+)\)/, "#no-such-heading)");
    assert.ok(checkParity(read(document), path.join(root, document), changed, path.join(root, target), lang)
      .some(error => error.includes("ancla Markdown inexistente")));
    const guide = read(`docs/i18n/${lang}/AYUDA-QUANSHENG.md`);
    const anchor = markdownHeadingIds(guide).find(value => value.includes("100"));
    assert.ok(text.includes(`AYUDA-QUANSHENG.md#${anchor}`), `${target}: ancla traducida`);
    const html = render(`[Guide](AYUDA-QUANSHENG.md#${anchor})`, `i18n/${lang}/ANDROID.md`, { lang }).body;
    assert.ok(html.includes(`href="ayuda-quansheng.${lang}.html#puesta-en-marcha-de-0-a-100"`), html);
  }
});

test("las referencias del original espanol tambien tienen anclas Markdown validas", () => {
  const { DOCUMENTS } = require("../scripts/i18n.cjs");
  for (const document of DOCUMENTS) {
    const text = read(document);
    const file = path.join(root, document);
    assert.deepEqual(checkParity(text, file, text, file, "es"), [], document);
    assert.equal(relink(text, file, file, "es"), text, document);
  }
});

test("el centro completo de ayuda se genera reproduciblemente en cuatro idiomas sin resumir secciones", () => {
  assert.deepEqual(HELP_LANGS, ["es", "en", "fr", "de"]);
  const original = read("ayuda.html");
  const protectedContent = html => [...html.matchAll(/<(code|pre|kbd|samp)\b[^>]*>[\s\S]*?<\/\1>/g)].map(match => match[0]);
  const sections = html => [...html.matchAll(/<(?:section|nav|details|summary|h[1-6])\b[^>]*>/g)]
    .map(match => match[0].replace(/aria-label="[^"]*"/g, 'aria-label=""'));
  const externalLinks = html => [...html.matchAll(/href="(https?:[^"]+)"/g)].map(match => match[1]);
  for (const lang of HELP_LANGS) {
    const file = helpCenterFile(lang);
    const html = read(file);
    assert.equal(html, renderHelpCenter(original, lang), `${file}: HTML reproducible`);
    assert.match(html, new RegExp(`<html lang="${lang === "en" ? "en-US" : lang}">`));
    assert.deepEqual(sections(html), sections(original), `${file}: todas las secciones y preguntas`);
    assert.deepEqual(protectedContent(html), protectedContent(original), `${file}: comandos, diagnosticos y protocolos exactos`);
    assert.deepEqual(externalLinks(html), externalLinks(original), `${file}: fuentes y licencias`);
    assert.ok(html.includes('id="help-filter"'), `${file}: buscador conservado`);
    assert.ok(html.includes('src="ui-i18n.js"'), `${file}: interfaz localizada`);
    for (const code of HELP_LANGS) {
      assert.ok(html.includes(`hreflang="${code === "en" ? "en-US" : code}" href="${helpCenterFile(code)}"`));
    }
    if (lang !== "es") {
      assert.ok(html.includes(`href="index.html?lang=${lang === "en" ? "en-US" : lang}"`));
      for (const guide of Object.values(pages)) {
        assert.ok(html.includes(`href="${localized(guide, lang)}"`), `${file}: guia localizada ${guide}`);
      }
      assert.throws(() => renderHelpCenter(original.replace("Cómo funciona la aplicación", "Nueva explicacion sin traducir"), lang), /Falta traducir ayuda/);
      assert.throws(() => renderHelpCenter(original.replace("Buscar en la ayuda", "Firmware"), lang), /Traducciones de ayuda sin usar/);
    }
  }
  assert.equal(helpCenterFile("it"), "ayuda.html", "el italiano conserva su centro de ayuda original");
  assert.throws(() => renderHelpCenter(original, "it"), /Idioma de ayuda no soportado/);
});

test("los centros de ayuda y los indices conservan idioma, consultas y anclas sin perder el italiano", () => {
  const { localizedURL } = require("../ui-i18n.js");
  const base = "https://example.invalid/Radio-Web-install/index.html";
  for (const lang of HELP_LANGS) {
    const locale = lang === "en" ? "en-US" : lang;
    for (const source of ["ayuda.html", "ayuda.en.html", "ayuda.fr.html", "ayuda.de.html"]) {
      assert.equal(localizedURL(`${source}?x=1&lang=es#drivers`, base, locale),
        `${helpCenterFile(lang)}?x=1&lang=${locale}#drivers`);
    }
    const file = helpCenterFile(lang);
    for (const [, link] of read(file).matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^https?:/.test(link)) continue;
      const [target, anchor] = link.split("#");
      const resolved = target.split("?")[0] || file;
      assert.ok(ALLOWED_FILES.includes(resolved), `${file}: recurso no servido ${link}`);
      assert.ok(fs.existsSync(path.join(root, resolved)), `${file}: recurso inexistente ${link}`);
      if (anchor && anchor !== "main") assert.ok(read(resolved).includes(`id="${anchor}"`), `${file}: ancla inexistente ${link}`);
    }
  }
  for (const lang of LANGS) {
    assert.ok(read(localized("ayuda-referencias.html", lang)).includes(`href="${helpCenterFile(lang)}"`));
    assert.ok(read("ayuda.html").includes(`href="${localized("ayuda-firmwares.html", lang)}"`));
    const html = render("[Drivers](../ayuda.html#drivers)", "DEPLOYMENT.md", { lang }).body;
    assert.ok(html.includes(`href="${helpCenterFile(lang)}#drivers"`));
  }
});

test("el servidor y todos los instaladores sirven los cuatro centros completos de ayuda", async () => {
  const installer = read("scripts/build-installers.sh");
  const server = createServer({}, {});
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    for (const lang of HELP_LANGS) {
      const file = helpCenterFile(lang);
      assert.ok(installer.includes(file), `instalador omite ${file}`);
      const response = await fetch(`${base}/${file}?lang=${lang === "en" ? "en-US" : lang}`);
      assert.equal(response.status, 200, file);
      assert.match(response.headers.get("content-type"), /text\/html/);
      assert.equal((await response.text()).replace(/\r\n/g, "\n"), read(file));
    }
    assert.equal((await fetch(`${base}/docs/i18n/help-center.json`)).status, 404, "los recursos de traduccion no se exponen");
  } finally { server.close(); }
});
