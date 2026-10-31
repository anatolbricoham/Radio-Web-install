"use strict";
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const root = path.join(__dirname, "..");
const catalog = require("../f4hwn-options.js").F4HWN_OPTIONS;
const localCatalog = require("../docs/bricohams-options-v6.1.0.json");
const history = require("../docs/f4hwn-history-presets.json");
const pages = Object.freeze({
  "AYUDA-FIRMWARES.md": "ayuda-firmwares.html",
  "AYUDA-CONFIGURACION.md": "ayuda-configuracion.html",
  "AYUDA-QUANSHENG.md": "ayuda-quansheng.html",
  "AYUDA-OPCIONES-F4HWN.md": "ayuda-opciones-f4hwn.html",
  "F4HWN-PRESETS.md": "ayuda-presets-f4hwn.html",
  "AYUDA-ARDF.md": "ayuda-ardf.html",
  "AYUDA-EGZUMER.md": "ayuda-egzumer.html",
  "AYUDA-PACK-DIM0S.md": "ayuda-pack-dim0s.html",
  "AYUDA-OPENGD77.md": "ayuda-opengd77.html",
  "AYUDA-OPENGD77-MODELOS.md": "ayuda-opengd77-modelos.html",
  "AYUDA-ANYTONE.md": "ayuda-anytone.html",
  "KARINA.md": "ayuda-karina.html",
  "BRICOHAMS-FIRMWARE.md": "ayuda-bricohams.html",
  "ESTADO-ENTREGA.md": "ayuda-entrega.html",
  "ANDROID.md": "ayuda-android.html",
  "VALIDACION-INTEGRAL-V3-ANDROID.md": "ayuda-validacion-v3-android.html",
  "ATLAS-UV-K5-V3.md": "ayuda-atlas-uv-k5-v3.html",
  "DM32UV-FIRMWARE.md": "ayuda-dm32uv.html",
  "ENLACES-COMUNIDAD.md": "ayuda-enlaces-comunidad.html",
  "BINARIOS-TERCEROS.md": "ayuda-binarios-terceros.html",
  "EJEMPLOS.md": "ayuda-ejemplos.html",
  "INICIACION-SATELITE.md": "ayuda-iniciacion-satelite.html",
  "ANTENAS-SATELITE.md": "ayuda-antenas-satelite.html",
  "ARCHITECTURE.md": "ayuda-arquitectura.html",
  "BRANDING.md": "ayuda-marca.html",
  "DECISIONS.md": "ayuda-decisiones.html",
  "DEPLOYMENT.md": "ayuda-despliegue.html"
});
// Spanish is the original; the other languages are translations kept in docs/i18n/<lang>/ with the same file names.
const LANGS = Object.freeze(["es", "en", "de", "it", "fr"]);
const TRANSLATIONS = Object.freeze(LANGS.slice(1));
const UI = Object.freeze({
  es: { name: "Español", skip: "Saltar al contenido", help: "Ayuda", app: "Ayuda de la aplicacion", library: "Biblioteca de firmware",
    toc: "En esta guia", tocLabel: "Contenido de esta guia", languages: "Idioma", description: "ayuda de Bricohams por modelo y version.",
    footer: "Documento generado desde el Markdown versionado. Consulta las fuentes y limites de cada guia.", back: "Volver al indice", notice: "",
    references: "Documentacion y referencias", referenceNote: "Todas las guias de esta lista estan disponibles en los cinco idiomas. Los enlaces entre guias conservan el idioma elegido. Los repositorios, manuales y fuentes externas conservan su idioma original; no se afirma que sus autores ofrezcan traducciones.",
    support: "Ayuda y preguntas frecuentes", readme: "Presentacion del proyecto", document: "Documento", versions: "Versiones por idioma" },
  en: { name: "English (US)", skip: "Skip to content", help: "Help", app: "App help", library: "Firmware library",
    toc: "In this guide", tocLabel: "Contents of this guide", languages: "Language", description: "Bricohams help by model and version.",
    footer: "Document generated from the versioned Markdown. Check the sources and limits of each guide.", back: "Back to the index",
    notice: "Translation of the Spanish original. If there is any discrepancy, the Spanish version prevails.",
    references: "Documentation and references", referenceNote: "All guides in this list are available in five languages. Links between guides preserve the selected language. External repositories, manuals, and sources retain their original language; we do not claim their authors provide translations.",
    support: "Help and frequently asked questions", readme: "Project overview", document: "Document", versions: "Language versions" },
  de: { name: "Deutsch", skip: "Zum Inhalt springen", help: "Hilfe", app: "App-Hilfe", library: "Firmware-Bibliothek",
    toc: "In dieser Anleitung", tocLabel: "Inhalt dieser Anleitung", languages: "Sprache", description: "Bricohams-Hilfe nach Modell und Version.",
    footer: "Aus dem versionierten Markdown erzeugtes Dokument. Beachte die Quellen und Grenzen jeder Anleitung.", back: "Zurück zum Index",
    notice: "Übersetzung des spanischen Originals. Bei Abweichungen gilt die spanische Fassung.",
    references: "Dokumentation und Referenzen", referenceNote: "Alle Anleitungen dieser Liste sind in fünf Sprachen verfügbar. Links zwischen Anleitungen behalten die gewählte Sprache bei. Externe Repositories, Handbücher und Quellen behalten ihre Originalsprache; Übersetzungen durch deren Autoren werden nicht zugesichert.",
    support: "Hilfe und häufige Fragen", readme: "Projektübersicht", document: "Dokument", versions: "Sprachversionen" },
  it: { name: "Italiano", skip: "Vai al contenuto", help: "Aiuto", app: "Aiuto dell'app (spagnolo)", library: "Libreria firmware",
    toc: "In questa guida", tocLabel: "Contenuto di questa guida", languages: "Lingua", description: "aiuto Bricohams per modello e versione.",
    footer: "Documento generato dal Markdown versionato. Consulta le fonti e i limiti di ogni guida.", back: "Torna all'indice",
    notice: "Traduzione dell'originale spagnolo. In caso di discrepanza prevale la versione spagnola.",
    references: "Documentazione e riferimenti", referenceNote: "Tutte le guide in questo elenco sono disponibili in cinque lingue. I collegamenti tra le guide conservano la lingua scelta. Repository, manuali e fonti esterne mantengono la lingua originale; non si afferma che i loro autori offrano traduzioni.",
    support: "Aiuto e domande frequenti (spagnolo)", readme: "Presentazione del progetto", document: "Documento", versions: "Versioni linguistiche" },
  fr: { name: "Français", skip: "Aller au contenu", help: "Aide", app: "Aide de l'application", library: "Bibliothèque de firmware",
    toc: "Dans ce guide", tocLabel: "Contenu de ce guide", languages: "Langue", description: "aide Bricohams par modèle et version.",
    footer: "Document généré à partir du Markdown versionné. Consultez les sources et les limites de chaque guide.", back: "Retour à l'index",
    notice: "Traduction de l'original espagnol. En cas de divergence, la version espagnole fait foi.",
    references: "Documentation et références", referenceNote: "Tous les guides de cette liste sont disponibles en cinq langues. Les liens entre guides conservent la langue choisie. Les dépôts, manuels et sources externes gardent leur langue originale ; nous ne prétendons pas que leurs auteurs proposent des traductions.",
    support: "Aide et questions fréquentes", readme: "Présentation du projet", document: "Document", versions: "Versions linguistiques" }
});
const localized = (file, lang) => lang === "es" ? file : file.replace(/\.html$/, `.${lang}.html`);
const HELP_LANGS = Object.freeze(["es", "en", "fr", "de"]);
const SIBLING_DOCUMENTS = Object.freeze(["AUTHORS.md", "ACKNOWLEDGEMENTS.md", "SUPPORT.md", "SECURITY.md",
  "hardware/antenas/README.md", "precompiled/sources/README.md", "test-bench/schema.md"]);
