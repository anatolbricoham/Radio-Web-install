# Quansheng: F4HWN, Versionen und Konfiguration

Revision: 26-10-2026. Untersuchte funktionsfähige Basis: Fusion61, Commit
`f556a96e73c3e423a00cf473aeb37f827cac05a5`; modularer Webkatalog v6.3.0,
Commit `ca3a4271386049e7b459b215cef0ad0eea1a30ca`.
Diese Anleitung schreibt Funktionen von v6.1/v6.3 nicht automatisch v4 oder v5 zu.
Wie das Funkgerät intern funktioniert (Pins, Speicher, Protokoll, Bootloader,
Schaltpläne und Fotos): [Technischer Atlas UV-K5 V3](ATLAS-UV-K5-V3.md).

## Einfache Kanäle und Ländervorlagen

Unter Kanäle gibt es drei Schritte: Funkgerät lesen, Vorlage wählen und prüfen/
speichern. Rechts stehen Spanien, UK, USA, Deutschland, Frankreich, Ungarn und Italien
mit Regions-/Bundesstaat- und Ortsfiltern bereit. Je Seite werden 50 Ergebnisse
angezeigt; nichts wird automatisch ausgewählt. Alle auswählen erlaubt höchstens
1024 Kanäle: in den USA zuerst einen Bundesstaat wählen. Hinzufügen ändert nur die
lokale Datei und benötigt einen vorhandenen FM-Speicher. Speichern lädt die Datei
herunter; Schreiben erfordert weiterhin vollständige Sicherung und erneutes Lesen.
Sicherungen, Scanlisten, CSV und Ziehen bleiben unter den erweiterten Optionen.

