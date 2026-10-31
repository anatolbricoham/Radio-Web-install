# Quansheng: F4HWN, versioni e configurazione

Revisione: 26-10-2026. Base funzionale esaminata: Fusion61, commit
`f556a96e73c3e423a00cf473aeb37f827cac05a5`; catalogo modulare web v6.3.0,
commit `ca3a4271386049e7b459b215cef0ad0eea1a30ca`.
Questa guida non attribuisce automaticamente le funzioni v6.1/v6.3 a v4 o v5.
Per il funzionamento interno della radio (pin, memorie, protocollo, bootloader,
schemi e foto): [Atlante tecnico UV-K5 V3](ATLAS-UV-K5-V3.md).

## Canali semplici e modelli per paese

In Canali segui tre passi: leggi la radio, scegli un modello, verifica/salva.
A destra trovi Spagna, UK, Stati Uniti, Germania, Francia, Ungheria e Italia con
filtri per regione/stato e località. I risultati sono paginati a gruppi di 50;
nessuna selezione automatica. Seleziona tutto richiede al massimo 1024 canali:
per gli USA scegli prima uno stato. L'aggiunta modifica solo il file locale e
richiede una memoria FM esistente. Salva scarica il file; la scrittura richiede
ancora backup completo e rilettura. Copie, liste di scansione, CSV e trascinamento
restano nelle opzioni avanzate.

