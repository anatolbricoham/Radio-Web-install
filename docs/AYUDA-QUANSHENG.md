# Quansheng: F4HWN, versiones y configuracion

Revision: 26-10-2026. Base funcional inspeccionada: Fusion61, commit
`f556a96e73c3e423a00cf473aeb37f827cac05a5`; catalogo modular web v6.3.0,
commit `ca3a4271386049e7b459b215cef0ad0eea1a30ca`.
Esta guia no atribuye automaticamente las funciones v6.1/v6.3 a v4 o v5.
Como funciona la radio por dentro (pines, memorias, protocolo, bootloader,
esquemas y fotos): [Atlas tecnico UV-K5 V3](ATLAS-UV-K5-V3.md).

## Canales sencillos y plantillas por pais

En Canales sigue tres pasos: leer el walkie, elegir una plantilla y revisar/guardar.
El panel derecho permite elegir España, UK, Estados Unidos, Alemania, Francia,
Hungria o Italia y filtrar por region/estado o localidad. Se muestran 50 resultados
por pagina; no se selecciona nada automaticamente. Seleccionar resultados exige
como maximo 1024 canales: para EE. UU. elige primero un estado. Anadir la seleccion
modifica solo el archivo local y requiere una memoria FM existente como base.
Guardar descarga el archivo; escribir conserva todas las exigencias de respaldo
y relectura. Copias, listas de escaneo, CSV y arrastre siguen en opciones avanzadas.