Quelle ist [HearHam](https://hearham.com/repeaters), dessen API in Online-/Offline-
Apps verwendet werden darf, mit gemeinfreien Verwaltungsgrenzen von Natural Earth.
RepeaterBook wird nicht gespiegelt. Enthalten sind verfügbare aktive VHF/UHF-FM-
Einträge, nicht alle Repeater jedes Landes: besonders Ungarn und Italien haben
geringe Abdeckung. Datum, Gebiet, Betrieb und Berechtigungen prüfen. Töne und
nominelles TX dienen nur zur Information; Import sperrt TX. PMR446 ist optional,
nur RX, nicht für die USA verfügbar und erlaubt kein Senden mit Amateurfunkgeräten.
SAT ergänzt nur nominelle FM-Speicher, ohne Doppler.

Monatsüberflüge umfassen die verbleibenden Tage des UTC-Monats für 75 Referenzpunkte:
europäische Städte und je einen ungefähren Punkt in den 50 US-Bundesstaaten und
Washington DC. Sie gelten nicht landesweit. Koordinaten, Datum, TLE-Epoche und
Mindesthöhe von 10 Grad werden angegeben. Abtastung alle 60 s; mehr als sieben Tage
nach der TLE-Epoche sind Überflüge vorläufig. Keine operativen Pläne und keine
CAT-Übertragung. Vollständiges JSON herunterladen oder im Hintergrund mit eigenen
Koordinaten neu berechnen; vor Betrieb aktuelle TLE und die genaue 24/48-Stunden-
Berechnung unter Satelliten verwenden. Zukünftige Genauigkeit ist nicht garantiert.

Der tägliche GitHub-Actions-Auftrag läuft um 04:35 UTC, lädt Daten, berechnet neu,
testet und veröffentlicht nur bei Erfolg aller Prüfungen. Fehler sind in Actions
sichtbar; die letzte Veröffentlichung bleibt bestehen, ohne erfundene Daten.
Lokal regenerieren mit `npm run fetch:channel-templates` und anschließend
`npm run fetch:template-passes`. Installer enthalten dieselben Dateien;
ihre Offline-Kopie ändert sich erst mit Installation einer neuen Version.

## Live-Viewer und RF-Protokoll

Unter **Kanäle** stehen die beiden Tabellen am Desktop nebeneinander und mobil untereinander.
Direkt unter **Kanäle** das kompatible Modell wählen und Lesen erlauben.
Auf **Verbinden und Kanäle lesen (nur Lesen)** klicken: Links
erscheint die aktive Bank ohne Schreibberechtigung. Rechts PMR446, REMER VHF oder
Bricohams-Murcia-Relais wählen und **Vorlage zum Ziehen vorbereiten** anklicken.
Aus CSV und anderen Katalogen vorbereitete Kanäle erscheinen ebenfalls dort.
Zeilen oder eine Auswahl nach links ziehen oder **Auswahl kopieren** und **Hier einfügen**
verwenden. Katalogkanäle werden nur für RX aus einer bestehenden FM-Speichervorlage
eingefügt; AM und DMR werden nicht umgewandelt. Nur die lokale Kopie ändert sich.
Vor erneutem Lesen speichern: Ersetzen benötigt eine Bestätigung. Schreiben ins Gerät
erfordert weiterhin vollständige Flash-Sicherung, Bestätigung und erneutes Lesen.
Die neue Kanalverbindung startet den Viewer nicht automatisch, damit der Port beim
Lesen frei bleibt.

Hardwaretest am 27.10.2026: USB-Seriell-Gerät COM4, erkannte Firmware F4HWN v6.1.0,
aktive Bank mit 41344 Bytes und 121 FM-Kanälen. Zwei vollständige Lesevorgänge waren bytegleich
(SHA-256 `16f9c8b5ccb9d865ceaca599acf1766737641d8e8285a832680c2f745b02a331`).
Die veröffentlichte Web-App zeigte alle 121 Kanäle und bereitete 16 PMR446 vor.
Einfügen von PMR01 ergab 122 Kanäle ausschließlich in der lokalen Kopie, bei gesperrtem Schreiben.
Nur Identifikation und Lesen wurden gesendet: kein Schreiben, Neustart oder Bankwechsel.
Schreiben ins Gerät und die APK auf einem Telefon sind damit nicht validiert.

Der Viewer erscheint am Anfang des Quansheng-Bereichs. Er startet nach Abschluss der Verbindung:
sofort bei **Nur-Leseverbindung / CAT verbinden** oder nach der Sicherung bei
**Verbinden und sichern**. Er benötigt ein Image mit aktiviertem K5Viewer und ohne
Sperre, die das Protokoll verhindert. Wenn er zehn Sekunden lang keine Frames empfängt,
zeigt er dies an und hält an; er simuliert nicht die Anzeige.

- Echtes LCD mit 128 x 64, PNG-Aufnahme und vom Firmware gemeldeter LED-Status.
- Eine Verbindung und ein Reader. Jeder Vorgang hält zuerst den
  Viewer an, wartet auf den Abschluss der Frames und führt danach den Befehl aus.
  **Viewer und RF-Protokoll starten** setzt ihn fort. **Viewer pausieren** behält die letzte Aufnahme.
- Das RF-Protokoll erscheint ganz unten. Es empfängt RF Log **v2** und den Firmware-Verlauf,
  entfernt Sequenzduplikate und hält höchstens 512 Einträge im RAM.
  RF Log muss aktiviert sein: Fehlende Daten bedeuten nicht, dass keine Signale vorliegen.
- **RF-Protokoll als CSV exportieren** lädt Sequenz, RX/TX/Einschalten, Frequenz,
  Dauer, Speichernummer/-name, Rohmesswert und Akku herunter. Einträgen ohne UTC-Zeit wird
  kein Datum zugewiesen. Die Messwerte sind keine kalibrierten Leistungsmessungen.
  Die CSV entschärft Tabellenkalkulationsformeln.
- Beim erneuten Verbinden wird die vorherige Ansicht geleert, damit keine Funkgeräte vermischt werden. Zuvor exportieren.
  Das Anhalten des Viewers löscht nicht das dauerhafte Funkgeräteprotokoll.

Protokollreferenz: UV Studio, Revision
`e7aa946f6de002559e1aaf3f91765db7fc2ed567`, `k5viewer.js` und `rf-log.js`.
Die lokale Implementierung sendet weder PTT, Tasten, reboot noch persistente Befehle.
Der COM4-Test vom 26-10-2026 empfing **24 LCD-Frames und einen RF-Frame** von der weiterhin
laufenden Firmware, ohne unvollständige Daten. USB-DTR musste aktiviert werden;
Web Serial setzt es für Quansheng ausdrücklich. Das Funkgerät sendete keine gespeicherten
RF-Einträge; daher wird kein physischer Test eines nicht empfangenen Verlaufs behauptet.
Parser des Verlaufs, gegenseitiger Ausschluss, Webanzeige und CSV wurden zusätzlich mit
Test-Frames geprüft. K5Viewer muss in der aktiven Firmware aktiviert sein.

## Vorgefertigter Katalog ohne Build-Werkzeuge

Die Website enthält neun v6.1.0-Images: Bricohams ARDF, Satellite, Spectrum,
Labs und Fusion sowie die offiziellen F4HWN Fusion, FieldOps, Transfer und Labs.
Ein Ordner muss nicht ausgewählt werden. Derselbe Katalog gilt für den lokalen Server
und den statischen Export. Es handelt sich nicht um einen dynamischen Download beliebiger URLs.

### CHIRP v6.1.0

Alle neun Katalogabbilder verwenden das F4HWN-v6.1.0-Protokoll. Der generische
CHIRP-Eintrag **Quansheng / UV-K5** kann das Gerät erkennen, sein Abbild jedoch
als nicht unterstützte Firmware markieren und Bearbeitung sowie Upload sperren.
Das beweist keinen Verbindungsfehler. Dieselbe Version neu zu kompilieren oder
ihre Kennung zu fälschen korrigiert die Treiberauswahl nicht.

1. Vorhandenes Abbild und Sicherungen von Konfiguration/Kalibrierung aufbewahren.
2. Den [offiziellen F4HWN-v6.1.0-Treiber](../../../precompiled/chirp/f4hwn.chirp.v6.1.0.py) herunterladen.
   Diese Python-Datei in CHIRP über **Datei > Modul laden** öffnen.
   Keine Sicherheitsoptionen zum automatischen Laden von Modulen ändern.
3. Unter **Funkgerät > Vom Funkgerät herunterladen** **Quansheng** und
   **UV-K1 & UV-K5 V3 (F4HWN)** sowie den Geräteport auswählen; das Gerät muss
   normal eingeschaltet sein. Neu auslesen und unter anderem Namen speichern.
4. Kanäle aus einer alten Datei als CSV exportieren und in das neue Abbild
   importieren. Frequenzen, Töne, Ablagen und TX-Sperre prüfen; das eingeschränkte
   Abbild nicht umbenennen oder gewaltsam beschreibbar machen.
5. Vor Änderungen eine neue Sicherung erstellen und die Kalibrierung behalten.
   Zur Kanalmigration weder Kalibrierung noch erweiterte Einstellungen hochladen.

Ein mit dem generischen Treiber erstelltes Abbild bleibt schreibgeschützt:
Ein Firmware- oder Modellwechsel konvertiert das Format nicht. Der Beispieltreiber
v6.3.0 gehört zu einer anderen Veröffentlichung; hier v6.1.0 verwenden.
Das [Manifest](../../../precompiled/chirp/manifest.json) legt Quelle und SHA-256 fest;
das unveränderte Modul steht unter GPL-2.0-oder-später, mit
[Lizenz](../../../precompiled/chirp/COPYING.txt) und [Urheberangaben](../../../precompiled/chirp/NOTICE.txt).
Dies beschreibt die korrekte Treiberauswahl, bestätigt jedoch keine physischen
Lese-/Schreib- oder Starttests aller neun Varianten.

1. UV-K1 oder UV-K5 V3 und das Katalog-Image auswählen.
2. Modell und Beta-Status der Bricohams-Ableitungen bestätigen.
3. **Herunterladen, prüfen und für Slot vorbereiten** prüft Größe, SHA-256 und
   PY32-Struktur, bevor das Image freigegeben wird. **BIN und Manifest herunterladen**
   speichert es ohne Vorbereitung oder Schreiben.
4. Slot 1-4 und Namen auswählen und **Installieren und CRC prüfen** drücken. Die Sicherungsschutzmaßnahmen
   bleiben aktiv; Main, CFG und Kalibrierung werden nicht gelöscht.
5. Jeden Slot manuell starten und SysInf sowie Funktionen prüfen.

Bricohams-Images bleiben **Beta ohne vollständige Startvalidierung**,
auch wenn ihr Schreiben in den Flash per CRC geprüft wurde.
Der Katalog bewahrt die ursprünglichen Metadaten: Ein Strukturtest wird dadurch nicht zur
Hardwarezertifizierung. Für andere Versionen ist weiterhin der Katalog offizieller
Releases verfügbar; mit Slots inkompatible Varianten können nur heruntergeladen werden.

Wartung: `npm run publish:firmware` prüft die fünf lokalen Builds mit festgelegten
SHA-256-Werten und ruft das offizielle v6.1.0-Release mit den GitHub-Hashes ab. Erst nach
Prüfung aller Dateien wird der Katalog geschrieben. Die GPL-Lizenzen von Bricohams und Apache-Upstream-Lizenzen
sowie Hinweise werden mitgeliefert. Optionen, integrierte Quell-Hashes und Upstream-Commit stehen in jedem
Eintrag von `precompiled/catalog.json`; Builder und Quellmodule befinden sich in diesem Repository.
Benutzerkonfigurationen und Kalibrierungen sind nicht im Katalog enthalten.

### Physische Programmierung am 26-10-2026 geprüft

Auf dem vom Besitzer als UV-K5 V3 angegebenen Gerät wurden folgende Images geschrieben:

| Slot | Image | Im Funkgerät geprüfte CRC |
| --- | --- | --- |
| 1 | BH ARDF | `47f33dcc` |
| 2 | BH Labs | `273d232d` |
| 3 | BH Satellite | `96d5b68b` |
| 4 | BH Spectrum | `702b5c07` |

Main/Fusion, aktive Konfiguration und Kalibrierung wurden als unverändert bestätigt.
Während des Schreibens wurden keine CFG-Resets, App-Löschungen oder Neustarts gesendet.
Später startete der Besitzer BH Labs manuell; echte Lesevorgänge wurden bestätigt,
wie weiter unten beschrieben. **Start von ARDF, Satellite und
Spectrum sowie Schreibtests von Kanälen sind weiterhin ungeprüft**:
CRCs belegen keine Ausführung.
Verlorene Antworten und eine USB-CDC-Blockierung bei exakt 64 Byte großen Frames wurden festgestellt.
Der Quansheng-Transport hängt außerhalb dieser Frames ein Nullbyte an und
wiederholt bis zu viermal ausschließlich denselben NOR-Block (wie UV Studio);
Löschvorgänge, Resets und Firmware-Ablehnungen werden nie automatisch wiederholt.

Zum Betrieb von Slot 3 (BH Satellite) siehe [Satelliten-Einstieg](INICIACION-SATELITE.md)
und [Satellitenantennen](ANTENAS-SATELITE.md).

### Erweiterte Optionen und Umfang der Wiederherstellung

Das Panel **Eigene Bricohams-Werkzeuge** enthält interne Zugänge zu
Tastatur/Neustart, Hauptfirmware-DFU v6/v7, Sicherung/Wiederherstellung der Kalibrierung,
Logo-Download/-Installation, Flash-Sicherung/-Wiederherstellung, App-Katalog/-Sortierung/-Löschung,
Slots und RF-Filter/-Export. Es öffnet UV Studio nicht, lädt dessen Skripte nicht
und delegiert diese Vorgänge nicht an eine andere Website. Herkunfts- und Lizenzlinks
für Binärdateien bleiben erhalten: Sie sind keine Laufzeitabhängigkeiten der Oberfläche.
Die Stock-Wiederherstellung rekonstruiert den externen Flash und benötigt den DFU-Schritt,
mit verschiedenen Images für UV-K1/UV-K5 V3, wobei die eigene Kalibrierung erhalten bleibt.
Das ist nicht mit **CFG-Bank zurücksetzen** zu verwechseln, das nur eine Bank löscht.

Es gibt native Wartungs- und Werk/DFU-Panels mit eigener Implementierung
des veröffentlichten Protokolls, ohne Oberfläche oder Code von UV Studio zu kopieren.
Zwischen Versionen besteht keine vollständige Funktionsgleichheit: Slots und Kanäle behalten ihren
v6-Ablauf; DFU unterstützt BIN v6 und v7-Pakete FWAT/FWA1. v7-Ressourcen werden nur in der
aktiven Firmware mit übereinstimmender Build ID und neuer Sicherung installiert.
Die gesamte v7-Unterstützung wurde in Simulation getestet, nicht an diesem physischen Funkgerät.
Pausiere den Viewer, bevor du die CAT-Verfolgung startest: Beide teilen sich den Anschluss.
CAT und Viewer sind gesperrt, solange eine Werkswiederherstellung aussteht.

**Hauptfirmware / eigenes DFU:** F4HWN-v6.x-PY32-BIN von 256 Byte bis 118 KiB
oder ein v7-Paket mit FWAT-Trailer und FWA1-Ressourcen auswählen.
Das Paket wird lokal aufgeteilt: Nur das interne Image wird an DFU gesendet.
Grenzen, exakte Längen, Paket-CRC und Ressourcen-CRC werden geprüft.
V7 ohne vollständiges Paket und unbekannte Versionen werden abgelehnt.
Das Image wird anhand von Vektoren, Version und SHA-256 geprüft,
dies garantiert jedoch weder Herkunft noch physische Kompatibilität. Eine vollständige Sicherung
und die Eingabe von `FIRMWARE PRINCIPAL UV-K5-V3` oder `FIRMWARE PRINCIPAL UV-K1` sind erforderlich.
Vorbereiten schreibt nichts; es speichert eine unveränderliche Kopie im Speicher, sperrt andere
Vorgänge und aktiviert die DFU-Schaltfläche. Hier trennen, manuell mit PTT
in DFU wechseln und `DFU PRINCIPAL UV-K5-V3` oder `DFU PRINCIPAL UV-K1` bestätigen.
Zwischen den Schritten weder die Seite schließen noch das Funkgerät wechseln.

Dieser Ablauf ersetzt die interne Firmware, nicht den Bootloader; er löscht nicht den externen Flash
und synchronisiert nicht das externe Main-Image des Multiboots. Der Multiboot-Wähler
kann beim Start ein anderes Image wiederherstellen: Slots prüfen und manuell kontrollieren.
Ein Rollback wird nicht garantiert. Bootloader, konsistente Identifikation,
Seitennummer und Status jedes ACK werden geprüft. DFU bietet kein erneutes Auslesen: Bestätigte
Seiten belegen weder Start noch RF-Funktion. Bei Fehler die Seite, die Sicherung
und dasselbe Funkgerät behalten, um es erneut zu versuchen. Nur in Simulation getestet.

**Externe v7-Ressourcen:** Nach DFU die v7-Firmware normal starten und mit neuer vollständiger Sicherung
verbinden (wenn diese nicht abgeschlossen werden kann, bleibt das Schreiben gesperrt).
Der Bildschirm kann leer sein, solange Ressourcen fehlen. Dasselbe vollständige Paket oder dessen FWA1
unter **Externe v7-Ressourcen** auswählen. Datei prüfen, ohne zu schreiben, und
`RECURSOS UV-K5-V3` oder `RECURSOS UV-K1` zur Installation bestätigen. Aktiver Slot und Build ID werden per
`0x0750` abgefragt; eine abweichende Build ID stoppt den Vorgang vor dem Löschen.

Nur der Ressourcenbereich des aktiven Slots wird per `0x0752` gelöscht; geschrieben wird
in Blöcken von bis zu 128 Byte per `0x0754`, und der 32 Byte große FWA1-Header
wird zuletzt geschrieben. Nur bei Timeout wird derselbe Block erneut versucht
(maximal vier Wiederholungen), niemals Löschungen oder Ablehnungen. `0x0756` validiert
Ressourcen; die abschließende Abfrage muss denselben Slot/dieselbe Build ID, gültigen Status
und geladene Ressourcen melden. Nach jedem Löschversuch wird die Schreibfreigabe widerrufen:
neu verbinden und erneut sichern. Ein physisches erneutes Auslesen eines Bereichs, dessen Adresse hier nicht veröffentlicht ist,
wird nicht angeboten; das Ergebnis ist Firmware-Validierung, kein Bildschirm- oder Startnachweis.
Eine Unterbrechung kann unvollständige Ressourcen hinterlassen: Paket und Sicherung für die Wiederherstellung aufbewahren. Es werden keine
Ressourcen in inaktive Slots installiert und die v6-Speicherkarte wird nicht für v7 verwendet.

**Eigenes RF-Protokoll:** Nach Speichernamen, Frequenz in MHz und RX/TX/Einschalt-Ereignis filtern. Die Filter ändern nur die Ansicht, löschen niemals den empfangenen Verlauf. Auswahl als CSV oder das gesamte Protokoll als JSON `bricohams-rf-log` v1 exportieren. `exportedAt` ist der Exportzeitpunkt, nicht der Ereigniszeitpunkt; `eventUTCProvided` und `calibratedRF` sind falsch. Aus dem Verlauf werden keine UTC-Daten, kalibrierten RSSI-Werte oder Spektrumanalysen erfunden.

**Urheberschaft und Rechte:** Die Implementierung dieser Werkzeuge stammt von Bricohams, Firmware, Apps und Ressourcen Dritter behalten jedoch ihre Lizenzen und Zuschreibungen. Eine Neugestaltung der Website macht diese Dateien nicht zu eigenen Werken und garantiert keine Abwesenheit von Ansprüchen. Apache-/GPL-Hinweise werden nicht entfernt und Stock-Images nicht innerhalb der Website weiterverbreitet.

**Native Fernbedienung:** Im Viewer benötigt sie eine vollständige Sicherung der aktuellen Verbindung, manuelle Freigabe und Bestätigung jeder Taste. Verfügbar sind Ziffern, MENU, auf/ab, EXIT, Stern, Raute und F1/F2, jeweils kurzer oder langer Druck; PTT und globale Tastenkürzel fehlen. Tasten können Einstellungen ändern, F1/F2 je nach Zuordnung Sendefunktionen ausführen. Nicht von reinem RX ausgehen. Nach jeder Übertragung wird die Tastatur erneut deaktiviert. Gemeldet wird nur das Senden über UART; eine Ausführungsbestätigung (ACK) wird nicht erfunden. LCD prüfen. Gesperrt, wenn pausiert, Berechtigung/Verbindung verloren, CAT gestartet oder Werkswiederherstellung ausgeführt wird.

**Nativer Neustart:** Erfordert eine vollständige Sicherung und die Eingabe von `REINICIAR RADIO`, auch im erweiterten Modus. Pausiert den Viewer, sendet einen einzelnen Befehl `0x05DD`, widerruft Berechtigungen und schließt die Verbindung. Keine Wiederholung und keine Behauptung, ein ACK oder einen erfolgreichen Start erhalten zu haben; Funkgerät prüfen und für eine neue Sicherung erneut verbinden. Ändert weder Slot noch CFG-Bank und kann vorübergehenden Zustand verlieren. Tastatur und Neustart wurden in Simulation getestet, nicht am physischen Funkgerät.

**Native Wartung:** Ermöglicht Download/Installation eines Logos als ST7565-BIN oder genaues PNG mit 128 x 64, Export/Wiederherstellung der 512 Byte Kalibrierung und Export/Wiederherstellung des 2 MiB externen Flashs. Schreibvorgänge erfordern eine vollständige Sicherung der aktuellen Verbindung und ausdrückliche Bestätigung. Das Logo wird erneut gelesen und benachbarte Daten werden geprüft. Die Flash-Wiederherstellung bewahrt den gesamten aktuellen Kalibrierungssektor, überspringt identische Sektoren und schreibt Multiboot-Statussektoren zuletzt. Sowohl Backup als auch Restore prüfen die 512 Sektoren zu je 4 KiB anhand der physischen Firmware-CRC: Mit dem Befehl `0x073E` lassen sich die 2 MiB nicht auf einmal abfragen. Die gespeicherte Gesamt-CRC wird lokal über das Image berechnet, dessen Sektoren bereits verglichen wurden. Wiederherstellung von Kalibrierung oder Flash widerruft die Schreibberechtigung: erneut verbinden. Keine Kalibrierung eines anderen Funkgeräts importieren.

**Native Fabrikwiederherstellung, irreversibel:** Kein CFG-Reset. Exaktes Modell wählen und die beiden Stock-BIN über die Links des Assistenten herunterladen. Größe und SHA-256 werden anhand der festgelegten offiziellen Revision `e7aa946f6de002559e1aaf3f91765db7fc2ed567` geprüft; die BIN-Dateien werden nicht weiterverteilt.

1. Vollständige Sicherung außerhalb des Browsers exportieren und beide BIN-Dateien prüfen.
2. Mit demselben normal verbundenen Funkgerät `FABRICA UV-K5-V3` oder `FABRICA UV-K1` bestätigen. Schritt 1 ersetzt Slots, alle Kanalbänke, Apps und Protokolle, bewahrt aber den gesamten Kalibrierungssektor.
3. Vollständige Flash-Prüfung abwarten. Seite nicht schließen oder neu laden:
   Die Freigabe für Schritt 2 existiert nur im Speicher. Vor Abschluss beider Schritte nicht normal starten und Funkgerät nicht wechseln.
4. Trennen drücken; Funkgerät ausschalten und beim Einschalten PTT für DFU gedrückt halten
   (LED an, Bildschirm aus). PTT loslassen, Schritt 2 wählen und
   `DFU UV-K5-V3` oder `DFU UV-K1` bestätigen.
5. Der Assistent prüft Bootloader und Bestätigung jeder Seite. Für V3 wird nur Bootloader
   `7.00.07`, für K1 nur `7.02.02` oder `7.03.xx` akzeptiert.
   Wiederholungen sind bei Timeout auf dieselbe Seite begrenzt, niemals bei Ablehnungen.
   DFU unterstützt kein erneutes Auslesen: Bestätigte Seiten belegen keinen Start.
6. Manuell starten und Version, Empfang und Funktion prüfen.
   Wenn Schritt 2 fehlschlägt, Seite behalten und mit demselben Image wiederholen.
   Wenn Schritt 1 fehlschlägt, weder DFU versuchen noch normal starten: Sicherung behalten,
   hier trennen und die offizielle Wiederherstellung verwenden.

Wartung und DFU wurden mit simulierten Geräten getestet. Die vier offiziellen Stock-Dateien wurden
heruntergeladen und mit dem Produktionsprüfer validiert. **Während dieser Tests wurde am physischen Funkgerät keine vollständige Wiederherstellung von Werk, Kalibrierung, Logo oder Flash ausgeführt.**

| UV-Studio-Option | Auf dieser Website | Zusätzlicher offizieller Zugang |
| --- | --- | --- |
| LCD-Viewer, Aufnahme, kurzer/langer Tastendruck und Neustart | Nativ, gemeinsame Verbindung; Änderungen mit Bestätigung | Offizieller Viewer |
| RF-Protokoll, Verlauf, Filter, CSV/JSON | Nativ, v2; lokaler Export | Andere Ansichten |
| Vorgefertigter Katalog | Nativ, neun festgelegte Images und dynamischer Katalog | Editor-Katalog |
| Slots 1-4, löschen, CRC | Nativ mit Sicherung | Zusätzliche Editor-Optionen |
| CFG 1-4 | Nativer Reset getrennt von Firmware | Bankauswahl am Funkgerät |
| Labs-Apps | Katalog mit sechs Apps, native Auflistung, Export, Installation, Verschieben auf leeren Slot, einzeln/alle löschen und prüfen | Erweiterter Katalog |
| Kalibrierung | Native Sicherung/Wiederherstellung, Bestätigung und erneutes Lesen | Offizielle Wiederherstellung |
| Externer Flash | Native Sicherung/Wiederherstellung, Kalibrierungssektor geschützt | Offizielle Wiederherstellung |
| Hauptfirmware | Natives DFU: BIN v6 oder v7-Paket FWAT/FWA1 | Synchronisiert externes Main nicht |
| v7-Assets | Nativ, nur aktiver Slot mit Build ID, Sicherung und Firmwareprüfung | Keine inaktiven Slots oder physisches erneutes Lesen |
| Logo | Nativ BIN oder PNG 128 x 64 herunterladen/installieren | Offizieller Editor |
| Stock-Fabrik und DFU | Nativer Assistent, zwei Schritte und festgelegte Hashes/Modelle | Offizielle Wiederherstellung |

## Inbetriebnahme von 0 bis 100 %

Vollständiger Ablauf vom gerade ausgepackten Funkgerät bis zu einem konfigurierten,
gesicherten und überprüften Gerät. Jede Phase nennt das Abschlusskriterium.
Die Phasen 9 und 10 sind optional.

| Phase | Aufgabe | Abgeschlossen, wenn | Details |
| --- | --- | --- | --- |
| 0. Identifizieren | Aufkleber unter dem Akku, SysInf und Bootloader-Version | UV-K5 V3, UV-K1 oder andere Revision bekannt | [Versionen](ATLAS-UV-K5-V3.md#versionen-und-ihre-identifikation) |
| 1. PC vorbereiten | Desktop-Chrome oder -Edge, USB-C-Datenkabel oder Kenwood-Kabel, Treiber | Anschluss erscheint und wird von keiner anderen App verwendet | [Treiber](../../../ayuda.html#drivers) und [USB](AYUDA-CONFIGURACION.md#usb-verbindung-betriebsarten-nicht-verwechseln) |
| 2. Sicherungen | Kalibrierung (512 Byte), Konfiguration und, sofern Firmware dies zulässt, vollständiger Flash | Dateien samt SHA-256 außerhalb des Browsers vorhanden | [Kalibrierung](ATLAS-UV-K5-V3.md#kalibrierung) |
| 3. Firmware wählen | Version und Edition (Fusion, FieldOps, Transfer, Labs) für Hardware | `.bin` aus offiziellem Release heruntergeladen und Hash geprüft | [Editionen](#welche-edition-wählen) und [Versionen](#versions--und-formatmatrix) |
| 4. Flashen | Funkgerät aus, PTT beim Einschalten gedrückt, UV Studio oder Bricohams Studio | Tool bestätigt alle Seiten und Funkgerät startet neu | [Bootloader](ATLAS-UV-K5-V3.md#bootloader-und-flashen) |
| 5. Erster Start | SysInf lesen und Version prüfen | Version stimmt mit geflashtem Image überein | Nächster Abschnitt |
| 6. Grundeinstellungen | Navigation, Akku, Bildschirm, Squelch, TX und Sperren | Einstellungen bleiben nach Aus-/Einschalten erhalten | Tabelle der Grundeinstellungen |
| 7. Kanäle | Repeater, PMR nur RX, Satelliten und Namen | Speicher erscheinen und werden identisch erneut gelesen | [FM-Speicher](#fm-speicher-vorbereiten-und-übertragen) |
| 8. Scan | Listen, Prioritäten und Fortsetzung | Scan durchläuft nur die vorgesehenen Speicher | [Scan](#scan-prioritäten-und-tasten) |
| 9. Multiboot (optional) | Slots 1-4 und CFG-Bänke | Jeder Slot besteht CRC-Prüfung und startet | [Slots und Bänke](#slots-und-cfg-bänke-unterschiedliche-vorgänge) |
| 10. Labs (optional) | Overlay-Apps derselben Veröffentlichung | App startet und kehrt zur Firmware zurück | [Labs](#labs-und-anwendungen) |
| 11. Abschlussprüfung | Checkliste und neue Sicherung | Endzustand gesichert und Versionen notiert | [Abschlussliste](AYUDA-CONFIGURACION.md#checkliste-nach-der-konfiguration) |

### Phase 4 Schritt für Schritt: Hauptfirmware flashen

1. Sicherungen aus Phase 2 speichern. Ohne gesicherte Kalibrierung nicht fortfahren.
2. CHIRP, CPS, andere Studio-Tabs und die normale Verbindung dieser Website schließen.
3. Funkgerät ausschalten. PTT gedrückt halten und einschalten: LED bleibt an,
   Bildschirm bleibt aus. PTT loslassen und USB-C-Kabel anschließen.
4. In [UV Studio](https://armel.github.io/uvstudio/) oder
   [Bricohams Studio](https://brico-hams.github.io/Bricohams-Studio/) den Anschluss auswählen. Der Bootloader muss `7.00.07` (UV-K5 V3) oder `7.02.02`/`7.03.0x`
   (UV-K1) melden. Bei anderer Version anhalten und Modell prüfen.
5. Das flache `.bin` der Edition auswählen. Niemals `*.packed.bin` (für den offiziellen
   Updater) oder ein V1-Image verwenden.
6. Bestätigen und Funkgerät sowie Kabel nicht berühren, bis alle Seiten bestätigt sind.
   Bei Unterbrechung bleibt das Funkgerät im Update-Modus: ab Schritt 3 mit derselben Datei wiederholen.
7. Das Funkgerät startet selbst neu. Nach dem Flashen von F4HWN die Kalibrierung
   wie vom Projekt empfohlen mit UV Studio erneut speichern.

### Phase 5: erster Start

- SysInf öffnen und Version und Edition notieren. Bei Abweichung von der Datei nicht
  fortfahren: Phase 4 wiederholen.
- Die Kalibrierung wird beim Flashen nicht gelöscht. Wenn der Akku 0 V anzeigt oder das Squelch
  nicht wie erwartet funktioniert, vor weiteren Änderungen prüfen, ob die Kalibrierung zu diesem Funkgerät gehört.
- Zeigen Menüs nach einem Firmwarewechsel widersprüchliche Werte, Reset erst nach Prüfung der Sicherungen
  verwenden: Der Umfang hängt vom Build ab.

### Phase 6: empfohlene Grundeinstellungen

| Menü | Sinnvoller Startwert | Grund |
| --- | --- | --- |
| SetNav | Je nach Modell (K1 oder K5 V3) | Bei vertauscht wirkenden Pfeilen diese Einstellung prüfen |
| BatTyp | Tatsächliche Akkukapazität | Richtige Ladeanzeige |
| SetCtr, BLMin, BLMax, BLTime | Gut lesbar bei möglichst geringem Verbrauch | Komfort und Laufzeit |
| Sql | Zum Einstieg 3-4 | Schließt Rauschen, ohne schwache Signale zu verlieren |
| Step | Raster des Dienstes (12.5 oder 25 kHz auf VHF/UHF) | Reale Kanäle abstimmen |
| RxMode | Zu Beginn MAIN ONLY | TX-Pfad jederzeit erkennen |
| SetPTT | Classic | OnePush kann nach Loslassen weiter senden |
| VOX | OFF | Unbeabsichtigte Aussendungen vermeiden |
| TxTOut | 60-120 s | Hängt festes PTT ab |
| F Lock | Profil für deine Region | Begrenzt TX auf die entsprechenden Bänder |
| SetLck | Tasten (und PTT, falls nötig) | Änderungen in der Tasche verhindern |
| ChDisp | Name | Speichernamen im MR-Modus sehen |

Nach den Änderungen aus- und einschalten, um das Speichern zu prüfen.
Die Bedeutung jedes Menüs steht im [Menü-Wörterbuch](#wörterbuch-der-funkgerätemenüs).

### Phasen 7 und 8: Kanäle und Scan

- Diese Website bereitet Kanäle auf einer Vorlage vor und schreibt sie mit Sicherung und
  erneutem Lesen ([FM-Speicher](#fm-speicher-vorbereiten-und-übertragen)). Alternativ kannst du
  den CHIRP-Treiber jeder F4HWN-Veröffentlichung oder Bricohams Studio verwenden.
- Importierte Kanäle haben TXLock aktiviert. Nur bei geprüften und autorisierten Kanälen entfernen
  ([Kanalwörterbuch](AYUDA-CONFIGURACION.md#glossar-für-analogkanäle)).
- Jeden Speicher einer Liste (ScList) zuweisen, Prioritäten (PriCh1/PriCh2)
  und Fortsetzungsmodus (ScnRev) wählen. Scan mit passendem SQL testen.

## Auf Werkseinstellungen zurücksetzen und Wiederherstellung

| Situation | Vorgehen |
| --- | --- |
| Zur Werksfirmware zurückkehren | Geführte Wiederherstellung von [UV Studio](https://armel.github.io/uvstudio/): rekonstruiert externen Flash, ohne Kalibrierung anzutasten. Nur das Werks-`.bin` zu flashen, kann dazu führen, dass K1 nicht mehr startet |
| Funkgerät startet nach Flash nicht | Update-Modus betreten (PTT beim Einschalten) und erneut ein `.bin` für das richtige Modell flashen |
| Bootloader reagiert nicht oder Anschluss wird nicht angezeigt | Anderes Datenkabel und anderen Anschluss versuchen; prüfen, ob eine andere App den Anschluss verwendet |
| Update-Modus nicht erreichbar | SWD-Wiederherstellung mit ST-Link ([SWD](ATLAS-UV-K5-V3.md#swd-und-wiederherstellung)). Nur mit Erfahrung |
| Kalibrierung verloren oder von einem anderen Funkgerät | Sicherung aus Phase 2 wiederherstellen. Keine Kalibrierung anderer Geräte verwenden |

## Beta: echter USB-Test und Kanäle

### BH Labs gestartet: echte Prüfung vom 26-10-2026

Nach manueller Auswahl von Slot 2 weist COM4 **F4HWN v6.1.0** aus.
Die CRCs von Main und den vier Bricohams-Slots aus der vorherigen Tabelle wurden geprüft;
38 Kanäle der aktiven Bank von BH Labs wurden gelesen.

Die erste Sicherung ergab, dass `0x073E` einen 2-MiB-Bereich ablehnt:
Die Firmware begrenzt jede CRC-Abfrage auf 4 KiB. Nach Korrektur der Website wurde
Sicherung der 2 MiB abgeschlossen und gespeichert; alle 512 Sektoren wurden geprüft.
Außerdem wurden die 512 Byte Kalibrierung und Main mit 120832 Byte gespeichert.
Die Kalibrierung behält den vorherigen SHA-256-Wert
`f9c537df7a1764b31c73b3021dae69a1a654e267315f8c58c12bc4a3f1dd1a1b`.
16 App-Slots wurden abgefragt; Tetris wurde aus dem physischen Flash rekonstruiert und exportiert,
Dateiformat und CRC der Datei wurden validiert.

Die aktive Konfiguration wurde unverändert erneut gelesen. An einer lokalen Kopie
dieser echten Lesung wurde das Erstellen, Bearbeiten und Löschen eines RX-only-Kanals geprüft,
wobei die 38 ursprünglichen Kanäle und geschützten Einstellungen erhalten blieben. **Während dieser Prüfung wurden keine Kanäle, Apps, Firmware, Kalibrierung oder Ressourcen geschrieben.** Das Schreiben von CRUD-Änderungen auf dem Funkgerät und die physische Isolation
anderer Bänke sind mit diesem Lesetest nicht nachgewiesen.

### Historische Lesetests mit Main/Fusion v6.0.0

Nur-Lese-Test vom 25-10-2026 an COM4 (USB CDC
VID 36B7 / PID FFFF), vom Besitzer als **UV-K5 V3** angegebenes Modell.
Das Funkgerät meldet **F4HWN v6.0.0**; die Platine wird nicht automatisch abgeleitet.

- Identifikation, 512 Byte Kalibrierung und logische Konfiguration mit 41344 Byte:
  korrekt. Zwei unabhängige Lesungen stimmen Byte für Byte und per SHA-256 überein.
- 200 vorhandene Kanäle werden erkannt. Speicher mit gelöschter Frequenz
  (`0`/`0xFFFFFFFF`) werden trotz verbleibender Attribute nicht angezeigt,
  entsprechend der Firmwareprüfung.
- Slot-Abfrage: Main/Fusion, FieldOps, Labs, Doppler und Ardf, alle v6.0.0.
  Es werden Header gelesen; das ist keine Prüfung der CRC jedes Images.
- Der physische Flash-Befehl `0x0738` antwortet in dieser Firmware nicht. Zuvor wurde er
  bei der automatischen Sicherung aufgerufen und der Timeout machte die Verbindung ungültig.
  v6.0 erstellt nun eine **partielle** Sicherung (Kalibrierung/Konfiguration), hält die
  Leseverbindung aufrecht und erklärt die Schreibsperre, ohne diesen Befehl zu versuchen.
- Keine physischen Kanäle, Firmware, Slots oder Kalibrierung wurden geschrieben oder gelöscht.
  Es wurden keine RF-Tests oder OpenGD77-Hardwaretests durchgeführt.

Erneuter Lesetest am **26-10-2026**: COM4 antwortet mit F4HWN v6.0.0 und liefert
41344 Byte mit 200 Speichern. An einer Kopie dieser Lesung werden 16 neue PMR-Kanäle (216 Kanäle),
Bearbeitung, Listenzuweisung und lokales Löschen geprüft, ohne Bytes ab `0x8800` zu verändern.
Der Browser öffnet diese echte Lesung ebenfalls und liest die 16 hinzugefügten PMR erneut ein.
Es wurde nichts dauerhaft geschrieben. CAT wurde mit dieser Firmware nicht getestet:
Sie implementiert den CAT-v1-Befehl des Bricohams-Satelliten-Images nicht.

### FM-Speicher vorbereiten und übertragen

1. Je nach Gerät UV-K5 V3 oder UV-K1 auswählen und Modell bestätigen. Für Lesen ohne Warten auf
   den vollständigen Flash **Nur-Leseverbindung / CAT verbinden** verwenden. Diese Sitzung erstellt keine
   Sicherung und schaltet keine persistenten Schreibvorgänge frei. Die normale Verbindung behält die
   obligatorische automatische Sicherung für Schreibvorgänge bei.
2. **Kanäle der aktiven Bank lesen** drücken. In v6.0 werden sie automatisch aus der partiellen Sicherung
   angezeigt; nach vollständiger Sicherung wird auch die aktive Konfiguration gelesen. Für die Arbeit ohne Funkgerät
   eine logische F4HWN-v6-Konfiguration mit genau 41344 Byte öffnen, keine Firmware und keinen vollständigen Flash.
3. **Analoge PMR446-Kanäle 1-16 (nur RX)**, FM-Repeater oder SAT/Doppler-Speicher
   im Planer vorbereiten. Einen vorhandenen FM-Speicher als Vorlage wählen und
   **Kanäle zur geöffneten lokalen Datei hinzufügen** drücken. Die erste FM-Vorlage wird beim Öffnen der Datei
   gewählt und beim Aktualisieren der Tabelle beibehalten. Eine Konfiguration ohne FM-Speicher benötigt eine gültige Vorlage
   aus derselben Firmware; willkürliche Datensätze werden nicht erzeugt. Du kannst ebenfalls
   FM-Kanäle aus einer CHIRP-CSV oder OpenGD77 CPS importieren; nur unterstützte VHF/UHF-Frequenzen werden akzeptiert,
   DMR-Zeilen und andere Formate mit Begründung ausgeschlossen. Das Repeater-Dateifeld akzeptiert dieselben
   CSV-Dateien und überträgt sie direkt in die vorbereiteten Kanäle. Für RepeaterBook-JSON muss die Autorisierung bestätigt werden;
   es wird zunächst in die Auswahltabelle übernommen.
4. Neue Speicher haben TXLock aktiviert, Töne und DTMF deaktiviert sowie Reverse deaktiviert.
   PMR wird schmal vorbereitet. Importiert werden nur nominale RX/TX-Werte zwischen
   136-174 oder 400-470 MHz; das erlaubt keine Übertragung. Namen: erste 10
   ASCII-Zeichen. Duplikate werden nur ausgelassen, wenn der entsprechende vorhandene Speicher bereits TX-gesperrt ist;
   eine Übereinstimmung mit möglichem TX gilt nicht als gültig.
5. **Bearbeiten** ändert Name/RX/TX eines FM-Speichers; **Aus Datei löschen**
   entfernt ihn aus der lokalen Kopie. Die Bearbeitung aktiviert TX-Sperre und erhält
   Bytes außerhalb dieser Felder; beide Vorgänge ändern nur eine Speicherkopie. Den vom Parser angezeigten Kanal erneut prüfen,
   **Lokale Konfiguration speichern** drücken und die bearbeitete Binärdatei getrennt vom
   Original speichern. Wenn Chrome/Edge einen Dateiauswahldialog anbietet, schreibt und schließt die Website die Datei vor der Bestätigung.
   In Browsern ohne diesen Dialog wird nur ein Download angefordert: Downloads prüfen und die Anforderung
   nicht mit einer bestätigten Speicherung verwechseln. Das Speichern des JSON-Projekts oder der CSV ersetzt diese Binärdatei nicht.
6. **Kanäle schreiben und erneut lesen (Beta)** wird nur mit vollständiger Sicherung dieser Sitzung
   und über Labs v6.1+ mit Flash-Lesen und CRC freigeschaltet. Es wird geprüft, dass das Funkgerät noch dem
   Lesestand entspricht; 8-Byte-Blöcke werden geschrieben und alles erneut gelesen.
   Während des Schreibens werden betroffene Speicher vorübergehend als leer markiert;
   nach Daten/Namen werden sie wieder aktiviert. Der Vorgang ist nicht ausfallsicher bei Stromverlust.
   VFO, Einstellungen, Kalibrierung und andere Bänke sind geschützt.
7. Nach Erfolg das Funkgerät manuell neu starten, damit Caches neu geladen werden. Bei Fehler Sicherung
   und exakte Meldung bewahren; Erfolg nicht allein aus einem ACK ableiten.

Die Übertragung wurde mit simuliertem Transport, **nicht mit Hardware** geprüft:
Das verbundene v6.0-Gerät erlaubt die erforderliche vollständige Sicherung nicht. Dieses Gerät wird
als Nebeneffekt weder aktualisiert noch geflasht. Die native SAT-Orbit-Tabelle wird nicht installiert:
SAT/Doppler sind FM-Speicher. Kontinuierliche CAT-RX-Verfolgung erfordert ausdrücklich das Bricohams-Satellites-Image mit CAT v1.

### Multiboot-Zyklus ohne Schreiben über USB simulieren

Die automatisierte Regression wird ausgeführt mit:

```powershell
node --test --test-name-pattern="simulacion multiboot completa" tests\connectors.test.cjs
```

Ausschließlich ein Transport im Arbeitsspeicher wird verwendet: kein Web Serial, COM oder USB wird geöffnet.
Vier Installationen mit Test-Images, vollständiger Sicherung und sitzungsgebundener Berechtigung, zuletzt geschriebenem Header und CRC je Slot werden simuliert. Im Modell werden unterschiedliche CFG-Bänke manuell ausgewählt, damit sie nicht mit Slot-Nummern verwechselt werden. In jeder Bank werden 16 PMR, 11 REMER und ein fiktiver CSV-Repeater importiert; geschrieben, erneut gelesen, bearbeitet, Liste geändert, gelöscht und Speicher wiederverwendet. Isolation von Bänken, Main, Kalibrierung und geschützten Einstellungen wird geprüft. In Satellites werden CAT RX und STOP ohne dauerhafte Änderungen simuliert. AM wird abgelehnt, da dieser Importer es nicht umwandelt.

CSV-Dateien akzeptieren abschließende Dezimalnullen wie `145.600000` und Offset `0.600000`,
ohne Werte mit mehr als fünf signifikanten Nachkommastellen zu runden.
Die Test-Repeater sind kein aktuelles Verzeichnis realer Frequenzen.
Diese Simulation führt weder die kompilierte Firmware aus noch prüft sie Start, RF,
Bildschirm, Audio oder physische Bankisolation des angeschlossenen Funkgeräts.
Sie schaltet keine Schreibvorgänge frei und ersetzt nicht die vollständige Sicherung dieses Geräts.

### Seitenabschnitte und Kanaltabellen

Die seitlichen Schritte (Sicherungen und Verbindung, Kanäle, Satelliten, Firmware, Werkzeuge) zeigen nur den gewählten Abschnitt. Werkzeuglinks öffnen den Abschnitt ihres Ziels.

Alte Fragmentlinks öffnen die passende Ansicht; anschließend wird das Fragment aus der URL entfernt. Die Seitenleiste lässt sich bei niedrigen Fenstern separat scrollen. Kanaländerungen bleiben beim Ansichtswechsel erhalten; der Kanaleditor steht vor den Planungskatalogen.

Eine ausgewählte Zeile ziehen, um die gesamte Auswahl in ursprünglicher Reihenfolge zu verschieben; eine nicht ausgewählte Zeile verschiebt nur diesen Kanal. In der oberen Hälfte der Zielzeile ablegen für davor, in der unteren für danach. Alle Speicherbytes einschließlich Tönen, DCS und nicht bearbeitbaren Attributen bleiben erhalten.

**Funkgerätekanäle herunterladen (Originalsicherung)** liest und speichert die aktive Bank erneut, ohne lokale Änderungen zu ersetzen. **Lokale Konfiguration speichern** speichert die bearbeitete Version. Modellwahl, Lesebestätigung, Status, Fortschritt und Trennen sind direkt unter Kanäle verfügbar.

**Kanal hinzufügen** fragt Speichernummer, Name, RX, nominelle TX und Scanliste (0, 1-24 oder 25) ab. Ohne Nummer wird am Ende angefügt, oder eine freie Lücke verwendet, falls Speicher 1024 belegt ist. Bei belegter Nummer **Davor**, **Danach** oder **Abbrechen** wählen; Abbrechen ändert die Datei nicht. Neue Kanäle sind nur für RX und verwenden eine vorhandene FM-Vorlage. Nur **Schreiben und Kanäle erneut lesen** ändert das Funkgerät, mit vollständiger verifizierter Sicherung.

Zwei Tabellen: **Funkgerätekanäle** aus der aktiven Bank oder Datei und **Zu ladende Kanäle** aus Repeatern, REMER, PMR446, SAT/Doppler, Flughäfen, FM/CSV oder Funkgerätkopien. Ziehen einer Zeile verschiebt die Zwischenzeilen. Aus der Ladetabelle ins Funkgerät wird vor dem Ziel eingefügt, in leerem Bereich angehängt. Kopien vom Funkgerät erhalten jedes Byte einschließlich DCS. Auswahl kopieren / Hier einfügen oder Ctrl+C / Ctrl+V bei fokussierter Tabelle verwenden. Einfügen ins Funkgerät erfolgt vor der ersten Auswahl, sonst am Ende. Nur zusammenhängende Speicher bis zur ersten Lücke werden verschoben, spätere bleiben unverändert. Lokale Bearbeitung, keine USB-Schreibvorgänge.

### Schaltflächen für Backup und Restore von Kanälen

#### Ausnahme: autorisierter Ersatz von Legacy-Firmware

Die erweiterte API `BackupManager.authorizeSlotReplacement` kann ausschließlich Firmwareinstallationen
in Slots 1-4 für F4HWN Legacy mit partieller Sicherung autorisieren, nachdem wörtlich
`REEMPLAZAR SLOTS SIN RESPALDO DE FIRMWARE` bestätigt wurde. Diese Zustimmung bedeutet den Verlust
früherer Images ohne wiederherstellbare Kopie; deren CRC ist keine Sicherung.
Sie wird weder durch Verbinden noch durch PRO oder Importieren einer Datei aktiviert.

Vor Erteilung dieser Autorisierung werden Kalibrierung und Konfiguration der aktuellen Sitzung gelesen und gespeichert.
Der partielle Datensatz hält die Zustimmung, Slots, Namen, Größen und exakten SHA-256 der Images fest.
Jede Installation prüft diesen Datensatz erneut und verbraucht eine einzelne Autorisierung für dieses Image und diesen Slot.
Eine solche Freigabe erlaubt weder separates Löschen von Slots noch Main, Flash-Wiederherstellung,
Schreiben von Kanälen, CFG-Reset oder Installation/Löschung von Anwendungen.
Die normale Website behält ihre Anforderungen an eine vollständige Sicherung bei.
Dieser Ablauf folgt dem Installationsprotokoll von UV Studio: Slot löschen,
Image-Blöcke schreiben, Header zuletzt und CRC prüfen. Er ist weder eine vollständige Sicherung noch
Startnachweis. Wenn Schreiben oder Prüfung scheitern, anhalten und diesen Slot nicht starten.
Jedes Image manuell testen und Main unverändert lassen.

**Aktive Bank sichern** liest erneut und speichert die 41344 Byte große Binärdatei mit Datum und SHA-256.
Sie ersetzt weder den lokalen Bearbeitungsstand durch einen Download noch überschreibt sie diesen.
Das Ergebnis unterscheidet eine geschriebene Datei von einem angeforderten Download. Es ist eine logische Kopie,
keine Sicherung von Flash, Firmware oder Kalibrierung.

**Restore: Kanalkopie öffnen** erfordert, zuerst die Zielbank zu verbinden und auszulesen.
Größe, Struktur und identische Version werden geprüft; nur Speicher,
Namen und Attribute bis `0x8800` werden über die Lesung des Ziels kopiert. Dessen Einstellungen bleiben erhalten;
vor dem Ersetzen des lokalen Bearbeitungsstands ist eine Bestätigung erforderlich. Kanäle können mit aktiviertem TX wiederhergestellt werden:
vor dem Schreiben prüfen. Es wird nicht selbst geschrieben:
Zum Übertragen **Kanäle schreiben und erneut lesen** verwenden, mit den Anforderungen an vollständige Sicherung,
Bestätigung und erneutes Lesen. Keine Flash-Kopien oder UV-Studio-Pakete importieren.

### Regionale Vorlagen und vorkonfigurierte Dateien

Unter Repeater fügt **3 Bricohams-Repeater Murcia vorbereiten** ED5YBF
Carrascoy, ED5YAK und ED5YAL Sierra Espuna hinzu, abgeschrieben aus der bereitgestellten
`PRESET_CSV` im ZIP von Bricohams Studio. Die CHIRP-CSV-Datei kann ohne externe Dienste heruntergeladen werden.
Alles ist nur RX; die CSV verwendet Duplex off und nominales TX in Kommentaren. Die Aktualität ist nicht bestätigt und CTCSS wird nicht programmiert.

**Murcia-Vorlagen** zeigt getrennt an und lädt separat herunter:

- Flughäfen LEMI, LELC und LEAL sowie Notfrequenz 121.500 MHz: 15 AM-Dienste als JSON.
  RF-Träger und 8.33-kHz-Kanalbezeichnungen bleiben getrennt. Quelle:
  [AIP ENAIRE](https://aip.enaire.es/), AD 2.18 des jeweiligen Flughafens,
  abgerufen am 26-10-2026. Koordinaten beziehen sich ungefähr auf den Flugplatz.
  Aktuelles AIP und NOTAM prüfen; Vorlage nicht für den Flugbetrieb verwenden.
- FM Murcia: 15 Einträge von Onda Regional und OR Musica aus
  [Donde escucharnos](https://www.orm.es/donde-escucharnos/), abgerufen am
  26-10-2026. Eine Auswahl an Rundfunksendern, nicht alle kommerziellen Sender.
  Es liegen keine geprüften Senderkoordinaten vor und es gibt keine Näherungsfilterung.
- REMER: Download der 11 bereits verfügbaren VHF-Kanäle als CSV, nur RX.
  Auswahl und einzelne Vorbereitung erfolgen weiterhin auf dem REMER-Tab.

AM und WFM-Rundfunk sind Vorlagen zum Nachschlagen/Exportieren; sie werden nicht in Kommunikations-FM umgewandelt.
Der aktuelle Quansheng-Speichereditor installiert sie nicht;
erfordert werden kompatibler Empfänger und passendes Format. Downloads belegen weder Empfang,
Aktivität noch Schreiben auf Hardware.

### Scanlisten nach Zone oder Geografie

Neue Speicher nehmen standardmäßig an allen Listen teil (Wert 25);
sie haben keine Teilnahme mit Wert null. Für einen Stapel kannst du eine einzelne Liste 1-24, null für keine Teilnahme
oder eine Gruppierung nach Zone, Provinz/Region oder Ort wählen. Die Gruppierung reserviert freie
Listennummern, ohne vorhandene Listen zu ersetzen. Fehlt das gewählte Feld oder gibt es keine freien Listen,
wird der Stapel ohne Änderung des Images abgelehnt. Eine Provinz wird nicht aus der
Frequenz abgeleitet und Geolokalisierung nicht implizit verwendet.

REMER enthält seine Zone; RepeaterBook erhält Region/Ort. Eine CSV kann zusätzliche Spalten
`Zone`, `Region`/`State`, `City` und `Country` enthalten.
Ohne diese kannst du eine einzelne Liste oder die allgemeine Zone des CSV-Formats verwenden.
Der Bericht nennt die jeder neuen Gruppe zugewiesene Nummer: vor dem Schließen notieren.
Listennamen, Prioritäten, ALL/MIX oder globale Einstellungen werden nicht geändert.
Ausgelassene Duplikate behalten ihre bisherige Liste.

Um vorhandene Kanäle zu ändern, in der Tabelle markieren, **Auswahl einer Liste zuweisen** wählen und
**Liste auf lokale Datei anwenden** drücken. Du kannst die Liste eines einzelnen Speichers auch bearbeiten.
Die Zuweisung entfernt seine Markierung als Scan-Ausschluss, behält aber Frequenzen, Töne, Modi
und TX-Sperre. Binärdatei speichern und ScList im Funkgerät nach einem autorisierten Schreibvorgang prüfen.
Es sind keine DMR-Zonen oder mehrere gleichzeitige Gruppen pro Kanal; jeder Speicher hat eine native Teilnahme-Nummer.

### Gespeicherte Überflüge und CAT RX

**Überflugplan als JSON speichern** bewahrt TLE, Position, Zeitpläne und ausgewählte
FM-Frequenz. **Überflugplan-JSON erneut öffnen** verlangt Zustimmung zur Verwendung der Dateiposition,
prüft die Daten und berechnet die Zeitpläne für die aktuelle Zeit neu, ohne Anbieter abzufragen.
Alte Zeitpläne werden nicht zur Steuerung von CAT verwendet. Ein abgelaufenes TLE wird abgelehnt: Elemente aktualisieren und neu berechnen.
Alte Pläne ohne Frequenz lassen sich öffnen, aber die FM-Frequenz muss erneut abgefragt und ausgewählt werden.

Um einen Überflug in die Konfiguration zu übernehmen: Frequenz und Überflug wählen,
**Kanäle mit korrigiertem Doppler vorbereiten**, **Vorbereitete SAT-/Doppler-Kanäle laden**
und **Lokale Konfiguration speichern**. Das Speichern der Zeiten installiert kein TLE in der Firmware.
Diese Optionen zeichnen kein Audio vom Funkgerät auf.

Für CAT: Nur-Leseverbindung herstellen, das richtige Bricohams-Satellites-Image manuell starten,
SAT RX aufrufen, 8 drücken und die Firmwarebestätigung im Panel markieren. CAT nicht mit originalem F4HWN,
ARDF oder Espectro versuchen: Diese implementieren den privaten Befehl nicht. Einen aktuell sichtbaren Überflug auswählen und
Seite im Vordergrund lassen. RX-Befehle laufen nach 3 Sekunden ab;
die Browserkadenz zieht die Antwortzeit jedes Befehls ab.
Anhalten sendet keine neue Abstimmung, wenn SAT RX bereits deaktiviert ist.

Automatisierte und Browser-Tests prüfen PMR, Bearbeitung, Listen und Export anhand synthetischer Daten und der aus dem Gerät gelesenen Konfiguration.
Ein echter USB-Lesevorgang ist kein Nachweis für Schreiben, Anzeige oder RF. Ohne vollständige Sicherung und eindeutig bestimmte Bank
wird physisches Schreiben nicht als geprüft deklariert; Slots oder Kalibrierung werden nicht geändert.

### Multiboot und unabhängige Kanäle je Profil

Der Connector liest nur die logische Konfiguration, die das gestartete Funkgerät präsentiert.
Er wählt weder Firmware-Slots noch CFG-Bänke und belegt nicht, dass sichtbares Profil oder Slot dem Speicher entspricht,
der beschrieben wird. Es gibt keinen Webvorgang, der einen Kanalplan auf alle Slots verteilt.

Um Profile getrennt zu halten, jedes zu verwaltende Profil/jede Bank manuell starten und den Lese- und Exportablauf
**separat** wiederholen. Jede Datei mit Modell/Revision, Version und Firmwareprofil, CFG-Bank soweit am Funkgerät überprüfbar,
und Datum kennzeichnen; außerdem SHA-256 aufbewahren. Vor Bearbeitung eines anderen Profils vorherige Datei speichern und schließen.
Lesungen vergleichen: Wenn die Firmware den Slot nicht identifizieren lässt oder zwei Sicherungen keine Isolation belegen,
Trennung als ungeprüft behandeln und nicht schreiben. Keine Datei von einem Profil in ein anderes kopieren,
mit der Annahme, Speicher würden gemeinsam genutzt oder blieben unabhängig.

In dieser Sitzung fand kein neuer USB-Test statt. Für das zuvor dokumentierte Gerät (F4HWN v6.0.0)
ist die verfügbare Sicherung weiterhin partiell und physisches Schreiben gesperrt. Die neuen Funktionen zum Bearbeiten, Löschen
und Prüfen importierter Kanäle validieren die lokale Datei; sie belegen weder, dass die Firmware sie auf dem Bildschirm anzeigt,
noch dass die Änderung einen physischen Slot erreicht hat. Siehe [REMER, Flughäfen und kommerzielles FM](AYUDA-ANYTONE.md)
zu den Unterschieden zwischen lokaler Vorbereitung, Parser-Kompatibilität und RF-Test.

## Hardware vor Firmware auswählen

| Funkgerät/Revision | Verhältnis zu dieser Website | Regel |
| --- | --- | --- |
| UV-K1 / UV-K1(8) PY32 | UV-K1-Ziel des Katalogs/Connectors | Platine und Identifikation prüfen; kein V1-Image |
| UV-K5 V3 PY32 | UV-K5-V3-Ziel | Gleiche Familie erlaubt nicht, die tatsächliche Revision zu ignorieren |
| UV-K5(8), UV-K6, UV-K5+ V1 | Karina V1/OneOfEleven oder andere V1-Projekte | Außerhalb des PY32-Slot-Connectors |
| UV-K5 V2 | Andere Hardware | Weder V1 noch V3 wegen ähnlichen Aussehens |
| UV-K5(99) und Handelsbezeichnungen | Der Name kann verschiedene Revisionen umfassen | MCU/Revision anhand der Projektquelle identifizieren |
| TK-11 und ähnlich aussehende Baofeng-Geräte | Keine Ziele des Connectors | Diese Images nicht verwenden |

Das ARDF-Handbuch warnt sogar vor V3-Aufklebern auf V2-Hardware. Der Aufkleber ist hilfreich,
aber kein alleiniger Nachweis. USB-C garantiert weder, dass jede Firmware dasselbe Protokoll verwendet,
noch dass der Anschluss bei allen Revisionen zum Programmieren dient.

## Versions- und Formatmatrix

| Zweig | Katalog | Editionen/Varianten | Schreiben über diese Website |
| --- | --- | --- | --- |
| F4HWN v4.x | Erkannte stabile Versionen mit spezifischer Datei `k1` oder `k5v3` | Fusion, eventuell SA818 je Veröffentlichung | Nur Download |
| F4HWN v5.x | Erkannte stabile Versionen mit veröffentlichtem Hash | Fusion, eventuell SA818 | Nur Download |
| F4HWN v6.x | Erkannte stabile Versionen mit veröffentlichtem Hash | Fusion, FieldOps, Transfer, Labs je Veröffentlichung | Nur geprüfte Images ohne SA818 und mit vollständiger Sicherung |
| Entwicklung/Beta/rolling | Aus stabilem Katalog ausgeschlossen | Nicht mit Releases gleichzusetzen | Bibliothek sperrt bekannte Namen dieser Varianten |
| ARDF V3/UV-K1 | Separater reald-Zweig | ARDF-K5v3_K1-Versionen | Nur Download; siehe [ARDF](AYUDA-ARDF.md) |
| Stock | Nicht als F4HWN ausgewählt | Hersteller-Image | Wird von diesem Prüfer nicht in Slots installiert |
| Karina V1 | Paketdokumentation | RAW und packed V1 | Wegen PY32-Inkompatibilität gesperrt |
| Karina V3/K1 von Dim0s | Separat geprüftes ZIP mit PY32-Vektoren | RAW und packed je Hardware | Nicht freigegeben: Armel-Multiboot und Quellen ungeprüft |
| Bricohams V3 | Lokaler v6.1.0-Builder | Generierte Fusion und Labs | Slot-Vorbereitung, gleiche Schutzbarrieren, experimentell |

Die historischen Namen Bandscope, Broadcast, Basic, RescueOps oder Game in älteren Dokumenten sind nicht
1:1 mit v6-Presets gleichzusetzen. Einstellungen nicht anhand der Menüposition übernehmen. Für das genaue Verzeichnis
von Optionen und Standardwerten siehe [Optionen](AYUDA-OPCIONES-F4HWN.md) und
[Presets je Commit](F4HWN-PRESETS.md).

Der Auswahldialog fragt autorisierte Releases ab, verwirft Prereleases/Drafts und
prüft Namen, Version, Größe und von GitHub veröffentlichten SHA-256-Digest.
Bei Fehlern zeigt er keinen unvollständigen Katalog als vollständig an.
Die installierte Version muss in SysInf abgelesen werden, nicht aus der zuletzt
heruntergeladenen Datei abgeleitet werden. Ein Update kann Persistenz und CFG-Kompatibilität ändern.

### Am 25-10-2026 erkannter Release-Bestand

Live-Abfrage für UV-K5-V3: 41 erkannte Images, keine vollständige Liste aller
Dateien der Repositories. Für UV-K1 müssen v4-Images ausdrücklich für K1 bestimmt sein.
Jeder Link enthält die Versionshinweise; diese Tabelle erfindet keine ungeprüften Funktionsunterschiede zwischen Patches.

| Version | Erkannte Editionen | Behandlung |
| --- | --- | --- |
| [v6.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.3.0) | Fusion, FieldOps, Labs, Transfer | Nach Prüfungen und Sicherung vorbereitbar |
| [v6.2.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.2.0) | Fusion, FieldOps, Labs, Transfer | Ebenso; Änderungen an Daten/API prüfen |
| [v6.1.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.1.0) | Fusion, FieldOps, Labs, Transfer | Lokale Bricohams-Basis, nicht dieselbe Editionsidentität |
| [v6.0.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.0.0) | Fusion, FieldOps, Labs, Transfer | Physisches Labs-Lesen ab v6.1+ nicht voraussetzen |
| [v5.9.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.9.0) | Fusion und SA818 | Nur Download |
| [v5.8.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.8.0) | Fusion und SA818 | Nur Download |
| [v5.7.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.7.0) | Fusion und SA818 | Nur Download |
| [v5.6.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.6.1) | Fusion und SA818 | Nur Download |
| [v5.6.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.6.0) | Fusion und SA818 | Nur Download |
| [v5.5.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.5.0) | Fusion und SA818 | Nur Download |
| [v5.4.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.4.0) | Fusion und SA818 | Nur Download |
| [v5.3.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.3.1) | Fusion | Nur Download |
| [v5.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.3.0) | Fusion | Nur Download |
| [v5.2.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.2.0) | Fusion | Nur Download |
| [v5.1.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.1.0) | Fusion | Nur Download |
| [v4.3.2](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v4.3.2) | Fusion je Hardware | Nur Download |
| [v4.3.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v4.3.1) | Fusion je Hardware | Nur Download |
| [v4.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v4.3.0) | Fusion je Hardware | Nur Download |
| [ARDF v0.5.1](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.5.1) | ARDF | Nur Download |
| [ARDF v0.5](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.5) | ARDF | Nur Download |
| [ARDF v0.4](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.4) | ARDF | Nur Download |
| [ARDF v0.2](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.2) | ARDF | Nur Download |

## Welche Edition wählen

| Edition | Profilschwerpunkt v6 | Vorsicht |
| --- | --- | --- |
| Fusion | Allgemeine Nutzung, Spektrum, Scan, Multiboot/CFG je Preset | Enthält deshalb nicht den vollständigen physischen Labs-Reader |
| FieldOps | Außendienste, Fox Hunt/Beacon und RescueOps je Preset | TX-Funktionen prüfen; keine Zulassung für Notfälle |
| Transfer | Schwerpunkt Übertragung/AirCopy je Preset | Kompatibler Gegenpart/Protokoll erforderlich; ersetzt keine vollständige Sicherung |
| Labs | Overlay-Apps, Diagnose und externer Lese-/Schreibzugriff, sofern aktiviert | Experimentell; ABI/API und Befehle ändern sich |
| Max | Profil im Optionskatalog v6.3.0 verfügbar | Release-Binärdatei oder Platz bei beliebigen Änderungen nicht voraussetzen |
| Custom | Konfigurierbares reduziertes Profil | Multiboot nicht garantiert; lokaler Builder akzeptiert es hier nicht |
| Bricohams | Eigene Editionsidentität auf festgelegten v6.1.0-Profilen | Weder Karina noch offiziell signierte Firmware |

Exakte ON/OFF-Werte sind zuverlässiger als der kommerzielle Profilname.
Zum Beispiel erfordert Labs die konkreten Optionen für physischen Flash,
die diese Website für die Sicherung benötigt.

## Wörterbuch der Funkgerätemenüs

Die folgenden Namen stammen aus `MenuList` des untersuchten v6.1-Codes.
Ein bedingtes Menü kann in deinem Build fehlen. Verwende den Namen,
keine feste Nummer, die sich mit enthaltenen/ausgeschlossenen Funktionen ändert.
«Kanal speichern» bedeutet, den Speicher dauerhaft abzulegen; nicht alle temporären
Änderungen in MR werden automatisch gespeichert.

### Kanal, Empfang und Töne

| Menü | Erklärung und Prüfung |
| --- | --- |
| Step | VFO-Schrittweite, nicht Filterbandbreite. Raster des gehörten Dienstes wählen |
| Power | RF-Leistungsstufe je Kanal/VFO. Nominalwerte garantieren keine gemessene Leistung |
| RxDCS / RxCTCS | Subaudio-Empfangsfilter. Bei Stille zur Diagnose deaktivieren |
| TxDCS / TxCTCS | Gesendeter Code/Ton. Nur den vom System verlangten verwenden |
| TxODir | TX-Ablagerichtung: OFF, + oder - in der untersuchten Basis |
| TxOffs | Ablagebetrag. Resultierende TX-Frequenz prüfen |
| W/N | Breiter/schmaler FM-Kanal; SetNFM kann die schmale Variante wählen |
| BusyCL | Verhindert TX, wenn das Kriterium einen belegten Kanal erkennt |
| Compnd | Audio-Compander; Kompatibilität der Gegenstation erforderlich |
| Mode | RX-Demodulation im Build; ändert weder Hardware noch TX-Berechtigungen |
| TXLock | Sendesperre des Kanals; bei Empfangskanälen aktiviert lassen |
| Sql | Squelch-Schwelle; null kann Rauschen dauerhaft öffnen |
| RxMode | Bestimmt Empfang und TX-Antwort; VFO prüfen, das sendet |
| ChList | Speicher je nach Benutzeroberflächen-Kontext anzeigen/auswählen |
| ChSave | Im Speicher sichern; Ziel vor dem Überschreiben prüfen |
| ChDele | Speicher löschen; ist nicht dasselbe wie nur den Namen löschen |
| ChName | Kanalname; ändert nicht die Frequenz |

### Scan, Prioritäten und Tasten

| Menü | Erklärung und Prüfung |
| --- | --- |
| ScList | Aktive Scanliste; prüfen, dass sie nicht leer ist |
| ScPri | Verwendung von Prioritätskanälen im Zyklus |
| PriCh1 / PriCh2 | Prioritätsspeicher; keine VFO A/B |
| ScnRev | Fortsetzung: Träger, Zeit oder Halt je Build |
| F1Shrt / F1Long | Funktion bei kurzem/langem Druck auf Seitentaste 1 |
| F2Shrt / F2Long | Funktion bei kurzem/langem Druck auf Seitentaste 2 |
| M Long | Aktion bei langem Druck auf MENU |
| KeyLck | Automatische Sperre und Verzögerung; verschieden von SetLck |
| 1 Call | Direktwahlkanal; prüfen, ob der gewählte Speicher stimmt |
| SetScn | Scanmodus/-geschwindigkeit, falls kompiliert; schneller bedeutet nicht bessere Erkennung |
| SetKey | RescueOps-Tasteneinstellungen; nur wenn Profil sie enthält |

v6.1 beschreibt 24 benannte Listen und Kombinationen ALL und MIX. ALL
lässt ausgeschlossene Speicher aus, MIX kombiniert ausgewählte Listen. Diese Fähigkeit nicht
auf v4/v5 übertragen. Full-Watch-Prioritäten stammen aus Listenprioritäten;
Duplikate/ungültige Einträge schaffen keine zusätzlichen Empfänger.

### Audio, DTMF und Senden

| Menü | Erklärung und Prüfung |
| --- | --- |
| TxTOut | Dauerlimit für TX; nicht dasselbe wie die Wahl des SetTOT-Hinweistons |
| Mic | Mikrofonverstärkung; zu hoch verursacht Verzerrung, keine höhere Nutzleistung |
| MicBar | Pegelanzeige; ersetzt keine Messung des Hubes |
| Beep | Tastatur-/Oberflächentöne; Lautstärke vor Kopfhörern einstellen |
| Voice | Sprachansagen nur, wenn kompiliert |
| Roger | TX-Endsignal; nur dort verwenden, wo erlaubt und passend |
| STE / RP STE | Lokale/Repeater-Squelch-Abschaltung, abhängig von der Gegenstelle |
| ANI ID | DTMF-Kennung, sofern DTMF-Ruf kompiliert ist |
| UPCode / DWCode | Konfigurierte DTMF-Identifikations-/Steuerfolgen; nicht ohne Erlaubnis an Systeme senden |
| PTT ID | Zeitpunkt/Verwendung der Kennung beim Drücken von PTT |
| D ST | Mit DTMF verbundenes lokales Audio je Implementierung; kein DMR Time Slot |
| D Resp / D Hold | DTMF-Rufantwort und Haltezeit, sofern aktiviert |
| D Prel | DTMF-Präambel-/Timingparameter; Standard beibehalten, außer das System verlangt etwas anderes |
| D Decd / D List | DTMF-Dekodierung/-Liste der Ruf-Funktion |
| D Live | Empfangene DTMF anzeigen; macht das Signal nicht vertraulich |
| VOX | Audioauslösung; für Diagnose und gegen unbeabsichtigtes TX deaktivieren |
| SetPwr | Benutzer-Leistungsstufe für Power=USER |
| SetPTT | Klassische oder rastende OnePush-PTT; die zweite kann nach Loslassen weiter senden |
| SetTOT | Art des Timeout-Hinweises, nicht dessen Dauer |
| SetEOT | Hinweis am Ende der Aussendung; Ton/Anzeige je nach Verwendung prüfen |
| SetRxA | RX-Audioprofil, sofern AUDIO aktiviert ist |
| SetVol | Firmware-RX-Audioeinstellung, verschieden vom physischen Regler |
| SetNFM | Upstream dokumentierte schmale Filtervariante 12.5/6.25 kHz; kein VFO-Schritt |

### Anzeige, Energie und erweiterte Optionen

| Menü | Erklärung und Prüfung |
| --- | --- |
| BatSav | Empfangssparmodus; kann Aktivitätserkennung verzögern |
| BatTxt | Akkuanzeige |
| ChDisp | Name/Frequenz/Nummer je Anzeigemodus |
| POnMsg | Startnachricht; kein Nachweis echter Firmware |
| BLTime | Hintergrundbeleuchtungsdauer |
| BLMin / BLMax | Mindest-/Höchsthelligkeit; Lesbarkeit sicherstellen |
| BLTxRx | Beleuchtung bei TX/RX aktivieren |
| SysInf | Version/Build, Akku und Diagnoseanzeigen je nach Optionen |
| SetCtr | Bildschirmkontrast, keine RF-Verstärkung |
| SetInv | Farben/Pixel invertieren |
| SetLck | Umfang der Sperre: Tasten oder je Build auch PTT |
| SetMet | S-Meter-Stil; Werte sind kein kalibriertes Messgerät |
| SetGUI | Stil/Größe der VFO-Informationen |
| SetTmr | RX-/TX-Zeit anzeigen |
| SetOff | Deep-Sleep-Timer; kann eine Sitzung unterbrechen |
| SetSav | Energiesparanzeige/-logo, sofern kompiliert |
| SetCfg | Andere Konfigurationsbank anwenden, ohne Firmwarewechsel |
| SetNWR | NOAA-Funktion, sofern kompiliert und für die Region geeignet |
| F Lock | Bandprofil; keine Zulassung oder Erlaubnis zur TX-Erweiterung |
| 350 En | Zusätzlichen Empfangsbereich je Build zugänglich machen; bedeutet keine Sendegenehmigung |
| FrCali | Referenzfrequenzeinstellung, falls kompiliert; Messinstrument erforderlich |
| BatCal | Spannungsmessung kalibrieren; keine Werte anderer Geräte übernehmen |
| BatTyp | Akku-Kapazitätsprofil; keine Reparatur oder RF-Kalibrierung |
| SetNav | Navigationsanordnung UV-K1 gegenüber UV-K5 V3 |
| Reset | Einstellungen wiederherstellen; Umfang hängt vom Build ab, mit Verlustrisiko |

Menüs wie `Scramb`, `Tx 200`, `Tx 350`, `Tx 500`, `ScraEn` oder `NOAA-S` können
in Zweigen ohne F4HWN-Schicht erscheinen. Sie werden zur historischen Identifikation genannt,
nicht als in veröffentlichten Profilen aktivierte Optionen oder Anleitung zum Freischalten von Aussendungen.
Ein Scrambler darf nicht als sichere Verschlüsselung angesehen werden.

## RxMode und Full Watch

In v6.1 besucht Full Watch VFO A, B und gültige Prioritäten. Es sind keine vier
unabhängigen Empfänger. FULL RX/RESPOND kann auf dem zuletzt empfangenen Kanal antworten;
MAIN TX/FULL RX hält TX auf dem Hauptkanal. Vor PTT die Zielanzeige prüfen. Für Diagnose
MAIN ONLY wählen.
DUAL/CROSS-Anzeigemodi nicht mit Repeaterkonfiguration verwechseln und nicht als
automatische Wiederholung zwischen Bändern voraussetzen.
## Slots und CFG-Bänke: unterschiedliche Vorgänge

| Element | Inhalt | Das Ändern bedeutet |
| --- | --- | --- |
| Main | Von Firmware verwaltete Basiskopie, kein Bootloader | Durch Website geschützt |
| Slot 1-4 | Zusätzliches Firmware-Image im externen Flash | Ein Image aus dem Funkgerät zum Prozessor wiederherstellen |
| CFG M/1-4 | Unabhängige Kanäle, VFO, Einstellungen und Listen | Andere kompatible Konfiguration laden |
| Labs-App | Code/Ressourcen mit spezifischer ABI/API | Funktion in Overlay-RAM ausführen, nicht vollständige Firmware wechseln |

Im untersuchten Upstream v6.1 wird der Auswahldialog mit MENU beim Einschalten geöffnet.
Wiederherstellung direkt am Funkgerät bestätigen; währenddessen nicht ausschalten.
SetCfg wechselt die Bank, ohne Firmware wiederherzustellen. Die Website erfindet keinen Fernbefehl
für einen dieser Vorgänge.

Für die Vorbereitung aus der Bibliothek Ordner wählen, zugelassenen Eintrag auswählen,
Name/Hash prüfen und Vorbereiten drücken. Es wird nichts geschrieben. Installation erfordert
kompatible Verbindung, vollständige Flash-Sicherung und Bestätigung. Slot-CRC wird geprüft.
Korrekte Vektoren und F4HWN-Zeichenfolge belegen keine Authentizität des Codes.

## Labs und Anwendungen

Die untersuchte Basis dokumentiert 16 Slots sowie Apps für Funk, APRS, SSTV,
Diagnose und Demos. Das Angebot ändert sich zwischen Releases; nicht alle Apps sind verfügbar
oder mit jedem Build kompatibel.

**Vorgefertigter Labs-App-Katalog:** umfasst SystemInfo, BroadcastFM,
Cube3D, Tetris, Breakout und Minesweeper aus dem Upstream-Release v6.1.0.
Sie werden zusammen mit der Website auch im statischen Export bereitgestellt, ohne Kompilierung.
Sie unterliegen Apache-2.0 und behalten ihre ursprüngliche Urheberschaft; sie werden nicht als eigene Werke umbenannt.
SHA-256, Größe, FAP1, Name, Version, ABI und minimale API werden geprüft.
Alle erfordern ABI 1 und minimale API 2; Kompatibilität mit aktivem Labs prüfen.
Für dieses Gerät ist kein Start zertifiziert.

Modell und App auswählen, Kompatibilität bestätigen und **App prüfen und vorbereiten** drücken.
Das bereitet nur die Datei vor: Slots abfragen, Ziel auswählen und getrennt
**App installieren und prüfen** drücken. Datei und Manifest lassen sich ebenfalls herunterladen.
Apps werden nicht automatisch installiert oder ausgeführt. Der Testkatalog schließt Baken und Notfall-Apps aus;
der vollständige Katalog ist weiterhin in UV Studio. Es gibt keine Isolationsgarantie:
Jede native App kann auf das Funkgerät zugreifen.

Der Maintainer erstellt den Katalog erneut mit
`node scripts/publish-firmware.cjs --apps-only`: Nur die sechs archivierten Dateien mit festgelegten Hashes werden akzeptiert;
jede Änderung wird abgelehnt.

Der Connector prüft FAP1, Code-/Ressourcengrenzen und Ressourcen-CRC und liest geschriebene Blöcke erneut.
Ein akzeptierter Header belegt nicht, dass eine App ausgeführt werden kann: ABI, API und Fähigkeiten
können sie beim Laden/Ausführen ablehnen. Firmware und Apps aus derselben Veröffentlichung verwenden.
Die Installation einer App unbekannter Herkunft gibt nativem Code Zugriff auf das Funkgerät.

**App aus Slot exportieren** rekonstruiert die FAP1-Datei aus Header,
Code und physischen Ressourcen und prüft deren CRC, bevor der Download angefordert wird.
Erfordert Firmware mit physischem Flash-Lesen; es ist kein Katalog-Download.

**App in leeren Slot verschieben** ordnet Apps um, ohne eine andere zu überschreiben.
Quelle und leeres Ziel wählen und angezeigte Bestätigung eingeben.
Zuerst Ziel installieren/erneut lesen/prüfen; erst danach Quelle löschen und prüfen, dass sie leer ist.
Der Ablauf ist nicht atomar: Unterbrechung kann zwei Kopien hinterlassen
oder eine unvollständige Zielkopie bei intakter Quelle. Sicherung aufbewahren und Slots erneut abfragen,
bevor du es wiederholst. Zum Tauschen zweier belegter Apps einen dritten leeren Slot als temporären Speicher verwenden.
Keine App wird ausgeführt und ABI/API-Kompatibilität nicht zertifiziert.

**Alle Apps löschen** erfordert vollständige Sicherung und die Eingabe von
`BORRAR TODAS LAS APPS`, auch im erweiterten Modus. Die tatsächliche Slotanzahl
(16 oder 48 je Firmware) wird abgefragt; nur belegte Slots werden gelöscht und anschließend wird geprüft,
dass alle leer sind. Bei einem Fehler wird der Vorgang gestoppt, ohne Gesamterfolg zu behaupten;
teilweises Löschen wird nicht automatisch rückgängig gemacht. Kanäle, Konfiguration,
Firmware und Kalibrierung bleiben unangetastet. Diese neuen Vorgänge wurden mit einem simulierten Funkgerät geprüft;
am physischen Gerät wurden sie nicht ausgeführt.

APRS-TX erfordert gesetzeskonforme Rufzeichen-/SSID-, Positions- und Routenkonfiguration.
Das Laden einer `.app` führt über diese Website keine Aussendung aus; automatische Baken werden
nicht als Bestandteil einer Sicherung eingerichtet. Notfall-/EPIRB-Funktionen werden als Upstream-Inventar erwähnt:
Keine Aussendungen auf Notruffrequenzen testen.

## Häufige Probleme

| Symptom | Prüfung |
| --- | --- |
| Startet, aber SetCfg erscheint nicht | Multiboot-Optionen des Builds prüfen, nicht nur die Version |
| Slot wird mit Daten angezeigt, CRC ist aber falsch | Nicht wiederherstellen; Datei und Sicherung aufbewahren |
| USB wird erkannt, aber Flash-Lesen schlägt fehl | Physischer Labs-Befehl könnte fehlen; andere Programme schließen und Build notieren |
| Tasten wirken vertauscht | SetNav/Modell prüfen; nicht zum Korrigieren eine andere Gerätefamilie flashen |
| Einstellungsänderung verschwindet | Speicher sichern oder CFG-Bank und Persistenz prüfen |
| Repeater nicht hörbar | RX, Modus, SQL und RX-Filter; nicht mit höherer TX-Leistung beginnen |
| App wird nicht ausgeführt | ABI/API/caps und Release prüfen; nicht blind erneut schreiben |
| SA818 oder packed gesperrt | Absichtlich; nicht zur Umgehung umbenennen |

## Quellen und Wartung

- [PY32-Projekt und README](https://github.com/armel/uv-k1-k5v3-firmware-custom).
- [Releases nach Version](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases).
- [Festgelegte Presets v6.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/blob/ca3a4271386049e7b459b215cef0ad0eea1a30ca/CMakePresets.json).
- [Untersuchtes Menü v6.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/blob/f556a96e73c3e423a00cf473aeb37f827cac05a5/App/ui/menu.c).
- [UVTOOLS2 des Projekts](https://armel.github.io/uvtools2/).
- [Spezialisierter CHIRP-Treiber](https://github.com/armel/uv-k5-chirp-driver).
- [Bricohams, Hashes und Build](BRICOHAMS-FIRMWARE.md).
- [Karina V1 und Grenzen von Lizenz/Quellen](KARINA.md).
- [Technischer Atlas UV-K5 V3: Hardware, Protokolle und Schaltpläne](ATLAS-UV-K5-V3.md).

Für Stock-Firmware, UVMOD oder OneOfEleven das genaue Projekt und die Hardware konsultieren:
Es gibt keine garantierte Gleichwertigkeit von Menüs/EEPROM mit dieser Anleitung.
Zu vom Benutzer hinzugefügten Links siehe [Egzumer V1](AYUDA-EGZUMER.md) und
[Dim0s-Pack mit Karina V3/K1](AYUDA-PACK-DIM0S.md).