const helpCenterFile = lang => localized("ayuda.html", lang === "it" ? "es" : lang);
// The Spanish HTML is the only structural source. Every prose unit must have an
// explicit translation; commands, exact diagnostics and third-party names stay verbatim.
function renderHelpCenter(original, lang) {
  assert(HELP_LANGS.includes(lang), `Idioma de ayuda no soportado: ${lang}`);
  if (lang === "es") return original;
  const resource = require("../docs/i18n/help-center.json");
  assert.deepEqual(resource.languages, ["en-US", "fr", "de"]);
  const position = ["en", "fr", "de"].indexOf(lang) + 1;
  const entries = new Map(resource.translations.map(row => {
    assert(row.length === 4 && row.every(value => typeof value === "string" && value.trim()), `Traduccion incompleta: ${row[0]}`);
    assert(row.slice(1).every(value => !/[<>]/.test(value)), `HTML no permitido en traduccion: ${row[0]}`);
    return [row[0], row[position]];
  }));
  assert(entries.size === resource.translations.length, "Texto duplicado en traducciones de ayuda");
  const verbatim = new Set(resource.verbatim);
  const used = new Set();
  const translate = text => {
    const source = text.trim();
    if (!/[\p{L}]/u.test(source) || verbatim.has(source)) return text;
    assert(entries.has(source), `Falta traducir ayuda/${lang}: ${source}`);
    used.add(source);
    return text.replace(/\S(?:[\s\S]*\S)?/, entries.get(source));
  };
  const stack = [];
  const voidTags = new Set(["meta", "link", "input", "br", "img", "hr"]);
  let html = original.replace(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g, token => {
    if (!token.startsWith("<")) {
      return stack.some(tag => ["code", "pre", "kbd", "samp", "script", "style"].includes(tag)) ? token : translate(token);
    }
    const tag = /^<\/?([\w-]+)/.exec(token)?.[1];
    if (!tag) return token;
    if (token.startsWith("</")) stack.splice(stack.lastIndexOf(tag));
    else if (!voidTags.has(tag)) stack.push(tag);
    token = token.replace(/(aria-label|placeholder)="([^"]*)"/g, (_, name, value) =>
      `${name}="${translate(value).replace(/"/g, "&quot;")}"`);
    if (tag === "meta" && /name="description"/.test(token)) {
      token = token.replace(/content="([^"]*)"/, (_, value) => `content="${translate(value).replace(/"/g, "&quot;")}"`);
    }
    if (tag === "a" && !/\s(?:hreflang|lang)=/.test(token)) {
      token = token.replace(/href="([^"]+)"/, (_, href) => {
        const [file, hash] = href.split("#");
        const target = /^ayuda(?:-[\w-]+)?\.html$/.test(file) ? localized(file, lang)
          : /^(index|quansheng|opengd77|anytone)\.html$/.test(file) ? `${file}?lang=${lang === "en" ? "en-US" : lang}` : file;
        return `href="${target}${hash === undefined ? "" : `#${hash}`}"`;
      });
    }
    return token;
  });
  assert.equal(used.size, entries.size, `Traducciones de ayuda sin usar: ${[...entries.keys()].filter(key => !used.has(key)).join(" | ")}`);
  html = html.replace('<html lang="es">', `<html lang="${lang === "en" ? "en-US" : lang}">`);
  return html;
}
function buildHelpCenters() {
  const original = fs.readFileSync(path.join(root, "ayuda.html"), "utf8").replace(/\r\n/g, "\n");
  for (const lang of HELP_LANGS.filter(code => code !== "es")) {
    fs.writeFileSync(path.join(root, helpCenterFile(lang)), renderHelpCenter(original, lang));
  }
}
const escape = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const slug = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function optionNames() {
  return [...new Set(Object.values(catalog.presets).flatMap(preset => Object.keys(preset.options)))].sort();
}
function checkOptionCoverage(text) {
  for (const name of allOptionNames()) assert(text.includes(`\`${name}\``), `Falta explicar ${name}`);
}
function resolvePresets(catalog) {
  const visiting = new Set();
  function resolve(name) {
    assert(!visiting.has(name), `Herencia circular de presets: ${name}`);
    const preset = catalog.configurePresets.find(item => item.name === name);
    assert(preset, `Preset no encontrado: ${name}`);
    visiting.add(name);
    const values = {};
    const parents = preset.inherits ? [].concat(preset.inherits) : [];
    for (const parent of parents.reverse()) Object.assign(values, resolve(parent));
    Object.assign(values, preset.cacheVariables);
    visiting.delete(name);
    return values;
  }
  return Object.fromEntries(catalog.configurePresets.filter(preset => !preset.hidden).map(preset => {
    const options = Object.fromEntries(Object.entries(resolve(preset.name)).flatMap(([name, value]) => {
      if (name !== "DEV" && !name.startsWith("ENABLE_")) return [];
      if (typeof value === "boolean") return [[name, value]];
      if (/^(ON|OFF|TRUE|FALSE)$/i.test(String(value))) return [[name, /^(ON|TRUE)$/i.test(String(value))]];
      return [];
    }));
    return [preset.name, options];
  }));
}
function allOptionNames() {
  const historical = history.versions.filter(version => version.status === "verified")
    .flatMap(version => Object.values(resolvePresets(version.presets)).flatMap(options => Object.keys(options)));
  return [...new Set([...optionNames(), ...historical])].sort();
}
const PRESET_TEXT = Object.freeze({
  es: { title: "F4HWN: valores de todas las opciones por preset", generated: "Documento generado por `npm run build:help`; no editar las filas a mano.",
    version: "Version", source: "Fuente", sourceLink: "presets del commit", na: "N/D", option: "Opcion",
    legend: ["ON = incluido por defecto; OFF = desactivado; N/D = no expuesto en ese preset.",
      "N/D no significa OFF ni permite inferir el default interno de CMake.",
      "Las tablas describen decisiones de compilacion, no el valor actual de los menus de tu radio."],
    explain: "Explicacion de cada opcion y dependencias", localCommit: "Commit local fijado",
    local: ["La tabla siguiente es una instantanea de los presets originales de ese commit,",
      "guardada en bricohams-options-v6.1.0.json, no los valores v6.3.0.",
      "Las dos imagenes entregadas Fusion/Labs cambian ENABLE_VOX a OFF respecto",
      "a estos defaults. Todas sus opciones efectivas constan en build-info.json.",
      "FieldOps y Transfer son perfiles admitidos por el builder pero no compilados",
      "en la validacion inicial. Ver [guia Bricohams](BRICOHAMS-FIRMWARE.md)."],
    historical: "Versiones historicas", snapshot: (date, count) => `Instantanea consultada el ${date}: ${count} versiones fijadas por commit.`,
    history: ["Se resuelve herencia CMake, con prioridad al primer padre y al hijo.",
      "Los perfiles son los declarados en las fuentes; NO todos tienen una imagen",
      "publicada ni estan expuestos por el formulario web. Por ejemplo Fusion_ y",
      "Service_ son nombres internos de presets v6.3.0, no nuevas releases.",
      "Las fuentes/snapshots conservan su licencia upstream, no se reclasifican MIT.",
      "La disponibilidad de ediciones y restricciones se explican en",
      "[Quansheng y versiones](AYUDA-QUANSHENG.md)."],
    published: "Presets publicados", exact: "Fuente exacta", missing: "No se encontro CMakePresets.json; no se infieren valores.",
    sha: "SHA-256 del archivo de presets" },
  en: { title: "F4HWN: values of every option per preset", generated: "Document generated by `npm run build:help`; do not edit the rows by hand.",
    version: "Version", source: "Source", sourceLink: "presets of the commit", na: "N/A", option: "Option",
    legend: ["ON = included by default; OFF = disabled; N/A = not exposed in that preset.",
      "N/A does not mean OFF and does not let you infer the internal CMake default.",
      "The tables describe build decisions, not the current value of your radio menus."],
    explain: "Explanation of each option and its dependencies", localCommit: "Pinned local commit",
    local: ["The following table is a snapshot of the original presets of that commit,",
      "stored in bricohams-options-v6.1.0.json, not the v6.3.0 values.",
      "The two delivered Fusion/Labs images switch ENABLE_VOX to OFF compared",
      "with these defaults. All their effective options are listed in build-info.json.",
      "FieldOps and Transfer are profiles accepted by the builder but not compiled",
      "in the initial validation. See the [Bricohams guide](BRICOHAMS-FIRMWARE.md)."],
    historical: "Historical versions", snapshot: (date, count) => `Snapshot checked on ${date}: ${count} versions pinned by commit.`,
    history: ["CMake inheritance is resolved, with priority to the first parent and to the child.",
      "The profiles are those declared in the sources; NOT all of them have a published",
      "image or are exposed by the web form. For example Fusion_ and",
      "Service_ are internal v6.3.0 preset names, not new releases.",
      "Sources/snapshots keep their upstream license; they are not relicensed as MIT.",
      "Edition availability and restrictions are explained in",
      "[Quansheng and versions](AYUDA-QUANSHENG.md)."],
    published: "Published presets", exact: "Exact source", missing: "CMakePresets.json was not found; no values are inferred.",
    sha: "SHA-256 of the presets file" },
  de: { title: "F4HWN: Werte aller Optionen je Preset", generated: "Von `npm run build:help` erzeugtes Dokument; Zeilen nicht von Hand bearbeiten.",
    version: "Version", source: "Quelle", sourceLink: "Presets des Commits", na: "k. A.", option: "Option",
    legend: ["ON = standardmäßig enthalten; OFF = deaktiviert; k. A. = in diesem Preset nicht vorhanden.",
      "k. A. bedeutet nicht OFF und erlaubt keinen Rückschluss auf den internen CMake-Standardwert.",
      "Die Tabellen beschreiben Build-Entscheidungen, nicht den aktuellen Wert der Menüs deines Funkgeräts."],
    explain: "Erklärung jeder Option und ihrer Abhängigkeiten", localCommit: "Festgelegter lokaler Commit",
    local: ["Die folgende Tabelle ist eine Momentaufnahme der Original-Presets dieses Commits,",
      "gespeichert in bricohams-options-v6.1.0.json, nicht die Werte von v6.3.0.",
      "Die beiden ausgelieferten Fusion/Labs-Images setzen ENABLE_VOX gegenüber",
      "diesen Standardwerten auf OFF. Alle wirksamen Optionen stehen in build-info.json.",
      "FieldOps und Transfer sind vom Builder akzeptierte Profile, wurden aber",
      "in der ersten Validierung nicht kompiliert. Siehe [Bricohams-Anleitung](BRICOHAMS-FIRMWARE.md)."],
    historical: "Historische Versionen", snapshot: (date, count) => `Momentaufnahme vom ${date}: ${count} per Commit festgelegte Versionen.`,
    history: ["Die CMake-Vererbung wird aufgelöst, mit Vorrang für den ersten Elternteil und das Kind.",
      "Die Profile sind die in den Quellen deklarierten; NICHT alle haben ein veröffentlichtes",
      "Image oder werden im Webformular angeboten. Zum Beispiel sind Fusion_ und",
      "Service_ interne Preset-Namen von v6.3.0, keine neuen Releases.",
      "Quellen/Snapshots behalten ihre Upstream-Lizenz und werden nicht als MIT umlizenziert.",
      "Verfügbarkeit der Editionen und Einschränkungen werden erklärt in",
      "[Quansheng und Versionen](AYUDA-QUANSHENG.md)."],
    published: "Veröffentlichte Presets", exact: "Genaue Quelle", missing: "CMakePresets.json wurde nicht gefunden; es werden keine Werte abgeleitet.",
    sha: "SHA-256 der Preset-Datei" },
  it: { title: "F4HWN: valori di tutte le opzioni per preset", generated: "Documento generato da `npm run build:help`; non modificare le righe a mano.",
    version: "Versione", source: "Fonte", sourceLink: "preset del commit", na: "N/D", option: "Opzione",
    legend: ["ON = incluso per impostazione predefinita; OFF = disattivato; N/D = non esposto in quel preset.",
      "N/D non significa OFF e non permette di dedurre il valore predefinito interno di CMake.",
      "Le tabelle descrivono scelte di compilazione, non il valore attuale dei menu della tua radio."],
    explain: "Spiegazione di ogni opzione e delle dipendenze", localCommit: "Commit locale fissato",
    local: ["La tabella seguente è un'istantanea dei preset originali di quel commit,",
      "salvata in bricohams-options-v6.1.0.json, non i valori v6.3.0.",
      "Le due immagini consegnate Fusion/Labs portano ENABLE_VOX a OFF rispetto",
      "a questi valori predefiniti. Tutte le opzioni effettive sono in build-info.json.",
      "FieldOps e Transfer sono profili accettati dal builder ma non compilati",
      "nella validazione iniziale. Vedi la [guida Bricohams](BRICOHAMS-FIRMWARE.md)."],
    historical: "Versioni storiche", snapshot: (date, count) => `Istantanea consultata il ${date}: ${count} versioni fissate per commit.`,
    history: ["L'ereditarietà CMake viene risolta, con priorità al primo genitore e al figlio.",
      "I profili sono quelli dichiarati nei sorgenti; NON tutti hanno un'immagine",
      "pubblicata né sono esposti dal modulo web. Per esempio Fusion_ e",
      "Service_ sono nomi interni di preset v6.3.0, non nuove release.",
      "Sorgenti/snapshot mantengono la loro licenza upstream, non sono riclassificati come MIT.",
      "La disponibilità delle edizioni e le restrizioni sono spiegate in",
      "[Quansheng e versioni](AYUDA-QUANSHENG.md)."],
    published: "Preset pubblicati", exact: "Fonte esatta", missing: "CMakePresets.json non trovato; nessun valore viene dedotto.",
    sha: "SHA-256 del file dei preset" },
  fr: { title: "F4HWN : valeurs de toutes les options par preset", generated: "Document généré par `npm run build:help` ; ne pas modifier les lignes à la main.",
    version: "Version", source: "Source", sourceLink: "presets du commit", na: "N/D", option: "Option",
    legend: ["ON = inclus par défaut ; OFF = désactivé ; N/D = non exposé dans ce preset.",
      "N/D ne signifie pas OFF et ne permet pas de déduire la valeur interne par défaut de CMake.",
      "Les tableaux décrivent des choix de compilation, pas la valeur actuelle des menus de votre radio."],
    explain: "Explication de chaque option et de ses dépendances", localCommit: "Commit local figé",
    local: ["Le tableau suivant est un instantané des presets d'origine de ce commit,",
      "enregistré dans bricohams-options-v6.1.0.json, et non les valeurs v6.3.0.",
      "Les deux images livrées Fusion/Labs passent ENABLE_VOX à OFF par rapport",
      "à ces valeurs par défaut. Toutes leurs options effectives figurent dans build-info.json.",
      "FieldOps et Transfer sont des profils acceptés par le builder mais non compilés",
      "lors de la validation initiale. Voir le [guide Bricohams](BRICOHAMS-FIRMWARE.md)."],
    historical: "Versions historiques", snapshot: (date, count) => `Instantané consulté le ${date} : ${count} versions figées par commit.`,
    history: ["L'héritage CMake est résolu, avec priorité au premier parent et à l'enfant.",
      "Les profils sont ceux déclarés dans les sources ; ils n'ont PAS tous une image",
      "publiée et ne sont pas tous proposés par le formulaire web. Par exemple Fusion_ et",
      "Service_ sont des noms internes de presets v6.3.0, pas de nouvelles versions.",
      "Les sources/instantanés conservent leur licence upstream, ils ne sont pas relicenciés en MIT.",
      "La disponibilité des éditions et les restrictions sont expliquées dans",
      "[Quansheng et versions](AYUDA-QUANSHENG.md)."],
    published: "Presets publiés", exact: "Source exacte", missing: "CMakePresets.json introuvable ; aucune valeur n'est déduite.",
    sha: "SHA-256 du fichier de presets" }
});
function presetMarkdown(lang = "es") {
  const t = PRESET_TEXT[lang];
  assert(t, `Idioma no soportado: ${lang}`);
  const value = (options, name) => Object.hasOwn(options, name) ? (options[name] ? "ON" : "OFF") : t.na;
  const header = names => [`| ${t.option} | ${names.join(" | ")} |`, `| --- | ${names.map(() => "---").join(" | ")} |`];
  const columns = Object.keys(catalog.presets);
  const lines = [
    `# ${t.title}`, "", t.generated, "",
    `${t.version}: **${catalog.upstream.tag}**. Commit: \`${catalog.upstream.commit}\`.`,
    `${t.source}: [${t.sourceLink}](https://github.com/${catalog.upstream.repository}/blob/${catalog.upstream.commit}/CMakePresets.json).`,
    "", ...t.legend, "", `[${t.explain}](AYUDA-OPCIONES-F4HWN.md).`, "", ...header(columns)
  ];
  for (const name of optionNames()) lines.push(`| \`${name}\` | ${columns.map(column => value(catalog.presets[column].options, name)).join(" | ")} |`);
  lines.push("", "## Bricohams local v6.1.0", "", `${t.localCommit}: \`${localCatalog.upstream.commit}\`.`, ...t.local, "",
    ...header(Object.keys(localCatalog.presets)));
  const localNames = [...new Set(Object.values(localCatalog.presets).flatMap(preset => Object.keys(preset.options)))].sort();
  for (const name of localNames) lines.push(`| \`${name}\` | ${Object.values(localCatalog.presets).map(preset => value(preset.options, name)).join(" | ")} |`);
  lines.push("", `## ${t.historical}`, "", t.snapshot(history.inspectedAt, history.versions.length), ...t.history, "");
  for (const version of history.versions) {
    lines.push(`## ${t.published} ${version.tag}`, "",
      `Commit: \`${version.commit}\`. [${t.exact}](https://github.com/${history.repository}/blob/${version.commit}/CMakePresets.json).`, "");
    if (version.status !== "verified") {
      lines.push(t.missing, "");
      continue;
    }
    const resolved = resolvePresets(version.presets);
    const columns = Object.keys(resolved);
    const names = [...new Set(Object.values(resolved).flatMap(options => Object.keys(options)))].sort();
    lines.push(`${t.sha}: \`${version.sha256}\`.`, "", ...header(columns));
    for (const name of names) lines.push(`| \`${name}\` | ${columns.map(column => value(resolved[column], name)).join(" | ")} |`);
    lines.push("");
  }
  return lines.join("\n");
}