Los datos proceden de [HearHam](https://hearham.com/repeaters), que permite usar
su API en aplicaciones online/offline, y de limites administrativos Natural Earth
de dominio publico. No se replica RepeaterBook. El catalogo incluye los registros
FM operativos disponibles en VHF/UHF, no todos los repetidores de cada pais:
la cobertura es especialmente reducida en Hungria e Italia. Revisa fecha, zona,
actividad y permisos. Los tonos y TX nominal son informativos; importar bloquea TX.
PMR446 es opcional, solo RX, no aparece para EE. UU. y no autoriza transmitir con
un equipo de radioaficionado. SAT anade solo memorias FM nominales, sin Doppler.

Pases del mes muestra los dias restantes del mes UTC para 75 puntos de referencia:
ciudades en Europa y un punto aproximado por cada uno de los 50 estados y Washington
DC. No son pases validos para todo un pais. Cada lista incluye coordenadas, fecha,
epoca TLE y elevacion minima de 10 grados. El muestreo es de 60 s; las previsiones
a mas de siete dias del TLE se marcan provisionales. No son planes operativos ni
se envian a CAT. Puedes descargar el JSON completo o recalcular en segundo plano
con tus coordenadas; antes de una operacion usa TLE reciente y el calculo preciso
de 24/48 horas de Satelites. La precision futura no esta garantizada.

La tarea diaria de GitHub Actions se ejecuta a las 04:35 UTC; descarga los datos,
recalcula los pases, prueba los resultados y publica solo si todo pasa. Un fallo
es visible en Actions y conserva la ultima version publicada; no se inventan datos.
Para regenerar localmente: `npm run fetch:channel-templates` seguido de
`npm run fetch:template-passes`. Los instaladores incluyen los mismos ficheros;
su copia offline solo cambia al instalar otra version.

## Visor en directo y registro RF

En **Canales**, las dos tablas se muestran una junto a otra en escritorio y apiladas
en movil. En la propia pantalla **Canales**, selecciona el modelo compatible y
autoriza la lectura. Pulsa **Conectar y leer canales (solo lectura)**:
la columna izquierda muestra las memorias del banco activo sin permiso de escritura.
En la derecha, elige PMR446, REMER VHF o repetidores Bricohams Murcia y pulsa
**Preparar plantilla para arrastrar**. Tambien aparecen los canales preparados
desde CSV y los otros catalogos. Arrastra una fila o una seleccion a la izquierda,
o usa **Copiar seleccion** y **Pegar aqui**. Los canales de catalogo se insertan
solo RX usando una memoria FM existente como plantilla; no se convierten AM o DMR.
El arrastre modifica exclusivamente la copia local. Guardala antes de releer:
se pide confirmacion antes de sustituirla. La escritura fisica sigue exigiendo
respaldo Flash completo, confirmacion y relectura. La nueva conexion de canales no
inicia automaticamente el visor, para no ocupar el puerto durante la lectura.

Prueba real del 27-10-2026: dispositivo USB serie COM4, firmware identificado
F4HWN v6.1.0, banco activo de 41344 bytes con 121 canales FM. Dos lecturas completas
coincidieron byte a byte (SHA-256 `16f9c8b5ccb9d865ceaca599acf1766737641d8e8285a832680c2f745b02a331`).
La web publicada mostro los 121 canales y preparo 16 PMR446; insertar PMR01
dejo 122 canales solo en la copia local y con la escritura bloqueada. Solo se
enviaron identificacion y lecturas: no hubo escritura, reinicio ni cambio de banco.
Esto no valida la escritura fisica ni la APK en un telefono.

El visor aparece al principio de Quansheng. Se inicia al terminar la conexion:
inmediatamente en **Conectar solo lectura / CAT**, o despues del respaldo en
**Conectar y respaldar**. Requiere una imagen con K5Viewer habilitado y sin
bloqueo que impida el protocolo. Si no recibe tramas en diez segundos lo
indica y se detiene; no simula la pantalla.

- LCD real de 128 x 64, captura PNG y estado de los LED comunicado por el firmware.
- Una sola conexion y un solo lector. Cualquier operacion pausa primero el
  visor, deja terminar las tramas y despues ejecuta el comando. **Iniciar visor
  y registro RF** lo reanuda. **Pausar visor** conserva la ultima captura.
- El registro RF aparece al final. Recibe RF Log **v2** e historial del firmware,
  elimina duplicados por secuencia y conserva como maximo 512 entradas en RAM.
  Requiere RF Log habilitado: ausencia de datos no significa ausencia de senales.
- **Exportar registro RF CSV** descarga secuencia, RX/TX/encendido, frecuencia,
  duracion, numero/nombre de memoria, medidor bruto y bateria. No se atribuye
  fecha UTC a registros que no la incluyen. Los valores del medidor no son
  mediciones calibradas de potencia. El CSV neutraliza formulas de hojas de calculo.
- Al reconectar se vacia la vista anterior para no mezclar radios. Exporta antes.
  Detener el visor no borra el registro persistente de la radio.

Referencia del protocolo: UV Studio, revision
`e7aa946f6de002559e1aaf3f91765db7fc2ed567`, `k5viewer.js` y `rf-log.js`.
La implementacion local no envia PTT, teclas, reboot ni ordenes persistentes.
La prueba COM4 del 26-10-2026 recibio **24 tramas LCD y una trama RF** del
firmware que seguia arrancado, sin datos incompletos. Fue necesario habilitar
DTR USB; Web Serial lo establece explicitamente para Quansheng. La radio no
envio entradas RF almacenadas, por lo que no se atribuye validacion fisica a
un historial no recibido. El parser de historial, la exclusion mutua, la
pantalla web y el CSV se comprobaron ademas con tramas de prueba. Debe estar
habilitado K5Viewer en el firmware activo.

## Catalogo precompilado sin herramientas de compilacion

La web incluye nueve imagenes v6.1.0: Bricohams ARDF, Satellite, Spectrum,
Labs y Fusion, y las oficiales F4HWN Fusion, FieldOps, Transfer y Labs.
No requiere seleccionar una carpeta. Es el mismo catalogo en servidor local
y en la exportacion estatica. No es una descarga dinamica de cualquier URL.

### CHIRP v6.1.0

Las nueve imagenes de este catalogo usan el protocolo F4HWN v6.1.0. En CHIRP,
seleccionar **Quansheng / UV-K5** generico puede identificar la radio y aun asi
marcar su imagen como firmware no soportado y bloquear edicion y carga. Ese
mensaje no demuestra un fallo de conexion ni se corrige recompilando la misma
version o falseando su identificacion.

1. Conserva la imagen existente y los respaldos de configuracion/calibracion.
2. Descarga el [controlador oficial F4HWN v6.1.0](../precompiled/chirp/f4hwn.chirp.v6.1.0.py).
   En CHIRP, usa **Archivo > Cargar modulo** para abrir ese archivo Python.
   No cambies las preferencias de seguridad para cargar modulos automaticamente.
3. En **Radio > Descargar de la radio**, selecciona **Quansheng** y
   **UV-K1 & UV-K5 V3 (F4HWN)**, con el puerto de tu radio y la radio encendida
   normalmente. Haz una descarga nueva y guardala con otro nombre.
4. Si necesitas recuperar canales de un archivo anterior, exportalos a CSV e
   importalos en esa descarga nueva. Comprueba frecuencias, tonos, desplazamientos
   y bloqueo TX; no renombres ni fuerces como escribible la imagen restringida.
5. Antes de cargar cambios, guarda un respaldo nuevo y conserva la calibracion.
   No selecciones cargar calibracion ni ajustes avanzados para migrar canales.

La imagen creada con el controlador generico sigue siendo de solo lectura:
cambiar de firmware o de modelo no convierte su formato. El driver v6.3.0 de
los ejemplos corresponde a otra publicacion; para este catalogo usa v6.1.0.
El [manifiesto](../precompiled/chirp/manifest.json) fija origen y SHA-256;
el modulo se distribuye sin cambios bajo GPL-2.0-o-posterior, con
[licencia](../precompiled/chirp/COPYING.txt) y [atribucion](../precompiled/chirp/NOTICE.txt).
Esto documenta la seleccion correcta del controlador; no certifica pruebas
fisicas de lectura/escritura o arranque de las nueve variantes.

1. Seleccionar UV-K1 o UV-K5 V3 y la imagen del catalogo.
2. Confirmar modelo y condicion Beta de las derivadas Bricohams.
3. **Descargar, verificar y preparar para slot** comprueba tamano, SHA-256 y
   estructura PY32 antes de habilitar la imagen. **Descargar BIN y manifiesto**
   permite guardarla sin preparar ni escribir.
4. Seleccionar slot 1-4, nombre y **Instalar y verificar CRC**. Las protecciones
   de respaldo siguen vigentes; Main, CFG y calibracion no se borran.
5. Arrancar manualmente cada slot y comprobar SysInf y funciones.

Las imagenes Bricohams siguen siendo **Beta sin validacion de arranque
completa**, incluso cuando su escritura en Flash se haya verificado por CRC.
El catalogo conserva los metadatos originales: no convierte una prueba
estructural en certificacion de hardware. Para otras versiones sigue
disponible el catalogo de publicaciones oficiales; las variantes incompatibles
con slots son solo descarga.

Mantenimiento: `npm run publish:firmware` verifica las cinco compilaciones
locales fijadas por SHA-256 y obtiene la publicacion oficial v6.1.0 con los
hashes de GitHub. Solo tras validar todos los archivos escribe el catalogo.
Se distribuyen las licencias GPL Bricohams y Apache upstream y sus avisos.
Las opciones, hashes de fuentes integradas y commit upstream estan en cada
entrada de `precompiled/catalog.json`; el constructor y los modulos fuente
estan en este repositorio. No se incluyen configuraciones ni calibraciones
de usuarios en el catalogo.

### Grabacion fisica verificada el 26-10-2026

En la unidad UV-K5 V3 declarada por su propietario se grabaron:

| Slot | Imagen | CRC verificado en radio |
| --- | --- | --- |
| 1 | BH ARDF | `47f33dcc` |
| 2 | BH Labs | `273d232d` |
| 3 | BH Satellite | `96d5b68b` |
| 4 | BH Spectrum | `702b5c07` |

Main/Fusion, configuracion activa y calibracion se verificaron sin cambios.
No se enviaron resets CFG, borrados de apps ni reinicios durante la grabacion.
Posteriormente el propietario arranco BH Labs manualmente y se verificaron
lecturas reales, como se detalla abajo. **El arranque de ARDF, Satellite y
Spectrum y las pruebas de escritura de canales siguen sin validar**:
los CRC no prueban ejecucion.
Se detectaron respuestas perdidas y un bloqueo USB CDC con tramas de 64 bytes
exactos. El transporte Quansheng agrega un byte nulo fuera de esas tramas y
reintenta hasta cuatro veces solo el mismo bloque NOR (como UV Studio);
nunca reintenta automaticamente borrados, resets ni rechazos del firmware.

Para operar el slot 3 (BH Satellite) consulta [Iniciacion al satelite](INICIACION-SATELITE.md)
y [Antenas de satelite](ANTENAS-SATELITE.md).

### Opciones avanzadas y alcance de la restauracion

El panel **Herramientas propias Bricohams** contiene accesos internos a
teclado/reinicio, firmware principal DFU v6/v7, backup/restore de calibracion,
descarga/instalacion de logo, backup/restore Flash, catalogo/orden/borrado de
apps, slots y filtros/exportacion RF. No abre UV Studio, no carga sus scripts
ni delega estas operaciones a otra web. Los enlaces de procedencia y licencia
de binarios se mantienen: no son dependencias de ejecucion de la interfaz.
La restauracion stock reconstruye Flash externa y necesita el paso DFU,
con imagenes distintas para UV-K1/UV-K5 V3, conservando calibracion propia.
No se confunde con **Restablecer banco CFG**, que solo borra un banco.

Hay paneles nativos de mantenimiento y fabrica/DFU con implementacion propia
del protocolo publicado, sin copiar la interfaz ni el codigo de UV Studio.
No hay paridad completa entre versiones: los slots y canales conservan su
flujo v6; el DFU admite BIN v6 y paquetes v7 FWAT/FWA1. Recursos v7 solo se
instalan en el firmware activo con Build ID coincidente y respaldo nuevo.
Todo el soporte v7 se ha probado en simulacion, no en esta radio fisica.
Pausar el visor antes de iniciar seguimiento CAT: ambos comparten el puerto.
CAT y el visor quedan bloqueados mientras haya una recuperacion de fabrica
pendiente.

**Firmware principal / DFU propio:** seleccionar BIN F4HWN v6.x PY32 de
256 bytes a 118 KiB, o paquete v7 con trailer FWAT y recursos FWA1.
El paquete se separa localmente: solo la imagen interna se envia a DFU.
Se comprueban limites, longitudes exactas, CRC del paquete y CRC de recursos.
V7 sin paquete completo y versiones desconocidas se rechazan.
La imagen se comprueba por vectores, version y SHA-256,
pero esto no garantiza procedencia ni compatibilidad fisica. Se exige respaldo
completo y la frase `FIRMWARE PRINCIPAL UV-K5-V3` o `FIRMWARE PRINCIPAL UV-K1`.
Preparar no escribe; guarda una copia inmutable en memoria, bloquea otras
operaciones y habilita el boton DFU. Desconectar aqui, entrar manualmente en
DFU con PTT y confirmar `DFU PRINCIPAL UV-K5-V3` o `DFU PRINCIPAL UV-K1`.
No cerrar la pagina ni cambiar de radio entre pasos.

Este flujo reemplaza firmware interno, no bootloader; no borra Flash externa
ni sincroniza la imagen Main externa del multiboot. El selector multiboot
puede restaurar otra imagen al arrancar: revisar slots y verificar manualmente.
No garantiza rollback. Se verifican bootloader, identificacion consistente,
numero de pagina y estado de cada ACK. No hay relectura DFU: finalizar
paginas no equivale a validar arranque o RF. Si falla, conservar la pagina,
el respaldo y la misma radio para reintentar. Solo probado en simulacion.

**Recursos externos v7:** tras DFU, arrancar normalmente el firmware v7 y
conectar con respaldo completo nuevo (si no puede completarse, la escritura
queda bloqueada). La pantalla puede estar vacia mientras faltan recursos.
Seleccionar el mismo paquete completo o su FWA1 en **Recursos externos v7**.
Comprobar el archivo sin escribir y confirmar `RECURSOS UV-K5-V3` o
`RECURSOS UV-K1` para instalar. Se consulta el slot activo y Build ID por
`0x0750`; un Build ID diferente detiene el proceso antes de borrar.

Se borra solo la zona de recursos del slot activo por `0x0752`, se escribe
en bloques de hasta 128 bytes por `0x0754` y la cabecera FWA1 de 32 bytes
se escribe al final. Solo se reintenta un bloque identico ante timeout
(maximo cuatro reintentos), nunca borrados ni rechazos. `0x0756` valida
recursos y la consulta final debe indicar slot/Build ID iguales, estado
valido y recursos cargados. Se revoca el permiso despues de cualquier intento
de borrado: reconectar y respaldar de nuevo. No se ofrece relectura fisica
de una zona cuya direccion no esta publicada aqui; el resultado es validacion
del firmware, no prueba de pantalla o arranque. Una interrupcion puede dejar
recursos incompletos: conservar paquete y respaldo para recuperar. No se
instalan recursos en slots inactivos ni se utiliza el mapa v6 para v7.

**Registro RF propio:** filtrar por nombre de memoria, frecuencia MHz y
evento RX/TX/encendido. Los filtros solo cambian la vista, nunca eliminan
el historial recibido. Exportar la seleccion en CSV o todo el registro en
JSON `bricohams-rf-log` v1. `exportedAt` es la hora de exportacion, no la hora
de los eventos; `eventUTCProvided` y `calibratedRF` son falsos. No se inventan
fechas UTC, RSSI calibrado ni analisis de espectro a partir del historial.

**Autoria y derechos:** la implementacion de estas herramientas es propia
de Bricohams, pero firmware, apps y recursos de terceros conservan sus
licencias y atribuciones. Reescribir la web no convierte esos archivos en
obra propia ni garantiza ausencia de reclamaciones. No se eliminan avisos
Apache/GPL ni se redistribuyen las imagenes stock dentro de la web.

**Teclado remoto nativo:** en el visor, requiere respaldo completo de la
conexion actual, habilitacion manual y confirmacion de cada tecla. Ofrece
digitos, MENU, arriba/abajo, EXIT, asterisco, almohadilla y F1/F2, con
pulsacion corta o larga; no incluye PTT ni atajos globales. Las teclas pueden
modificar ajustes y F1/F2 ejecutar funciones de emision segun su asignacion.
No asumir solo RX. Cada envio deshabilita de nuevo el teclado. Se informa
solo del envio UART, sin inventar un ACK de ejecucion; comprobar la LCD.
Se bloquea al pausar, perder permiso/conexion, iniciar CAT o recuperar fabrica.

**Reinicio nativo:** exige respaldo completo y escribir `REINICIAR RADIO`,
incluso en modo avanzado. Pausa el visor, envia una sola orden `0x05DD`,
revoca permisos y cierra la conexion. No reintenta ni afirma recibir ACK o
haber arrancado; verificar la radio y reconectar para respaldar de nuevo.
No cambia el slot ni el banco CFG y puede perder estado transitorio.
Teclado y reinicio se han probado en simulacion, no sobre la radio fisica.

**Mantenimiento nativo:** permite descargar/instalar logo BIN ST7565 o
PNG exacto de 128 x 64, exportar/restaurar los 512 bytes de calibracion y
exportar/restaurar Flash externa de 2 MiB. Las escrituras requieren respaldo
completo de la conexion actual y confirmacion explicita. El logo se relee
y se comprueban los datos vecinos. La restauracion Flash conserva todo el
sector de calibracion actual, omite sectores iguales y escribe los sectores
de estado multiboot al final. Tanto Backup como Restore verifican los 512
sectores de 4 KiB mediante el CRC fisico del firmware: el comando `0x073E`
no admite consultar los 2 MiB de una sola vez. El CRC global guardado se
calcula localmente sobre la imagen cuyos sectores ya se han comparado.
Restaurar calibracion o Flash revoca el permiso de escritura: reconectar.
No importar calibracion de otra radio.

**Fabrica nativa, irreversible:** no es el reset CFG. Seleccionar el modelo
exacto y descargar los dos BIN stock desde los enlaces del asistente. Se
validan tamano y SHA-256 contra la revision oficial fijada
`e7aa946f6de002559e1aaf3f91765db7fc2ed567`; no se redistribuyen esos BIN.

1. Exportar fuera del navegador el respaldo completo y verificar los dos BIN.
2. Con la misma radio conectada normalmente, confirmar `FABRICA UV-K5-V3`
   o `FABRICA UV-K1`. El paso 1 reemplaza slots, todos los bancos de canales,
   apps y registros, pero conserva el sector completo de calibracion.
3. Esperar la verificacion completa de Flash. No cerrar ni recargar la pagina:
   la autorizacion del paso 2 existe solo en memoria. No arrancar normalmente
   antes de completar ambos pasos y no cambiar de radio.
4. Pulsar Desconectar; apagar la radio y mantener PTT al encender para DFU
   (LED encendido, pantalla apagada). Soltar PTT, seleccionar el paso 2 y
   confirmar `DFU UV-K5-V3` o `DFU UV-K1`.
5. El asistente verifica bootloader y confirmacion de cada pagina. Solo acepta
   bootloader `7.00.07` para V3, y `7.02.02` o `7.03.xx` para K1.
   Los reintentos se limitan a la misma pagina ante timeout, nunca a rechazos.
   DFU no permite relectura: paginas confirmadas no prueban el arranque.
6. Arrancar manualmente y comprobar version, recepcion y funcionamiento.
   Si falla el paso 2, conservar la pagina y repetirlo con la misma imagen.
   Si falla el paso 1, no intentar DFU ni arrancar normalmente: conservar el
   respaldo, desconectar aqui y usar la recuperacion oficial.

El mantenimiento y DFU se han probado con dispositivos simulados. Los
cuatro archivos stock oficiales se descargaron y validaron con el
verificador de produccion. **No se ha ejecutado una restauracion de fabrica,
calibracion, logo ni Flash completa en la radio fisica durante estas pruebas.**

| Opcion UV Studio | En esta web | Acceso oficial adicional |
| --- | --- | --- |
| Visor LCD, captura, teclado corto/largo y reinicio | Nativo, comparte conexion; modificaciones con confirmacion | Visor oficial |
| Registro RF, historial, filtros, CSV/JSON | Nativo, v2; exportacion local | Otras visualizaciones |
| Catalogo precompilado | Nativo, nueve imagenes fijadas y catalogo dinamico | Catalogo del editor |
| Slots 1-4, borrar, CRC | Nativo con respaldo | Opciones adicionales del editor |
| CFG 1-4 | Reset nativo separado del firmware | Seleccion del banco desde la radio |
| Apps Labs | Catalogo de seis apps, listar, exportar, instalar, mover a vacio, borrar individual/global y verificar nativos | Catalogo ampliado |
| Calibracion | Backup/restore nativo, confirmacion y relectura | Restore oficial |
| Flash externa | Backup/restore nativo, sector de calibracion protegido | Restore oficial |
| Firmware principal | DFU nativo BIN v6 o paquete v7 FWAT/FWA1 | No sincroniza Main externo |
| Assets v7 | Nativos, solo slot activo con Build ID, respaldo y validacion firmware | No slots inactivos ni relectura fisica |
| Logo | Descargar/instalar nativo BIN o PNG 128 x 64 | Editor oficial |
| Fabrica stock y DFU | Asistente nativo, dos pasos y hashes/modelos fijados | Recuperacion oficial |

## Puesta en marcha de 0 a 100 %

Ruta completa desde una radio recien sacada de la caja hasta una radio
configurada, con copia y verificada. Cada fase indica cuando esta terminada.
Las fases 9 y 10 son opcionales.

| Fase | Que haces | Terminada cuando | Detalle |
| --- | --- | --- | --- |
| 0. Identificar | Pegatina bajo la bateria, SysInf y version del bootloader | Sabes si es UV-K5 V3, UV-K1 u otra revision | [Versiones](ATLAS-UV-K5-V3.md#versiones-y-como-identificarlas) |
| 1. Preparar el PC | Chrome o Edge de escritorio, cable USB-C de datos o cable Kenwood, controlador | El puerto aparece y ninguna otra aplicacion lo usa | [Controladores](../ayuda.html#drivers) y [USB](AYUDA-CONFIGURACION.md#conexion-usb-sin-confundir-modos) |
| 2. Copias | Calibracion (512 bytes), configuracion y, si el firmware lo permite, Flash completa | Tienes los archivos fuera del navegador con su SHA-256 | [Calibracion](ATLAS-UV-K5-V3.md#calibracion) |
| 3. Elegir firmware | Version y edicion (Fusion, FieldOps, Transfer, Labs) para tu hardware | Archivo `.bin` descargado de la publicacion oficial con hash comprobado | [Ediciones](#que-edicion-elegir) y [versiones](#matriz-de-versiones-y-formatos) |
| 4. Flashear | Radio apagada, PTT pulsado al encender, UV Studio o Bricohams Studio | La herramienta confirma todas las paginas y la radio reinicia | [Bootloader](ATLAS-UV-K5-V3.md#bootloader-y-flasheo) |
| 5. Primer arranque | Leer SysInf y comprobar la version | La version coincide con el archivo flasheado | Seccion siguiente |
| 6. Ajustes basicos | Navegacion, bateria, pantalla, squelch, TX y bloqueos | Los ajustes sobreviven a apagar y encender | Tabla de ajustes basicos |
| 7. Canales | Repetidores, PMR solo RX, satelites y nombres | Las memorias aparecen y se releen iguales | [Memorias FM](#preparar-y-enviar-memorias-fm) |
| 8. Escaneo | Listas, prioridades y reanudacion | El escaneo recorre solo las memorias previstas | [Escaneo](#escaneo-prioridades-y-teclas) |
| 9. Multiboot (opcional) | Slots 1-4 y bancos CFG | Cada slot valida por CRC y arranca | [Slots y bancos](#slots-y-bancos-cfg-operaciones-distintas) |
| 10. Labs (opcional) | Apps superpuestas de la misma publicacion | La app arranca y vuelve al firmware | [Labs](#labs-y-aplicaciones) |
| 11. Verificacion final | Lista de comprobacion y nueva copia | Tienes copia del estado final y anotadas las versiones | [Lista final](AYUDA-CONFIGURACION.md#lista-de-verificacion-posterior) |

### Fase 4 paso a paso: flashear el firmware principal

1. Guardar las copias de la fase 2. Sin calibracion guardada, no seguir.
2. Cerrar CHIRP, CPS, otras pestanas de Studio y la conexion normal de esta web.
3. Apagar la radio. Mantener PTT pulsado y encenderla: el LED queda encendido
   con la pantalla apagada. Soltar PTT y conectar el cable USB-C.
4. En [UV Studio](https://armel.github.io/uvstudio/) o en
   [Bricohams Studio](https://brico-hams.github.io/Bricohams-Studio/) elegir el
   puerto. El bootloader debe anunciar `7.00.07` (UV-K5 V3) o `7.02.02`/`7.03.0x`
   (UV-K1). Otra version: detenerse y comprobar el modelo.
5. Elegir el `.bin` plano de la edicion. Nunca un `*.packed.bin` (es para el
   actualizador oficial) ni una imagen V1.
6. Confirmar y no tocar la radio ni el cable hasta que todas las paginas esten
   confirmadas. Si se corta, la radio sigue en modo actualizacion: repetir desde
   el paso 3 con el mismo archivo.
7. La radio reinicia sola. Tras flashear F4HWN, guardar de nuevo la calibracion
   con UV Studio, como recomienda el proyecto.

### Fase 5: primer arranque

- Abrir SysInf y anotar version y edicion. Si no coincide con el archivo, no
  continuar: repetir la fase 4.
- La calibracion no se borra al flashear. Si la bateria marca 0 V o el squelch
  no se comporta, comprobar que la calibracion es la de esta radio antes de tocar nada.
- Si los menus muestran valores incoherentes despues de cambiar de firmware,
  usar Reset solo despues de comprobar las copias: su alcance depende del build.

### Fase 6: ajustes basicos recomendados

| Menu | Valor inicial razonable | Motivo |
| --- | --- | --- |
| SetNav | Segun el modelo (K1 o K5 V3) | Si las flechas parecen invertidas, es este ajuste |
| BatTyp | Capacidad real de tu bateria | Indicador de carga correcto |
| SetCtr, BLMin, BLMax, BLTime | Legibles con el menor consumo | Comodidad y autonomia |
| Sql | 3-4 para empezar | Cierra el ruido sin perder senales debiles |
| Step | Raster del servicio (12.5 o 25 kHz en VHF/UHF) | Sintonizar canales reales |
| RxMode | MAIN ONLY al empezar | Saber siempre por donde se transmite |
| SetPTT | Clasico | OnePush puede seguir emitiendo al soltar |
| VOX | OFF | Evitar emisiones accidentales |
| TxTOut | 60-120 s | Corta un PTT atascado |
| F Lock | Perfil de tu region | Limita TX a las bandas que corresponden |
| SetLck | Teclas (y PTT si lo necesitas) | Evita cambios en el bolsillo |
| ChDisp | Nombre | Ver el nombre de la memoria en modo MR |

Despues de ajustar, apagar y encender para confirmar que se han guardado.
El significado de cada menu esta en el [diccionario de menus](#diccionario-de-menus-de-radio).

### Fases 7 y 8: canales y escaneo

- Esta web prepara canales sobre una plantilla y los escribe con respaldo y
  relectura ([memorias FM](#preparar-y-enviar-memorias-fm)). Tambien puedes usar
  el driver CHIRP de cada publicacion de F4HWN o Bricohams Studio.
- Los canales importados nacen con TXLock. Quitarlo solo en canales verificados
  y autorizados ([diccionario de canal](AYUDA-CONFIGURACION.md#diccionario-de-canal-analogico)).
- Asignar cada memoria a su lista (ScList), elegir prioridades (PriCh1/PriCh2)
  y el modo de reanudacion (ScnRev). Probar el escaneo con SQL ajustado.

## Volver a fabrica y recuperacion

| Situacion | Que hacer |
| --- | --- |
| Quieres volver al firmware de fabrica | Restauracion guiada de [UV Studio](https://armel.github.io/uvstudio/): reconstruye la flash externa sin tocar la calibracion. Flashear solo el `.bin` de fabrica puede dejar el K1 sin arrancar |
| La radio no arranca tras flashear | Entrar en modo actualizacion (PTT al encender) y flashear de nuevo un `.bin` del modelo correcto |
| El bootloader no responde o no aparece el puerto | Probar otro cable de datos y otro puerto; comprobar que nada mas usa el puerto |
| No hay forma de entrar en modo actualizacion | Recuperacion por SWD con ST-Link ([SWD](ATLAS-UV-K5-V3.md#swd-y-recuperacion)). Solo con experiencia |
| Calibracion perdida o de otra radio | Restaurar la copia de la fase 2. No usar calibraciones de otras unidades |

## Beta: prueba USB real y canales

### BH Labs arrancado: verificacion real del 26-10-2026

Tras seleccionar manualmente el slot 2, COM4 identifica **F4HWN v6.1.0**.
Se verificaron los CRC de Main y los cuatro slots Bricohams de la tabla
anterior, y se leyeron 38 canales del banco activo de BH Labs.

El primer respaldo revelo que `0x073E` rechaza un rango de 2 MiB:
el firmware limita cada consulta CRC a 4 KiB. Tras corregir la web, se
completo y persistio el respaldo de los 2 MiB, verificando sus 512 sectores.
Tambien se guardaron la calibracion de 512 bytes y Main de 120832 bytes.
La calibracion conserva el SHA-256 anterior
`f9c537df7a1764b31c73b3021dae69a1a654e267315f8c58c12bc4a3f1dd1a1b`.
Se consultaron 16 huecos de apps y se reconstruyo y exporto Tetris desde
la Flash fisica, validando el formato y los CRC del archivo.

La configuracion activa se releyo sin cambios. Sobre una copia local de
esa lectura real se comprobo crear, editar y borrar un canal RX-only,
manteniendo los 38 canales originales y los ajustes protegidos. **No se
escribieron canales, apps, firmware, calibracion ni recursos durante esta
verificacion.** El CRUD escrito sobre la radio y el aislamiento fisico de
los otros bancos no quedan demostrados por esta prueba de lectura.

### Lecturas historicas con Main/Fusion v6.0.0

Prueba de solo lectura realizada el 25-10-2026 en COM4 (USB CDC
VID 36B7 / PID FFFF), modelo declarado por el propietario **UV-K5 V3**.
La radio identifica **F4HWN v6.0.0**; no se deduce automaticamente la placa.

- Identificacion, calibracion de 512 bytes y configuracion logica de 41344 bytes:
  correctas. Dos lecturas independientes coinciden byte a byte y por SHA-256.
- Se reconocen 200 canales existentes. Las memorias con frecuencia borrada
  (`0`/`0xFFFFFFFF`) no se muestran aunque conserven atributos residuales,
  siguiendo la comprobacion del firmware.
- Consulta de slots: Main/Fusion, FieldOps, Labs, Doppler y Ardf, todos v6.0.0.
  Esto lee cabeceras; no equivale a verificar CRC de cada imagen.
- El comando de Flash fisica `0x0738` no responde en este firmware. Antes se
  intentaba durante el respaldo automatico y el timeout invalidaba la conexion.
  Ahora v6.0 guarda una copia **parcial** (calibracion/configuracion), mantiene la
  conexion de lectura y explica el bloqueo de escritura, sin intentar ese comando.
- No se han escrito ni borrado canales fisicos, firmware, slots o calibracion.
  No se han hecho pruebas RF ni pruebas de hardware OpenGD77.

Repeticion de lectura el **26-10-2026**: COM4 responde F4HWN v6.0.0 y devuelve
41344 bytes con 200 memorias. Sobre una copia de esa lectura se verifican
16 PMR nuevos (216 canales), edicion, asignacion de lista y borrado local,
sin cambiar bytes desde `0x8800` en adelante. El navegador tambien abre esa
lectura real y relee los 16 PMR incorporados. No se envio ninguna escritura
persistente. CAT no se probo contra ese firmware: no implementa el comando
CAT v1 de la imagen Bricohams Satelites.

### Preparar y enviar memorias FM

1. Seleccionar UV-K5 V3 o UV-K1 segun el equipo y confirmar el modelo. Para leer
   sin esperar la Flash completa, usar **Conectar solo lectura / CAT**. Esta
   sesion no crea respaldo ni habilita escrituras persistentes. La conexion
   normal conserva el respaldo automatico obligatorio para escribir.
2. Pulsar **Leer canales del banco activo**. En v6.0 se muestran automaticamente
   desde la copia parcial; tras una copia completa tambien se lee la
   configuracion activa. Para trabajar sin radio, abrir una configuracion
   logica F4HWN v6 de exactamente 41344 bytes, no un firmware ni Flash completa.
3. Preparar **PMR446 analogicos 1-16 (solo RX)**, repetidores FM o memorias SAT/Doppler
   desde el planificador. Seleccionar una memoria FM existente como plantilla
   y pulsar **Anadir canales al archivo local abierto**. La primera plantilla
   FM se selecciona al abrir el archivo y se conserva al actualizar la tabla.
   Una configuracion sin memorias FM necesita una plantilla valida de su
   propio firmware; no se generan registros arbitrarios. Tambien puedes importar
   canales FM de un CSV CHIRP u OpenGD77 CPS; solo se aceptan frecuencias VHF/UHF
   soportadas y las filas DMR/otros formatos se excluyen con motivo. El campo
   de fichero de repetidores acepta esos mismos CSV y los lleva directamente
   a Canales preparados. El JSON RepeaterBook requiere confirmar autorizacion
   y pasa primero por la tabla de seleccion.
4. Las nuevas memorias tienen TXLock activo, tonos y DTMF desactivados y Reverse
   desactivado. PMR se prepara estrecho. Solo se importan RX/TX nominales entre
   136-174 o 400-470 MHz; esto no autoriza transmitir. Nombres: primeros 10
   caracteres ASCII. Se omiten duplicados solo si la memoria equivalente ya
   tiene TX bloqueada; no se considera valida una coincidencia que permita TX.
5. **Editar** cambia nombre/RX/TX de una memoria FM y **Borrar del archivo**
   elimina esa memoria de la copia local. La edicion activa el bloqueo TX y conserva
   los bytes que no pertenecen a esos campos; ambas operaciones trabajan sobre
   una copia en memoria. Verifica de nuevo el canal que muestra el parser y
   pulsa **Guardar configuracion local** y guarda el binario editado aparte del
   original. Cuando Chrome/Edge ofrece selector de archivo, la web escribe y
   cierra el archivo antes de confirmar. En navegadores sin ese selector solo
   solicita una descarga: comprobar Descargas y no confundir la solicitud con
   un guardado confirmado. Guardar proyecto JSON o CSV no sustituye este binario.
6. **Escribir y releer canales (Beta)** solo se habilita con respaldo completo
   de esta sesion, mediante Labs v6.1+ con lectura Flash y CRC. Verifica que la
   radio siga igual que al leerla, escribe bloques de 8 bytes y relee todo.
   Durante la escritura las memorias afectadas se marcan temporalmente vacias;
   se reactivan despues de sus datos/nombres. No es una transaccion resistente
   a apagones. VFO, ajustes, calibracion y bancos distintos estan protegidos.
7. Tras exito, reiniciar manualmente la radio para recargar caches. Si falla,
   conservar respaldo y mensaje exacto; no asumir exito por recibir un ACK.

El envio se ha verificado con transporte simulado, **no en hardware**:
la unidad v6.0 conectada no permite el respaldo completo requerido. No se
actualiza ni flashea esa unidad como efecto secundario. La tabla orbital SAT
nativa no se instala: SAT/Doppler son memorias FM. El seguimiento continuo
CAT RX requiere especificamente la imagen Bricohams Satelites con CAT v1.

### Simular el ciclo multiboot sin escribir en USB

La regresion automatizada se ejecuta con:

```powershell
node --test --test-name-pattern="simulacion multiboot completa" tests\connectors.test.cjs
```

Usa exclusivamente un transporte en memoria: no abre Web Serial, COM ni USB.
Simula cuatro instalaciones con imagenes de prueba, respaldo completo y permiso
por sesion, cabecera escrita al final y CRC de cada slot. Selecciona manualmente
en el modelo bancos CFG distintos del numero de slot, para no confundir ambos.
En cada banco importa 16 PMR, 11 REMER y un repetidor CSV ficticio; escribe,
relee, edita, cambia lista, borra y reutiliza la memoria. Comprueba aislamiento
de bancos, Main, calibracion y ajustes protegidos. En Satelites simula CAT RX y
STOP sin cambios persistentes. Rechaza AM, que este importador no convierte.

Los CSV admiten ceros decimales finales como `145.600000` y offset `0.600000`,
sin redondear valores que necesitan mas de cinco decimales significativos.
Los repetidores de prueba no son un directorio de frecuencias reales vigente.
Esta simulacion no ejecuta el firmware compilado, no prueba arranque, RF,
pantalla, audio ni el aislamiento fisico de bancos de la radio conectada.
No desbloquea escrituras ni sustituye el respaldo completo de esa unidad.

### Secciones de la pagina y tablas de canales

Los pasos de la barra lateral (Copias y conexion, Canales, Satelites, Firmware y
Herramientas) muestran **solo esa seccion**, sin saltar por la pagina. Los
enlaces del menu de herramientas abren la seccion que contiene su destino.
Los enlaces antiguos con fragmento abren esa vista y se retira el fragmento de
la URL. El menu lateral tiene desplazamiento propio en ventanas bajas.
Los canales y las ediciones se conservan al cambiar de seccion.

En **Canales** hay dos tablas:

- **Canales del walkie**: lo leido con *Leer canales del banco activo* o el
  archivo abierto. Marca varias filas para moverlas juntas en su orden original,
  o arrastra una sola. Suelta en la mitad superior de otra fila para colocarlas
  antes, o en la mitad inferior para colocarlas despues. Se conservan todos
  los bytes de memoria, incluidos tonos, DCS y atributos no editables.
- **Canales para cargar**: los preparados en Canales y Satelites (repetidores,
  REMER, PMR446, SAT y Doppler, aeropuertos, FM y CSV) mas las copias de
  canales del walkie.

**Pasar canales de una tabla a otra:**

- **Arrastrando:** de *para cargar* al walkie se insertan delante de la fila
  donde los sueltes, o al final si los sueltas en zona vacia. Del walkie a
  *para cargar* se copian con todos sus bytes, DCS incluido.
- **Copiando y pegando:** selecciona filas y usa *Copiar seleccion* y *Pegar
  aqui*, o Ctrl+C / Ctrl+V con la tabla enfocada. Al pegar en el walkie, los
  canales se insertan delante de la primera fila marcada, o al final si no hay
  ninguna marcada.

Al insertar, solo se desplazan las memorias contiguas hasta el primer hueco;
las de despues del hueco no cambian.

**Descargar canales del walkie (copia original)** relee y guarda el banco activo
sin reemplazar la edicion local. **Guardar configuracion local** guarda la
version editada. Estado, progreso y desconexion estan disponibles en Canales.

**Anadir canal** pide numero, nombre, RX, TX y lista de escaneo (0, 1-24 o 25).
Si dejas el numero vacio se usa el final, o un hueco libre si la ultima memoria
esta ocupada. Si el numero ya esta ocupado,
pregunta si el canal nuevo va **antes** o **despues** del existente y desplaza
el resto; **Cancelar** no cambia el archivo. Los canales de catalogo y los nuevos se crean solo RX sobre la
plantilla FM, como el resto de importaciones de esta web.

Nada se escribe en la radio hasta pulsar *Escribir y releer canales*, que
exige el respaldo completo y releer byte a byte.

### Botones Backup y Restore de canales

#### Sustitucion excepcional de firmware legacy autorizada

La API avanzada `BackupManager.authorizeSlotReplacement` permite autorizar
exclusivamente instalaciones de firmware en slots 1-4 para F4HWN legacy con
respaldo parcial, despues de aceptar literalmente
`REEMPLAZAR SLOTS SIN RESPALDO DE FIRMWARE`. Esta aceptacion significa perder
las imagenes anteriores sin copia recuperable; sus CRC no son un respaldo.
No se activa por conectar, por PRO ni por importar un archivo.

Antes de emitir esa autorizacion se leen y persisten calibracion y configuracion
de la sesion actual. El registro parcial conserva la aceptacion, slots, nombres,
tamanos y SHA-256 exactos de las imagenes. Cada instalacion verifica de nuevo
ese registro y consume una sola autorizacion para esa imagen y slot.
Un permiso asi no habilita borrar slots por separado, Main, restaurar Flash,
escribir canales, restablecer CFG ni instalar/borrar aplicaciones.
La web normal mantiene sus requisitos de respaldo completo.

Esta via sigue el protocolo de instalacion de UV Studio: borrado de un slot,
bloques de imagen, cabecera al final y CRC. No constituye respaldo completo ni
prueba de arranque. Si falla la escritura o la verificacion, detenerse y no
arrancar ese slot. Probar cada imagen manualmente y conservar Main intacto.

**Backup del banco activo** realiza una lectura nueva y guarda el binario de
41344 bytes con fecha y SHA-256. No descarga la edicion local en su lugar ni
reemplaza esa edicion. El resultado distingue archivo escrito de descarga
solicitada. Es una copia logica, no un respaldo de Flash, firmware o calibracion.

**Restore: abrir copia de canales** requiere conectar y leer primero el banco
destino. Valida tamano, estructura y version identica; copia solo memorias,
nombres y atributos hasta `0x8800` sobre la lectura del destino. Conserva sus
ajustes y pide confirmacion antes de sustituir la edicion local. Puede recuperar
canales con TX habilitada: revisar antes de escribir. No escribe por si solo:
para enviar se usa **Escribir y releer canales**, con sus requisitos de respaldo
completo, confirmacion y relectura. No importa copias Flash ni paquetes de UV Studio.

### Plantillas regionales y ficheros preconfigurados

En Repetidores, **Preparar 3 repetidores Bricohams Murcia** incorpora ED5YBF
Carrascoy, ED5YAK y ED5YAL Sierra Espuna, transcritos del `PRESET_CSV` del ZIP
Bricohams Studio aportado. Se puede descargar el fichero CHIRP CSV sin depender
de servicios externos. Todo es solo RX; el CSV usa Duplex off y TX nominal en
comentarios. La vigencia no esta confirmada y el CTCSS no se programa.

**Plantillas Murcia** muestra y descarga por separado:

- Aeropuertos LEMI, LELC y LEAL y guardia 121.500 MHz: 15 servicios AM en JSON.
  Portadoras RF y designadores 8.33 kHz se mantienen separados. Fuente:
  [AIP ENAIRE](https://aip.enaire.es/), AD 2.18 de cada aeropuerto,
  consultada el 26-10-2026. Las coordenadas son aproximadas del aerodromo.
  Confirmar AIP y NOTAM vigentes, no usar la plantilla para operacion aeronautica.
- FM Murcia: 15 entradas de Onda Regional y OR Musica, tomadas de
  [Donde escucharnos](https://www.orm.es/donde-escucharnos/), consultada el
  26-10-2026. Es una seleccion de radiodifusion, no todas las cadenas comerciales.
  No hay coordenadas verificadas de transmisores ni filtrado por proximidad.
- REMER: descarga de los 11 canales VHF ya disponibles, en CSV solo RX.
  Seleccion y preparacion individual siguen en la pestana REMER.

AM y radiodifusion WFM son plantillas de consulta/exportacion, no se convierten
a FM de comunicaciones. El editor de memorias Quansheng actual no las instala;
se requiere receptor y formato compatibles. Las descargas no prueban recepcion,
actividad ni escritura en hardware.

### Listas de escaneo por zona o geografia

Las nuevas memorias participan por defecto en todas las listas (valor 25);
no quedan con participacion cero. Puedes elegir una lista unica 1-24 para
el lote, cero para no participar, o agrupar por zona, provincia/region o
localidad. La agrupacion reserva listas numericas libres sin reemplazar
listas existentes. Si falta el campo elegido o no hay listas libres, se
rechaza el lote sin modificar la imagen. No se infiere una provincia por
la frecuencia ni se usa geolocalizacion implicitamente.

REMER incluye su zona; RepeaterBook conserva region/localidad. Un CSV puede
incluir columnas adicionales `Zone`, `Region`/`State`, `City` y `Country`.
Sin ellas puedes usar lista unica o la zona generica del formato CSV.
El informe indica el numero asignado a cada grupo nuevo: anotarlo antes de
cerrar. No cambia nombres de lista, prioridades, ALL/MIX ni ajustes globales.
Los duplicados omitidos conservan su lista anterior.

Para cambiar canales existentes, marcarlos en la tabla, elegir **Asignar
seleccion a lista** y pulsar **Aplicar lista al archivo local**. Tambien
puedes editar la lista de una memoria individual. La asignacion elimina
su marca de exclusion del escaneo, pero conserva frecuencias, tonos, modos
y bloqueo TX. Guardar el binario y verificar ScList en la radio despues de
una escritura autorizada. No son zonas DMR ni varios grupos simultaneos por
canal; cada memoria tiene un numero de participacion nativo.

### Pases guardados y CAT RX

**Guardar plan de pases JSON** conserva TLE, posicion, horarios y la frecuencia
FM seleccionada. **Reabrir plan de pases JSON** requiere consentimiento para
usar la posicion del archivo, valida los datos y recalcula horarios para la
hora actual sin consultar proveedores. Los horarios antiguos no se usan para
controlar CAT. Un TLE caducado se rechaza: actualizar elementos y recalcular.
Los planes antiguos sin frecuencia se pueden abrir, pero hay que consultar
y seleccionar de nuevo la frecuencia FM.

Para llevar un pase a la configuracion: seleccionar frecuencia y pase,
**Preparar canales con Doppler corregido**, **Cargar SAT / Doppler preparados**
y **Guardar configuracion local**. Guardar horarios no instala TLE en el
firmware. Estas opciones no graban audio de la radio.

Para CAT: conectar en solo lectura, arrancar manualmente la imagen Bricohams
Satelites correcta, entrar en SAT RX, pulsar 8 y marcar la confirmacion de
firmware en el panel. No intentar CAT sobre F4HWN original, ARDF o Espectro:
no implementan el comando privado. Seleccionar un pase actualmente visible y
mantener la pagina en primer plano. Las ordenes RX caducan a los 3 segundos;
la cadencia del navegador descuenta el tiempo de respuesta de cada orden.
Detener no envia una nueva sintonia si SAT RX ya esta desactivado.

Las pruebas automatizadas y de navegador comprueban PMR, edicion, listas y
exportacion sobre datos sinteticos y sobre la configuracion leida de la unidad.
La lectura USB real no equivale a verificar escritura, pantalla o RF. Sin
respaldo completo y banco inequivoque no se declara verificada la escritura
fisica ni se modifican slots o calibracion.

### Multiboot y canales independientes por perfil

El conector solo lee la configuracion logica que presenta la radio arrancada.
No selecciona slots de firmware ni bancos CFG, ni demuestra que el perfil o
slot visible corresponda al almacenamiento que se va a escribir. No existe
una operacion web que distribuya un plan de canales a todos los slots.

Para mantener perfiles separados, arranca manualmente cada perfil/banco que
quieras administrar y repite el flujo de lectura y exportacion **por separado**.
Etiqueta cada archivo con modelo/revision, version y perfil de firmware, banco
CFG si se puede verificar en la radio y fecha; conserva tambien su hash SHA-256.
Antes de editar otro perfil, guarda y cierra el archivo anterior. Compara las
lecturas: si el firmware no permite identificar el slot o dos respaldos no
demuestran aislamiento, trata la separacion como no verificada y no escribas.
No copies un archivo de un perfil a otro suponiendo que las memorias se
comparten o se mantienen independientes.

En esta sesion no se hizo una nueva prueba USB. Para la unidad previamente
documentada (F4HWN v6.0.0), el respaldo disponible sigue siendo parcial y la
escritura fisica permanece bloqueada. Las nuevas funciones de editar, borrar
y comprobar canales despues de importarlos son validaciones del archivo local,
no una prueba de que el firmware los muestre en la pantalla ni de que el cambio
haya llegado a un slot fisico. Consulta [REMER, aeropuertos y FM comercial](AYUDA-ANYTONE.md)
para las diferencias entre preparacion local, compatibilidad de parser y prueba RF.

## Elegir hardware antes de firmware

| Radio/revision | Relacion con esta web | Regla |
| --- | --- | --- |
| UV-K1 / UV-K1(8) PY32 | Destino UV-K1 del catalogo/conector | Verificar placa e identificacion; no imagen V1 |
| UV-K5 V3 PY32 | Destino UV-K5-V3 | Compartir familia no permite ignorar revision real |
| UV-K5(8), UV-K6, UV-K5+ V1 | Karina V1/OneOfEleven u otros proyectos V1 | Fuera del conector de slots PY32 |
| UV-K5 V2 | Hardware diferente | Ni V1 ni V3 por parecido exterior |
| UV-K5(99) y etiquetas comerciales | El nombre puede abarcar revisiones diferentes | Identificar MCU/revision con fuente del proyecto |
| TK-11 y Baofeng de aspecto parecido | No son destinos del conector | No usar estas imagenes |

El manual ARDF advierte incluso de etiquetas V3 en hardware V2. La pegatina
ayuda pero no es prueba unica. USB-C no garantiza que cualquier firmware hable
el mismo protocolo ni que el puerto sirva para programacion en todas las revisiones.

## Matriz de versiones y formatos

| Rama | Catalogo | Ediciones/variantes | Escritura desde esta web |
| --- | --- | --- | --- |
| F4HWN v4.x | Estables reconocidas con archivo especifico `k1` o `k5v3` | Fusion, posibles SA818 segun publicacion | Solo descarga |
| F4HWN v5.x | Estables reconocidas y hash publicado | Fusion, posibles SA818 | Solo descarga |
| F4HWN v6.x | Estables reconocidas y hash publicado | Fusion, FieldOps, Transfer, Labs segun publicacion | Solo imagenes no SA818, inspeccionadas y con respaldo completo |
| Desarrollo/beta/rolling | Excluidas del catalogo estable | No se equiparan a release | Biblioteca bloquea nombres conocidos de esas variantes |
| ARDF V3/UV-K1 | Fuente reald separada | Versiones ARDF-K5v3_K1 | Solo descarga; ver [ARDF](AYUDA-ARDF.md) |
| Stock | No se selecciona como F4HWN | Imagen del fabricante | No se instala en slots mediante este inspector |
| Karina V1 | Documentacion del paquete | RAW y packed V1 | Bloqueado por incompatibilidad PY32 |
| Karina V3/K1 de Dim0s | ZIP inspeccionado separado, con vectores PY32 | RAW y packed por hardware | No se habilita: multiboot Armel y fuentes no verificados |
| Bricohams V3 | Constructor local v6.1.0 | Fusion y Labs generadas | Preparacion en slots, mismas barreras, experimental |

Los nombres historicos Bandscope, Broadcast, Basic, RescueOps o Game que aparecen
en documentos antiguos no son equivalentes uno-a-uno a los presets v6.
No conviertas sus ajustes por posicion de menu. Para el inventario exacto de
opciones y defaults usa [opciones](AYUDA-OPCIONES-F4HWN.md) y
[presets por commit](F4HWN-PRESETS.md).

El selector consulta publicaciones autorizadas, descarta prereleases/drafts,
comprueba nombre, version, tamano y digest SHA-256 publicado por GitHub.
No muestra un catalogo parcial como si estuviera completo ante errores.
La version instalada debe leerse en SysInf, no deducirse del ultimo archivo
descargado. Una actualizacion puede cambiar persistencia y compatibilidad CFG.

### Inventario de publicaciones reconocido el 25-10-2026

Consulta en vivo realizada para UV-K5-V3: 41 imagenes reconocidas, no un listado
de todos los archivos de los repositorios. Para UV-K1 las v4 deben ser las
imagenes especificas de K1. Cada enlace contiene las notas de esa version;
esta tabla no inventa diferencias funcionales no comprobadas entre parches.

| Version | Ediciones reconocidas | Tratamiento |
| --- | --- | --- |
| [v6.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.3.0) | Fusion, FieldOps, Labs, Transfer | Preparables tras comprobaciones y respaldo |
| [v6.2.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.2.0) | Fusion, FieldOps, Labs, Transfer | Igual; revisar cambios de datos/API |
| [v6.1.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.1.0) | Fusion, FieldOps, Labs, Transfer | Base local Bricohams, no misma identidad de edicion |
| [v6.0.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.0.0) | Fusion, FieldOps, Labs, Transfer | No asumir lector fisico Labs v6.1+ |
| [v5.9.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.9.0) | Fusion y SA818 | Solo descarga |
| [v5.8.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.8.0) | Fusion y SA818 | Solo descarga |
| [v5.7.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.7.0) | Fusion y SA818 | Solo descarga |
| [v5.6.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.6.1) | Fusion y SA818 | Solo descarga |
| [v5.6.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.6.0) | Fusion y SA818 | Solo descarga |
| [v5.5.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.5.0) | Fusion y SA818 | Solo descarga |
| [v5.4.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.4.0) | Fusion y SA818 | Solo descarga |
| [v5.3.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.3.1) | Fusion | Solo descarga |
| [v5.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.3.0) | Fusion | Solo descarga |
| [v5.2.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.2.0) | Fusion | Solo descarga |
| [v5.1.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.1.0) | Fusion | Solo descarga |
| [v4.3.2](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v4.3.2) | Fusion por hardware | Solo descarga |
| [v4.3.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v4.3.1) | Fusion por hardware | Solo descarga |
| [v4.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v4.3.0) | Fusion por hardware | Solo descarga |
| [ARDF v0.5.1](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.5.1) | ARDF | Solo descarga |
| [ARDF v0.5](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.5) | ARDF | Solo descarga |
| [ARDF v0.4](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.4) | ARDF | Solo descarga |
| [ARDF v0.2](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.2) | ARDF | Solo descarga |

## Que edicion elegir

| Edicion | Enfoque del perfil v6 | Precaucion |
| --- | --- | --- |
| Fusion | Uso general, espectro, escaneo, multiboot/CFG segun preset | No contiene por ello el lector fisico completo de Labs |
| FieldOps | Funciones de campo, Fox Hunt/Beacon y RescueOps segun preset | Revisar funciones TX; no es homologacion de emergencias |
| Transfer | Enfasis de transferencia/AirCopy segun preset | Requiere extremo/protocolo compatible, no sustituye copia completa |
| Labs | Apps overlay, diagnostico y lectura/escritura externa cuando habilitada | Experimental; ABI/API y comandos cambian |
| Max | Perfil disponible en catalogo de opciones v6.3.0 | No asumir que existe binario de release ni que cabe con cualquier cambio |
| Custom | Perfil reducido configurable | No tiene garantizado multiboot; el builder local aqui no lo acepta |
| Bricohams | Identidad de edicion propia sobre perfiles v6.1.0 fijados | No es Karina ni firmware oficial firmado |

Los valores exactos ON/OFF son mas fiables que el nombre comercial del perfil.
Por ejemplo, Labs requiere las opciones concretas de Flash fisica para el
respaldo que exige esta web.

## Diccionario de menus de radio

Los siguientes nombres proceden de `MenuList` del codigo v6.1 inspeccionado.
Un menu condicionado puede no existir en tu compilacion. Se usa el nombre,
no un numero fijo que cambia al incluir/excluir funciones.
«Guardar canal» significa persistir la memoria; no todas las modificaciones
temporales en MR se guardan automaticamente.

### Canal, recepcion y tonos

| Menu | Explicacion y comprobacion |
| --- | --- |
| Step | Paso del VFO; no ancho del filtro. Elegir el raster del servicio escuchado |
| Power | Nivel RF por canal/VFO. Los valores nominales no garantizan potencia medida |
| RxDCS / RxCTCS | Filtro subaudible de recepcion. Desactivar al diagnosticar silencio |
| TxDCS / TxCTCS | Codigo/tono transmitido. Solo el exigido por el sistema |
| TxODir | Direccion del desplazamiento TX: OFF, + o - en la base inspeccionada |
| TxOffs | Magnitud de desplazamiento. Revisar frecuencia TX resultante |
| W/N | Canal FM ancho/estrecho; SetNFM puede elegir variante estrecha |
| BusyCL | Impide TX cuando el criterio de canal ocupado lo detecta |
| Compnd | Compander de audio; exige compatibilidad del interlocutor |
| Mode | Demodulacion RX disponible en ese build; no cambia hardware ni permisos TX |
| TXLock | Bloqueo de emision del canal; mantener en canales de escucha |
| Sql | Umbral de squelch; cero puede dejar ruido abierto continuamente |
| RxMode | Determina escucha y respuesta TX; comprobar el VFO que emitira |
| ChList | Consulta/seleccion de memorias segun contexto de interfaz |
| ChSave | Guardar en memoria; comprobar destino antes de reemplazar |
| ChDele | Borrar memoria; no equivale a borrar solo el nombre |
| ChName | Nombre de canal; no modifica frecuencia |

### Escaneo, prioridades y teclas

| Menu | Explicacion y comprobacion |
| --- | --- |
| ScList | Lista de escaneo activa; revisar que no este vacia |
| ScPri | Uso de canales prioritarios en el ciclo |
| PriCh1 / PriCh2 | Memorias prioritarias; no son VFO A/B |
| ScnRev | Reanudacion: portadora, tiempo o parada segun build |
| F1Shrt / F1Long | Funcion de pulsacion corta/larga del lateral 1 |
| F2Shrt / F2Long | Funcion de pulsacion corta/larga del lateral 2 |
| M Long | Accion asignada a pulsacion larga de MENU |
| KeyLck | Bloqueo automatico y demora; diferente de SetLck |
| 1 Call | Canal de llamada rapida; verificar que la memoria elegida sea correcta |
| SetScn | Modo/velocidad de escaneo cuando se compila; mas rapido no asegura mejor deteccion |
| SetKey | Ajustes de teclas de RescueOps; solo si el perfil lo incluye |

En v6.1 se describen 24 listas con nombre mas combinaciones ALL y MIX. ALL
omite las memorias excluidas y MIX combina listas seleccionadas. No proyectar
esa capacidad sobre v4/v5. Las prioridades de Full Watch provienen de las
prioridades de lista; duplicados/entradas invalidas no crean receptores nuevos.

### Audio, DTMF y emision

| Menu | Explicacion y comprobacion |
| --- | --- |
| TxTOut | Limite continuo de TX; distinto de elegir el aviso SetTOT |
| Mic | Ganancia de microfono; exceso causa distorsion, no mas potencia util |
| MicBar | Indicador de nivel; no sustituye medida de desviacion |
| Beep | Avisos de teclado/interfaz; ajustar volumen antes de auriculares |
| Voice | Indicaciones de voz solo si estan compiladas |
| Roger | Aviso de fin de TX; usar solo donde este permitido y sea apropiado |
| STE / RP STE | Tratamiento de cola de squelch local/repetidor, dependiente del otro extremo |
| ANI ID | Identificador DTMF cuando la llamada DTMF esta compilada |
| UPCode / DWCode | Secuencias configuradas de identificacion/control DTMF; no enviar a sistemas sin permiso |
| PTT ID | Momento/uso de identificacion al accionar PTT |
| D ST | Audio local asociado a DTMF segun implementacion; no es Time Slot DMR |
| D Resp / D Hold | Respuesta y retencion de llamadas DTMF cuando habilitadas |
| D Prel | Parametro de preambulo/temporizacion DTMF; conservar default salvo requisito del sistema |
| D Decd / D List | Decodificacion/lista DTMF de la funcion de llamadas |
| D Live | Visualizacion de DTMF recibido; no convierte la señal en privada |
| VOX | Disparo por audio; desactivar para diagnostico y para evitar TX accidental |
| SetPwr | Nivel de usuario usado por Power=USER |
| SetPTT | PTT clasico o enclavado OnePush; el segundo puede seguir emitiendo al soltar |
| SetTOT | Tipo de aviso de timeout, no su duracion |
| SetEOT | Aviso de fin de emision; revisar sonido/visual segun uso |
| SetRxA | Perfil de audio RX cuando AUDIO esta habilitado |
| SetVol | Ajuste de audio RX por firmware, distinto del mando fisico |
| SetNFM | Variante de filtro estrecho 12.5/6.25 kHz documentada por upstream; no paso VFO |

### Pantalla, energia y opciones avanzadas

| Menu | Explicacion y comprobacion |
| --- | --- |
| BatSav | Ahorro de recepcion; puede retrasar deteccion de actividad |
| BatTxt | Presentacion de bateria |
| ChDisp | Nombre/frecuencia/numero segun modo de visualizacion |
| POnMsg | Mensaje de encendido; no prueba autenticidad del firmware |
| BLTime | Tiempo de retroiluminacion |
| BLMin / BLMax | Brillo minimo/maximo; deben resultar legibles |
| BLTxRx | Activacion de luz durante TX/RX |
| SysInf | Version/build, bateria y paginas de diagnostico segun opciones |
| SetCtr | Contraste de pantalla, no ganancia RF |
| SetInv | Inversion de colores/pixeles |
| SetLck | Alcance del bloqueo: teclas o tambien PTT segun build |
| SetMet | Estilo del S-meter; cifras no equivalen a instrumento calibrado de banco |
| SetGUI | Estilo/tamano de informacion VFO |
| SetTmr | Visualizacion de tiempos RX/TX |
| SetOff | Temporizador de deep sleep; puede interrumpir una sesion |
| SetSav | Presentacion/logo de ahorro cuando compilado |
| SetCfg | Aplicar otro banco de configuracion sin cambiar firmware |
| SetNWR | Funcion NOAA si compilada y aplicable a la region |
| F Lock | Perfil de bandas; no homologacion ni permiso para ampliar TX |
| 350 En | Acceso de recepcion a un rango adicional segun build; no implica emision autorizada |
| FrCali | Ajuste de referencia de frecuencia si se compila; requiere instrumental |
| BatCal | Calibracion de lectura de tension; no cargar valores de otra unidad |
| BatTyp | Perfil de capacidad de bateria; no reparacion ni calibracion RF |
| SetNav | Disposicion de navegacion UV-K1 frente a UV-K5 V3 |
| Reset | Restauracion de ajustes; alcance dependiente del build, con riesgo de perdida |

Menus `Scramb`, `Tx 200`, `Tx 350`, `Tx 500`, `ScraEn` o `NOAA-S` pueden
aparecer en ramas sin la capa F4HWN. Se citan para identificacion historica,
no como opciones habilitadas en los perfiles publicados ni instrucciones para
desbloquear emisiones. Un scrambler no debe tratarse como cifrado seguro.

## RxMode y Full Watch

En v6.1 Full Watch visita VFO A, B y prioridades validas. No son cuatro
receptores independientes. FULL RX/RESPOND puede responder en el ultimo canal
recibido; MAIN TX/FULL RX mantiene TX en el principal. Antes de usar PTT verifica
la indicacion de destino. Para diagnostico elige MAIN ONLY.
Los modos DUAL/CROSS de pantalla no deben confundirse con configuracion de
repetidor ni asumirse como repeticion automatica entre bandas.

## Slots y bancos CFG: operaciones distintas

| Elemento | Contenido | Cambiarlo implica |
| --- | --- | --- |
| Main | Copia base gestionada por firmware, no bootloader | Protegido por la web |
| Slot 1-4 | Imagen de firmware adicional en Flash externa | Restaurar una imagen al procesador desde la radio |
| CFG M/1-4 | Canales, VFO, ajustes y listas independientes | Cargar otra configuracion compatible |
| App Labs | Codigo/recursos con ABI/API especifica | Ejecutar una funcion en overlay RAM, no cambiar firmware completo |

En el upstream v6.1 inspeccionado se abre el selector con MENU al encender.
Confirmar restauracion en la propia radio; no apagar durante ella.
SetCfg cambia banco sin restaurar firmware. La web no inventa un comando remoto
para ninguna de estas acciones.

Para preparar desde biblioteca, elegir carpeta, seleccionar entrada admitida,
revisar nombre/hash y pulsar Preparar. No escribe. Instalar requiere conexion
compatible, respaldo Flash completo y confirmacion. Se verifica CRC del slot.
Vectores y cadena F4HWN correctos no prueban que el codigo sea autentico.

## Labs y aplicaciones

La base inspeccionada documenta 16 huecos y apps de radio, APRS, SSTV,
diagnostico y demos. El conjunto cambia entre releases; no todas las apps
estan disponibles ni son compatibles con todos los builds.

**Catalogo de apps Labs precompiladas:** incluye SystemInfo, BroadcastFM,
Cube3D, Tetris, Breakout y Minesweeper, de la publicacion upstream v6.1.0.
Se sirven junto con la web, tambien en la exportacion estatica, sin compilar.
Son Apache-2.0 y conservan autoria original; no se renombran como propias.
Se comprueban SHA-256, tamano, FAP1, nombre, version, ABI y API minima.
Todas requieren ABI 1 y API minima 2; confirmar compatibilidad con el Labs
activo. No hay certificacion de arranque en esta unidad.

Seleccionar modelo y app, confirmar compatibilidad y pulsar **Verificar y
preparar app**. Esto solo prepara el archivo: consultar huecos, seleccionar
destino y pulsar **Instalar app y verificar** por separado. Tambien se puede
descargar el archivo y su manifiesto. No se instalan ni ejecutan apps
automaticamente. El catalogo de pruebas excluye balizas y apps de socorro;
el catalogo completo sigue en UV Studio. No es una garantia de aislamiento:
toda app nativa tiene acceso a la radio.

El mantenedor regenera este catalogo con
`node scripts/publish-firmware.cjs --apps-only`: solo acepta los seis
archivos archivados y hashes fijados; rechaza cualquier cambio.

El conector comprueba FAP1, limites de codigo/recursos y CRC de recursos, y
relee bloques escritos. La aceptacion de cabecera no demuestra que una app
pueda ejecutarse: ABI, API y capacidades pueden rechazarla al cargar/ejecutar.
Usa firmware y apps de la misma publicacion. Instalar una app de origen
desconocido equivale a dar codigo nativo acceso a la radio.

**Exportar app del hueco** reconstruye el archivo FAP1 desde cabecera,
codigo y recursos fisicos y verifica sus CRC antes de solicitar la descarga.
Necesita firmware con lectura Flash fisica; no es una descarga del catalogo.

**Mover app al hueco vacio** permite reordenar sin sobrescribir otra app.
Seleccionar origen y destino vacio, y escribir la confirmacion mostrada.
Primero instala/relee/verifica el destino; solo despues borra el origen y
comprueba que queda vacio. No es atomico: una interrupcion puede dejar dos
copias, o una copia de destino incompleta con el origen intacto. Conservar
el respaldo y consultar de nuevo los huecos antes de reintentar. Para
intercambiar dos apps ocupadas, usar un tercer hueco vacio como temporal.
No ejecuta ninguna app ni certifica compatibilidad ABI/API.

**Borrar todas las apps** exige respaldo completo y la frase
`BORRAR TODAS LAS APPS`, tambien en modo avanzado. Se consulta el numero
real de huecos (16 o 48 segun firmware), se borran solo los ocupados y se
comprueba que todos quedan vacios. Un error detiene el proceso sin afirmar
exito global; el borrado parcial no se revierte automaticamente. No toca
canales, configuracion, firmware ni calibracion. Estas operaciones nuevas
se han verificado con radio simulada; no se han ejecutado en la unidad fisica.

APRS TX requiere configuracion legal de indicativo/SSID, posicion y ruta.
No transmite esta web por cargar un `.app`; no se configuran balizas automaticas
como parte de un respaldo. Las funciones de emergencia/EPIRB se citan como
inventario upstream: no probar emisiones en frecuencias de socorro.

## Problemas habituales

| Sintoma | Revision |
| --- | --- |
| Arranca pero no aparece SetCfg | Comprobar opciones multiboot del build, no solo version |
| Slot visible con datos pero CRC incorrecto | No restaurar; conservar archivo y respaldo |
| USB identifica pero lectura Flash falla | Puede faltar comando fisico Labs; cerrar otros programas y registrar build |
| Teclas parecen invertidas | Revisar SetNav/modelo; no flashear otra familia para corregirlo |
| Cambio de ajustes desaparece | Guardar memoria o comprobar banco CFG y persistencia |
| No se oye un repetidor | RX, modo, SQL y filtro RX; no empezar aumentando potencia TX |
| Una app no se ejecuta | Verificar ABI/API/caps y release, no repetir escrituras a ciegas |
| SA818 o packed bloqueado | Es intencionado; no renombrar para eludir la restriccion |

## Fuentes y mantenimiento

- [Proyecto PY32 y README](https://github.com/armel/uv-k1-k5v3-firmware-custom).
- [Publicaciones por version](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases).
- [Presets v6.3.0 fijados](https://github.com/armel/uv-k1-k5v3-firmware-custom/blob/ca3a4271386049e7b459b215cef0ad0eea1a30ca/CMakePresets.json).
- [Menu v6.1 inspeccionado](https://github.com/armel/uv-k1-k5v3-firmware-custom/blob/f556a96e73c3e423a00cf473aeb37f827cac05a5/App/ui/menu.c).
- [UVTOOLS2 del proyecto](https://armel.github.io/uvtools2/).
- [Driver CHIRP dedicado](https://github.com/armel/uv-k5-chirp-driver).
- [Bricohams, hashes y compilacion](BRICOHAMS-FIRMWARE.md).
- [Karina V1 y limites de licencia/fuentes](KARINA.md).
- [Atlas tecnico UV-K5 V3: hardware, protocolos y esquemas](ATLAS-UV-K5-V3.md).

Para un firmware stock, UVMOD o OneOfEleven consultar su proyecto y hardware
exactos: no hay equivalencia de menus/EEPROM garantizada con esta guia.
Para los enlaces añadidos por el usuario, ver [Egzumer V1](AYUDA-EGZUMER.md) y
[pack Dim0s con Karina V3/K1](AYUDA-PACK-DIM0S.md).
