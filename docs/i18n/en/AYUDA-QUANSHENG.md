# Quansheng: F4HWN, versions and configuration

Revision: 26-10-2026. Inspected functional baseline: Fusion61, commit
`f556a96e73c3e423a00cf473aeb37f827cac05a5`; modular web catalog v6.3.0,
commit `ca3a4271386049e7b459b215cef0ad0eea1a30ca`.
This guide does not automatically attribute v6.1/v6.3 features to v4 or v5.
For how the radio works internally (pins, memories, protocol, bootloader,
schematics, and photos), see [UV-K5 V3 technical atlas](ATLAS-UV-K5-V3.md).

## Simple channels and country templates

In Channels follow three steps: read the radio, choose a template, then review/save.
The right panel offers Spain, UK, United States, Germany, France, Hungary and Italy,
with region/state and location filters. Results are paginated in groups of 50;
nothing is selected automatically. Selecting all requires at most 1024 channels:
choose a state first for the USA. Adding changes only the local file and needs an
existing FM memory as its base. Save downloads the file; writing still requires
the complete backup and reread protections. Backups, scan lists, CSV and dragging
remain available in advanced options.

Data comes from [HearHam](https://hearham.com/repeaters), which permits its API in
online/offline apps, and public-domain Natural Earth administrative boundaries.
RepeaterBook is not mirrored. The catalog contains available operational VHF/UHF FM
records, not every repeater in each country: coverage is particularly limited in
Hungary and Italy. Check the date, area, activity and permissions. Tones and nominal
TX are informational; importing blocks TX. PMR446 is optional, RX only, unavailable
for the USA and does not authorize amateur-radio equipment to transmit.
SAT adds nominal FM memories only, without Doppler.

Monthly passes cover the remaining days of the UTC month for 75 reference points:
European cities and an approximate point in each of the 50 US states plus Washington
DC. They are not valid throughout a country. Lists include coordinates, generation
date, TLE epoch and a minimum elevation of 10 degrees. Sampling is 60 s; passes more
than seven days after the TLE epoch are tentative. These are not operational plans
and are never sent to CAT. Download the complete JSON or recalculate in a background
worker for your coordinates; before operating, use fresh TLE and the precise 24/48
hour calculation in Satellites. Future accuracy is not guaranteed.

The daily GitHub Actions job runs at 04:35 UTC, downloads the data, recalculates
passes, tests the results and publishes only when all checks pass. Failures are
visible in Actions and retain the last published version; no data is fabricated.
To regenerate locally run `npm run fetch:channel-templates` followed by
`npm run fetch:template-passes`. Installers include the same files;
their offline copy changes only when another version is installed.

## Live viewer and RF log

In **Channels**, the two tables appear side by side on desktop and stacked on mobile.
Select the compatible model and authorize reading directly in **Channels**.
Click **Connect and read channels (read-only)**: the left
column shows the active bank without write permission. On the right, choose PMR446,
REMER VHF, or Bricohams Murcia repeaters and click **Prepare template for dragging**.
Channels prepared from CSV and other catalogs appear here too. Drag a row or selection
to the left, or use **Copy selection** and **Paste here**. Catalog channels are inserted
RX only using an existing FM memory as a template; AM and DMR are not converted.
Dragging changes only the local copy. Save it before rereading: replacing it requires
confirmation. Physical writes still require a complete Flash backup, confirmation,
and rereading. The new channel connection does not start the viewer automatically,
so it does not occupy the port during reading.

Physical test on 2026-10-27: USB serial device COM4, identified firmware F4HWN v6.1.0,
41344-byte active bank with 121 FM channels. Two complete reads matched byte for byte
(SHA-256 `16f9c8b5ccb9d865ceaca599acf1766737641d8e8285a832680c2f745b02a331`).
The published web app displayed all 121 channels and prepared 16 PMR446 channels;
inserting PMR01 produced 122 channels only in the local copy, with writing disabled.
Only identification and read commands were sent: no writing, reboot, or bank change.
This does not validate physical writing or the APK on a phone.

The viewer appears at the top of the Quansheng section. It starts when the
connection completes: immediately with **Connect read-only / CAT**, or after
the backup with **Connect and back up**. It requires an image with K5Viewer
enabled and no lock that prevents the protocol. If no frames arrive within ten
seconds, it reports this and stops; it does not simulate the screen.

- Real 128 x 64 LCD, PNG capture, and firmware-reported LED status.
- One connection and one reader. Any operation first pauses the viewer, lets
  frames finish, and then runs the command. **Start viewer and RF log** resumes
  it. **Pause viewer** retains the last capture.
- The RF log appears at the end. It receives RF Log **v2** and firmware history,
  removes duplicate sequence numbers, and retains up to 512 entries in RAM.
  RF Log must be enabled: no data does not mean no signals.
- **Export RF log CSV** downloads the sequence, RX/TX/power-on event, frequency,
  duration, memory number/name, raw meter value, and battery. No UTC date is
  assigned to records that do not include one. Meter values are not calibrated
  power measurements. The CSV neutralizes spreadsheet formulas.
- Reconnecting clears the previous view to avoid mixing radios. Export first.
  Stopping the viewer does not erase the radio's persistent log.

Protocol reference: UV Studio, revision
`e7aa946f6de002559e1aaf3f91765db7fc2ed567`, `k5viewer.js`, and `rf-log.js`.
The local implementation does not send PTT, keypresses, reboot, or persistent
commands. The COM4 test on 26-10-2026 received **24 LCD frames and one RF frame**
from firmware that remained running, with no incomplete data. USB DTR had to be
enabled; Web Serial explicitly sets it for Quansheng. The radio did not send
stored RF entries, so no physical validation is claimed for a history that was
not received. The history parser, mutual exclusion, web screen, and CSV were
also checked with test frames. K5Viewer must be enabled in the active firmware.

## Precompiled catalog without build tools

The website includes nine v6.1.0 images: Bricohams ARDF, Satellite, Spectrum,
Labs, and Fusion, plus the official F4HWN Fusion, FieldOps, Transfer, and Labs.
No folder selection is required. The same catalog is used on the local server
and in the static export. It is not a dynamic download from an arbitrary URL.

### CHIRP v6.1.0

All nine catalog images use the F4HWN v6.1.0 protocol. Selecting generic
**Quansheng / UV-K5** in CHIRP can identify the radio but mark its image as
unsupported firmware and block editing and upload. This does not establish a
connection failure; rebuilding the same version or falsifying its identity does
not correct the driver selection.

1. Keep the existing image and configuration/calibration backups.
2. Download the [official F4HWN v6.1.0 driver](../../../precompiled/chirp/f4hwn.chirp.v6.1.0.py).
   In CHIRP, use **File > Load module** to open that Python file.
   Do not change security preferences to load modules automatically.
3. In **Radio > Download from radio**, select **Quansheng** and
   **UV-K1 & UV-K5 V3 (F4HWN)**, the radio's port, and normal operating mode.
   Make a fresh download and save it under a different name.
4. To recover channels from an older file, export them as CSV and import them
   into the fresh download. Check frequencies, tones, offsets and TX lock;
   do not rename or force the restricted image to become writable.
5. Before uploading changes, save a fresh backup and retain calibration.
   Do not select calibration or advanced-settings upload to migrate channels.

An image created with the generic driver remains read-only: changing firmware
or model does not convert its format. The example v6.3.0 driver belongs to a
different release; use v6.1.0 with this catalog.
The [manifest](../../../precompiled/chirp/manifest.json) pins source and SHA-256;
the unchanged module is distributed under GPL-2.0-or-later, with
[license](../../../precompiled/chirp/COPYING.txt) and [attribution](../../../precompiled/chirp/NOTICE.txt).
This documents correct driver selection, not physical read/write or boot
validation of all nine variants.

1. Select UV-K1 or UV-K5 V3 and an image from the catalog.
2. Confirm the model and Beta status of Bricohams derivatives.
3. **Download, verify, and prepare for slot** checks size, SHA-256, and PY32
   structure before enabling the image. **Download BIN and manifest** lets you
   save it without preparing or writing it.
4. Select slot 1-4, a name, and **Install and verify CRC**. Backup protections
   remain in effect; Main, CFG, and calibration are not erased.
5. Manually boot each slot and check SysInf and its functions.

Bricohams images remain **Beta without complete boot validation**, even when
their Flash write has been verified by CRC. The catalog retains original
metadata: a structural test is not converted into hardware certification.
The official release catalog remains available for other versions; variants
incompatible with slots are download-only.

Maintenance: `npm run publish:firmware` verifies the five local builds pinned by
SHA-256 and retrieves the official v6.1.0 release with GitHub hashes. It writes
the catalog only after validating every file. The Bricohams GPL and upstream
Apache licenses and notices are distributed. Options, integrated-source hashes,
and upstream commit are listed in each `precompiled/catalog.json` entry; the
builder and source modules are in this repository. User configurations and
calibrations are not included in the catalog.

### Physical writing verified on 26-10-2026

The following was written to the UV-K5 V3 unit identified by its owner:

| Slot | Image | CRC verified on radio |
| --- | --- | --- |
| 1 | BH ARDF | `47f33dcc` |
| 2 | BH Labs | `273d232d` |
| 3 | BH Satellite | `96d5b68b` |
| 4 | BH Spectrum | `702b5c07` |

Main/Fusion, active configuration, and calibration were verified unchanged.
No CFG resets, app erasures, or reboots were sent during writing. Later, the
owner manually booted BH Labs and real reads were verified, as detailed below.
**ARDF, Satellite, and Spectrum booting, and channel-write tests, remain
unvalidated**: CRCs do not prove execution.
Lost responses and a USB CDC lockup with exact 64-byte frames were detected.
Quansheng transport adds a null byte outside those frames and retries the same
NOR block up to four times (as UV Studio does); it never automatically retries
erasures, resets, or firmware rejections.

To operate slot 3 (BH Satellite), see [Satellite introduction](INICIACION-SATELITE.md)
and [Satellite antennas](ANTENAS-SATELITE.md).
### Advanced options and restoration scope

The **Bricohams custom tools** panel contains internal access to the keyboard/reboot,
main firmware DFU v6/v7, calibration backup/restore, logo download/installation,
Flash backup/restore, app catalog/order/erase, slots, and RF filters/export. It
does not open UV Studio, load its scripts, or delegate these operations to
another website. Binary provenance and license links are retained; they are not
runtime dependencies of the interface. Stock restoration rebuilds external
Flash and requires the DFU step, with different images for UV-K1/UV-K5 V3,
preserving the unit's own calibration. Do not confuse this with **Reset CFG
bank**, which erases only one bank.

Native maintenance and factory/DFU panels implement the published protocol
independently, without copying UV Studio's interface or code. Versions are not
fully at parity: slots and channels retain their v6 workflow; DFU accepts v6
BIN and v7 FWAT/FWA1 packages. V7 resources are installed only in the active
firmware with a matching Build ID and a new backup. All v7 support was tested
in simulation, not on this physical radio. Pause the viewer before starting CAT
tracking: they share the port. CAT and the viewer remain blocked while a factory
recovery is pending.

**Main firmware / custom DFU:** select an F4HWN v6.x PY32 BIN from 256 bytes to
118 KiB, or a v7 package with an FWAT trailer and FWA1 resources. The package is
split locally; only the internal image is sent to DFU. Package limits, exact
lengths, package CRC, and resource CRCs are checked. V7 without the complete
package and unknown versions are rejected. The image is checked for vectors,
version, and SHA-256, but this does not guarantee provenance or physical
compatibility. A full backup and the phrase `FIRMWARE PRINCIPAL UV-K5-V3` or
`FIRMWARE PRINCIPAL UV-K1` are required. Preparing does not write; it stores an
immutable in-memory copy, blocks other operations, and enables the DFU button.
Disconnect here, manually enter DFU with PTT, and confirm
`DFU PRINCIPAL UV-K5-V3` or `DFU PRINCIPAL UV-K1`. Do not close the page or
switch radios between steps.

This flow replaces internal firmware, not the bootloader; it does not erase
external Flash or synchronize the multiboot external Main image. The multiboot
selector may restore another image at boot: check slots and verify manually.
Rollback is not guaranteed. The bootloader, consistent identification, page
number, and status of each ACK are checked. DFU has no readback: completing
pages does not validate boot or RF. If it fails, keep the page, backup, and same
radio for retry. Simulation-tested only.

**V7 external resources:** after DFU, boot v7 normally and connect with a new
full backup (if that cannot be completed, writing remains blocked). The screen
may be blank while resources are missing. Select the same complete package or
its FWA1 in **V7 external resources**. Check the file without writing, then
confirm `RECURSOS UV-K5-V3` or `RECURSOS UV-K1` to install. The active slot and
Build ID are queried using `0x0750`; a different Build ID stops the process
before erasure.

Only the active slot's resource area is erased using `0x0752`; blocks of up to
128 bytes are written with `0x0754`, and the 32-byte FWA1 header is written
last. Only an identical block is retried on timeout (up to four retries), never
erasures or rejections. `0x0756` validates resources, and the final query must
report the same slot/Build ID, valid status, and loaded resources. Erasing
revokes write permission after any attempt: reconnect and back up again. No
physical readback is offered for an area whose address is not published here;
the result is firmware validation, not proof of display or boot. An
interruption can leave resources incomplete: keep the package and backup for
recovery. Resources are not installed into inactive slots, and the v6 map is
not used for v7.

**Custom RF log:** filter by memory name, MHz frequency, and RX/TX/power-on
event. Filters change only the view; they never delete received history. Export
the selection as CSV or the full log as JSON `bricohams-rf-log` v1.
`exportedAt` is the export time, not the event time; `eventUTCProvided` and
`calibratedRF` are false. UTC dates, calibrated RSSI, and spectrum analysis are
not invented from the history.

**Authorship and rights:** these tools are Bricohams' own implementation, but
third-party firmware, apps, and resources retain their licenses and
attributions. Rewriting the website does not make those files original work or
guarantee freedom from claims. Apache/GPL notices are not removed, and stock
images are not redistributed inside the website.

**Native remote keyboard:** in the viewer, it requires a full backup of the
current connection, manual enablement, and confirmation for every key. It offers
digits, MENU, up/down, EXIT, asterisk, hash, and F1/F2, with short or long
presses; it has no PTT or global shortcuts. Keys may change settings, and F1/F2
may trigger transmission features according to their assignments. Do not assume
receive-only operation. Each send disables the keyboard again. Only UART
transmission is reported; no execution ACK is fabricated. Check the LCD. It is
locked when paused, permission/connection is lost, CAT starts, or factory
recovery begins.

**Native reboot:** requires a full backup and entering `REINICIAR RADIO`, even
in advanced mode. It pauses the viewer, sends one `0x05DD` command, revokes
permissions, and closes the connection. It does not retry or claim an ACK or
successful reboot; check the radio and reconnect for a new backup. It does not
change the slot or CFG bank and may lose transient state. Keyboard and reboot
were tested in simulation, not on the physical radio.

**Native maintenance:** allows downloading/installing an ST7565 BIN or exact
128 x 64 PNG logo, exporting/restoring the 512 calibration bytes, and
exporting/restoring 2 MiB of external Flash. Writes require a full backup of
the current connection and explicit confirmation. The logo is read back and
neighboring data checked. Flash restore preserves the entire current
calibration sector, skips identical sectors, and writes multiboot status
sectors last. Both Backup and Restore verify all 512 4 KiB sectors using the
firmware's physical CRC: command `0x073E` cannot query 2 MiB at once. The stored
global CRC is calculated locally over the image whose sectors have already
been compared. Restoring calibration or Flash revokes write permission:
reconnect. Do not import calibration from another radio.

**Native factory restore, irreversible:** this is not CFG reset. Select the
exact model and download the two stock BIN files from the wizard links. Size
and SHA-256 are checked against the pinned official revision
`e7aa946f6de002559e1aaf3f91765db7fc2ed567`; these BIN files are not redistributed.

1. Export the full backup outside the browser and verify both BIN files.
2. With the same radio connected normally, confirm `FABRICA UV-K5-V3` or
   `FABRICA UV-K1`. Step 1 replaces slots, every channel bank, apps, and logs,
   but preserves the entire calibration sector.
3. Wait for the full Flash verification. Do not close or reload the page:
   step 2 authorization exists only in memory. Do not boot normally before
   both steps are complete, and do not switch radios.
4. Click Disconnect; turn off the radio and hold PTT while powering on for DFU
   (LED on, screen off). Release PTT, select step 2, and confirm
   `DFU UV-K5-V3` or `DFU UV-K1`.
5. The wizard verifies the bootloader and confirmation of each page. It accepts
   only bootloader `7.00.07` for V3, and `7.02.02` or `7.03.xx` for K1.
   Retries are limited to the same page on timeout, never rejections. DFU has no
   readback: confirmed pages do not prove boot.
6. Boot manually and check version, reception, and operation. If step 2 fails,
   keep the page and retry it with the same image. If step 1 fails, do not
   attempt DFU or boot normally: keep the backup, disconnect here, and use
   official recovery.

Maintenance and DFU were tested with simulated devices. The four official
stock files were downloaded and validated with the production verifier.
**No factory restore, calibration, logo, or full Flash restoration was
performed on the physical radio during these tests.**

| UV Studio option | On this website | Additional official access |
| --- | --- | --- |
| LCD viewer, capture, short/long keyboard press, and reboot | Native, shares connection; changes require confirmation | Official viewer |
| RF log, history, filters, CSV/JSON | Native, v2; local export | Other views |
| Precompiled catalog | Native, nine pinned images and dynamic catalog | Editor catalog |
| Slots 1-4, erase, CRC | Native with backup | Additional editor options |
| CFG 1-4 | Native reset, separate from firmware | Select bank on radio |
| Labs apps | Six-app catalog, list, export, install, move to empty slot, individual/global erase, and native verification | Expanded catalog |
| Calibration | Native backup/restore, confirmation, and readback | Official restore |
| External Flash | Native backup/restore, calibration sector protected | Official restore |
| Main firmware | Native DFU for v6 BIN or v7 FWAT/FWA1 package | Does not sync external Main |
| V7 assets | Native, active slot only with Build ID, backup, and firmware validation | No inactive slots or physical readback |
| Logo | Native download/install of BIN or 128 x 64 PNG | Official editor |
| Stock factory and DFU | Native wizard, two steps, pinned hashes/models | Official recovery |
## Getting started from 0 to 100%

A complete path from a new radio to one that is configured, backed up, and
verified. Each phase explains when it is complete. Phases 9 and 10 are optional.

| Phase | What you do | Complete when | Details |
| --- | --- | --- | --- |
| 0. Identify | Check label under the battery, SysInf, and bootloader version | You know whether it is UV-K5 V3, UV-K1, or another revision | [Versions](ATLAS-UV-K5-V3.md#versions-and-how-to-identify-them) |
| 1. Prepare PC | Desktop Chrome or Edge, USB-C data cable or Kenwood cable, driver | Port appears and no other application is using it | [Drivers](../../../ayuda.html#drivers) and [USB](AYUDA-CONFIGURACION.md#usb-connection-do-not-confuse-modes) |
| 2. Backups | Calibration (512 bytes), configuration, and, if firmware allows, full Flash | Files are outside the browser and have SHA-256 hashes | [Calibration](ATLAS-UV-K5-V3.md#calibration) |
| 3. Choose firmware | Version and edition (Fusion, FieldOps, Transfer, Labs) for your hardware | `.bin` file downloaded from the official release with its hash checked | [Editions](#which-edition-to-choose) and [versions](#version-and-format-matrix) |
| 4. Flash | Radio off, hold PTT while powering on, use UV Studio or Bricohams Studio | Tool confirms every page and the radio restarts | [Bootloader](ATLAS-UV-K5-V3.md#bootloader-and-flashing) |
| 5. First boot | Read SysInf and check the version | Version matches the flashed file | Next section |
| 6. Basic settings | Navigation, battery, display, squelch, TX, and locks | Settings persist after power cycling | Basic settings table |
| 7. Channels | Repeaters, receive-only PMR, satellites, and names | Memories appear and read back unchanged | [FM memories](#prepare-and-send-fm-memories) |
| 8. Scanning | Lists, priorities, and resume behavior | Scanning covers only the intended memories | [Scanning](#scanning-priorities-and-keys) |
| 9. Multiboot (optional) | Slots 1-4 and CFG banks | Each slot passes CRC and boots | [Slots and banks](#slots-and-cfg-banks-different-operations) |
| 10. Labs (optional) | Overlay apps from the same release | App boots and returns to firmware | [Labs](#labs-and-apps) |
| 11. Final verification | Checklist and a fresh backup | You have a final-state backup and recorded versions | [Final checklist](AYUDA-CONFIGURACION.md#post-operation-checklist) |

### Phase 4 step by step: flash the main firmware

1. Save the Phase 2 backups. Do not continue without saved calibration.
2. Close CHIRP, CPS, other Studio tabs, and this website's normal connection.
3. Turn off the radio. Hold PTT while powering on: the LED stays on and the
   display stays off. Release PTT and connect the USB-C cable.
4. In [UV Studio](https://armel.github.io/uvstudio/) or
   [Bricohams Studio](https://brico-hams.github.io/Bricohams-Studio/), select
   the port. The bootloader must report `7.00.07` (UV-K5 V3) or
   `7.02.02`/`7.03.0x` (UV-K1). For any other version, stop and check the model.
5. Choose the plain `.bin` for the edition. Never use a `*.packed.bin` (for the
   official updater) or a V1 image.
6. Confirm and do not touch the radio or cable until every page is confirmed.
   If interrupted, the radio remains in update mode: repeat from step 3 with
   the same file.
7. The radio restarts on its own. After flashing F4HWN, save calibration again
   with UV Studio, as the project recommends.

### Phase 5: first boot

- Open SysInf and note the version and edition. If they do not match the file,
  do not continue: repeat Phase 4.
- Flashing does not erase calibration. If the battery reads 0 V or squelch
  behaves unexpectedly, confirm the calibration belongs to this radio before
  changing anything.
- If menus show inconsistent values after a firmware change, use Reset only
  after checking your backups: its scope depends on the build.

### Phase 6: recommended basic settings

| Menu | Reasonable starting value | Reason |
| --- | --- | --- |
| SetNav | According to model (K1 or K5 V3) | Use this if the arrow directions seem reversed |
| BatTyp | Actual battery capacity | Correct charge indicator |
| SetCtr, BLMin, BLMax, BLTime | Readable with the lowest power use | Comfort and battery life |
| Sql | 3-4 to start | Closes squelch noise without losing weak signals |
| Step | Service raster (12.5 or 25 kHz on VHF/UHF) | Tune to real channels |
| RxMode | MAIN ONLY to start | Always know which VFO will transmit |
| SetPTT | Classic | OnePush may keep transmitting after release |
| VOX | OFF | Avoid accidental transmissions |
| TxTOut | 60-120 s | Stops a stuck PTT |
| F Lock | Your regional profile | Limits TX to applicable bands |
| SetLck | Keys (and PTT if needed) | Prevents changes in a pocket |
| ChDisp | Name | Show the memory name in MR mode |

After changing settings, power-cycle to confirm they were saved. See the
[menu glossary](#radio-menu-glossary) for each menu's meaning.

### Phases 7 and 8: channels and scanning

- This website prepares channels from a template and writes them with a backup
  and readback ([FM memories](#prepare-and-send-fm-memories)). You can also use
  the CHIRP driver for each F4HWN release or Bricohams Studio.
- Imported channels start with TXLock. Remove it only for verified, authorized
  channels ([channel glossary](AYUDA-CONFIGURACION.md#analog-channel-glossary)).
- Assign each memory to its list (ScList), choose priorities (PriCh1/PriCh2),
  and set resume mode (ScnRev). Test scanning with SQL adjusted.

## Return to stock and recovery

| Situation | What to do |
| --- | --- |
| You want to return to factory firmware | Use guided [UV Studio](https://armel.github.io/uvstudio/) restoration: it rebuilds external Flash without touching calibration. Flashing only the factory `.bin` may leave the K1 unable to boot |
| The radio will not boot after flashing | Enter update mode (hold PTT while powering on) and reflash the correct model's `.bin` |
| The bootloader does not respond or the port does not appear | Try another data cable and port; check that no other program is using the port |
| You cannot enter update mode | SWD recovery with ST-Link ([SWD](ATLAS-UV-K5-V3.md#swd-and-recovery)). Experienced users only |
| Calibration is lost or belongs to another radio | Restore the Phase 2 backup. Do not use calibration from another unit |

## Beta: real USB test and channels

### BH Labs booted: real verification on 26-10-2026

After manually selecting slot 2, COM4 identifies **F4HWN v6.1.0**. Main and
the four Bricohams slot CRCs in the table above were verified, and 38 channels
were read from the active BH Labs bank.

The first backup revealed that `0x073E` rejects a 2 MiB range: firmware limits
each CRC query to 4 KiB. After the website was corrected, the 2 MiB backup was
completed and persisted, with all 512 sectors verified. The 512-byte
calibration and 120832-byte Main image were also saved. Calibration retains the
prior SHA-256
`f9c537df7a1764b31c73b3021dae69a1a654e267315f8c58c12bc4a3f1dd1a1b`.
Sixteen app slots were queried; Tetris was rebuilt and exported from physical
Flash, with the file format and CRCs validated.

The active configuration was read back unchanged. On a local copy of that real
read, creating, editing, and deleting an RX-only channel were checked while
retaining the original 38 channels and protected settings. **No channels,
apps, firmware, calibration, or resources were written during this
verification.** This read test does not demonstrate on-radio CRUD writes or
physical isolation of the other banks.
### Historical reads with Main/Fusion v6.0.0

Read-only test performed on 25-10-2026 on COM4 (USB CDC VID 36B7 / PID FFFF),
for a unit identified by its owner as **UV-K5 V3**. The radio reports
**F4HWN v6.0.0**; this does not automatically identify the board.

- Identification, 512-byte calibration, and 41344-byte logical configuration:
  successful. Two independent reads matched byte for byte and by SHA-256.
- 200 existing channels were recognized. Memories with erased frequencies
  (`0`/`0xFFFFFFFF`) are not shown, even if residual attributes remain, in line
  with the firmware's check.
- Slot query: Main/Fusion, FieldOps, Labs, Doppler, and Ardf, all v6.0.0. This
  reads headers; it is not equivalent to checking each image's CRC.
- The physical Flash command `0x0738` does not respond in this firmware. It
  used to be attempted during automatic backup, and the timeout invalidated
  the connection. v6.0 now saves a **partial** copy (calibration/configuration),
  keeps the read connection open, and explains the write lockout without trying
  that command.
- No physical channels, firmware, slots, or calibration were written or erased.
  No RF or OpenGD77 hardware tests were performed.

A repeat read on **26-10-2026**: COM4 reports F4HWN v6.0.0 and returns 41344
bytes with 200 memories. On a copy of that read, 16 new PMR channels (216 total)
were verified, along with editing, list assignment, and local deletion, without
changing bytes from `0x8800` onward. The browser also opens that real read and
reads back the 16 added PMR channels. No persistent write was sent. CAT was not
tested with this firmware: it does not implement the private CAT v1 command in
the Bricohams Satellites image.

### Prepare and send FM memories

1. Select UV-K5 V3 or UV-K1 for the device and confirm the model. To read
   without waiting for a full Flash backup, use **Connect read-only / CAT**.
   This session does not create a backup or enable persistent writes. A normal
   connection retains the automatic backup required for writing.
2. Click **Read channels from active bank**. In v6.0 they appear automatically
   from the partial copy; after a full backup, the active configuration is also
   read. To work without a radio, open an F4HWN v6 logical configuration that
   is exactly 41344 bytes—not firmware or a full Flash image.
3. Prepare **analog PMR446 channels 1-16 (RX only)**, FM repeaters, or SAT/Doppler
   memories in the planner. Select an existing FM memory as a template and
   click **Add channels to the open local file**. The first FM template is
   selected when the file is opened and retained when the table is refreshed.
   A configuration with no FM memories needs a valid template from its own
   firmware; arbitrary records are not generated. You can also import FM
   channels from CHIRP CSV or OpenGD77 CPS; only supported VHF/UHF frequencies
   are accepted, and DMR/other-format rows are excluded with a reason. The
   repeater-file field accepts those same CSV files and sends them directly to
   Prepared Channels. RepeaterBook JSON requires authorization confirmation
   and first goes through the selection table.
4. New memories have TXLock enabled, tones and DTMF disabled, and Reverse
   disabled. PMR is prepared as narrow FM. Only nominal RX/TX frequencies from
   136-174 or 400-470 MHz are imported; this does not authorize transmission.
   Names use the first 10 ASCII characters. Duplicates are skipped only when
   the equivalent existing memory already has TX locked; a match that permits
   TX is not considered valid.
5. **Edit** changes an FM memory's name/RX/TX, and **Delete from file** removes
   that memory from the local copy. Editing enables TX lock and preserves bytes
   outside those fields; both operations work on an in-memory copy. Recheck the
   channel shown by the parser, click **Save local configuration**, and save
   the edited binary separately from the original. When Chrome/Edge offers a
   file picker, the website writes and closes the file before confirming. In
   browsers without that picker, it only requests a download: check Downloads
   and do not mistake the request for a confirmed save. Saving a JSON or CSV
   project is not a substitute for this binary.
6. **Write and read back channels (Beta)** is enabled only with a full backup
   from this session, using Labs v6.1+ with Flash read and CRC support. It
   checks that the radio is unchanged since the read, writes 8-byte blocks,
   and reads everything back. During writing, affected memories are temporarily
   marked empty; they are reactivated after their data/names are written. This
   is not power-failure-proof transactional writing. VFO, settings, calibration,
   and other banks are protected.
7. On success, manually restart the radio to reload caches. If it fails, keep
   the backup and exact message; do not assume success based only on an ACK.

Sending was verified with simulated transport, **not on hardware**: the
connected v6.0 unit does not allow the required full backup. The unit is not
updated or flashed as a side effect. The native SAT orbital table is not
installed: SAT/Doppler are FM memories. Continuous CAT RX tracking specifically
requires the Bricohams Satellites image with CAT v1.
### Simulate the multiboot cycle without writing to USB

The automated regression test runs with:

```powershell
node --test --test-name-pattern="simulacion multiboot completa" tests\connectors.test.cjs
```

It uses only an in-memory transport: it does not open Web Serial, COM, or USB.
It simulates four installations using test images, a full backup and
session-scoped permission, a header written last, and each slot's CRC. In the
model, it manually selects CFG banks whose numbers differ from the slot number,
so the two are not confused. Each bank imports 16 PMR channels, 11 REMER
channels, and a fictitious repeater CSV; writes, reads back, edits, changes a
list, deletes, and reuses a memory. It checks isolation between banks, Main,
calibration, and protected settings. In Satellites it simulates CAT RX and STOP
without persistent changes. AM is rejected because this importer does not
convert it.

CSV files accept trailing decimal zeros, such as `145.600000` and offset
`0.600000`, without rounding values that require more than five significant
decimal places. The test repeaters are not a current directory of real
frequencies. This simulation does not run compiled firmware or test boot, RF,
display, audio, or physical isolation of banks in the connected radio. It does
not unlock writes or replace the full backup required for that unit.

### Page sections and channel tables

Sidebar steps (Backups and connection, Channels, Satellites, Firmware, Tools) show only the selected section; tools-menu links open the section containing their target.

Legacy fragment links open the corresponding view and the fragment is removed from the URL. The sidebar scrolls independently in short windows. Channel edits survive switching views, and the channel editor appears before the planning catalogs.

Drag a selected row to move the entire selection in its original order, or drag an unselected row to move just that channel. Drop on the upper half of the destination row to place it before, or the lower half to place it after. All memory bytes, including tones, DCS, and uneditable attributes, are preserved.

**Download radio channels (original backup)** rereads and saves the active bank without replacing your local edits. **Save local configuration** saves the edited version. Model selection, reading consent, status, progress, and disconnect are available directly in Channels.

**Add channel** asks for a memory number, name, RX, nominal TX, and scan list (0, 1-24, or 25). Leave the number empty to append, or use a free gap if memory 1024 is occupied. If the requested number is occupied, choose **Before**, **After**, or **Cancel**; cancellation leaves the file unchanged. New channels are RX only and use an existing FM template. Only **Write and reread channels** changes the radio, with a complete verified backup.

Channels has two tables: **Radio channels**, read from the active bank or opened file, and **Channels to load**, prepared by repeaters, REMER, PMR446, SAT/Doppler, airports, FM/CSV or copied from the radio. Drag a row to reorder; intermediate rows shift. Drag from the load table into the radio to insert before the target, or append in an empty area. Copying from the radio preserves every byte, including DCS. Select rows and use Copy selection / Paste here, or Ctrl+C / Ctrl+V with the table focused. Radio paste inserts before the first selected row or appends if none is selected. Only contiguous memories up to the first gap shift; later memories remain unchanged. These are local edits, not USB writes.

### Channel Backup and Restore buttons

#### Authorized exceptional legacy firmware replacement

The advanced API `BackupManager.authorizeSlotReplacement` authorizes only
firmware installation in slots 1-4 for F4HWN legacy with a partial backup,
after the user literally accepts
`REEMPLAZAR SLOTS SIN RESPALDO DE FIRMWARE`. This acceptance means the previous
images will be lost without a recoverable copy; their CRCs are not a backup.
Connecting, using PRO, or importing a file does not enable this authorization.

Before issuing authorization, the current session's calibration and
configuration are read and persisted. The partial record retains the
acceptance, slots, names, sizes, and exact SHA-256 hashes of the images. Each
installation rechecks that record and consumes one authorization for that
image and slot. This permission does not allow separately erasing slots, Main,
restoring Flash, writing channels, resetting CFG, or installing/removing apps.
The normal website still requires a full backup.

This path follows UV Studio's installation protocol: erase a slot, write image
blocks, write the header last, and check CRC. It is not a full backup or proof
of boot. If writing or verification fails, stop and do not boot that slot.
Test each image manually and leave Main intact.

**Back up active bank** performs a fresh read and saves the 41344-byte binary
with date and SHA-256. It does not download the local edit in its place or
replace that edit. The result distinguishes a written file from a requested
download. This is a logical copy, not a backup of Flash, firmware, or
calibration.

**Restore: open channel backup** requires connecting and reading the
 destination bank first. It validates size, structure, and an identical
version; copies only memories, names, and attributes through `0x8800` onto the
read of the destination; preserves that destination's settings; and asks for
confirmation before replacing the local edit. It can restore channels with TX
enabled: review them before writing. It does not write by itself. To send, use
**Write and read back channels**, subject to its full-backup, confirmation, and
readback requirements. Flash backups and UV Studio packages are not imported.

### Regional templates and preset files

In Repeaters, **Prepare 3 Bricohams Murcia repeaters** adds ED5YBF Carrascoy,
ED5YAK, and ED5YAL Sierra Espuna, transcribed from the supplied Bricohams
Studio ZIP's `PRESET_CSV`. The CHIRP CSV file can be downloaded without relying
on external services. Receive-only throughout; the CSV uses Duplex off and
lists nominal TX in comments. Current status has not been confirmed, and CTCSS
is not programmed.

**Murcia templates** are displayed and downloaded separately:

- LEMI, LELC, and LEAL airports plus guard frequency 121.500 MHz: 15 AM
  services in JSON. RF carriers and 8.33 kHz designators remain separate.
  Source: [AIP ENAIRE](https://aip.enaire.es/), each airport's AD 2.18,
  consulted on 26-10-2026. Airport coordinates are approximate. Check current
  AIP and NOTAM; do not use the template for aeronautical operations.
- FM Murcia: 15 Onda Regional and OR Musica entries from
  [Where to listen](https://www.orm.es/donde-escucharnos/), consulted on
  26-10-2026. This is a broadcast selection, not every commercial station.
  Transmitter coordinates are not verified, and there is no proximity filter.
- REMER: download the 11 available VHF channels as receive-only CSV.
  Individual selection and preparation remain in the REMER tab.

AM and WFM broadcast templates are for reference/export; they are not converted
to communications FM. The current Quansheng memory editor does not install
them; a compatible receiver and format are required. Downloads do not prove
reception, activity, or hardware writes.

### Scan lists by zone or geography

New memories participate in all lists by default (value 25); participation is
not set to zero. You can choose one list from 1-24 for the batch, zero for no
participation, or group by zone, province/region, or locality. Grouping
reserves free numeric lists without replacing existing lists. If the selected
field is missing or there are no free lists, the batch is rejected without
changing the image. A province is not inferred from frequency, and geolocation
is not used implicitly.

REMER includes its zone; RepeaterBook retains region/locality. A CSV can include
additional `Zone`, `Region`/`State`, `City`, and `Country` columns. Without them,
you can use one list for all or the CSV format's generic zone. The report shows
the number assigned to each new group; record it before closing. List names,
priorities, ALL/MIX, and global settings are not changed. Skipped duplicates
keep their previous list.

To change existing channels, mark them in the table, choose **Assign selection
to list**, and click **Apply list to local file**. You can also edit one
memory's list. Assignment removes its scan-exclusion mark but preserves
frequencies, tones, modes, and TX lock. Save the binary and check ScList on the
radio after an authorized write. These are not DMR zones or multiple groups
per channel; each memory has one native participation number.
### Saved passes and CAT RX

**Save pass plan as JSON** preserves the TLE, position, schedule, and selected
FM frequency. **Reopen pass plan JSON** requires consent to use the position in
the file, validates the data, and recalculates schedules for the current time
without querying providers. Old schedules are not used to control CAT. An
expired TLE is rejected: update the elements and recalculate. Older plans
without a frequency can be opened, but you must look up and select the FM
frequency again.

To add a pass to the configuration, select the frequency and pass, then use
**Prepare channels with Doppler correction**, **Load prepared SAT / Doppler**,
and **Save local configuration**. Saving schedules does not install TLE data in
firmware. These options do not record radio audio.

For CAT, connect in read-only mode, manually boot the correct Bricohams
Satellites image, enter SAT RX, press 8, and check the firmware confirmation in
the panel. Do not try CAT with original F4HWN, ARDF, or Spectrum: they do not
implement the private command. Select a currently visible pass and keep the
page in the foreground. RX commands expire after 3 seconds; the browser's
command cadence accounts for each command's response time. Stop does not send
another tuning command if SAT RX is already disabled.

Automated and browser tests check PMR, editing, lists, and export using
synthetic data and the configuration read from the unit. A real USB read is not
equivalent to verifying writes, display, or RF. Without a full backup and an
unambiguous bank, physical writing is not declared verified, and slots or
calibration are not modified.

### Multiboot and independent channels by profile

The connector reads only the logical configuration presented by the booted
radio. It does not select firmware slots or CFG banks, nor does it prove that
the visible profile or slot corresponds to the storage that would be written.
There is no website operation that distributes a channel plan to every slot.

To keep profiles separate, manually boot each profile/bank you want to manage
and repeat the read and export workflow **separately**. Label each file with
model/revision, firmware version and profile, CFG bank if verifiable on the
radio, and date; also retain its SHA-256 hash. Save and close the previous file
before editing another profile. Compare reads: if firmware cannot identify the
slot, or two backups do not establish isolation, treat separation as unverified
and do not write. Do not copy a file between profiles assuming memories are
shared or remain independent.

No new USB test was performed in this session. For the previously documented
unit (F4HWN v6.0.0), the available backup remains partial and physical writing
is still locked. The new edit, delete, and post-import channel checks validate
the local file; they do not prove that firmware displays the channels or that
the change reached a physical slot. See [REMER, airports, and commercial FM](AYUDA-ANYTONE.md)
for the differences between local preparation, parser compatibility, and RF testing.

## Choose hardware before firmware

| Radio/revision | Relationship to this website | Rule |
| --- | --- | --- |
| UV-K1 / UV-K1(8) PY32 | UV-K1 target for catalog/connector | Verify board and identification; no V1 image |
| UV-K5 V3 PY32 | UV-K5-V3 target | Same family does not let you ignore the actual revision |
| UV-K5(8), UV-K6, UV-K5+ V1 | Karina V1/OneOfEleven or other V1 projects | Outside the PY32 slot connector's scope |
| UV-K5 V2 | Different hardware | Neither V1 nor V3 images based on appearance alone |
| UV-K5(99) and commercial labels | The name may cover different revisions | Identify MCU/revision using the project's source |
| TK-11 and similar-looking Baofeng radios | Not connector targets | Do not use these images |

The ARDF manual even warns that V3 labels can be found on V2 hardware. The
sticker helps but is not conclusive. USB-C does not guarantee that all firmware
uses the same protocol or that the port can program every revision.
## Version and format matrix

| Branch | Catalog | Editions/variants | Writing from this website |
| --- | --- | --- | --- |
| F4HWN v4.x | Stable releases recognized with a specific `k1` or `k5v3` file | Fusion; possibly SA818, depending on release | Download only |
| F4HWN v5.x | Stable releases recognized with published hash | Fusion; possibly SA818 | Download only |
| F4HWN v6.x | Stable releases recognized with published hash | Fusion, FieldOps, Transfer, Labs, depending on release | Only non-SA818 images that have been inspected and have a full backup |
| Development/beta/rolling | Excluded from the stable catalog | Not treated as releases | Library blocks known names for these variants |
| ARDF V3/UV-K1 | Separate reald source | ARDF-K5v3_K1 versions | Download only; see [ARDF](AYUDA-ARDF.md) |
| Stock | Not selected as F4HWN | Manufacturer image | This inspector does not install it in slots |
| Karina V1 | Package documentation | RAW and packed V1 | Blocked because it is incompatible with PY32 |
| Karina V3/K1 by Dim0s | Separately inspected ZIP with PY32 vectors | Hardware-specific RAW and packed files | Not enabled: Armel multiboot and sources have not been verified |
| Bricohams V3 | Local v6.1.0 builder | Generated Fusion and Labs | Slot preparation with the same safeguards; experimental |

Historical names such as Bandscope, Broadcast, Basic, RescueOps, or Game in old
documents do not map one-to-one to v6 presets. Do not convert their settings
by menu position. For the exact option/default inventory, see
[options](AYUDA-OPCIONES-F4HWN.md) and [presets by commit](F4HWN-PRESETS.md).

The selector queries authorized releases, excludes prereleases and drafts, and
checks the name, version, size, and SHA-256 digest published by GitHub. It does
not present a partial catalog as complete when errors occur. Read the installed
version in SysInf; do not infer it from the most recently downloaded file. An
update can change persistence and CFG compatibility.

### Release inventory recognized on 25-10-2026

A live query for UV-K5-V3 recognized 41 images; this is not a list of every
file in the repositories. UV-K1 v4 images must be the versions made specifically
for K1. Each link contains that version's notes; this table does not invent
functional differences between patches that have not been verified.

| Version | Recognized editions | Handling |
| --- | --- | --- |
| [v6.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.3.0) | Fusion, FieldOps, Labs, Transfer | Can be prepared after checks and backup |
| [v6.2.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.2.0) | Fusion, FieldOps, Labs, Transfer | Same; review data/API changes |
| [v6.1.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.1.0) | Fusion, FieldOps, Labs, Transfer | Local Bricohams baseline; not the same edition identity |
| [v6.0.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.0.0) | Fusion, FieldOps, Labs, Transfer | Do not assume the Labs v6.1+ physical reader |
| [v5.9.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.9.0) | Fusion and SA818 | Download only |
| [v5.8.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.8.0) | Fusion and SA818 | Download only |
| [v5.7.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.7.0) | Fusion and SA818 | Download only |
| [v5.6.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.6.1) | Fusion and SA818 | Download only |
| [v5.6.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.6.0) | Fusion and SA818 | Download only |
| [v5.5.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.5.0) | Fusion and SA818 | Download only |
| [v5.4.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.4.0) | Fusion and SA818 | Download only |
| [v5.3.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.3.1) | Fusion | Download only |
| [v5.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.3.0) | Fusion | Download only |
| [v5.2.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.2.0) | Fusion | Download only |
| [v5.1.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.1.0) | Fusion | Download only |
| [v4.3.2](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v4.3.2) | Hardware-specific Fusion | Download only |
| [v4.3.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v4.3.1) | Hardware-specific Fusion | Download only |
| [v4.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v4.3.0) | Hardware-specific Fusion | Download only |
| [ARDF v0.5.1](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.5.1) | ARDF | Download only |
| [ARDF v0.5](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.5) | ARDF | Download only |
| [ARDF v0.4](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.4) | ARDF | Download only |
| [ARDF v0.2](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.2) | ARDF | Download only |

## Which edition to choose

| Edition | v6 profile focus | Caution |
| --- | --- | --- |
| Fusion | General use, spectrum, scanning, multiboot/CFG depending on preset | Does not therefore include the complete Labs physical reader |
| FieldOps | Field features, Fox Hunt/Beacon, and RescueOps depending on preset | Review TX features; this is not emergency-service certification |
| Transfer | Focus on transfer/AirCopy depending on preset | Requires a compatible endpoint/protocol; does not replace a full backup |
| Labs | Overlay apps, diagnostics, and external read/write when enabled | Experimental; ABI/API and commands change |
| Max | Profile available in the v6.3.0 options catalog | Do not assume a release binary exists or fits with every change |
| Custom | Configurable reduced profile | Multiboot is not guaranteed; the local builder here does not accept it |
| Bricohams | Bricohams edition identity on pinned v6.1.0 profiles | Not Karina or officially signed firmware |

Exact ON/OFF values are more reliable than a profile's marketing name. For
example, Labs needs the specific physical Flash options required for this
website's backup.
## Radio menu glossary

The following names come from `MenuList` in the inspected v6.1 code. A
conditional menu may not exist in your build. Refer to the menu name, not a
fixed number that changes when features are included or excluded. “Save
channel” means persist the memory; not every temporary change in MR is saved
automatically.

### Channel, reception, and tones

| Menu | Explanation and check |
| --- | --- |
| Step | VFO tuning step, not filter bandwidth. Choose the raster for the service you are listening to |
| Power | RF level per channel/VFO. Nominal values do not guarantee measured output power |
| RxDCS / RxCTCS | Subaudible receive filter. Disable it when troubleshooting silence |
| TxDCS / TxCTCS | Transmitted code/tone. Use only what the system requires |
| TxODir | TX offset direction: OFF, +, or - in the inspected codebase |
| TxOffs | Offset magnitude. Check the resulting TX frequency |
| W/N | Wide/narrow FM channel; SetNFM may select a narrow variant |
| BusyCL | Prevents TX when it detects a busy channel under its criterion |
| Compnd | Audio compander; requires compatibility at the other end |
| Mode | RX demodulation available in that build; does not change hardware or TX permissions |
| TXLock | Channel transmit lock; keep enabled on listening channels |
| Sql | Squelch threshold; zero may leave the receiver continuously open to noise |
| RxMode | Determines listening and TX response; check which VFO will transmit |
| ChList | View/select memories depending on interface context |
| ChSave | Save to memory; check the destination before replacing it |
| ChDele | Delete a memory; not the same as deleting only its name |
| ChName | Channel name; does not change frequency |

### Scanning, priorities, and keys

| Menu | Explanation and check |
| --- | --- |
| ScList | Active scan list; check that it is not empty |
| ScPri | Use of priority channels in the cycle |
| PriCh1 / PriCh2 | Priority memories; not VFO A/B |
| ScnRev | Resume behavior: carrier, time, or stop, depending on build |
| F1Shrt / F1Long | Short/long press function for side key 1 |
| F2Shrt / F2Long | Short/long press function for side key 2 |
| M Long | Function assigned to a long MENU press |
| KeyLck | Automatic lock and delay; different from SetLck |
| 1 Call | Quick-call channel; verify the selected memory |
| SetScn | Scan mode/speed when compiled; faster scanning does not guarantee better detection |
| SetKey | RescueOps key settings; only if included in the profile |

In v6.1, the documentation describes 24 named lists plus ALL and MIX
combinations. ALL omits excluded memories, and MIX combines selected lists.
Do not assume this capability in v4/v5. Full Watch priorities come from list
priorities; duplicates/invalid entries do not create additional receivers.

### Audio, DTMF, and transmission

| Menu | Explanation and check |
| --- | --- |
| TxTOut | Continuous TX limit; different from selecting the SetTOT warning |
| Mic | Microphone gain; too much causes distortion, not more useful power |
| MicBar | Level indicator; does not replace a deviation measurement |
| Beep | Key/interface alerts; set volume before using headphones |
| Voice | Voice prompts, only if compiled |
| Roger | TX-end alert; use only where permitted and appropriate |
| STE / RP STE | Local/repeater squelch-tail handling, depending on the other endpoint |
| ANI ID | DTMF identifier when DTMF calling is compiled |
| UPCode / DWCode | Configured DTMF identification/control sequences; do not send to systems without permission |
| PTT ID | Timing/use of identification when PTT is pressed |
| D ST | Local audio associated with DTMF depending on implementation; not a DMR Time Slot |
| D Resp / D Hold | DTMF call response and hold behavior when enabled |
| D Prel | DTMF preamble/timing parameter; keep the default unless the system requires otherwise |
| D Decd / D List | DTMF decoding/list for the calling feature |
| D Live | Display of received DTMF; does not make the signal private |
| VOX | Audio-triggered transmission; disable for troubleshooting and to avoid accidental TX |
| SetPwr | User power level used by Power=USER |
| SetPTT | Classic or latched OnePush PTT; the latter may continue transmitting after release |
| SetTOT | Timeout warning type, not its duration |
| SetEOT | End-of-transmission alert; check audio/visual behavior for your use |
| SetRxA | RX audio profile when AUDIO is enabled |
| SetVol | Firmware RX audio adjustment, distinct from the physical control |
| SetNFM | Upstream-documented 12.5/6.25 kHz narrow-filter variant; not a VFO step |

### Display, power, and advanced options

| Menu | Explanation and check |
| --- | --- |
| BatSav | Receive power saving; may delay activity detection |
| BatTxt | Battery display |
| ChDisp | Name/frequency/number, depending on display mode |
| POnMsg | Startup message; does not prove firmware authenticity |
| BLTime | Backlight duration |
| BLMin / BLMax | Minimum/maximum brightness; ensure the result is readable |
| BLTxRx | Light activation during TX/RX |
| SysInf | Version/build, battery, and diagnostic pages depending on options |
| SetCtr | Display contrast, not RF gain |
| SetInv | Invert colors/pixels |
| SetLck | Lock scope: keys or PTT too, depending on build |
| SetMet | S-meter style; figures are not equivalent to a calibrated bench instrument |
| SetGUI | VFO information style/size |
| SetTmr | RX/TX time display |
| SetOff | Deep-sleep timer; may interrupt a session |
| SetSav | Screensaver/logo when compiled |
| SetCfg | Apply another configuration bank without changing firmware |
| SetNWR | NOAA function if compiled and applicable to the region |
| F Lock | Band profile; not certification or permission to expand TX |
| 350 En | Receive access to an additional range depending on build; does not authorize transmission |
| FrCali | Frequency reference adjustment if compiled; requires test equipment |
| BatCal | Voltage-reading calibration; do not use values from another unit |
| BatTyp | Battery capacity profile; not a repair or RF calibration |
| SetNav | Navigation layout for UV-K1 versus UV-K5 V3 |
| Reset | Reset settings; scope depends on build and may cause data loss |

Menus `Scramb`, `Tx 200`, `Tx 350`, `Tx 500`, `ScraEn`, and `NOAA-S` may
appear in branches without the F4HWN layer. They are listed for historical
identification, not as enabled options in published profiles or instructions
to unlock transmissions. A scrambler must not be treated as secure encryption.
## RxMode and Full Watch

In v6.1, Full Watch checks VFO A, VFO B, and valid priorities. These are not
four independent receivers. FULL RX/RESPOND may reply on the last received
channel; MAIN TX/FULL RX keeps TX on the main VFO. Before using PTT, verify the
indicated transmit destination. For troubleshooting, choose MAIN ONLY.
DUAL/CROSS display modes must not be confused with repeater configuration or
assumed to automatically repeat between bands.

## Slots and CFG banks: different operations

| Item | Contents | Changing it means |
| --- | --- | --- |
| Main | Base copy managed by firmware, not the bootloader | Protected by the website |
| Slot 1-4 | Additional firmware image in external Flash | Restore an image from the radio to the processor |
| CFG M/1-4 | Independent channels, VFO, settings, and lists | Load another compatible configuration |
| Labs app | Code/resources with a specific ABI/API | Run a function in RAM overlay; does not replace full firmware |

In the inspected v6.1 upstream, the selector opens by pressing MENU while
powering on. Confirm restoration on the radio itself; do not turn it off during
the process. SetCfg changes banks without restoring firmware. The website does
not invent a remote command for either action.

To prepare an image from the library, choose a folder, select a supported entry,
review its name/hash, and click Prepare. This does not write anything.
Installation requires a compatible connection, a full Flash backup, and
confirmation. The slot CRC is checked. Correct vectors and an F4HWN string do
not prove that the code is authentic.

## Labs and apps

The inspected codebase documents 16 slots and radio, APRS, SSTV, diagnostic,
and demo apps. The set changes between releases; not every app is available or
compatible with every build.

**Precompiled Labs app catalog:** includes SystemInfo, BroadcastFM, Cube3D,
Tetris, Breakout, and Minesweeper from upstream release v6.1.0. They are
served with the website, including the static export, without compiling. They
are Apache-2.0 and retain their original authorship; they are not renamed as
our work. SHA-256, size, FAP1, name, version, ABI, and minimum API are checked.
All require ABI 1 and minimum API 2; confirm compatibility with active Labs.
Boot has not been certified on this unit.

Select a model and app, confirm compatibility, and click **Verify and prepare
app**. This only prepares the file: query the slots, select a destination, and
separately click **Install app and verify**. You can also download the file and
its manifest. Apps are not installed or run automatically. The test catalog
excludes beacons and distress apps; the full catalog remains in UV Studio. This
is not an isolation guarantee: every native app has access to the radio.

The maintainer regenerates this catalog with
`node scripts/publish-firmware.cjs --apps-only`: only the six archived files
and pinned hashes are accepted; any change is rejected.

The connector checks FAP1, code/resource limits, and resource CRCs, then reads
written blocks back. Accepting a header does not prove that an app can run: ABI,
API, or capabilities may reject it at load/run time. Use firmware and apps from
the same release. Installing an app from an unknown source gives native code
access to the radio.

**Export app from slot** rebuilds the FAP1 file from the header, physical code,
and resources, and checks their CRCs before requesting the download. Requires
firmware with physical Flash read support; this is not a catalog download.

**Move app to empty slot** lets you reorder apps without overwriting another.
Select the source and an empty destination, then enter the displayed
confirmation. The destination is installed, read back, and verified before the
source is erased and checked as empty. This is not atomic: an interruption can
leave two copies or an incomplete destination while the source remains intact.
Keep the backup and query the slots again before retrying. To swap two occupied
apps, use a third empty slot as a temporary location. This does not run an app
or certify ABI/API compatibility.

**Erase all apps** requires a full backup and the phrase
`BORRAR TODAS LAS APPS`, including in advanced mode. The actual slot count
(16 or 48, depending on firmware) is queried; only occupied slots are erased,
and all slots are checked as empty. An error stops the process without claiming
overall success; a partial erase is not rolled back automatically. Channels,
configuration, firmware, and calibration are untouched. These new operations
were verified with a simulated radio; they were not run on the physical unit.

APRS TX requires a legally configured callsign/SSID, position, and route.
Loading a `.app` does not make this website transmit; automatic beacons are not
configured as part of a backup. Emergency/EPIRB functions are mentioned as
upstream inventory only: do not test transmissions on distress frequencies.

## Common problems

| Symptom | Check |
| --- | --- |
| Radio boots but SetCfg does not appear | Check the build's multiboot options, not just its version |
| Slot is visible with data but CRC is wrong | Do not restore it; keep the file and backup |
| USB identifies but Flash read fails | Physical Labs command may be missing; close other programs and record the build |
| Keys seem reversed | Check SetNav/model; do not flash another family to fix it |
| A settings change disappears | Save the memory or check CFG bank and persistence |
| Repeater cannot be heard | Check RX, mode, SQL, and RX filter; do not start by increasing TX power |
| An app will not run | Check ABI/API/caps and release; do not blindly repeat writes |
| SA818 or packed image is blocked | This is intentional; do not rename it to bypass the restriction |

## Sources and maintenance

- [PY32 project and README](https://github.com/armel/uv-k1-k5v3-firmware-custom).
- [Releases by version](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases).
- [Pinned v6.3.0 presets](https://github.com/armel/uv-k1-k5v3-firmware-custom/blob/ca3a4271386049e7b459b215cef0ad0eea1a30ca/CMakePresets.json).
- [Inspected v6.1 menu](https://github.com/armel/uv-k1-k5v3-firmware-custom/blob/f556a96e73c3e423a00cf473aeb37f827cac05a5/App/ui/menu.c).
- [Project UVTOOLS2](https://armel.github.io/uvtools2/).
- [Dedicated CHIRP driver](https://github.com/armel/uv-k5-chirp-driver).
- [Bricohams, hashes, and build](BRICOHAMS-FIRMWARE.md).
- [Karina V1 and license/source limits](KARINA.md).
- [UV-K5 V3 technical atlas: hardware, protocols, and schematics](ATLAS-UV-K5-V3.md).

For stock firmware, UVMOD, or OneOfEleven, consult the exact project and
hardware: menu/EEPROM equivalence with this guide is not guaranteed. For links
added by the user, see [Egzumer V1](AYUDA-EGZUMER.md) and
[Dim0s pack with Karina V3/K1](AYUDA-PACK-DIM0S.md).