function destination(target, source, lang = "es") {
  if (/^https?:\/\//i.test(target)) return target;
  assert(!/^[a-z][a-z0-9+.-]*:/i.test(target), `Esquema no permitido en ${source}: ${target}`);
  const [file, anchor] = target.split("#");
  const resolved = file ? path.resolve(root, "docs", path.dirname(source), file) : path.join(root, "docs", source);
  assert(fs.existsSync(resolved), `Enlace local roto en ${source}: ${target}`);
  const asset = path.relative(root, resolved).replace(/\\/g, "/");
  if (/^precompiled\/chirp\/(f4hwn\.chirp\.v6\.1\.0\.py|manifest\.json|NOTICE\.txt|COPYING\.txt)$/.test(asset)) return asset;
  const relative = path.relative(path.join(root, "docs"), resolved).replace(/\\/g, "/");
  const page = pages[relative.replace(/^i18n\/[a-z]{2}\//, "")];
  // App pages and the full help center stay local and preserve the guide language.
  if (path.dirname(resolved) === root && resolved.endsWith(".html")) {
    const name = path.basename(resolved);
    const nativeLocale = lang === "en" ? "en-US" : lang;
    return `${name === "ayuda.html" ? helpCenterFile(lang) : name}${lang !== "it" && /^(index|quansheng|opengd77|anytone)\.html$/.test(name) ? `?lang=${nativeLocale}` : ""}${anchor ? `#${anchor}` : ""}`;
  }
  const found = canonical(target, path.join(root, "docs", source));
  const original = page && path.join(root, "docs", relative.replace(/^i18n\/[a-z]{2}\//, ""));
  const index = original && found && markdownHeadingIds(fs.readFileSync(original, "utf8")).indexOf(found.anchor);
  const pageAnchor = index >= 0 && original ? headingIds(fs.readFileSync(original, "utf8"))[index] : anchor;
  return page
    ? `${file ? localized(page, lang) : ""}${pageAnchor ? `#${pageAnchor}` : ""}`
    : `https://github.com/Brico-Hams/Radio-Web-install/blob/main/${path.relative(root, resolved).replace(/\\/g, "/")}${anchor ? `#${anchor}` : ""}`;
}
// Images are local files under docs/ only, so pages keep working offline and under img-src 'self'.
function image(target, source) {
  assert(/\.(jpg|png|svg)$/i.test(target) && !/^[a-z][a-z0-9+.-]*:/i.test(target), `Imagen no permitida en ${source}: ${target}`);
  const docs = path.join(root, "docs");
  const resolved = path.resolve(docs, path.dirname(source), target);
  assert(resolved.startsWith(docs + path.sep) && fs.existsSync(resolved), `Imagen rota en ${source}: ${target}`);
  return path.relative(root, resolved).replace(/\\/g, "/");
}
function inline(text, source, lang = "es") {
  const tokens = [];
  const protect = html => {
    tokens.push(html);
    return `\u0000${tokens.length - 1}\u0000`;
  };
  let value = text.replace(/`([^`]+)`/g, (_, code) => protect(`<code>${escape(code)}</code>`));
  value = value.replace(/<(https?:\/\/[^>\s]+)>/gi, (_, target) =>
    protect(`<a href="${escape(target)}" target="_blank" rel="noopener noreferrer">${escape(target)}</a>`));
  value = value.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, target) => {
    const href = destination(target, source, lang);
    const external = /^https?:/i.test(href);
    return protect(`<a href="${escape(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${escape(label)}</a>`);
  });
  value = escape(value).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return value.replace(/\u0000(\d+)\u0000/g, (_, index) => tokens[Number(index)]);
}
// options.ids reuses the Spanish heading ids so anchors stay valid across languages.
function render(markdown, source, { lang = "es", ids } = {}) {
  const lines = markdown.split(/\r?\n/);
  const out = [];
  const headings = [];
  const used = new Map();
  let headingCount = 0;
  let paragraph = [];
  let list = "";
  const endParagraph = () => {
    if (paragraph.length) out.push(`<p>${inline(paragraph.join(" "), source, lang)}</p>`);
    paragraph = [];
  };
  const endList = () => { if (list) out.push(`</${list}>`); list = ""; };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) { endParagraph(); endList(); continue; }
    if (/^ {0,3}```/.test(line)) {
      endParagraph(); endList();
      const code = [];
      while (++i < lines.length && !/^ {0,3}```/.test(lines[i])) code.push(lines[i]);
      assert(i < lines.length, `Bloque de codigo sin cerrar: ${source}`);
      out.push(`<pre><code>${escape(code.join("\n"))}</code></pre>`);
      continue;
    }
    const picture = /^!\[([^\]]+)\]\(([^)\s]+)\)$/.exec(line);
    if (picture) {
      endParagraph(); endList();
      const src = escape(image(picture[2], source));
      out.push(`<figure><a href="${src}"><img src="${src}" alt="${escape(picture[1])}" loading="lazy"></a><figcaption>${escape(picture[1])}</figcaption></figure>`);
      continue;
    }
    const heading = /^(#{1,6}) (.+)$/.exec(line);
    if (heading) {
      endParagraph(); endList();
      const base = slug(heading[2]);
      const count = used.get(base) || 0;
      used.set(base, count + 1);
      const id = ids ? ids[headingCount] : `${base}${count ? `-${count}` : ""}`;
      assert(id, `Titulo sin equivalente en el original: ${source}: ${heading[2]}`);
      headingCount++;
      out.push(`<h${heading[1].length} id="${id}">${inline(heading[2], source, lang)}</h${heading[1].length}>`);
      if (heading[1].length === 2) headings.push({ id, text: heading[2] });
      continue;
    }
    if (line.startsWith("|") && /^\|[\s:|-]+\|$/.test(lines[i + 1] || "")) {
      endParagraph(); endList();
      const cells = row => row.trim().replace(/^\||\|$/g, "").split("|").map(cell => cell.trim());
      out.push('<div class="table-scroll"><table><thead><tr>' +
        cells(line).map(cell => `<th scope="col">${inline(cell, source, lang)}</th>`).join("") + "</tr></thead><tbody>");
      i++;
      while (i + 1 < lines.length && lines[i + 1].startsWith("|")) {
        out.push("<tr>" + cells(lines[++i]).map(cell => `<td>${inline(cell, source, lang)}</td>`).join("") + "</tr>");
      }
      out.push("</tbody></table></div>");
      continue;
    }
    const item = /^\s*(?:([-*])|\d+\.) (.+)$/.exec(line);
    if (item) {
      endParagraph();
      const next = item[1] ? "ul" : "ol";
      if (list !== next) { endList(); list = next; out.push(`<${list}>`); }
      let content = item[2];
      while (i + 1 < lines.length && /^\s{2,}\S/.test(lines[i + 1]) &&
        !/^\s*(?:[-*]|\d+\.) /.test(lines[i + 1])) content += ` ${lines[++i].trim()}`;
      out.push(`<li>${inline(content, source, lang)}</li>`);
      continue;
    }
    endList();
    paragraph.push(line);
  }
  endParagraph(); endList();
  return { body: out.join("\n"), headings };
}
const sourceFor = (source, lang) => lang === "es" ? source : `i18n/${lang}/${source}`;
// Structure that a translation must keep: heading levels, code blocks, images, link targets, inline code and table rows.
function structure(markdown) {
  const lines = markdown.split(/\r?\n/);
  const result = { headings: [], code: [], images: [], links: [], inlineCode: [], tableRows: 0 };
  const text = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^ {0,3}```/.test(line)) {
      const block = [line.trimStart()];
      while (++i < lines.length && !/^ {0,3}```/.test(lines[i])) block.push(lines[i]);
      result.code.push(block.join("\n"));
      continue;
    }
    const picture = /^!\[([^\]]+)\]\(([^)\s]+)\)$/.exec(line);
    if (picture) { result.images.push(picture[2]); continue; }
    const heading = /^(#{1,6}) (.+)$/.exec(line);
    if (heading) result.headings.push({ level: heading[1].length, text: heading[2] });
    if (line.startsWith("|")) result.tableRows++;
    text.push(line);
  }
  const plain = text.join(" ").replace(/`([^`]+)`/g, (_, code) => { result.inlineCode.push(code); return " "; });
  for (const match of plain.matchAll(/<(https?:\/\/[^>\s]+)>/gi)) result.links.push(match[1]);
  for (const match of plain.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) result.links.push(match[2]);
  return result;
}
function headingIds(markdown) {
  const used = new Map();
  return structure(markdown).headings.map(({ text }) => {
    const base = slug(text);
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    return `${base}${count ? `-${count}` : ""}`;
  });
}
function markdownHeadingIds(markdown) {
  const used = new Map();
  return structure(markdown).headings.map(({ text }) => {
    const base = text.toLowerCase().replace(/[`*_]/g, "").replace(/[^\p{L}\p{N}\p{M}\s-]/gu, "").replace(/ /g, "-");
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    return `${base}${count ? `-${count}` : ""}`;
  });
}
const isExternal = target => /^[a-z][a-z0-9+.-]*:/i.test(target);
const repoPath = file => path.relative(root, file).replace(/\\/g, "/");
// Repository path of a link target with translations folded onto their Spanish original.
// A link to a sibling translation that is not written yet still counts when its Spanish original exists.
const fold = relative => relative.replace(/^docs\/i18n\/[a-z]{2}\//, "docs/").replace(/^README\.[a-z]{2}\.md$/, "README.md")
  .replace(/^(ayuda(?:-[^/]+)?)\.(en|de|it|fr)\.html$/, "$1.html")
  .replace(/^(.*)\.(en|fr|de)\.md$/, (match, name) => SIBLING_DOCUMENTS.includes(`${name}.md`) ? `${name}.md` : match);
const exists = resolved => fs.existsSync(resolved) || (fold(repoPath(resolved)) !== repoPath(resolved) &&
  translatable(fold(repoPath(resolved))) && fs.existsSync(path.join(root, fold(repoPath(resolved)))));
function canonical(target, fromFile, fallbackFile) {
  if (isExternal(target)) return { path: target, anchor: "" };
  const [file, anchor = ""] = target.split("#");
  let resolved = file ? path.resolve(path.dirname(fromFile), file) : fromFile;
  if (!exists(resolved) && fallbackFile) resolved = path.resolve(path.dirname(fallbackFile), file);
  if (!exists(resolved)) return null;
  const original = fold(repoPath(resolved));
  if (anchor && resolved.endsWith(".md") && fs.existsSync(resolved)) {
    const text = fs.readFileSync(resolved, "utf8");
    let index = markdownHeadingIds(text).indexOf(anchor);
    if (index < 0) index = headingIds(text).indexOf(anchor);
    if (index >= 0) return { path: original, anchor: markdownHeadingIds(fs.readFileSync(path.join(root, original), "utf8"))[index] };
    const originalText = fs.readFileSync(path.join(root, original), "utf8");
    index = headingIds(originalText).indexOf(anchor);
    if (index >= 0) return { path: original, anchor: markdownHeadingIds(originalText)[index] };
  }
  return { path: original, anchor };
}
const translatable = relative => relative === "README.md" || relative === "docs/FDROID.md" || SIBLING_DOCUMENTS.includes(relative) ||
  (relative.startsWith("docs/") && Object.hasOwn(pages, relative.slice(5)));
function translatedPath(relative, lang) {
  if (lang === "es") return relative;
  if (relative === "docs/FDROID.md" && lang === "it") return relative;
  if (relative === "README.md") return `README.${lang}.md`;
  if (SIBLING_DOCUMENTS.includes(relative)) {
    const sibling = relative.replace(/\.md$/, `.${lang}.md`);
    return fs.existsSync(path.join(root, sibling)) ? sibling : relative;
  }
  return `docs/i18n/${lang}/${relative.slice(5)}`;
}
// Rewrites link and image targets of a translation so they work from its own folder and point to sibling translations.
function relink(markdown, esFile, trFile, lang) {
  const fix = target => {
    if (isExternal(target)) return target;
    const found = canonical(target, trFile, esFile);
    if (!found) return target;
    const destination = found.path === "ayuda.html" ? helpCenterFile(lang) : translatable(found.path) ? translatedPath(found.path, lang)
      : /^ayuda-.+\.html$/.test(found.path) ? localized(found.path, lang) : found.path;
    const destinationFile = path.join(root, destination);
    let anchor = found.anchor;
    if (anchor && translatable(found.path) && fs.existsSync(destinationFile)) {
      const originalText = fs.readFileSync(path.join(root, found.path), "utf8");
      const index = markdownHeadingIds(originalText).indexOf(anchor);
      if (index >= 0) anchor = markdownHeadingIds(fs.readFileSync(destinationFile, "utf8"))[index];
    }
    const relative = path.relative(path.dirname(trFile), path.join(root, destination)).replace(/\\/g, "/") || path.basename(destination);
    return `${path.resolve(trFile) === destinationFile && anchor ? "" : relative}${anchor ? `#${anchor}` : ""}`;
  };
  let fence = false;
  return markdown.split(/(\r?\n)/).map(line => {
    if (/^ {0,3}```/.test(line)) { fence = !fence; return line; }
    if (fence || /^\r?\n$/.test(line)) return line;
    return line.split("`").map((part, index) => index % 2 ? part : part.replace(/(\]\()([^)\s]+)(\))/g, (_, open, target, close) =>
      `${open}${fix(target)}${close}`)).join("`");
  }).join("");
}
function checkParity(esText, esFile, trText, trFile, lang) {
  const es = structure(esText);
  const tr = structure(trText);
  const problems = [];
  const levels = list => list.map(item => item.level).join(",");
  if (levels(es.headings) !== levels(tr.headings)) {
    const index = es.headings.findIndex((item, i) => tr.headings[i]?.level !== item.level);
    problems.push(`titulos: ${es.headings.length} en el original y ${tr.headings.length} en la traduccion; primera diferencia en el titulo ${index + 1} (${es.headings[index]?.text ?? "fin"})`);
  }
  if (es.code.length !== tr.code.length) problems.push(`bloques de codigo: ${es.code.length} frente a ${tr.code.length}`);
  else es.code.forEach((block, i) => { if (block !== tr.code[i]) problems.push(`bloque de codigo ${i + 1} modificado: ${block.split("\n")[1] ?? ""}`); });
  if (es.tableRows !== tr.tableRows) problems.push(`filas de tabla: ${es.tableRows} frente a ${tr.tableRows}`);
  const bag = list => [...list].sort();
  const diff = (a, b) => {
    const rest = [...b];
    const missing = [];
    for (const item of a) {
      const index = rest.indexOf(item);
      if (index < 0) missing.push(item); else rest.splice(index, 1);
    }
    return { missing, extra: rest };
  };
  const code = diff(bag(es.inlineCode), bag(tr.inlineCode));
  if (code.missing.length || code.extra.length) problems.push(`codigo en linea distinto; falta: ${JSON.stringify(code.missing.slice(0, 8))}; sobra: ${JSON.stringify(code.extra.slice(0, 8))}`);
  const targets = (list, file, fallback) => list.map(target => {
    const found = canonical(target, file, fallback);
    return found ? `${found.path}${found.anchor ? `#${found.anchor}` : ""}` : `ROTO:${target}`;
  });
  const links = diff(bag(targets(es.links, esFile)), bag(targets(tr.links, trFile)));
  if (links.missing.length || links.extra.length) problems.push(`enlaces distintos; falta: ${JSON.stringify(links.missing.slice(0, 8))}; sobra: ${JSON.stringify(links.extra.slice(0, 8))}`);
  const images = diff(targets(es.images, esFile), targets(tr.images, trFile));
  if (images.missing.length || images.extra.length) problems.push(`imagenes distintas; falta: ${JSON.stringify(images.missing)}; sobra: ${JSON.stringify(images.extra)}`);
  for (const target of [...tr.links, ...tr.images]) {
    if (isExternal(target)) continue;
    const [file] = target.split("#");
    const resolved = file ? path.resolve(path.dirname(trFile), file) : trFile;
    if (!exists(resolved)) { problems.push(`ruta que no existe desde la traduccion: ${target} (ejecuta --fix)`); continue; }
    const found = canonical(target, trFile);
    if (translatable(found.path) && repoPath(resolved) !== translatedPath(found.path, lang)) problems.push(`enlace al original en vez de a la traduccion: ${target} (ejecuta --fix)`);
    if (target.includes("#") && resolved.endsWith(".md")) {
      const anchor = target.slice(target.indexOf("#") + 1);
      if (!markdownHeadingIds(fs.readFileSync(resolved, "utf8")).includes(anchor)) problems.push(`ancla Markdown inexistente: ${target} (ejecuta --fix)`);
    }
  }
  return problems;
}
function pageHtml({ lang, file, title, body, headings }) {
  const ui = UI[lang];
  const languageTag = code => code === "en" ? "en-US" : code;
  const languages = LANGS.map(code => `<a href="${localized(file, code)}" hreflang="${languageTag(code)}" lang="${languageTag(code)}"${code === lang ? ' aria-current="page"' : ""}>${UI[code].name}</a>`).join(" · ");
  const alternates = LANGS.map(code => `  <link rel="alternate" hreflang="${languageTag(code)}" href="${localized(file, code)}">`).join("\n");
  const appLink = name => `${name}${lang !== "it" ? `?lang=${languageTag(lang)}` : ""}`;
  return `<!doctype html>
<html lang="${languageTag(lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="description" content="${escape(title)}: ${escape(ui.description)}">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'">
  <title>${escape(title)} | Bricohams Radio Workspace</title>
  <link rel="icon" href="bricohams-logo.png" type="image/png">
  <link rel="stylesheet" href="styles.css">
  <script src="appearance.js" defer></script>
  <link rel="stylesheet" href="help-docs.css">
${alternates}
</head>
<body>
  <a class="skip" href="#main">${escape(ui.skip)}</a>
  <main id="main" class="firmware-help">
    <header><a href="${appLink("index.html")}"><img src="bricohams-logo.png" alt="Bricohams" width="240" height="89"></a>
      <nav aria-label="${escape(ui.help)}"><a href="${localized("ayuda-referencias.html", lang)}">${escape(ui.references)}</a> · <a href="${localized("ayuda-firmwares.html", lang)}">${escape(ui.library)}</a> · <a href="${localized("ayuda-atlas-uv-k5-v3.html", lang)}">Atlas UV-K5 V3</a> · <a href="${appLink("quansheng.html")}">Quansheng</a> · <a href="${appLink("opengd77.html")}">OpenGD77</a></nav>
      <nav class="languages" aria-label="${escape(ui.languages)}">${languages}</nav>
    </header>
    <nav class="panel" aria-label="${escape(ui.tocLabel)}"><h2>${escape(ui.toc)}</h2><ul>${headings.map(item => `<li><a href="#${item.id}">${escape(item.text)}</a></li>`).join("")}</ul></nav>
    <article class="panel">${body}</article>
    <footer>${ui.notice ? `<p class="translation-note">${escape(ui.notice)}</p>` : ""}<p>${escape(ui.footer)} <a href="${localized("ayuda-firmwares.html", lang)}">${escape(ui.back)}</a>.</p></footer>
  </main>
</body>
</html>
`;
}
function build() {
  buildHelpCenters();
  const docs = path.join(root, "docs");
  for (const lang of LANGS) {
    const options = path.join(docs, sourceFor("AYUDA-OPCIONES-F4HWN.md", lang));
    assert(fs.existsSync(options), `Falta la traduccion ${lang}: AYUDA-OPCIONES-F4HWN.md`);
    checkOptionCoverage(fs.readFileSync(options, "utf8"));
    fs.mkdirSync(path.dirname(path.join(docs, sourceFor("F4HWN-PRESETS.md", lang))), { recursive: true });
    fs.writeFileSync(path.join(docs, sourceFor("F4HWN-PRESETS.md", lang)), presetMarkdown(lang));
  }
  for (const [source, file] of Object.entries(pages)) {
    const esFile = path.join(docs, source);
    const original = fs.readFileSync(esFile, "utf8");
    const ids = headingIds(original);
    for (const lang of LANGS) {
      const trFile = path.join(docs, sourceFor(source, lang));
      assert(fs.existsSync(trFile), `Falta la traduccion ${lang}: ${source}`);
      const markdown = fs.readFileSync(trFile, "utf8");
      if (lang !== "es") {
        const problems = checkParity(original, esFile, markdown, trFile, lang);
        assert(!problems.length, `Traduccion ${lang}/${source} no equivale al original:\n- ${problems.join("\n- ")}`);
      }
      for (const lang of LANGS) {
        const ui = UI[lang];
        const rows = Object.entries(pages).map(([source, file]) => {
          const title = fs.readFileSync(path.join(docs, sourceFor(source, lang)), "utf8").match(/^# (.+)$/m)[1];
          return `<tr><td><a href="${localized(file, lang)}">${escape(title)}</a></td><td>${LANGS.map(code =>
            `<a href="${localized(file, code)}" lang="${code === "en" ? "en-US" : code}">${UI[code].name}</a>`).join(" · ")}</td></tr>`;
        }).join("\n");
        const readme = lang === "es" ? "README.md" : `README.${lang}.md`;
        const body = `<h1>${escape(ui.references)}</h1><p>${escape(ui.referenceNote)}</p>
<p><a href="https://github.com/Brico-Hams/Radio-Web-install/blob/main/${readme}">${escape(ui.readme)}</a> · <a href="${helpCenterFile(lang)}">${escape(ui.support)}</a></p>
<div class="table-scroll"><table><thead><tr><th scope="col">${escape(ui.document)}</th><th scope="col">${escape(ui.versions)}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
        fs.writeFileSync(path.join(root, localized("ayuda-referencias.html", lang)), pageHtml({
          lang, file: "ayuda-referencias.html", title: ui.references, body, headings: []
        }));
      }
      const title = markdown.match(/^# (.+)$/m)?.[1];
      assert(title, `Falta titulo: ${sourceFor(source, lang)}`);
      const { body, headings } = render(markdown, sourceFor(source, lang), { lang, ids });
      fs.writeFileSync(path.join(root, localized(file, lang)), pageHtml({ lang, file, title, body, headings }));
    }
  }
  console.log(`${Object.keys(pages).length} guias HTML en ${LANGS.length} idiomas (${LANGS.join(", ")}); ${optionNames().length} opciones de interfaz, ${allOptionNames().length} en el historial de ${history.versions.length} versiones.`);
}
if (require.main === module) build();
// Every image referenced by a guide, as a root-relative path: what the server, Pages and installers must ship.
function helpImages() {
  return [...new Set(Object.keys(pages).flatMap(source =>
    [...fs.readFileSync(path.join(root, "docs", source), "utf8").matchAll(/^!\[[^\]]+\]\(([^)\s]+)\)$/gm)]
      .map(match => image(match[1], source))))].sort();
}
module.exports = { build, render, pages, helpImages, optionNames, allOptionNames, resolvePresets, checkOptionCoverage, presetMarkdown,
  HELP_LANGS, helpCenterFile, renderHelpCenter, buildHelpCenters,
  LANGS, TRANSLATIONS, UI, localized, sourceFor, structure, headingIds, markdownHeadingIds, relink, checkParity, translatedPath };
