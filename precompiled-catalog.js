(function (root) {
  "use strict";
  const R = root.RadioWorkspace;
  const IDS = ["bricohams-ardf", "bricohams-satellite", "bricohams-spectrum", "bricohams-labs",
    "bricohams-fusion", "f4hwn-fusion", "f4hwn-fieldops", "f4hwn-transfer", "f4hwn-labs"];
  function validatePrecompiledCatalog(catalog) {
    R.assert(catalog?.format === "bricohams-precompiled-catalog" && catalog.version === 1 &&
      Array.isArray(catalog.entries) && catalog.entries.length > 0 && catalog.entries.length <= IDS.length,
    "Catalogo precompilado no valido.");
    const ids = new Set();
    for (const entry of catalog.entries) {
      R.assert(IDS.includes(entry.id) && !ids.has(entry.id) && entry.path === `precompiled/${entry.id}.bin` &&
        entry.name === `${entry.id}.bin` && /^[a-f0-9]{64}$/.test(entry.sha256) &&
        Number.isInteger(entry.size) && entry.size >= 256 && entry.size <= 0x1d800 &&
        entry.targets?.length === 2 && entry.targets.includes("UV-K1") && entry.targets.includes("UV-K5-V3") &&
        ["beta", "upstream-stable"].includes(entry.stability) && entry.hardwareBootTested === false &&
        typeof entry.edition === "string" && /^[\x20-\x7e]{1,15}$/.test(entry.edition) &&
        ["Bricohams", "Armel F4HWN"].includes(entry.publisher), "Entrada precompilada no valida.");
      const source = new URL(entry.source);
      R.assert(source.protocol === "https:" && source.hostname === "github.com" &&
        (source.pathname === "/Brico-Hams/Radio-Web-install" ||
          /^\/armel\/uv-k1-k5v3-firmware-custom\/releases\/tag\/v6\.\d+\.\d+$/.test(source.pathname)),
      "Fuente precompilada no permitida.");
      ids.add(entry.id);
    }
    return catalog.entries;
  }
  async function verifyPrecompiledImage(entry, bytes) {
    R.assert(bytes instanceof Uint8Array && bytes.length === entry.size &&
      await R.sha256(bytes) === entry.sha256, "Imagen precompilada corrupta: tamano o SHA-256 distinto.");
    R.inspectQuanshengSlotImage(bytes);
    return bytes;
  }
  async function mountPrecompiledCatalog({ model, action, useImage, download, log }) {
    const panel = document.createElement("section");
    panel.id = "precompiled-panel";
    panel.className = "panel firmware-panel";
    panel.innerHTML = `<h2>Catalogo precompilado: instalar sin compilar</h2>
      <p>Imagenes Bricohams y F4HWN oficiales alojadas con esta web. Solo UV-K1 y UV-K5 V3 (PY32); nunca UV-K5 V1. El SHA-256 verifica integridad, no el arranque ni la compatibilidad fisica. Los modulos Bricohams son Beta.</p>
      <p><strong>CHIRP y firmware v6.1.0:</strong> descarga el <a href="precompiled/chirp/f4hwn.chirp.v6.1.0.py" download>controlador F4HWN v6.1.0</a> y cargalo mediante Archivo &gt; Cargar modulo. Selecciona Quansheng / UV-K1 &amp; UV-K5 V3 (F4HWN), no UV-K5 generico, y descarga de nuevo desde la radio. <a href="ayuda-quansheng.html#chirp-v6-1-0">Instrucciones y recuperacion de canales</a>; <a href="precompiled/chirp/manifest.json">origen y SHA-256</a>.</p>
      <p>Una imagen marcada como firmware no soportado sigue siendo de solo lectura: cambiar de firmware o de modelo no convierte ese archivo. Conserva el respaldo y migra sus canales por CSV a la descarga nueva. Antes de escribir, respalda la configuracion y la calibracion; no cargues imagenes de otros modelos.</p>
      <label for="precompiled-entry">Imagen</label><select id="precompiled-entry" disabled><option>Cargando catalogo...</option></select>
      <p id="precompiled-info" role="status">Verificando indice...</p>
      <label class="check"><input id="precompiled-confirm" type="checkbox"> Confirmo modelo y acepto la condicion Beta cuando corresponda.</label>
      <div class="operation-buttons"><button id="precompiled-use" type="button" class="button primary" disabled>Descargar, verificar y preparar para slot</button><button id="precompiled-save" type="button" class="button secondary" disabled>Descargar BIN y manifiesto</button></div>
      <p>Preparar no escribe. Selecciona despues el slot y pulsa Instalar y verificar CRC. No borra CFG, Main ni calibracion. Licencias: <a href="precompiled/LICENSE.txt" target="_blank" rel="noopener noreferrer">GPL Bricohams</a>, <a href="precompiled/APACHE-2.0.txt" target="_blank" rel="noopener noreferrer">Apache upstream</a>; <a href="precompiled/NOTICE.txt" target="_blank" rel="noopener noreferrer">autorias originales</a> y <a href="precompiled/BRICOHAMS-NOTICE.txt" target="_blank" rel="noopener noreferrer">aviso Bricohams</a>. Codigo y reproduccion: <a href="https://github.com/Brico-Hams/Radio-Web-install" target="_blank" rel="noopener noreferrer">repositorio Bricohams</a>.</p>`;
    document.getElementById("radio-operations").before(panel);
    const $ = id => document.getElementById(id);
    const response = await fetch("precompiled/catalog.json", { cache: "no-store", signal: AbortSignal.timeout(15000) });
    R.assert(response.ok, `Catalogo precompilado: HTTP ${response.status}.`);
    const entries = validatePrecompiledCatalog(await response.json());
    $("precompiled-entry").replaceChildren(...entries.map(entry =>
      new Option(`${entry.publisher} / ${entry.edition} / ${entry.version} / ${entry.stability}`, entry.id)));
    $("precompiled-entry").disabled = false;
    const selected = () => entries.find(entry => entry.id === $("precompiled-entry").value);
    let loading = false;
    const state = () => {
      const entry = selected();
      $("precompiled-entry").disabled = loading;
      $("precompiled-confirm").disabled = loading;
      $("precompiled-use").disabled = loading || !entry?.targets.includes(model.value) || !$("precompiled-confirm").checked;
      $("precompiled-save").disabled = loading || !entry || !$("precompiled-confirm").checked;
      $("precompiled-info").textContent = entry ?
        `${entry.size} bytes · SHA-256 ${entry.sha256} · No validado mediante arranque en esta unidad.` : "Selecciona imagen.";
    };
    model.addEventListener("change", () => { $("precompiled-confirm").checked = false; state(); });
    $("precompiled-entry").addEventListener("change", () => { $("precompiled-confirm").checked = false; state(); });
    $("precompiled-confirm").addEventListener("change", state);
    const load = prepare => action("Verificar firmware precompilado", async () => {
      const entry = selected();
      R.assert(entry && $("precompiled-confirm").checked, "Confirma primero modelo e imagen.");
      if (prepare) R.assert(entry.targets.includes(model.value), "Modelo incompatible con el catalogo precompilado.");
      loading = true;
      state();
      try {
        const response = await fetch(entry.path, { cache: "no-store", signal: AbortSignal.timeout(60000) });
        R.assert(response.ok, `Firmware precompilado: HTTP ${response.status}.`);
        const bytes = await verifyPrecompiledImage(entry, new Uint8Array(await response.arrayBuffer()));
        if (prepare) useImage(bytes, entry.edition);
        else {
          download(entry.name, bytes);
          download(`${entry.id}.manifest.json`, JSON.stringify(entry, null, 2), "application/json");
        }
        log(`${entry.edition}: ${entry.sha256}; ${prepare ? "preparado" : "descarga solicitada"}, sin escritura.`);
      } finally { loading = false; state(); }
    });
    $("precompiled-use").addEventListener("click", () => load(true));
    $("precompiled-save").addEventListener("click", () => load(false));
    state();
  }
  const APP_IDS = ["SystemInfo", "BroadcastFM", "Cube3D", "Tetris", "Breakout", "Minesweeper"];
  function validateAppCatalog(catalog) {
    R.assert(catalog?.format === "bricohams-precompiled-apps" && catalog.version === 1 &&
      Array.isArray(catalog.entries) && catalog.entries.length > 0 && catalog.entries.length <= APP_IDS.length,
    "Catalogo de apps no valido.");
    const ids = new Set();
    for (const entry of catalog.entries) {
      R.assert(APP_IDS.includes(entry.id) && !ids.has(entry.id) &&
        entry.path === `precompiled/apps/${entry.id}.app` && entry.name === entry.id &&
        /^[a-f0-9]{64}$/.test(entry.sha256) && Number.isInteger(entry.size) &&
        entry.size > 64 && entry.size <= 64 + 0x1000 + 0xf00 &&
        entry.firmwareRelease === "v6.1.0" && entry.license === "Apache-2.0" &&
        entry.hardwareBootTested === false && entry.abi === 1 && entry.apiMin === 2 &&
        typeof entry.version === "string" && /^\d+\.\d+$/.test(entry.version) &&
        entry.source === `https://github.com/armel/uv-k1-k5v3-firmware-custom/blob/f556a96e73c3e423a00cf473aeb37f827cac05a5/archive/apps/v6.1.0/${entry.id}.app`,
      "Entrada de app precompilada no valida.");
      ids.add(entry.id);
    }
    return catalog.entries;
  }
  async function verifyPrecompiledApp(entry, bytes) {
    R.assert(bytes instanceof Uint8Array && bytes.length === entry.size &&
      await R.sha256(bytes) === entry.sha256, "App precompilada corrupta: tamano o SHA-256 distinto.");
    const { header } = R.parseQuanshengApp(bytes);
    R.assert(header.name === entry.name && header.appVersion === entry.version &&
      header.abi === entry.abi && header.apiMin === entry.apiMin, "App distinta de su manifiesto.");
    return bytes;
  }
  async function mountPrecompiledApps({ model, action, useApp, download, log }) {
    const panel = document.createElement("section");
    panel.className = "panel firmware-panel";
    panel.id = "precompiled-apps-panel";
    panel.innerHTML = `<h2>Catalogo de apps Labs precompiladas</h2>
      <p>Seis apps upstream v6.1.0, sin compilacion. Requieren Labs con ABI 1 y API minima 2; no certificadas por arranque en esta unidad. Una app tiene acceso nativo a la radio: revisar compatibilidad antes de instalar. Preparar no escribe ni ejecuta.</p>
      <label for="precompiled-app-entry">App</label><select id="precompiled-app-entry" disabled></select>
      <p id="precompiled-app-info" role="status">Cargando catalogo...</p>
      <label><input id="precompiled-app-confirm" type="checkbox"> Confirmo modelo, Labs y compatibilidad ABI/API de mi firmware.</label>
      <div class="operation-buttons"><button id="precompiled-app-use" type="button" class="button secondary" disabled>Verificar y preparar app</button><button id="precompiled-app-save" type="button" class="button secondary" disabled>Descargar app y manifiesto</button></div>
      <p>Sin balizas ni apps de socorro en este catalogo de pruebas. <a href="precompiled/APACHE-2.0.txt">Licencia Apache</a>, <a href="precompiled/NOTICE.txt">autoria original</a>. Para instalar, consulta huecos y usa Instalar app y verificar.</p>`;
    document.getElementById("radio-operations").before(panel);
    const $ = id => document.getElementById(id);
    const response = await fetch("precompiled/apps/catalog.json", { cache: "no-store", signal: AbortSignal.timeout(15000) });
    R.assert(response.ok, `Catalogo apps: HTTP ${response.status}.`);
    const entries = validateAppCatalog(await response.json());
    $("precompiled-app-entry").replaceChildren(...entries.map(entry => new Option(`${entry.name} ${entry.version}`, entry.id)));
    let loading = false;
    const selected = () => entries.find(entry => entry.id === $("precompiled-app-entry").value);
    const state = () => {
      const entry = selected();
      $("precompiled-app-entry").disabled = loading;
      $("precompiled-app-confirm").disabled = loading;
      const ready = !loading && entry && $("precompiled-app-confirm").checked;
      $("precompiled-app-use").disabled = !ready || !["UV-K1", "UV-K5-V3"].includes(model.value);
      $("precompiled-app-save").disabled = !ready;
      $("precompiled-app-info").textContent = entry ?
        `${entry.size} bytes · ABI ${entry.abi} · API minima ${entry.apiMin} · ${entry.firmwareRelease} · SHA-256 ${entry.sha256}` : "Selecciona app.";
    };
    for (const control of [model, $("precompiled-app-entry")]) control.addEventListener("change", () => {
      $("precompiled-app-confirm").checked = false; state();
    });
    $("precompiled-app-confirm").addEventListener("change", state);
    const load = prepare => action("Verificar app precompilada", async () => {
      const entry = selected();
      R.assert(entry && $("precompiled-app-confirm").checked, "Confirma la compatibilidad de la app.");
      if (prepare) R.assert(["UV-K1", "UV-K5-V3"].includes(model.value), "Selecciona modelo compatible.");
      loading = true; state();
      try {
        const response = await fetch(entry.path, { cache: "no-store", signal: AbortSignal.timeout(15000) });
        R.assert(response.ok, `App: HTTP ${response.status}.`);
        const bytes = await verifyPrecompiledApp(entry, new Uint8Array(await response.arrayBuffer()));
        if (prepare) useApp(bytes);
        else {
          download(`${entry.id}.app`, bytes);
          download(`${entry.id}.manifest.json`, JSON.stringify(entry, null, 2), "application/json");
        }
        log(`App ${entry.name}: ${prepare ? "preparada" : "descarga solicitada"}, sin escritura ni ejecucion. SHA-256 ${entry.sha256}.`);
      } finally { loading = false; state(); }
    });
    $("precompiled-app-use").addEventListener("click", () => load(true));
    $("precompiled-app-save").addEventListener("click", () => load(false));
    state();
  }
  Object.assign(R, { validatePrecompiledCatalog, verifyPrecompiledImage, mountPrecompiledCatalog,
    validateAppCatalog, verifyPrecompiledApp, mountPrecompiledApps });
  if (typeof module !== "undefined") module.exports = R;
})(globalThis);