I dati provengono da [HearHam](https://hearham.com/repeaters), che permette l'API
nelle app online/offline, e dai confini amministrativi Natural Earth di dominio
pubblico. RepeaterBook non viene replicato. Il catalogo contiene i record FM VHF/UHF
operativi disponibili, non tutti i ripetitori di ogni paese: copertura molto limitata
in Ungheria e Italia. Verifica data, zona, attività e autorizzazioni. Toni e TX nominale
sono informativi; l'import blocca TX. PMR446 è facoltativo, solo RX, assente per
gli USA e non autorizza trasmissioni con apparati radioamatoriali.
SAT aggiunge solo memorie FM nominali, senza Doppler.

I passaggi coprono i giorni restanti del mese UTC per 75 punti di riferimento:
città europee e un punto approssimativo in ciascuno dei 50 stati USA e Washington
DC. Non valgono per tutto un paese. Sono inclusi coordinate, data, epoca TLE ed
elevazione minima di 10 gradi. Campionamento ogni 60 s; oltre sette giorni dal TLE
i passaggi sono provvisori. Non sono piani operativi e non vengono inviati a CAT.
Scarica il JSON completo o ricalcola in background con le tue coordinate; prima
dell'uso utilizza TLE recenti e il calcolo preciso 24/48 ore di Satelliti.
La precisione futura non è garantita.

Il processo giornaliero GitHub Actions parte alle 04:35 UTC, scarica i dati,
ricalcola, verifica e pubblica solo se tutti i controlli riescono. Gli errori sono
visibili in Actions e rimane l'ultima versione pubblicata; nessun dato inventato.
Per rigenerare localmente: `npm run fetch:channel-templates` seguito da
`npm run fetch:template-passes`. Gli installer includono gli stessi file;
la copia offline cambia solo installando un'altra versione.

## Visualizzatore in diretta e registro RF

In **Canali**, le due tabelle sono affiancate su desktop e impilate su mobile.
Seleziona il modello compatibile e autorizza la lettura direttamente in **Canali**.
Premi **Connetti e leggi canali (sola lettura)**: la colonna
sinistra mostra il banco attivo senza permesso di scrittura. A destra scegli PMR446,
REMER VHF o ripetitori Bricohams Murcia e prepara il modello da trascinare.
Sono disponibili anche i canali preparati da CSV e dagli altri cataloghi.
Trascina una riga o una selezione a sinistra, oppure usa copia e incolla.
I canali del catalogo vengono inseriti solo RX usando una memoria FM esistente
come modello; AM e DMR non vengono convertiti. Cambia soltanto la copia locale.
Salvala prima di rileggere: la sostituzione richiede conferma. La scrittura fisica
richiede ancora backup Flash completo, conferma e rilettura. La nuova connessione
non avvia automaticamente il visualizzatore, per lasciare libera la porta durante la lettura.

Test fisico del 27-10-2026: dispositivo USB seriale COM4, firmware identificato F4HWN v6.1.0,
banco attivo di 41344 byte con 121 canali FM. Due letture complete erano identiche byte per byte
(SHA-256 `16f9c8b5ccb9d865ceaca599acf1766737641d8e8285a832680c2f745b02a331`).
La web pubblicata ha mostrato tutti i 121 canali e preparato 16 PMR446; inserire PMR01
ha prodotto 122 canali soltanto nella copia locale, con scrittura bloccata. Sono stati
inviati soltanto identificazione e letture: nessuna scrittura, riavvio o cambio banco.
Questo non valida la scrittura fisica né l'APK su un telefono.

Il visualizzatore compare all'inizio della sezione Quansheng. Si avvia al termine della connessione:
subito con **Connetti in sola lettura / CAT**, oppure dopo il backup con
**Connetti e crea backup**. Richiede un'immagine con K5Viewer abilitato e senza
blocchi che impediscano il protocollo. Se non riceve frame entro dieci secondi,
lo segnala e si arresta; non simula lo schermo.

- LCD reale da 128 x 64, acquisizione PNG e stato dei LED comunicato dal firmware.
- Una sola connessione e un solo lettore. Ogni operazione mette prima in pausa il
  visualizzatore, attende la fine dei frame e poi esegue il comando. **Avvia
  visualizzatore e registro RF** lo riavvia. **Metti in pausa il visualizzatore** conserva l'ultima acquisizione.
- Il registro RF compare in fondo. Riceve RF Log **v2** e lo storico del firmware,
  elimina i duplicati in base alla sequenza e conserva al massimo 512 voci in RAM.
  Richiede RF Log abilitato: l'assenza di dati non significa assenza di segnali.
- **Esporta registro RF CSV** scarica sequenza, RX/TX/accensione, frequenza,
  durata, numero/nome della memoria, misuratore grezzo e batteria. Non attribuisce
  una data UTC ai record che non la includono. I valori del misuratore non sono
  misure di potenza calibrate. Il CSV neutralizza le formule dei fogli di calcolo.
- Alla riconnessione la vista precedente viene svuotata per non mescolare radio diverse. Esporta prima.
  Fermare il visualizzatore non cancella il registro persistente della radio.

Riferimento del protocollo: UV Studio, revisione
`e7aa946f6de002559e1aaf3f91765db7fc2ed567`, `k5viewer.js` e `rf-log.js`.
L'implementazione locale non invia PTT, tasti, reboot né comandi persistenti.
Il test COM4 del 26-10-2026 ha ricevuto **24 frame LCD e un frame RF** dal
firmware rimasto in esecuzione, senza dati incompleti. È stato necessario abilitare
DTR USB; Web Serial lo imposta esplicitamente per Quansheng. La radio non ha
inviato voci RF memorizzate, quindi non si dichiara una convalida fisica di uno
storico non ricevuto. Il parser dello storico, l'esclusione reciproca, la
schermata web e il CSV sono stati verificati anche con frame di test. K5Viewer
deve essere abilitato nel firmware attivo.

## Catalogo precompilato senza strumenti di compilazione

Il sito include nove immagini v6.1.0: Bricohams ARDF, Satellite, Spectrum,
Labs e Fusion, oltre alle immagini ufficiali F4HWN Fusion, FieldOps, Transfer e Labs.
Non occorre selezionare una cartella. Il catalogo è identico sul server locale
e nell'esportazione statica. Non si tratta di un download dinamico da qualsiasi URL.

### CHIRP v6.1.0

Le nove immagini del catalogo usano il protocollo F4HWN v6.1.0. Selezionare
**Quansheng / UV-K5** generico in CHIRP può identificare la radio ma segnare
l'immagine come firmware non supportato, bloccando modifica e caricamento.
Il messaggio non dimostra un guasto di connessione; ricompilare la stessa
versione o falsificarne l'identità non corregge la scelta del driver.

1. Conserva l'immagine esistente e i backup di configurazione/calibrazione.
2. Scarica il [driver ufficiale F4HWN v6.1.0](../../../precompiled/chirp/f4hwn.chirp.v6.1.0.py).
   In CHIRP, apri il file Python con **File > Carica modulo**.
   Non cambiare le preferenze di sicurezza per caricare moduli automaticamente.
3. In **Radio > Scarica dalla radio**, seleziona **Quansheng** e
   **UV-K1 & UV-K5 V3 (F4HWN)**, la porta della radio e il normale funzionamento.
   Esegui un nuovo download e salvalo con un nome diverso.
4. Per recuperare canali da un vecchio file, esportali in CSV e importali nel
   nuovo download. Verifica frequenze, toni, spaziature e blocco TX;
   non rinominare né forzare la scrittura dell'immagine limitata.
5. Prima di caricare modifiche, crea un nuovo backup e conserva la calibrazione.
   Non caricare calibrazione o impostazioni avanzate per migrare i canali.

L'immagine creata con il driver generico resta di sola lettura: cambiare firmware
o modello non ne converte il formato. Il driver v6.3.0 degli esempi appartiene a
un'altra versione; usa v6.1.0 con questo catalogo.
Il [manifesto](../../../precompiled/chirp/manifest.json) fissa origine e SHA-256;
il modulo è distribuito senza modifiche sotto GPL-2.0-o-successiva, con
[licenza](../../../precompiled/chirp/COPYING.txt) e [attribuzione](../../../precompiled/chirp/NOTICE.txt).
Queste istruzioni documentano la scelta corretta del driver, senza certificare
prove fisiche di lettura/scrittura o avvio delle nove varianti.

1. Seleziona UV-K1 o UV-K5 V3 e l'immagine del catalogo.
2. Conferma il modello e lo stato Beta delle derivate Bricohams.
3. **Scarica, verifica e prepara per lo slot** controlla dimensione, SHA-256 e
   struttura PY32 prima di abilitare l'immagine. **Scarica BIN e manifest**
   consente di salvarla senza prepararla né scriverla.
4. Seleziona slot 1-4, nome e **Installa e verifica CRC**. Le protezioni del
   backup restano attive; Main, CFG e calibrazione non vengono cancellati.
5. Avvia manualmente ogni slot e verifica SysInf e le funzioni.

Le immagini Bricohams rimangono **Beta senza convalida completa dell'avvio**,
anche quando la scrittura in Flash è stata verificata tramite CRC. Il catalogo
conserva i metadati originali: una verifica strutturale non diventa una
certificazione hardware. Per altre versioni è ancora disponibile il catalogo
delle release ufficiali; le varianti non compatibili con gli slot sono solo scaricabili.

Manutenzione: `npm run publish:firmware` verifica le cinque compilazioni
locali fissate tramite SHA-256 e recupera la release ufficiale v6.1.0 con gli
hash di GitHub. Il catalogo viene scritto solo dopo la convalida di tutti i file.
Sono distribuite le licenze GPL Bricohams e Apache upstream e i relativi avvisi.
Le opzioni, gli hash dei sorgenti integrati e il commit upstream sono in ogni
voce di `precompiled/catalog.json`; il generatore e i moduli sorgente si trovano
in questo repository. Il catalogo non include configurazioni o calibrazioni
degli utenti.

### Scrittura fisica verificata il 26-10-2026

Sull'unità UV-K5 V3 dichiarata dal proprietario sono stati scritti:

| Slot | Immagine | CRC verificato sulla radio |
| --- | --- | --- |
| 1 | BH ARDF | `47f33dcc` |
| 2 | BH Labs | `273d232d` |
| 3 | BH Satellite | `96d5b68b` |
| 4 | BH Spectrum | `702b5c07` |

Main/Fusion, configurazione attiva e calibrazione sono stati verificati senza modifiche.
Durante la scrittura non sono stati inviati reset CFG, cancellazioni di app né riavvii.
In seguito il proprietario ha avviato manualmente BH Labs e sono state verificate
letture reali, come descritto sotto. **L'avvio di ARDF, Satellite e Spectrum e
le prove di scrittura dei canali non sono ancora convalidati**:
i CRC non dimostrano l'esecuzione.
Sono state rilevate risposte perse e un blocco USB CDC con frame esattamente da 64 byte.
Il trasporto Quansheng aggiunge un byte nullo fuori da tali frame e riprova fino a quattro volte
solo lo stesso blocco NOR (come UV Studio); non riprova mai automaticamente cancellazioni,
reset o rifiuti del firmware.

Per usare lo slot 3 (BH Satellite), consulta [Introduzione al satellite](INICIACION-SATELITE.md)
e [Antenne satellitari](ANTENAS-SATELITE.md).

### Opzioni avanzate e ambito del ripristino
Il pannello **Strumenti Bricohams personalizzati** contiene accessi interni a
keyboard/reboot, firmware principale DFU v6/v7, backup/ripristino della calibrazione,
download/installazione del logo, backup/ripristino Flash, catalogo/ordinamento/cancellazione delle
app, slot e filtri/esportazione RF. Non apre UV Studio, non carica i suoi script
né delega queste operazioni a un altro sito. I link di provenienza e licenza
dei binari sono mantenuti: non sono dipendenze di esecuzione dell'interfaccia.
Il ripristino stock ricostruisce la Flash esterna e richiede il passaggio DFU,
con immagini distinte per UV-K1/UV-K5 V3, conservando la calibrazione originale.
Non va confuso con **Reimposta banco CFG**, che cancella solo un banco.

Sono disponibili pannelli nativi di manutenzione e ripristino di fabbrica/DFU,
con implementazione autonoma del protocollo pubblicato, senza copiare
l'interfaccia né il codice di UV Studio. Non c'è piena parità tra le versioni:
slot e canali mantengono il flusso v6; DFU accetta BIN v6 e pacchetti v7 FWAT/FWA1.
Le risorse v7 vengono installate solo nel firmware attivo con Build ID corrispondente e un nuovo backup.
Tutto il supporto v7 è stato testato in simulazione, non su questa radio fisica.
Metti in pausa il visualizzatore prima di avviare il tracking CAT: condividono la porta.
CAT e visualizzatore sono bloccati finché è in sospeso un ripristino di fabbrica.

**Firmware principale / DFU autonomo:** seleziona un BIN F4HWN v6.x PY32 da
256 byte a 118 KiB, oppure un pacchetto v7 con trailer FWAT e risorse FWA1.
Il pacchetto viene separato localmente: a DFU viene inviata solo l'immagine interna.
Vengono verificati limiti, lunghezze esatte, CRC del pacchetto e CRC delle risorse.
V7 senza pacchetto completo e versioni sconosciute vengono rifiutati.
L'immagine viene verificata in base a vettori, versione e SHA-256,
ma ciò non garantisce provenienza né compatibilità fisica. È richiesto un backup
completo e la frase `FIRMWARE PRINCIPAL UV-K5-V3` o `FIRMWARE PRINCIPAL UV-K1`.
La preparazione non scrive; salva una copia immutabile in memoria, blocca le altre
operazioni e abilita il pulsante DFU. Disconnetti qui, entra manualmente in
DFU con PTT e conferma `DFU PRINCIPAL UV-K5-V3` o `DFU PRINCIPAL UV-K1`.
Non chiudere la pagina né cambiare radio tra un passaggio e l'altro.

Questo flusso sostituisce il firmware interno, non il bootloader; non cancella la Flash esterna
né sincronizza l'immagine Main esterna del multiboot. Il selettore multiboot
può ripristinare un'altra immagine all'avvio: controlla gli slot e verifica manualmente.
Non è garantito il rollback. Vengono verificati bootloader, identificazione coerente,
numero di pagina e stato di ogni ACK. DFU non prevede rilettura: completare le
pagine non equivale a convalidare l'avvio o la RF. In caso di errore, conserva la pagina,
il backup e la stessa radio per riprovare. Testato solo in simulazione.

**Risorse esterne v7:** dopo DFU, avvia normalmente il firmware v7 e
connetti eseguendo un nuovo backup completo (se non è possibile completarlo,
la scrittura resta bloccata). Lo schermo può essere vuoto finché mancano le risorse.
Seleziona lo stesso pacchetto completo o il relativo FWA1 in **Risorse esterne v7**.
Verifica il file senza scrivere e conferma `RECURSOS UV-K5-V3` o
`RECURSOS UV-K1` per installare. Lo slot attivo e il Build ID vengono consultati tramite
`0x0750`; un Build ID diverso arresta il processo prima della cancellazione.

Viene cancellata solo la zona risorse dello slot attivo tramite `0x0752`, si scrive
in blocchi fino a 128 byte tramite `0x0754` e l'intestazione FWA1 di 32 byte
viene scritta alla fine. Si riprova un blocco identico solo in caso di timeout
(massimo quattro tentativi), mai le cancellazioni né i rifiuti. `0x0756` convalida
le risorse e la consultazione finale deve indicare stesso slot/Build ID, stato
valido e risorse caricate. Il permesso viene revocato dopo ogni tentativo
di cancellazione: riconnetti ed esegui un nuovo backup. Non è offerta la rilettura fisica
di una zona il cui indirizzo non è pubblicato qui; il risultato è una convalida
del firmware, non una prova dello schermo o dell'avvio. Un'interruzione può lasciare
risorse incomplete: conserva pacchetto e backup per il ripristino. Le risorse non
vengono installate negli slot inattivi né si usa la mappa v6 per v7.

**Registro RF autonomo:** filtra per nome della memoria, frequenza MHz ed
evento RX/TX/accensione. I filtri cambiano solo la vista, non eliminano
lo storico ricevuto. Esporta la selezione in CSV o l'intero registro in
JSON `bricohams-rf-log` v1. `exportedAt` è l'ora di esportazione, non l'ora
degli eventi; `eventUTCProvided` e `calibratedRF` sono false. Non si inventano
date UTC, RSSI calibrato né analisi dello spettro a partire dallo storico.

**Autorialità e diritti:** l'implementazione di questi strumenti è di Bricohams,
ma firmware, app e risorse di terze parti mantengono licenze e attribuzioni.
Riscrivere il sito non trasforma tali file in opere proprie né garantisce
l'assenza di contestazioni. Non vengono rimossi gli avvisi Apache/GPL né
ridistribuite nel sito le immagini stock.

**Tastiera remota nativa:** nel visualizzatore, richiede un backup completo della
connessione corrente, abilitazione manuale e conferma di ogni tasto. Offre
cifre, MENU, su/giù, EXIT, asterisco, cancelletto e F1/F2, con pressione breve
o lunga; non include PTT né scorciatoie globali. I tasti possono modificare
impostazioni e F1/F2 eseguire funzioni di trasmissione in base all'assegnazione.
Non presumere che sia solo RX. Ogni invio disabilita nuovamente la tastiera.
Viene segnalato solo l'invio UART, senza inventare un ACK di esecuzione; verifica l'LCD.
Si blocca se messo in pausa, se si perde il permesso/la connessione, se si avvia CAT o il ripristino di fabbrica.

**Riavvio nativo:** richiede un backup completo e la digitazione di `REINICIAR RADIO`,
anche in modalità avanzata. Mette in pausa il visualizzatore, invia un solo comando `0x05DD`,
revoca i permessi e chiude la connessione. Non riprova né afferma di aver ricevuto un ACK
o che la radio sia ripartita; verifica la radio e riconnetti per fare un nuovo backup.
Non cambia slot né banco CFG e può perdere lo stato transitorio.
Tastiera e riavvio sono stati testati in simulazione, non sulla radio fisica.

**Manutenzione nativa:** consente di scaricare/installare un logo BIN ST7565 o
PNG esattamente da 128 x 64, esportare/ripristinare i 512 byte di calibrazione e
esportare/ripristinare la Flash esterna da 2 MiB. Le scritture richiedono un backup
completo della connessione corrente e una conferma esplicita. Il logo viene riletto
e vengono verificati i dati adiacenti. Il ripristino Flash conserva l'intero
settore di calibrazione corrente, omette i settori identici e scrive i settori
di stato multiboot per ultimi. Sia Backup sia Restore verificano tutti i 512
settori da 4 KiB tramite il CRC fisico del firmware: il comando `0x073E`
non consente di interrogare tutti i 2 MiB in una sola volta. Il CRC globale salvato si
calcola localmente sull'immagine i cui settori sono già stati confrontati.
Il ripristino di calibrazione o Flash revoca il permesso di scrittura: riconnetti.
Non importare la calibrazione di un'altra radio.

**Ripristino di fabbrica nativo, irreversibile:** non è il reset CFG. Seleziona
il modello esatto e scarica i due BIN stock dai link dell'assistente. Vengono
verificati dimensione e SHA-256 rispetto alla revisione ufficiale fissata
`e7aa946f6de002559e1aaf3f91765db7fc2ed567`; i BIN non vengono ridistribuiti.

1. Esporta fuori dal browser il backup completo e verifica i due BIN.
2. Con la stessa radio connessa normalmente, conferma `FABRICA UV-K5-V3`
   o `FABRICA UV-K1`. Il passaggio 1 sostituisce slot, tutti i banchi canali,
   app e registri, ma conserva l'intero settore di calibrazione.
3. Attendi la verifica completa della Flash. Non chiudere né ricaricare la pagina:
   l'autorizzazione del passaggio 2 esiste solo in memoria. Non avviare normalmente
   prima di completare entrambi i passaggi e non cambiare radio.
4. Fai clic su Disconnetti; spegni la radio e tieni premuto PTT all'accensione per DFU
   (LED acceso, schermo spento). Rilascia PTT, seleziona il passaggio 2 e
   conferma `DFU UV-K5-V3` o `DFU UV-K1`.
5. L'assistente verifica il bootloader e la conferma di ogni pagina. Accetta solo
   bootloader `7.00.07` per V3 e `7.02.02` o `7.03.xx` per K1.
   I tentativi si limitano alla stessa pagina in caso di timeout, mai ai rifiuti.
   DFU non consente la rilettura: le pagine confermate non provano l'avvio.
6. Avvia manualmente e verifica versione, ricezione e funzionamento.
   Se il passaggio 2 fallisce, conserva la pagina e riprovalo con la stessa immagine.
   Se il passaggio 1 fallisce, non tentare DFU né l'avvio normale: conserva il
   backup, disconnetti qui e usa il ripristino ufficiale.

La manutenzione e DFU sono stati testati con dispositivi simulati. I
quattro file stock ufficiali sono stati scaricati e convalidati con il
verificatore di produzione. **Durante questi test non è stato eseguito sulla radio fisica un ripristino di fabbrica,
una calibrazione, un logo né un ripristino completo della Flash.**

| Opzione UV Studio | In questo sito | Accesso ufficiale aggiuntivo |
| --- | --- | --- |
| Visualizzatore LCD, acquisizione, tastiera breve/lunga e riavvio | Nativo, condivide la connessione; modifiche con conferma | Visualizzatore ufficiale |
| Registro RF, storico, filtri, CSV/JSON | Nativo, v2; esportazione locale | Altre visualizzazioni |
| Catalogo precompilato | Nativo, nove immagini fissate e catalogo dinamico | Catalogo dell'editor |
| Slot 1-4, cancellazione, CRC | Nativo con backup | Opzioni aggiuntive dell'editor |
| CFG 1-4 | Reset nativo separato dal firmware | Selezione del banco dalla radio |
| App Labs | Catalogo di sei app, elenco, esportazione, installazione, spostamento in uno slot vuoto, cancellazione singola/globale e verifica native | Catalogo esteso |
| Calibrazione | Backup/ripristino nativo, conferma e rilettura | Ripristino ufficiale |
| Flash esterna | Backup/ripristino nativo, settore di calibrazione protetto | Ripristino ufficiale |
| Firmware principale | DFU nativo BIN v6 o pacchetto v7 FWAT/FWA1 | Non sincronizza Main esterno |
| Risorse v7 | Native, solo slot attivo con Build ID, backup e convalida firmware | Nessuno slot inattivo né rilettura fisica |
| Logo | Download/installazione nativa BIN o PNG 128 x 64 | Editor ufficiale |
| Ripristino stock e DFU | Assistente nativo, due passaggi e hash/modelli fissati | Ripristino ufficiale |

## Avvio da 0 al 100 %

Percorso completo da una radio appena tolta dalla scatola a una radio
configurata, con backup e verificata. Ogni fase indica quando è completata.
Le fasi 9 e 10 sono facoltative.

| Fase | Cosa fai | Completata quando | Dettaglio |
| --- | --- | --- | --- |
| 0. Identificazione | Etichetta sotto la batteria, SysInf e versione del bootloader | Sai se è UV-K5 V3, UV-K1 o un'altra revisione | [Versioni](ATLAS-UV-K5-V3.md#versioni-e-come-identificarle) |
| 1. Preparazione del PC | Chrome o Edge desktop, cavo USB-C dati o cavo Kenwood, driver | La porta appare e nessun'altra applicazione la usa | [Driver](../../../ayuda.html#drivers) e [USB](AYUDA-CONFIGURACION.md#connessione-usb-senza-confondere-le-modalità) |
| 2. Backup | Calibrazione (512 byte), configurazione e, se il firmware lo consente, Flash completa | Hai i file fuori dal browser con il loro SHA-256 | [Calibrazione](ATLAS-UV-K5-V3.md#calibrazione) |
| 3. Scelta del firmware | Versione ed edizione (Fusion, FieldOps, Transfer, Labs) per l'hardware | File `.bin` scaricato dalla release ufficiale con hash verificato | [Edizioni](#quale-edizione-scegliere) e [versioni](#matrice-di-versioni-e-formati) |
| 4. Flash | Radio spenta, PTT premuto all'accensione, UV Studio o Bricohams Studio | Lo strumento conferma tutte le pagine e la radio si riavvia | [Bootloader](ATLAS-UV-K5-V3.md#bootloader-e-flashing) |
| 5. Primo avvio | Leggere SysInf e verificare la versione | La versione corrisponde al file flashato | Sezione successiva |
| 6. Impostazioni di base | Navigazione, batteria, schermo, squelch, TX e blocchi | Le impostazioni persistono dopo lo spegnimento e l'accensione | Tabella delle impostazioni di base |
| 7. Canali | Ripetitori, PMR solo RX, satelliti e nomi | Le memorie compaiono e vengono rilette identiche | [Memorie FM](#preparare-e-inviare-memorie-fm) |
| 8. Scansione | Elenchi, priorità e ripresa | La scansione percorre solo le memorie previste | [Scansione](#scansione-priorità-e-tasti) |
| 9. Multiboot (facoltativo) | Slot 1-4 e banchi CFG | Ogni slot supera il CRC e si avvia | [Slot e banchi](#slot-e-banchi-cfg-operazioni-diverse) |
| 10. Labs (facoltativo) | App overlay della stessa release | L'app si avvia e ritorna al firmware | [Labs](#labs-e-applicazioni) |
| 11. Verifica finale | Lista di controllo e nuovo backup | Hai un backup dello stato finale e le versioni annotate | [Lista finale](AYUDA-CONFIGURACION.md#lista-di-controllo-finale) |

### Fase 4, passo per passo: flash del firmware principale

1. Salva i backup della fase 2. Non proseguire senza aver salvato la calibrazione.
2. Chiudi CHIRP, CPS, le altre schede di Studio e la connessione normale di questo sito.
3. Spegni la radio. Tieni premuto PTT e accendila: il LED resta acceso
   con lo schermo spento. Rilascia PTT e collega il cavo USB-C.
4. In [UV Studio](https://armel.github.io/uvstudio/) o in
   [Bricohams Studio](https://brico-hams.github.io/Bricohams-Studio/) seleziona la
   porta. Il bootloader deve annunciare `7.00.07` (UV-K5 V3) o `7.02.02`/`7.03.0x`
   (UV-K1). Se mostra un'altra versione, fermati e verifica il modello.
5. Seleziona il `.bin` semplice dell'edizione. Mai un `*.packed.bin` (è per
   l'aggiornamento ufficiale) né un'immagine V1.
6. Conferma e non toccare la radio né il cavo finché tutte le pagine non sono
   confermate. Se si interrompe, la radio resta in modalità aggiornamento: ripeti dal
   passaggio 3 con lo stesso file.
7. La radio si riavvia da sola. Dopo aver flashato F4HWN, salva nuovamente la calibrazione
   con UV Studio, come raccomandato dal progetto.

### Fase 5: primo avvio

- Apri SysInf e annota versione ed edizione. Se non corrispondono al file, non
  continuare: ripeti la fase 4.
- La calibrazione non viene cancellata dal flash. Se la batteria indica 0 V o lo squelch
  non funziona correttamente, verifica che la calibrazione sia di questa radio prima di intervenire.
- Se i menu mostrano valori incoerenti dopo aver cambiato firmware,
  usa Reset solo dopo aver verificato i backup: l'ambito dipende dalla build.

### Fase 6: impostazioni di base consigliate

| Menu | Valore iniziale ragionevole | Motivo |
| --- | --- | --- |
| --- | --- | --- || SetNav | In base al modello (K1 o K5 V3) | Se le frecce sembrano invertite, è questa l'impostazione |
| BatTyp | Capacità effettiva della batteria | Indicatore di carica corretto |
| SetCtr, BLMin, BLMax, BLTime | Leggibili con il minimo consumo | Comfort e autonomia |
| Sql | 3-4 per iniziare | Chiude il rumore senza perdere segnali deboli |
| Step | Raster del servizio (12.5 o 25 kHz in VHF/UHF) | Sintonizzare i canali reali |
| RxMode | MAIN ONLY all'inizio | Sapere sempre da dove si trasmette |
| SetPTT | Classico | OnePush può continuare a trasmettere al rilascio |
| VOX | OFF | Evitare trasmissioni accidentali |
| TxTOut | 60-120 s | Interrompe un PTT bloccato |
| F Lock | Profilo della tua regione | Limita TX alle bande previste |
| SetLck | Tasti (e PTT se necessario) | Evita modifiche in tasca |
| ChDisp | Nome | Visualizza il nome della memoria in modalità MR |

Dopo aver modificato le impostazioni, spegni e riaccendi per verificare che siano state salvate.
Il significato di ogni menu è nel [dizionario dei menu](#dizionario-dei-menu-della-radio).

### Fasi 7 e 8: canali e scansione

- Questo sito prepara canali su un modello e li scrive con backup e rilettura
  ([memorie FM](#preparare-e-inviare-memorie-fm)). Puoi anche usare
  il driver CHIRP di ogni release F4HWN o Bricohams Studio.
- I canali importati hanno TXLock attivo. Rimuovilo solo per canali verificati
  e autorizzati ([dizionario dei canali](AYUDA-CONFIGURACION.md#glossario-del-canale-analogico)).
- Assegna ogni memoria al suo elenco (ScList), scegli le priorità (PriCh1/PriCh2)
  e la modalità di ripresa (ScnRev). Prova la scansione con SQL regolato.

## Ripristino alle impostazioni di fabbrica e recupero

| Situazione | Cosa fare |
| --- | --- |
| Vuoi tornare al firmware di fabbrica | Ripristino guidato di [UV Studio](https://armel.github.io/uvstudio/): ricostruisce la flash esterna senza toccare la calibrazione. Flashare solo il `.bin` di fabbrica può impedire l'avvio del K1 |
| La radio non si avvia dopo il flash | Entra in modalità aggiornamento (PTT all'accensione) e flasha di nuovo un `.bin` del modello corretto |
| Il bootloader non risponde o la porta non appare | Prova un altro cavo dati e un'altra porta; verifica che nessun altro usi la porta |
| Non c'è modo di entrare in modalità aggiornamento | Recupero tramite SWD con ST-Link ([SWD](ATLAS-UV-K5-V3.md#swd-e-recupero)). Solo con esperienza |
| Calibrazione persa o di un'altra radio | Ripristina il backup della fase 2. Non usare calibrazioni di altre unità |

## Beta: test USB reale e canali

### BH Labs avviato: verifica reale del 26-10-2026

Dopo aver selezionato manualmente lo slot 2, COM4 identifica **F4HWN v6.1.0**.
Sono stati verificati i CRC di Main e dei quattro slot Bricohams della tabella
precedente, e sono stati letti 38 canali dal banco attivo di BH Labs.

Il primo backup ha rivelato che `0x073E` rifiuta un intervallo da 2 MiB:
il firmware limita ogni interrogazione CRC a 4 KiB. Dopo aver corretto il sito,
è stato completato e salvato il backup dei 2 MiB, verificando i suoi 512 settori.
Sono stati salvati anche la calibrazione da 512 byte e Main da 120832 byte.
La calibrazione mantiene il precedente SHA-256
`f9c537df7a1764b31c73b3021dae69a1a654e267315f8c58c12bc4a3f1dd1a1b`.
Sono stati consultati 16 slot app vuoti ed è stato ricostruito ed esportato Tetris
dalla Flash fisica, con verifica del formato e dei CRC del file.

La configurazione attiva è stata riletta senza modifiche. Su una copia locale
di quella lettura reale sono state verificate creazione, modifica e cancellazione di un canale solo RX,
mantenendo i 38 canali originali e le impostazioni protette. **Durante questa
verifica non sono stati scritti canali, app, firmware, calibrazione né risorse.**
Questa prova di sola lettura non dimostra l'esecuzione di operazioni CRUD sulla radio
né l'isolamento fisico degli altri banchi.

### Letture storiche con Main/Fusion v6.0.0

Test di sola lettura eseguito il 25-10-2026 su COM4 (USB CDC
VID 36B7 / PID FFFF), modello dichiarato dal proprietario **UV-K5 V3**.
La radio identifica **F4HWN v6.0.0**; non si deduce automaticamente la scheda.

- Identificazione, calibrazione da 512 byte e configurazione logica da 41344 byte:
  corrette. Due letture indipendenti coincidono byte per byte e in SHA-256.
- Sono riconosciuti 200 canali esistenti. Le memorie con frequenza cancellata
  (`0`/`0xFFFFFFFF`) non vengono mostrate anche se conservano attributi residui,
  in base alla verifica del firmware.
- Consultazione degli slot: Main/Fusion, FieldOps, Labs, Doppler e Ardf, tutti v6.0.0.
  Vengono lette le intestazioni; non equivale a verificare il CRC di ogni immagine.
- Il comando Flash fisica `0x0738` non risponde in questo firmware. Prima
  veniva tentato durante il backup automatico e il timeout invalidava la connessione.
  Ora v6.0 salva una copia **parziale** (calibrazione/configurazione), mantiene la
  connessione di lettura e spiega il blocco della scrittura, senza tentare quel comando.
- Non sono stati scritti né cancellati canali fisici, firmware, slot o calibrazione.
  Non sono stati effettuati test RF né test hardware OpenGD77.

Nuova lettura il **26-10-2026**: COM4 risponde F4HWN v6.0.0 e restituisce
41344 byte con 200 memorie. Su una copia di quella lettura sono verificati
16 nuovi PMR (216 canali), modifica, assegnazione elenco e cancellazione locale,
senza cambiare i byte da `0x8800` in avanti. Il browser apre anche quella lettura reale
e rilegge i 16 PMR aggiunti. Non è stata inviata alcuna scrittura persistente.
CAT non è stato provato su quel firmware: non implementa il comando
CAT v1 dell'immagine Bricohams Satellites.

### Preparare e inviare memorie FM

1. Seleziona UV-K5 V3 o UV-K1 in base all'apparato e conferma il modello. Per leggere
   senza attendere la Flash completa, usa **Connetti in sola lettura / CAT**. Questa
   sessione non crea un backup né abilita scritture persistenti. La connessione
   normale mantiene il backup automatico obbligatorio per scrivere.
2. Fai clic su **Leggi canali dal banco attivo**. In v6.0 vengono mostrati automaticamente
   dalla copia parziale; dopo un backup completo viene letta anche la
   configurazione attiva. Per lavorare senza radio, apri una configurazione
   logica F4HWN v6 da esattamente 41344 byte, non un firmware o una Flash completa.
3. Prepara **PMR446 analogici 1-16 (solo RX)**, ripetitori FM o memorie SAT/Doppler
   dal pianificatore. Seleziona una memoria FM esistente come modello
   e fai clic su **Aggiungi canali al file locale aperto**. Il primo modello
   FM viene selezionato all'apertura del file e mantenuto aggiornando la tabella.
   Una configurazione senza memorie FM richiede un modello valido del proprio
   firmware; non vengono generati record arbitrari. Puoi anche importare
   canali FM da CSV CHIRP o OpenGD77 CPS; sono accettate solo frequenze VHF/UHF
   supportate e le righe DMR/altri formati sono escluse con indicazione del motivo.
   Il campo file ripetitori accetta gli stessi CSV e li porta direttamente
   in Canali preparati. Per il JSON RepeaterBook occorre confermare l'autorizzazione
e passare prima dalla tabella di selezione.
4. Le nuove memorie hanno TXLock attivo, toni e DTMF disattivati e Reverse
   disattivato. PMR viene preparato in banda stretta. Vengono importate solo RX/TX nominali tra
   136-174 o 400-470 MHz; ciò non autorizza la trasmissione. Nomi: primi 10
   caratteri ASCII. I duplicati vengono ignorati solo se la memoria equivalente ha
   TX bloccata; non è considerata valida una corrispondenza che consente TX.
5. **Modifica** cambia nome/RX/TX di una memoria FM e **Elimina dal file**
   rimuove quella memoria dalla copia locale. La modifica attiva il blocco TX e conserva
   i byte non appartenenti a questi campi; entrambe le operazioni lavorano su
   una copia in memoria. Verifica nuovamente il canale mostrato dal parser e
   fai clic su **Salva configurazione locale**, quindi salva il binario modificato
   separatamente dall'originale. Quando Chrome/Edge offre un selettore file, il sito scrive e
   chiude il file prima della conferma. Nei browser senza quel selettore viene solo
   richiesta una download: controlla Download e non confondere la richiesta con
   un salvataggio confermato. Salvare il progetto JSON o CSV non sostituisce questo binario.
6. **Scrivi e rileggi i canali (Beta)** è abilitato solo con un backup completo
   di questa sessione, tramite Labs v6.1+ con lettura Flash e CRC. Verifica che la
   radio sia ancora uguale a quando è stata letta, scrive blocchi da 8 byte e rilegge tutto.
   Durante la scrittura le memorie interessate vengono temporaneamente segnate vuote;
   vengono riattivate dopo i dati/nomi. Non è una transazione resistente a interruzioni di corrente.
   VFO, impostazioni, calibrazione e altri banchi sono protetti.
7. Dopo il successo, riavvia manualmente la radio per ricaricare le cache. Se fallisce,
   conserva backup e messaggio esatto; non presumere il successo da un ACK.

L'invio è stato verificato con trasporto simulato, **non su hardware**:
l'unità v6.0 connessa non consente il backup completo richiesto. L'unità non viene
aggiornata né flashata come effetto collaterale. La tabella orbitale SAT nativa non
viene installata: SAT/Doppler sono memorie FM. Il tracking continuo
CAT RX richiede specificamente l'immagine Bricohams Satellites con CAT v1.

### Simulare il ciclo multiboot senza scrivere su USB

La regressione automatizzata viene eseguita con:

```powershell
node --test --test-name-pattern="simulacion multiboot completa" tests\connectors.test.cjs
```

Usa esclusivamente un trasporto in memoria: non apre Web Serial, COM né USB.
Simula quattro installazioni con immagini di test, backup completo e autorizzazione
per sessione, intestazione scritta per ultima e CRC di ogni slot. Seleziona
manualmente nel modello banchi CFG distinti dal numero dello slot, per non confonderli.
In ogni banco importa 16 PMR, 11 REMER e un ripetitore CSV fittizio; scrive,
rilegge, modifica, cambia elenco, cancella e riutilizza la memoria. Verifica
l'isolamento dei banchi, Main, calibrazione e impostazioni protette. In Satellites
simula CAT RX e STOP senza modifiche persistenti. Rifiuta AM, che questo importatore non converte.

I CSV accettano zeri decimali finali come `145.600000` e offset `0.600000`,
senza arrotondare valori che richiedono più di cinque decimali significativi.
I ripetitori di test non sono un elenco aggiornato di frequenze reali.
Questa simulazione non esegue il firmware compilato, non verifica avvio, RF,
schermo, audio né l'isolamento fisico dei banchi della radio connessa.
Non abilita scritture né sostituisce il backup completo di quell'unità.

### Sezioni della pagina e tabelle dei canali

I passi laterali (Backup e connessione, Canali, Satelliti, Firmware, Strumenti) mostrano solo la sezione scelta. I collegamenti strumenti aprono la sezione della destinazione.

I vecchi collegamenti con frammento aprono la vista corrispondente e il frammento viene rimosso dall'URL. Il menu laterale scorre autonomamente nelle finestre basse. Le modifiche ai canali restano al cambio di vista; l'editor precede i cataloghi di preparazione.

Trascina una riga selezionata per spostare l'intera selezione nel suo ordine originale, oppure una riga non selezionata per spostare solo quel canale. Rilascia nella metà superiore della riga di destinazione per inserire prima, oppure nella metà inferiore per inserire dopo. Tutti i byte vengono conservati, inclusi toni, DCS e attributi non modificabili.

**Scarica canali della radio (backup originale)** rilegge e salva il banco attivo senza sostituire le modifiche locali. **Salva configurazione locale** salva la versione modificata. Modello, consenso alla lettura, stato, avanzamento e disconnessione sono disponibili in Canali.

**Aggiungi canale** richiede numero memoria, nome, RX, TX nominale e lista di scansione (0, 1-24 o 25). Lascia il numero vuoto per aggiungere in fondo, oppure in uno spazio libero se la memoria 1024 è occupata. Per un numero occupato scegli **Prima**, **Dopo** o **Annulla**; annullare non modifica il file. I nuovi canali sono solo RX e usano un modello FM esistente. Solo **Scrivi e rileggi canali** modifica la radio, con backup completo verificato.

Due tabelle: **Canali della radio**, letti dal banco attivo o dal file, e **Canali da caricare**, preparati da ripetitori, REMER, PMR446, SAT/Doppler, aeroporti, FM/CSV o copie dalla radio. Trascina una riga per spostarla e far scorrere le intermedie. Dalla tabella da caricare alla radio si inserisce prima della destinazione, o in fondo nell’area vuota. La copia dalla radio conserva ogni byte, DCS incluso. Usa Copia selezione / Incolla qui, o Ctrl+C / Ctrl+V con la tabella attiva. Incolla nella radio inserisce prima della prima selezione o in fondo senza selezione. Scorrono solo memorie contigue fino al primo spazio; le successive restano invariate. Modifiche locali, nessuna scrittura USB.

### Pulsanti Backup e Restore dei canali

#### Sostituzione eccezionale autorizzata del firmware legacy

L'API avanzata `BackupManager.authorizeSlotReplacement` consente di autorizzare
esclusivamente installazioni firmware negli slot 1-4 per F4HWN legacy con
backup parziale, dopo aver accettato letteralmente
`REEMPLAZAR SLOTS SIN RESPALDO DE FIRMWARE`. Questa accettazione significa perdere
le immagini precedenti senza una copia recuperabile; i relativi CRC non sono un backup.
Non si attiva con la connessione, con PRO né importando un file.

Prima di rilasciare tale autorizzazione vengono letti e salvati calibrazione e configurazione
della sessione corrente. Il registro parziale conserva l'accettazione, slot, nomi,
dimensioni e SHA-256 esatti delle immagini. Ogni installazione verifica di nuovo
quel registro e consuma una sola autorizzazione per quell'immagine e slot.
Tale permesso non consente la cancellazione separata di slot, Main, ripristino Flash,
scrittura canali, reset CFG né installazione/cancellazione di applicazioni.
Il sito normale mantiene i requisiti di backup completo.

Questo percorso segue il protocollo d'installazione di UV Studio: cancellazione di uno slot,
blocchi immagine, intestazione alla fine e CRC. Non è un backup completo né
una prova di avvio. Se la scrittura o la verifica falliscono, fermati e non
avviare quello slot. Prova manualmente ogni immagine e mantieni Main intatto.

**Backup del banco attivo** esegue una nuova lettura e salva il binario
da 41344 byte con data e SHA-256. Non scarica al suo posto l'edizione locale né
la sostituisce. Il risultato distingue un file scritto da un download
richiesto. È una copia logica, non un backup di Flash, firmware o calibrazione.

**Restore: apri copia dei canali** richiede di connettersi e leggere prima il banco
di destinazione. Convalida dimensione, struttura e versione identica; copia solo memorie,
nomi e attributi fino a `0x8800` sopra la lettura del banco di destinazione. Ne conserva
le impostazioni e chiede conferma prima di sostituire l'edizione locale. Può recuperare
canali con TX abilitata: controlla prima di scrivere. Non scrive da solo:
per inviare si usa **Scrivi e rileggi i canali**, con i suoi requisiti di backup
completo, conferma e rilettura. Non importa backup Flash né pacchetti UV Studio.

### Modelli regionali e file preconfigurati

Nella sezione Ripetitori, **Prepara 3 ripetitori Bricohams Murcia** aggiunge ED5YBF
Carrascoy, ED5YAK ed ED5YAL Sierra Espuna, trascritti dal `PRESET_CSV` dello ZIP
Bricohams Studio fornito. È possibile scaricare il file CHIRP CSV senza dipendere
da servizi esterni. Tutto è solo RX; il CSV usa Duplex off e TX nominale nei
commenti. La validità non è confermata e CTCSS non viene programmato.

**Modelli Murcia** mostra e scarica separatamente:

- Aeroporti LEMI, LELC e LEAL e frequenza di guardia 121.500 MHz: 15 servizi AM in JSON.
  Portanti RF e designatori 8.33 kHz restano separati. Fonte:
  [AIP ENAIRE](https://aip.enaire.es/), AD 2.18 di ciascun aeroporto,
  consultata il 26-10-2026. Le coordinate dell'aeroporto sono approssimative.
  Verifica AIP e NOTAM vigenti; non usare il modello per operazioni aeronautiche.
- FM Murcia: 15 voci di Onda Regional e OR Musica, tratte da
  [Dove ascoltarci](https://www.orm.es/donde-escucharnos/), consultata il
  26-10-2026. È una selezione di radiodiffusione, non tutte le emittenti commerciali.
  Non ci sono coordinate verificate dei trasmettitori né filtri di prossimità.
- REMER: download degli 11 canali VHF già disponibili, in CSV solo RX.
  Selezione e preparazione individuale restano nella scheda REMER.

AM e radiodiffusione WFM sono modelli per consultazione/esportazione, non vengono convertiti
in FM di comunicazione. L'attuale editor delle memorie Quansheng non li installa;
sono necessari un ricevitore e un formato compatibili. I download non provano ricezione,
attività né scrittura su hardware.

### Elenchi di scansione per zona o area geografica

Le nuove memorie partecipano per impostazione predefinita a tutti gli elenchi (valore 25);
non restano con partecipazione zero. Puoi scegliere un solo elenco 1-24 per
il gruppo, zero per non partecipare, o raggruppare per zona, provincia/regione o
località. Il raggruppamento riserva elenchi numerici liberi senza sostituire
quelli esistenti. Se manca il campo scelto o non ci sono elenchi liberi, il gruppo
viene rifiutato senza modificare l'immagine. Non si deduce la provincia
in base alla frequenza né si usa la geolocalizzazione implicitamente.

REMER include la propria zona; RepeaterBook conserva regione/località. Un CSV può
includere colonne aggiuntive `Zone`, `Region`/`State`, `City` e `Country`.
Senza di esse puoi usare un solo elenco o la zona generica del formato CSV.
Il report indica il numero assegnato a ogni nuovo gruppo: annotalo prima di
chiudere. Non cambia nomi degli elenchi, priorità, ALL/MIX né impostazioni globali.
I duplicati ignorati mantengono l'elenco precedente.

Per cambiare i canali esistenti, selezionali nella tabella, scegli **Assegna
selezione a elenco** e fai clic su **Applica elenco al file locale**. Puoi anche
modificare l'elenco di una singola memoria. L'assegnazione rimuove
il contrassegno di esclusione dalla scansione, ma mantiene frequenze, toni, modalità
e blocco TX. Salva il binario e verifica ScList sulla radio dopo
una scrittura autorizzata. Non sono zone DMR né più gruppi simultanei per
canale; ogni memoria ha un numero nativo di partecipazione.

### Passaggi salvati e CAT RX

**Salva piano dei passaggi JSON** conserva TLE, posizione, orari e la frequenza
FM selezionata. **Riapri piano dei passaggi JSON** richiede il consenso per
usare la posizione del file, convalida i dati e ricalcola gli orari in base
all'ora corrente senza consultare fornitori. Gli orari precedenti non vengono usati
per controllare CAT. Un TLE scaduto viene rifiutato: aggiorna gli elementi e ricalcola.
I vecchi piani senza frequenza possono essere aperti, ma occorre consultare
e selezionare di nuovo la frequenza FM.

Per trasferire un passaggio alla configurazione: seleziona frequenza e passaggio,
**Prepara canali con Doppler corretto**, **Carica SAT / Doppler preparati**
e **Salva configurazione locale**. Salvare gli orari non installa TLE nel
firmware. Queste opzioni non registrano l'audio della radio.

Per CAT: connettiti in sola lettura, avvia manualmente l'immagine Bricohams
Satellites corretta, entra in SAT RX, premi 8 e seleziona la conferma
firmware nel pannello. Non tentare CAT su F4HWN originale, ARDF o Spectrum:
non implementano il comando privato. Seleziona un passaggio attualmente visibile e
tieni la pagina in primo piano. I comandi RX scadono dopo 3 secondi;
la cadenza del browser sottrae il tempo di risposta di ogni comando.
Fermarsi non invia una nuova sintonia se SAT RX è già disattivato.

I test automatizzati e del browser verificano PMR, modifica, elenchi ed
esportazione su dati sintetici e sulla configurazione letta dall'unità.
La lettura USB reale non equivale alla verifica della scrittura, dello schermo o della RF. Senza
backup completo e un banco inequivocabile, la scrittura fisica non è dichiarata
verificata e non vengono modificati slot o calibrazione.

### Multiboot e canali indipendenti per profilo

Il connettore legge solo la configurazione logica presentata dalla radio avviata.
Non seleziona slot firmware né banchi CFG, e non dimostra che il profilo o
lo slot visibile corrisponda allo spazio di memoria in cui si scriverà. Non esiste
un'operazione web che distribuisca un piano canali a tutti gli slot.

Per mantenere profili separati, avvia manualmente ogni profilo/banco che
vuoi gestire e ripeti il flusso di lettura ed esportazione **separatamente**.
Etichetta ogni file con modello/revisione, versione e profilo firmware, banco
CFG se verificabile sulla radio, e data; conserva anche il relativo hash SHA-256.
Prima di modificare un altro profilo, salva e chiudi il file precedente. Confronta
le letture: se il firmware non consente di identificare lo slot o due backup non
dimostrano l'isolamento, considera la separazione non verificata e non scrivere.
Non copiare un file da un profilo all'altro presumendo che le memorie siano
condivise o rimangano indipendenti.

In questa sessione non è stato eseguito un nuovo test USB. Per l'unità documentata in precedenza
(F4HWN v6.0.0), il backup disponibile è ancora parziale e la scrittura fisica resta bloccata.
Le nuove funzioni per modificare, cancellare e verificare canali dopo l'importazione
sono convalide del file locale, non una prova che il firmware li mostri sul display né
che la modifica sia stata trasferita a uno slot fisico. Consulta [REMER, aeroporti e FM commerciale](AYUDA-ANYTONE.md)
per le differenze tra preparazione locale, compatibilità del parser e test RF.
## Scegliere l'hardware prima del firmware

| Radio/revisione | Relazione con questo sito | Regola |
| --- | --- | --- |
| UV-K1 / UV-K1(8) PY32 | Destinazione UV-K1 del catalogo/connettore | Verifica scheda e identificazione; non usare un'immagine V1 |
| UV-K5 V3 PY32 | Destinazione UV-K5-V3 | L'appartenenza alla stessa famiglia non consente di ignorare la revisione reale |
| UV-K5(8), UV-K6, UV-K5+ V1 | Karina V1/OneOfEleven o altri progetti V1 | Fuori dal connettore slot PY32 |
| UV-K5 V2 | Hardware diverso | Né V1 né V3 per somiglianza esteriore |
| UV-K5(99) ed etichette commerciali | Il nome può comprendere revisioni diverse | Identifica MCU/revisione in base alla fonte del progetto |
| TK-11 e Baofeng dall'aspetto simile | Non sono destinazioni del connettore | Non usare queste immagini |

Il manuale ARDF avverte persino della presenza di etichette V3 su hardware V2. L'etichetta
aiuta ma non è una prova univoca. USB-C non garantisce che ogni firmware utilizzi
lo stesso protocollo né che la porta sia adatta alla programmazione per ogni revisione.

## Matrice di versioni e formati

| Ramo | Catalogo | Edizioni/varianti | Scrittura da questo sito |
| --- | --- | --- | --- |
| F4HWN v4.x | Release stabili riconosciute con file specifico `k1` o `k5v3` | Fusion, possibili SA818 secondo la release | Solo download |
| F4HWN v5.x | Release stabili riconosciute e hash pubblicato | Fusion, possibili SA818 | Solo download |
| F4HWN v6.x | Release stabili riconosciute e hash pubblicato | Fusion, FieldOps, Transfer, Labs secondo la release | Solo immagini non SA818, ispezionate e con backup completo |
| Sviluppo/beta/rolling | Escluse dal catalogo stabile | Non sono equiparate a release | La libreria blocca i nomi noti di queste varianti |
| ARDF V3/UV-K1 | Fonte reald separata | Versioni ARDF-K5v3_K1 | Solo download; vedi [ARDF](AYUDA-ARDF.md) |
| Stock | Non selezionato come F4HWN | Immagine del produttore | Questo inspector non lo installa negli slot |
| Karina V1 | Documentazione del pacchetto | RAW e packed V1 | Bloccato per incompatibilità PY32 |
| Karina V3/K1 di Dim0s | ZIP separato ispezionato, con vettori PY32 | RAW e packed per hardware | Non abilitato: multiboot Armel e sorgenti non verificati |
| Bricohams V3 | Generatore locale v6.1.0 | Fusion e Labs generate | Preparazione negli slot, stesse protezioni, sperimentale |

I nomi storici Bandscope, Broadcast, Basic, RescueOps o Game che compaiono
nei vecchi documenti non corrispondono uno a uno ai preset v6.
Non convertire le relative impostazioni in base alla posizione del menu. Per l'inventario esatto delle
opzioni e dei valori predefiniti, usa [opzioni](AYUDA-OPCIONES-F4HWN.md) e
[preset per commit](F4HWN-PRESETS.md).

Il selettore consulta release autorizzate, scarta prerelease/draft,
verifica nome, versione, dimensione e digest SHA-256 pubblicato da GitHub.
Non mostra un catalogo parziale come se fosse completo in caso di errori.
La versione installata va letta in SysInf, non dedotta dall'ultimo file
scaricato. Un aggiornamento può modificare persistenza e compatibilità CFG.

### Inventario delle release riconosciute il 25-10-2026

Consultazione in tempo reale per UV-K5-V3: 41 immagini riconosciute, non un elenco
di tutti i file nei repository. Per UV-K1 le v4 devono essere le immagini
specifiche per K1. Ogni link contiene le note della versione;
questa tabella non inventa differenze funzionali non verificate tra patch.

| Versione | Edizioni riconosciute | Trattamento |
| --- | --- | --- |
| [v6.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.3.0) | Fusion, FieldOps, Labs, Transfer | Preparabili dopo verifiche e backup |
| [v6.2.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.2.0) | Fusion, FieldOps, Labs, Transfer | Idem; controllare modifiche a dati/API |
| [v6.1.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.1.0) | Fusion, FieldOps, Labs, Transfer | Base locale Bricohams, non identica identità dell'edizione |
| [v6.0.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.0.0) | Fusion, FieldOps, Labs, Transfer | Non presumere il lettore fisico Labs v6.1+ |
| [v5.9.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.9.0) | Fusion e SA818 | Solo download |
| [v5.8.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.8.0) | Fusion e SA818 | Solo download |
| [v5.7.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.7.0) | Fusion e SA818 | Solo download |
| [v5.6.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.6.1) | Fusion e SA818 | Solo download |
| [v5.6.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.6.0) | Fusion e SA818 | Solo download |
| [v5.5.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.5.0) | Fusion e SA818 | Solo download |
| [v5.4.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.4.0) | Fusion e SA818 | Solo download |
| [v5.3.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.3.1) | Fusion | Solo download |
| [v5.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.3.0) | Fusion | Solo download |
| [v5.2.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.2.0) | Fusion | Solo download |
| [v5.1.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.1.0) | Fusion | Solo download |
| [v4.3.2](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v4.3.2) | Fusion per hardware | Solo download |
| [v4.3.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v4.3.1) | Fusion per hardware | Solo download |
| [v4.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v4.3.0) | Fusion per hardware | Solo download |
| [ARDF v0.5.1](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.5.1) | ARDF | Solo download |
| [ARDF v0.5](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.5) | ARDF | Solo download |
| [ARDF v0.4](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.4) | ARDF | Solo download |
| [ARDF v0.2](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.2) | ARDF | Solo download |

## Quale edizione scegliere

| Edizione | Orientamento del profilo v6 | Precauzione |
| --- | --- | --- |
| Fusion | Uso generale, spettro, scansione, multiboot/CFG secondo preset | Non include per questo il lettore fisico completo di Labs |
| FieldOps | Funzioni sul campo, Fox Hunt/Beacon e RescueOps secondo preset | Verifica le funzioni TX; non è omologazione per le emergenze |
| Transfer | Enfasi su trasferimento/AirCopy secondo preset | Richiede un endpoint/protocollo compatibile, non sostituisce un backup completo |
| Labs | App overlay, diagnostica e lettura/scrittura esterna se abilitata | Sperimentale; ABI/API e comandi cambiano |
| Max | Profilo disponibile nel catalogo delle opzioni v6.3.0 | Non presumere che esista un binario di release o che sia compatibile con qualsiasi modifica |
| Custom | Profilo ridotto configurabile | Il multiboot non è garantito; il generatore locale qui non lo accetta |
| Bricohams | Identità di edizione propria basata sui profili v6.1.0 fissati | Non è Karina né firmware ufficiale firmato |

I valori esatti ON/OFF sono più affidabili del nome commerciale del profilo.
Per esempio, Labs richiede opzioni specifiche per la Flash fisica per il
backup richiesto da questo sito.

## Dizionario dei menu della radio

I nomi seguenti provengono da `MenuList` del codice v6.1 esaminato.
Un menu condizionato potrebbe non esistere nella tua compilazione. Si usa il nome,
non un numero fisso che cambia quando si includono/escludono funzioni.
«Salva canale» significa rendere persistente la memoria; non tutte le modifiche
temporanee in MR vengono salvate automaticamente.

### Canale, ricezione e toni

| Menu | Spiegazione e verifica |
| --- | --- |
| Step | Passo del VFO; non larghezza del filtro. Scegli il raster del servizio in ascolto |
| Power | Livello RF per canale/VFO. I valori nominali non garantiscono la potenza misurata |
| RxDCS / RxCTCS | Filtro subaudio in ricezione. Disattiva per diagnosticare il silenzio |
| TxDCS / TxCTCS | Codice/tono trasmesso. Solo quello richiesto dal sistema |
| TxODir | Direzione dello shift TX: OFF, + o - nella base esaminata |
| TxOffs | Entità dello shift. Verifica la frequenza TX risultante |
| W/N | Canale FM largo/stretto; SetNFM può selezionare la variante stretta |
| BusyCL | Impedisce TX se rileva il canale occupato secondo il criterio impostato |
| Compnd | Compander audio; richiede compatibilità dell'interlocutore |
| Mode | Demodulazione RX disponibile in quella build; non cambia hardware né permessi TX |
| TXLock | Blocco trasmissione del canale; mantienilo sui canali di ascolto |
| Sql | Soglia squelch; zero può lasciare il rumore continuamente aperto |
| RxMode | Determina ascolto e risposta TX; verifica quale VFO trasmetterà |
| ChList | Consultazione/selezione delle memorie secondo il contesto dell'interfaccia |
| ChSave | Salva in memoria; verifica la destinazione prima di sostituirla |
| ChDele | Cancella memoria; non equivale a cancellare solo il nome |
| ChName | Nome del canale; non modifica la frequenza |

### Scansione, priorità e tasti

| Menu | Spiegazione e verifica |
| --- | --- |
| ScList | Elenco scansione attivo; verifica che non sia vuoto |
| ScPri | Uso dei canali prioritari nel ciclo |
| PriCh1 / PriCh2 | Memorie prioritarie; non sono VFO A/B |
| ScnRev | Ripresa: portante, tempo o arresto secondo la build |
| F1Shrt / F1Long | Funzione di pressione breve/lunga del tasto laterale 1 |
| F2Shrt / F2Long | Funzione di pressione breve/lunga del tasto laterale 2 |
| M Long | Azione assegnata alla pressione prolungata di MENU |
| KeyLck | Blocco automatico e ritardo; diverso da SetLck |
| 1 Call | Canale di chiamata rapida; verifica che la memoria scelta sia corretta |
| SetScn | Modalità/velocità scansione quando compilata; più veloce non garantisce rilevamento migliore |
| SetKey | Impostazioni tasti RescueOps; solo se il profilo le include |

In v6.1 sono descritti 24 elenchi con nome e le combinazioni ALL e MIX. ALL
esclude le memorie escluse e MIX combina gli elenchi selezionati. Non estendere
questa capacità a v4/v5. Le priorità di Full Watch derivano dalle priorità degli
elenchi; duplicati/voci non valide non creano nuovi ricevitori.

### Audio, DTMF e trasmissione

| Menu | Spiegazione e verifica |
| --- | --- |
| TxTOut | Limite continuo di TX; diverso dalla selezione dell'avviso SetTOT |
| Mic | Guadagno microfono; un livello eccessivo causa distorsione, non più potenza utile |
| MicBar | Indicatore di livello; non sostituisce la misurazione della deviazione |
| Beep | Avvisi tastiera/interfaccia; regola il volume prima di usare le cuffie |
| Voice | Indicazioni vocali solo se compilate |
| Roger | Avviso di fine TX; usalo solo dove consentito e appropriato |
| STE / RP STE | Gestione della coda squelch locale/ripetitore, dipendente dall'altro endpoint |
| ANI ID | Identificatore DTMF quando la chiamata DTMF è compilata |
| UPCode / DWCode | Sequenze configurate d'identificazione/controllo DTMF; non inviarle a sistemi senza autorizzazione |
| PTT ID | Momento/uso dell'identificativo quando si aziona PTT |
| D ST | Audio locale associato a DTMF secondo l'implementazione; non è Time Slot DMR |
| D Resp / D Hold | Risposta e mantenimento delle chiamate DTMF quando abilitate |
| D Prel | Parametro di preambolo/temporizzazione DTMF; mantieni il valore predefinito salvo requisito del sistema |
| D Decd / D List | Decodifica/elenco DTMF della funzione di chiamata |
| D Live | Visualizzazione del DTMF ricevuto; non rende privata la trasmissione |
| VOX | Attivazione tramite audio; disattivala per la diagnostica e per evitare TX accidentale |
| SetPwr | Livello utente usato da Power=USER |
| SetPTT | PTT classico o bloccato OnePush; il secondo può continuare a trasmettere al rilascio |
| SetTOT | Tipo di avviso di timeout, non la sua durata |
| SetEOT | Avviso di fine trasmissione; verifica suono/indicazione visiva in base all'uso |
| SetRxA | Profilo audio RX quando AUDIO è abilitato |
| SetVol | Regolazione audio RX via firmware, diversa dal comando fisico |
| SetNFM | Variante del filtro stretto 12.5/6.25 kHz documentata da upstream; non è il passo VFO |

### Schermo, alimentazione e opzioni avanzate

| Menu | Spiegazione e verifica |
| --- | --- |
| BatSav | Risparmio in ricezione; può ritardare il rilevamento di attività |
| BatTxt | Visualizzazione della batteria |
| ChDisp | Nome/frequenza/numero secondo la modalità di visualizzazione |
| POnMsg | Messaggio di accensione; non prova l'autenticità del firmware |
| BLTime | Durata della retroilluminazione |
| BLMin / BLMax | Luminosità minima/massima; devono essere leggibili |
| BLTxRx | Attivazione luce durante TX/RX |
| SysInf | Versione/build, batteria e pagine diagnostiche secondo le opzioni |
| SetCtr | Contrasto schermo, non guadagno RF |
| SetInv | Inversione colori/pixel |
| SetLck | Ambito del blocco: tasti o anche PTT secondo la build |
| SetMet | Stile S-meter; i valori non equivalgono a uno strumento da banco calibrato |
| SetGUI | Stile/dimensione delle informazioni VFO |
| SetTmr | Visualizzazione dei tempi RX/TX |
| SetOff | Timer deep sleep; può interrompere una sessione |
| SetSav | Visualizzazione/logo di risparmio quando compilato |
| SetCfg | Applica un altro banco configurazione senza cambiare firmware |
| SetNWR | Funzione NOAA se compilata e applicabile alla regione |
| F Lock | Profilo bande; non è omologazione né permesso di ampliare TX |
| 350 En | Accesso in ricezione a una gamma aggiuntiva secondo la build; non autorizza la trasmissione |
| FrCali | Regolazione riferimento frequenza se compilata; richiede strumentazione |
| BatCal | Calibrazione della lettura della tensione; non caricare valori di un'altra unità |
| BatTyp | Profilo capacità batteria; non riparazione né calibrazione RF |
| SetNav | Disposizione navigazione UV-K1 rispetto a UV-K5 V3 |
| Reset | Ripristino impostazioni; ambito dipendente dalla build, con rischio di perdita |

I menu `Scramb`, `Tx 200`, `Tx 350`, `Tx 500`, `ScraEn` o `NOAA-S` possono
comparire in rami senza il livello F4HWN. Sono citati per identificazione storica,
non come opzioni abilitate nei profili pubblicati né istruzioni per
sbloccare trasmissioni. Uno scrambler non va considerato cifratura sicura.

## RxMode e Full Watch

In v6.1 Full Watch visita VFO A, B e priorità valide. Non sono quattro
ricevitori indipendenti. FULL RX/RESPOND può rispondere sull'ultimo canale
ricevuto; MAIN TX/FULL RX mantiene TX sul principale. Prima di usare PTT verifica
l'indicazione di destinazione. Per la diagnostica scegli MAIN ONLY.
Le modalità schermo DUAL/CROSS non vanno confuse con la configurazione del
ripetitore né presunte come ripetizione automatica tra bande.

## Slot e banchi CFG: operazioni diverse

| Elemento | Contenuto | Cosa comporta la modifica |
| --- | --- | --- |
| Main | Copia base gestita dal firmware, non bootloader | Protetta dal sito |
| Slot 1-4 | Immagine firmware aggiuntiva nella Flash esterna | Ripristinare un'immagine nel processore dalla radio |
| CFG M/1-4 | Canali, VFO, impostazioni ed elenchi indipendenti | Caricare un'altra configurazione compatibile |
| App Labs | Codice/risorse con ABI/API specifica | Eseguire una funzione in overlay RAM, non cambiare l'intero firmware |

Nell'upstream v6.1 esaminato il selettore si apre premendo MENU all'accensione.
Conferma il ripristino sulla radio stessa; non spegnerla durante l'operazione.
SetCfg cambia banco senza ripristinare il firmware. Il sito non inventa un comando remoto
per nessuna di queste azioni.

Per preparare dalla libreria, scegli una cartella, seleziona una voce supportata,
controlla nome/hash e fai clic su Prepara. Non scrive. L'installazione richiede
una connessione compatibile, un backup Flash completo e una conferma. Viene verificato il CRC dello slot.
Vettori e stringa F4HWN corretti non provano che il codice sia autentico.

## Labs e applicazioni

La base esaminata documenta 16 slot e app radio, APRS, SSTV,
diagnostica e demo. L'insieme cambia tra release; non tutte le app
sono disponibili o compatibili con tutte le build.

**Catalogo di app Labs precompilate:** include SystemInfo, BroadcastFM,
Cube3D, Tetris, Breakout e Minesweeper della release upstream v6.1.0.
Sono distribuite insieme al sito, anche nell'esportazione statica, senza compilazione.
Sono Apache-2.0 e mantengono l'autorialità originale; non vengono rinominate come proprie.
Sono verificati SHA-256, dimensione, FAP1, nome, versione, ABI e API minima.
Tutte richiedono ABI 1 e API minima 2; conferma la compatibilità con Labs
attivo. Non esiste una certificazione d'avvio per questa unità.

Seleziona modello e app, conferma la compatibilità e fai clic su **Verifica e
prepara app**. Questo prepara soltanto il file: consulta gli slot, seleziona
la destinazione e fai clic separatamente su **Installa app e verifica**.
È anche possibile scaricare il file e il relativo manifest. Le app non vengono
installate né eseguite automaticamente. Il catalogo di test esclude beacon e app di soccorso;
il catalogo completo rimane in UV Studio. Non garantisce l'isolamento:
ogni app nativa ha accesso alla radio.

Il manutentore rigenera questo catalogo con
`node scripts/publish-firmware.cjs --apps-only`: accetta solo i sei
file archiviati e gli hash fissati; rifiuta qualsiasi modifica.

Il connettore verifica FAP1, limiti di codice/risorse e CRC delle risorse, e
rilegge i blocchi scritti. L'accettazione dell'intestazione non dimostra che un'app
possa essere eseguita: ABI, API e capacità possono rifiutarla al caricamento/esecuzione.
Usa firmware e app della stessa release. Installare un'app di origine
sconosciuta equivale a dare a codice nativo accesso alla radio.

**Esporta app dallo slot** ricostruisce il file FAP1 da intestazione,
codice e risorse fisiche e ne verifica i CRC prima di richiedere il download.
Richiede firmware con lettura Flash fisica; non è un download dal catalogo.

**Sposta app nello slot vuoto** consente di riordinare senza sovrascrivere un'altra app.
Seleziona origine e destinazione vuota, quindi digita la conferma visualizzata.
Prima installa/rilegge/verifica la destinazione; solo dopo cancella l'origine e
controlla che sia vuota. Non è atomico: un'interruzione può lasciare due
copie, oppure una copia incompleta di destinazione con l'origine intatta. Conserva
il backup e consulta nuovamente gli slot prima di riprovare. Per
scambiare due app occupate, usa come temporaneo un terzo slot vuoto.
Non esegue app né certifica compatibilità ABI/API.

**Cancella tutte le app** richiede backup completo e la frase
`BORRAR TODAS LAS APPS`, anche in modalità avanzata. Viene consultato il numero
reale di slot (16 o 48 secondo il firmware), vengono cancellati solo quelli occupati e
si verifica che siano tutti vuoti. Un errore interrompe il processo senza dichiarare
il successo globale; una cancellazione parziale non viene annullata automaticamente. Non tocca
canali, configurazione, firmware né calibrazione. Queste nuove operazioni
sono state verificate con radio simulata; non sono state eseguite sull'unità fisica.

APRS TX richiede configurazione legale di nominativo/SSID, posizione e percorso.
Questo sito non trasmette caricando un `.app`; non configura beacon automatici
come parte di un backup. Le funzioni di emergenza/EPIRB sono citate come
inventario upstream: non provare trasmissioni sulle frequenze di soccorso.

## Problemi comuni

| Sintomo | Verifica |
| --- | --- |
| Si avvia ma SetCfg non compare | Controlla le opzioni multiboot della build, non solo la versione |
| Lo slot mostra dati ma CRC errato | Non ripristinare; conserva file e backup |
| USB si identifica ma la lettura Flash fallisce | Potrebbe mancare il comando Flash fisica Labs; chiudi altri programmi e annota la build |
| I tasti sembrano invertiti | Controlla SetNav/modello; non flashare un'altra famiglia per correggerlo |
| Le modifiche alle impostazioni scompaiono | Salva la memoria o verifica banco CFG e persistenza |
| Non si sente un ripetitore | RX, modalità, SQL e filtro RX; non iniziare aumentando la potenza TX |
| Un'app non si esegue | Verifica ABI/API/caps e release; non ripetere scritture alla cieca |
| SA818 o packed bloccato | È intenzionale; non rinominare per aggirare la restrizione |

## Fonti e manutenzione

- [Progetto PY32 e README](https://github.com/armel/uv-k1-k5v3-firmware-custom).
- [Release per versione](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases).
- [Preset v6.3.0 fissati](https://github.com/armel/uv-k1-k5v3-firmware-custom/blob/ca3a4271386049e7b459b215cef0ad0eea1a30ca/CMakePresets.json).
- [Menu v6.1 esaminato](https://github.com/armel/uv-k1-k5v3-firmware-custom/blob/f556a96e73c3e423a00cf473aeb37f827cac05a5/App/ui/menu.c).
- [UVTOOLS2 del progetto](https://armel.github.io/uvtools2/).
- [Driver CHIRP dedicato](https://github.com/armel/uv-k5-chirp-driver).
- [Bricohams, hash e compilazione](BRICOHAMS-FIRMWARE.md).
- [Karina V1 e limiti di licenza/sorgenti](KARINA.md).
- [Atlante tecnico UV-K5 V3: hardware, protocolli e schemi](ATLAS-UV-K5-V3.md).

Per un firmware stock, UVMOD o OneOfEleven, consulta il progetto e l'hardware
specifici: l'equivalenza di menu/EEPROM con questa guida non è garantita.
Per i link aggiunti dall'utente, vedi [Egzumer V1](AYUDA-EGZUMER.md) e
[pack Dim0s con Karina V3/K1](AYUDA-PACK-DIM0S.md).
