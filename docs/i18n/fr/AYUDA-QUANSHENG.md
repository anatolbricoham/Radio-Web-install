# Quansheng : F4HWN, versions et configuration

Révision : 26-10-2026. Base fonctionnelle inspectée : Fusion61, commit
`f556a96e73c3e423a00cf473aeb37f827cac05a5` ; catalogue modulaire web v6.3.0,
commit `ca3a4271386049e7b459b215cef0ad0eea1a30ca`.
Ce guide n’attribue pas automatiquement les fonctions v6.1/v6.3 à v4 ou v5.
Fonctionnement interne de la radio (broches, mémoires, protocole, bootloader,
schémas et photos) : [Atlas technique UV-K5 V3](ATLAS-UV-K5-V3.md).

## Canaux simples et modèles par pays

Dans Canaux, suivez trois étapes : lire le talkie, choisir un modèle et vérifier/
enregistrer. Le panneau droit propose Espagne, UK, États-Unis, Allemagne, France,
Hongrie et Italie, avec filtres région/État et localité. Les résultats sont affichés
par pages de 50 ; rien n'est sélectionné automatiquement. Tout sélectionner exige
au plus 1024 canaux : choisissez d'abord un État aux États-Unis. L'ajout change
uniquement le fichier local et nécessite une mémoire FM existante. Enregistrer
télécharge le fichier ; l'écriture exige toujours sauvegarde complète et relecture.
Copies, listes de balayage, CSV et glisser-déposer restent dans les options avancées.

Les données viennent de [HearHam](https://hearham.com/repeaters), qui autorise son API
dans les applications en ligne/hors ligne, et des limites Natural Earth du domaine
public. RepeaterBook n'est pas répliqué. Le catalogue contient les relais FM VHF/UHF
opérationnels disponibles, pas tous les relais de chaque pays : couverture très
limitée en Hongrie et Italie. Vérifiez date, zone, activité et autorisations. Tonalités
et TX nominal sont informatifs ; l'import bloque TX. PMR446 est facultatif, RX seul,
absent pour les États-Unis et n'autorise pas l'émission avec un talkie radioamateur.
SAT ajoute seulement des mémoires FM nominales, sans Doppler.

Les passages couvrent les jours restants du mois UTC pour 75 points de référence :
villes européennes et un point approximatif dans chacun des 50 États américains et
Washington DC. Ils ne sont pas valables pour tout un pays. Coordonnées, date, époque
TLE et élévation minimale de 10 degrés sont fournies. Échantillonnage de 60 s ;
au-delà de sept jours depuis le TLE, les passages sont provisoires. Ce ne sont pas
des plans opérationnels et rien n'est envoyé à CAT. Téléchargez le JSON complet ou
recalculez en arrière-plan avec vos coordonnées ; avant utilisation, employez un TLE
récent et le calcul précis 24/48 heures de Satellites. La précision future n'est
pas garantie.

La tâche quotidienne GitHub Actions s'exécute à 04:35 UTC, télécharge les données,
recalcule, teste et publie uniquement si tout réussit. Les erreurs sont visibles
dans Actions ; la dernière version reste publiée, sans données inventées.
Pour régénérer localement : `npm run fetch:channel-templates` puis
`npm run fetch:template-passes`. Les installateurs incluent les mêmes fichiers ;
leur copie hors ligne change seulement lors de l'installation d'une autre version.

## Visualiseur en direct et journal RF

Dans **Canaux**, les deux tables sont côte à côte sur ordinateur et empilées sur mobile.
Choisissez le modèle compatible et autorisez la lecture directement dans **Canaux**.
Cliquez sur **Connecter et lire les canaux (lecture seule)** :
la colonne gauche affiche la banque active sans autorisation d'écriture. À droite,
choisissez PMR446, REMER VHF ou les relais Bricohams Murcie, puis **Préparer le modèle
à glisser**. Les canaux préparés depuis CSV et les autres catalogues y figurent aussi.
Glissez une ligne ou une sélection vers la gauche, ou utilisez **Copier la sélection**
et **Coller ici**. Les canaux du catalogue sont insérés en réception seule à partir
d'une mémoire FM existante ; AM et DMR ne sont pas convertis. Seule la copie locale
change. Enregistrez-la avant de relire : son remplacement demande confirmation.
L'écriture physique exige toujours une sauvegarde Flash complète, une confirmation
et une relecture. Cette connexion ne démarre pas automatiquement le visualiseur,
pour ne pas occuper le port pendant la lecture.

Test physique du 27-10-2026 : périphérique USB série COM4, firmware identifié F4HWN v6.1.0,
banque active de 41344 octets contenant 121 canaux FM. Deux lectures complètes étaient identiques
(SHA-256 `16f9c8b5ccb9d865ceaca599acf1766737641d8e8285a832680c2f745b02a331`).
La web publiée a affiché les 121 canaux et préparé 16 PMR446 ; insérer PMR01 a donné
122 canaux uniquement dans la copie locale, avec écriture bloquée. Seules identification
et lectures ont été envoyées : aucune écriture, aucun redémarrage ni changement de banque.
Cela ne valide pas l'écriture physique ni l'APK sur téléphone.

Le visualiseur apparaît au début de la section Quansheng. Il démarre à la fin de la connexion :
immédiatement avec **Connecter en lecture seule / CAT**, ou après la sauvegarde avec
**Connecter et sauvegarder**. Il nécessite une image avec K5Viewer activé et sans
verrouillage empêchant le protocole. S’il ne reçoit aucune trame pendant dix secondes, il
le signale et s’arrête ; il ne simule pas l’écran.

- LCD réel de 128 x 64, capture PNG et état des LED signalé par le firmware.
- Une seule connexion et un seul lecteur. Toute opération met d’abord le
  visualiseur en pause, laisse les trames se terminer, puis exécute la commande. **Démarrer le visualiseur
  et le journal RF** le reprend. **Mettre le visualiseur en pause** conserve la dernière capture.
- Le journal RF apparaît en bas. Il reçoit RF Log **v2** et l’historique du firmware,
  élimine les doublons par séquence et conserve au maximum 512 entrées en RAM.
  RF Log doit être activé : l’absence de données ne signifie pas l’absence de signaux.
- **Exporter le journal RF CSV** télécharge la séquence, RX/TX/démarrage, la fréquence,
  la durée, le numéro/nom de mémoire, la valeur brute du compteur et la batterie. Aucune
  date UTC n’est attribuée aux enregistrements qui n’en incluent pas. Les valeurs du compteur
  ne sont pas des mesures de puissance étalonnées. Le CSV neutralise les formules des tableurs.
- Lors d’une reconnexion, l’affichage précédent est effacé pour éviter de mélanger les radios. Exportez avant.
  Arrêter le visualiseur n’efface pas le journal persistant de la radio.

Référence du protocole : UV Studio, révision
`e7aa946f6de002559e1aaf3f91765db7fc2ed567`, `k5viewer.js` et `rf-log.js`.
L’implémentation locale n’envoie ni PTT, ni touches, ni redémarrage, ni commandes persistantes.
Le test COM4 du 26-10-2026 a reçu **24 trames LCD et une trame RF** du
firmware qui continuait de fonctionner, sans données incomplètes. Il a fallu activer
DTR USB ; Web Serial le définit explicitement pour Quansheng. La radio n’a pas
envoyé d’entrées RF enregistrées : aucune validation matérielle n’est donc attribuée
à un historique qui n’a pas été reçu. L’analyseur d’historique, l’exclusion mutuelle,
l’écran web et le CSV ont également été vérifiés avec des trames de test. K5Viewer doit être activé dans le firmware actif.

## Catalogue précompilé sans outils de compilation

Le site inclut neuf images v6.1.0 : Bricohams ARDF, Satellite, Spectrum,
Labs et Fusion, ainsi que les images officielles F4HWN Fusion, FieldOps, Transfer et Labs.
Aucun dossier n’est à sélectionner. Le même catalogue est disponible sur le serveur local
et dans l’exportation statique. Il ne s’agit pas d’un téléchargement dynamique depuis une URL quelconque.

### CHIRP v6.1.0

Les neuf images du catalogue utilisent le protocole F4HWN v6.1.0. Choisir
**Quansheng / UV-K5** générique dans CHIRP peut identifier la radio mais marquer
son image comme firmware non pris en charge, bloquant modification et envoi.
Ce message ne prouve pas un défaut de connexion ; recompiler la même version
ou falsifier son identité ne corrige pas le choix du pilote.

1. Conserver l'image existante et les sauvegardes de configuration/étalonnage.
2. Télécharger le [pilote officiel F4HWN v6.1.0](../../../precompiled/chirp/f4hwn.chirp.v6.1.0.py).
   Dans CHIRP, ouvrir ce fichier Python par **Fichier > Charger un module**.
   Ne pas modifier les préférences de sécurité pour charger les modules automatiquement.
3. Dans **Radio > Télécharger depuis la radio**, sélectionner **Quansheng** et
   **UV-K1 & UV-K5 V3 (F4HWN)**, le port de la radio et le fonctionnement normal.
   Effectuer un nouveau téléchargement et l'enregistrer sous un autre nom.
4. Pour récupérer les canaux d'un ancien fichier, les exporter en CSV puis les
   importer dans ce nouveau téléchargement. Vérifier fréquences, tonalités,
   décalages et verrouillage TX ; ne pas renommer ni forcer l'image restreinte en écriture.
5. Avant tout envoi, créer une nouvelle sauvegarde et conserver l'étalonnage.
   Ne pas envoyer l'étalonnage ni les réglages avancés pour migrer des canaux.

L'image créée avec le pilote générique reste en lecture seule : changer de
firmware ou de modèle ne convertit pas son format. Le pilote v6.3.0 des exemples
appartient à une autre publication ; utiliser v6.1.0 avec ce catalogue.
Le [manifeste](../../../precompiled/chirp/manifest.json) fixe la source et le SHA-256 ;
le module inchangé est distribué sous GPL-2.0-ou-ultérieure, avec
[licence](../../../precompiled/chirp/COPYING.txt) et [attribution](../../../precompiled/chirp/NOTICE.txt).
Ces instructions documentent le bon choix de pilote, sans certifier les essais
physiques de lecture/écriture ou de démarrage des neuf variantes.

1. Sélectionner UV-K1 ou UV-K5 V3 et l’image du catalogue.
2. Confirmer le modèle et la condition Beta des versions dérivées de Bricohams.
3. **Télécharger, vérifier et préparer pour le slot** vérifie la taille, le SHA-256 et
   la structure PY32 avant d’autoriser l’image. **Télécharger le BIN et le manifeste**
   permet de l’enregistrer sans préparer ni écrire.
4. Sélectionner le slot 1-4, le nom et **Installer et vérifier le CRC**. Les protections
   de sauvegarde restent en vigueur ; Main, CFG et l’étalonnage ne sont pas effacés.
5. Démarrer manuellement chaque slot et vérifier SysInf et les fonctions.

Les images Bricohams restent **en version Beta, sans validation complète du démarrage**,
même lorsque leur écriture dans la Flash a été vérifiée par CRC.
Le catalogue conserve les métadonnées d’origine : un test structurel n’est pas transformé
en certification matérielle. Pour les autres versions, le catalogue des releases officielles
reste disponible ; les variantes incompatibles avec les slots ne sont proposées qu’au téléchargement.

Maintenance : `npm run publish:firmware` vérifie les cinq compilations
locales fixées par SHA-256 et récupère la release officielle v6.1.0 avec les
hashes de GitHub. Le catalogue n’est écrit qu’après validation de tous les fichiers.
Les licences GPL de Bricohams et Apache upstream, ainsi que leurs avis, sont distribués.
Les options, hashs des sources intégrées et commit upstream figurent dans chaque
entrée de `precompiled/catalog.json` ; le constructeur et les modules sources
se trouvent dans ce dépôt. Aucune configuration ni aucun étalonnage utilisateur n’est inclus dans le catalogue.

### Écriture physique vérifiée le 26-10-2026

Sur l’unité UV-K5 V3 déclarée par son propriétaire, les éléments suivants ont été écrits :

| Slot | Image | CRC vérifié dans la radio |
| --- | --- | --- |
| 1 | BH ARDF | `47f33dcc` |
| 2 | BH Labs | `273d232d` |
| 3 | BH Satellite | `96d5b68b` |
| 4 | BH Spectrum | `702b5c07` |

Main/Fusion, la configuration active et l’étalonnage ont été vérifiés sans changement.
Aucune réinitialisation CFG, suppression d’apps ni aucun redémarrage n’a été envoyé pendant l’écriture.
Ensuite, le propriétaire a démarré BH Labs manuellement et des lectures réelles ont été vérifiées,
comme indiqué ci-dessous. **Le démarrage d’ARDF, Satellite et Spectrum, ainsi que les tests d’écriture de canaux, restent à valider** :
les CRC ne prouvent pas l’exécution.
Des réponses perdues et un blocage USB CDC avec des trames de 64 octets exacts ont été détectés.
Le transport Quansheng ajoute un octet nul en dehors de ces trames et réessaie jusqu’à quatre fois
uniquement le même bloc NOR (comme UV Studio) ; il ne réessaie jamais automatiquement les effacements, réinitialisations ni refus du firmware.

Pour utiliser le slot 3 (BH Satellite), consultez [Initiation au satellite](INICIACION-SATELITE.md)
et [Antennes satellite](ANTENAS-SATELITE.md).

### Options avancées et portée de la restauration

Le panneau **Outils propres à Bricohams** contient des accès internes au
clavier/redémarrage, au firmware principal DFU v6/v7, à la sauvegarde/restauration de l’étalonnage,
au téléchargement/à l’installation du logo, à la sauvegarde/restauration Flash, au catalogue/tri/suppression des
apps, aux slots et aux filtres/exportations RF. Il n’ouvre pas UV Studio, ne charge pas ses scripts
et ne délègue pas ces opérations à un autre site. Les liens de provenance et de licence
des binaires sont conservés : ce ne sont pas des dépendances d’exécution de l’interface.
La restauration stock reconstruit la Flash externe et nécessite l’étape DFU,
avec des images différentes pour UV-K1/UV-K5 V3, tout en préservant l’étalonnage de l’appareil.
À ne pas confondre avec **Réinitialiser la banque CFG**, qui n’efface qu’une banque.

Des panneaux natifs de maintenance et de restauration usine/DFU utilisent une implémentation propre
du protocole publié, sans copier l’interface ni le code d’UV Studio.
La parité n’est pas complète entre les versions : les slots et canaux conservent leur
flux v6 ; le DFU accepte les BIN v6 et les paquets v7 FWAT/FWA1. Les ressources v7 ne
s’installent que dans le firmware actif avec un Build ID correspondant et une nouvelle sauvegarde.
Toute la prise en charge v7 a été testée en simulation, pas sur cette radio physique.
Mettre le visualiseur en pause avant de lancer le suivi CAT : ils partagent le port.
CAT et le visualiseur sont bloqués tant qu’une restauration usine est en attente.

**Firmware principal / DFU propre :** sélectionner un BIN F4HWN v6.x PY32 de
256 bytes à 118 KiB, ou un paquet v7 avec trailer FWAT et ressources FWA1.
Le paquet est séparé localement : seule l’image interne est envoyée au DFU.
Les limites, longueurs exactes, CRC du paquet et CRC des ressources sont vérifiés.
V7 sans paquet complet et versions inconnues sont refusés.
L’image est vérifiée par vecteurs, version et SHA-256,
mais cela ne garantit ni sa provenance ni sa compatibilité physique. Une sauvegarde complète
et la phrase `FIRMWARE PRINCIPAL UV-K5-V3` ou `FIRMWARE PRINCIPAL UV-K1` sont requises.
La préparation n’écrit rien ; elle conserve une copie immuable en mémoire, bloque les autres
opérations et active le bouton DFU. Se déconnecter ici, entrer manuellement en
DFU avec PTT et confirmer `DFU PRINCIPAL UV-K5-V3` ou `DFU PRINCIPAL UV-K1`.
Ne pas fermer la page ni changer de radio entre les étapes.

Ce flux remplace le firmware interne, pas le bootloader ; il n’efface pas la Flash externe
et ne synchronise pas l’image Main externe du multiboot. Le sélecteur multiboot
peut restaurer une autre image au démarrage : vérifier les slots manuellement.
Aucun rollback n’est garanti. Le bootloader, l’identification cohérente,
le numéro de page et l’état de chaque ACK sont vérifiés. Le DFU ne permet pas de relecture : la finalisation
des pages n’équivaut pas à valider le démarrage ou la RF. En cas d’échec, conserver la page,
la sauvegarde et la même radio pour réessayer. Testé en simulation uniquement.

**Ressources externes v7 :** après le DFU, démarrer normalement le firmware v7 et
se connecter avec une nouvelle sauvegarde complète (si elle ne peut pas être achevée,
l’écriture reste bloquée). L’écran peut rester vide tant que les ressources manquent.
Sélectionner le même paquet complet ou son FWA1 dans **Ressources externes v7**.
Vérifier le fichier sans écrire et confirmer `RECURSOS UV-K5-V3` ou
`RECURSOS UV-K1` pour installer. Le slot actif et le Build ID sont lus via
`0x0750` ; un Build ID différent arrête le processus avant l’effacement.

Seule la zone de ressources du slot actif est effacée via `0x0752`, puis les données sont écrites
par blocs de 128 octets maximum via `0x0754` et l’en-tête FWA1 de 32 octets
est écrit en dernier. Seul un bloc identique est réessayé après un timeout
(quatre tentatives maximum), jamais les effacements ni les refus. `0x0756` valide
les ressources et la requête finale doit indiquer le même slot/Build ID, un état valide
et les ressources chargées. L’autorisation est révoquée après toute tentative
d’effacement : se reconnecter et refaire une sauvegarde. Aucune relecture physique
d’une zone dont l’adresse n’est pas publiée ici n’est proposée ; le résultat est une validation
du firmware, pas une preuve d’affichage ou de démarrage. Une interruption peut rendre
les ressources incomplètes : conserver le paquet et la sauvegarde pour récupérer. Les
ressources ne s’installent pas dans les slots inactifs et la cartographie v6 n’est pas utilisée pour v7.
**Journal RF propre :** filtrer par nom de mémoire, fréquence MHz et
événement RX/TX/démarrage. Les filtres ne modifient que l’affichage, ils ne suppriment jamais
l’historique reçu. Exporter la sélection en CSV ou tout le journal en JSON
`bricohams-rf-log` v1. `exportedAt` est l’heure d’exportation, pas l’heure
des événements ; `eventUTCProvided` et `calibratedRF` sont faux. Aucune date UTC,
aucun RSSI étalonné ni aucune analyse de spectre ne sont inventés à partir de l’historique.

**Paternité et droits :** l’implémentation de ces outils est propre à
Bricohams, mais les firmwares, apps et ressources tiers conservent leurs
licences et attributions. Réécrire le site ne transforme pas ces fichiers en
œuvre propre et ne garantit pas l’absence de réclamations. Les avis
Apache/GPL ne sont pas supprimés et les images stock ne sont pas redistribuées dans le site.

**Clavier distant natif :** dans le visualiseur, il nécessite une sauvegarde complète de la
connexion actuelle, une activation manuelle et la confirmation de chaque touche. Il propose
les chiffres, MENU, haut/bas, EXIT, astérisque, dièse et F1/F2, avec
appui court ou long ; il n’inclut ni PTT ni raccourcis globaux. Les touches peuvent
modifier des réglages et F1/F2 exécuter des fonctions d’émission selon leur attribution.
Ne pas supposer que la fonction est en réception uniquement. Chaque envoi désactive de nouveau le clavier.
Seul l’envoi UART est signalé, sans inventer d’ACK d’exécution ; vérifier l’écran LCD.
Le clavier est bloqué en cas de pause, de perte d’autorisation/de connexion, de démarrage CAT ou de restauration usine.

**Redémarrage natif :** nécessite une sauvegarde complète et la saisie de
`REINICIAR RADIO`, même en mode avancé. Le visualiseur est mis en pause, une seule commande
`0x05DD` est envoyée, les autorisations sont révoquées et la connexion est fermée.
Aucune nouvelle tentative n’est effectuée et aucun ACK reçu ni démarrage réussi n’est affirmé ;
vérifier la radio et se reconnecter pour refaire une sauvegarde.
Cela ne change ni le slot ni la banque CFG et peut entraîner la perte d’un état transitoire.
Le clavier et le redémarrage ont été testés en simulation, pas sur la radio physique.

**Maintenance native :** permet de télécharger/installer un logo BIN ST7565 ou
un PNG exact de 128 x 64, d’exporter/restaurer les 512 octets d’étalonnage et
d’exporter/restaurer la Flash externe de 2 MiB. Les écritures nécessitent une sauvegarde
complète de la connexion actuelle et une confirmation explicite. Le logo est relu
et les données voisines sont vérifiées. La restauration Flash conserve tout le
secteur d’étalonnage actuel, ignore les secteurs identiques et écrit les secteurs
d’état multiboot en dernier. Backup et Restore vérifient les 512 secteurs de 4 KiB via le CRC
physique du firmware : la commande `0x073E` ne permet pas de consulter les 2 MiB d’un seul coup.
Le CRC global enregistré est calculé localement à partir de l’image dont les secteurs ont déjà été comparés.
La restauration de l’étalonnage ou de la Flash révoque l’autorisation d’écriture : se reconnecter.
Ne pas importer l’étalonnage d’une autre radio.

**Restauration usine native, irréversible :** il ne s’agit pas de la réinitialisation CFG. Sélectionner le modèle
exact et télécharger les deux BIN stock depuis les liens de l’assistant. La taille et le SHA-256 sont
vérifiés par rapport à la révision officielle fixée
`e7aa946f6de002559e1aaf3f91765db7fc2ed567` ; ces BIN ne sont pas redistribués.

1. Exporter hors du navigateur la sauvegarde complète et vérifier les deux BIN.
2. Avec la même radio connectée normalement, confirmer `FABRICA UV-K5-V3`
   ou `FABRICA UV-K1`. L’étape 1 remplace les slots, toutes les banques de canaux,
   les apps et les journaux, mais conserve le secteur d’étalonnage complet.
3. Attendre la vérification complète de la Flash. Ne pas fermer ni recharger la page :
   l’autorisation de l’étape 2 n’existe qu’en mémoire. Ne pas démarrer normalement
   avant la fin des deux étapes et ne pas changer de radio.
4. Cliquer sur Déconnecter ; éteindre la radio et maintenir PTT à l’allumage pour le DFU
   (LED allumée, écran éteint). Relâcher PTT, sélectionner l’étape 2 et
   confirmer `DFU UV-K5-V3` ou `DFU UV-K1`.
5. L’assistant vérifie le bootloader et la confirmation de chaque page. Il n’accepte que
   le bootloader `7.00.07` pour V3 et `7.02.02` ou `7.03.xx` pour K1.
   Les nouvelles tentatives sont limitées à la même page en cas de timeout, jamais en cas de refus.
   Le DFU ne permet pas de relecture : les pages confirmées ne prouvent pas le démarrage.
6. Démarrer manuellement et vérifier la version, la réception et le fonctionnement.
   Si l’étape 2 échoue, conserver la page et la répéter avec la même image.
   Si l’étape 1 échoue, ne pas tenter le DFU ni démarrer normalement : conserver la
   sauvegarde, se déconnecter ici et utiliser la récupération officielle.

La maintenance et le DFU ont été testés avec des appareils simulés. Les
quatre fichiers stock officiels ont été téléchargés et validés avec le
vérificateur de production. **Aucune restauration usine complète,
d’étalonnage, de logo ni de Flash n’a été exécutée sur la radio physique pendant ces tests.**

| Option UV Studio | Sur ce site | Accès officiel supplémentaire |
| --- | --- | --- |
| Visualiseur LCD, capture, clavier court/long et redémarrage | Natif, partage la connexion ; modifications avec confirmation | Visualiseur officiel |
| Journal RF, historique, filtres, CSV/JSON | Natif, v2 ; exportation locale | Autres visualisations |
| Catalogue précompilé | Natif, neuf images fixées et catalogue dynamique | Catalogue de l’éditeur |
| Slots 1-4, effacement, CRC | Natif avec sauvegarde | Options supplémentaires de l’éditeur |
| CFG 1-4 | Réinitialisation native distincte du firmware | Sélection de la banque depuis la radio |
| Apps Labs | Catalogue de six apps, liste, exportation, installation, déplacement vers un emplacement vide, suppression individuelle/globale et vérification natives | Catalogue étendu |
| Étalonnage | Backup/restore natif, confirmation et relecture | Restore officiel |
| Flash externe | Backup/restore natif, secteur d’étalonnage protégé | Restore officiel |
| Firmware principal | DFU natif BIN v6 ou paquet v7 FWAT/FWA1 | Ne synchronise pas Main externe |
| Assets v7 | Natifs, slot actif uniquement avec Build ID, sauvegarde et validation firmware | Pas de slots inactifs ni de relecture physique |
| Logo | Téléchargement/installation natifs BIN ou PNG 128 x 64 | Éditeur officiel |
| Restauration usine stock et DFU | Assistant natif, deux étapes et hashs/modèles fixés | Récupération officielle |

## Mise en service de 0 à 100 %

Parcours complet, d’une radio neuve jusqu’à une radio configurée, sauvegardée et vérifiée.
Chaque phase indique le critère de fin. Les phases 9 et 10 sont facultatives.

| Phase | Action | Terminée lorsque | Détails |
| --- | --- | --- | --- |
| 0. Identifier | Étiquette sous la batterie, SysInf et version du bootloader | Vous savez s’il s’agit d’une UV-K5 V3, UV-K1 ou d’une autre révision | [Versions](ATLAS-UV-K5-V3.md#versions-et-identification) |
| 1. Préparer le PC | Chrome ou Edge pour ordinateur, câble USB-C de données ou câble Kenwood, pilote | Le port apparaît et aucune autre application ne l’utilise | [Pilotes](../../../ayuda.html#drivers) et [USB](AYUDA-CONFIGURACION.md#connexion-usb-sans-confondre-les-modes) |
| 2. Sauvegardes | Étalonnage (512 octets), configuration et, si le firmware le permet, Flash complète | Vous avez les fichiers hors du navigateur avec leur SHA-256 | [Étalonnage](ATLAS-UV-K5-V3.md#calibration) |
| 3. Choisir le firmware | Version et édition (Fusion, FieldOps, Transfer, Labs) correspondant au matériel | Fichier `.bin` téléchargé depuis la release officielle avec hash vérifié | [Éditions](#quelle-édition-choisir) et [versions](#matrice-des-versions-et-formats) |
| 4. Flasher | Radio éteinte, PTT maintenu à l’allumage, UV Studio ou Bricohams Studio | L’outil confirme toutes les pages et la radio redémarre | [Bootloader](ATLAS-UV-K5-V3.md#bootloader-et-flashage) |
| 5. Premier démarrage | Lire SysInf et vérifier la version | La version correspond au fichier flashé | Section suivante |
| 6. Réglages de base | Navigation, batterie, écran, squelch, TX et verrouillages | Les réglages sont conservés après extinction et rallumage | Tableau des réglages de base |
| 7. Canaux | Relais, PMR en RX uniquement, satellites et noms | Les mémoires apparaissent et sont relues à l’identique | [Mémoires FM](#préparer-et-envoyer-des-mémoires-fm) |
| 8. Balayage | Listes, priorités et reprise | Le balayage ne parcourt que les mémoires prévues | [Balayage](#balayage-priorités-et-touches) |
| 9. Multiboot (facultatif) | Slots 1-4 et banques CFG | Chaque slot valide le CRC et démarre | [Slots et banques](#slots-et-banques-cfg--opérations-distinctes) |
| 10. Labs (facultatif) | Apps en overlay de la même release | L’app démarre et retourne au firmware | [Labs](#labs-et-applications) |
| 11. Vérification finale | Liste de contrôle et nouvelle sauvegarde | Vous possédez une sauvegarde de l’état final et les versions sont notées | [Liste finale](AYUDA-CONFIGURACION.md#liste-de-vérification-après-lopération) |

### Phase 4 étape par étape : flasher le firmware principal

1. Enregistrer les sauvegardes de la phase 2. Sans étalonnage sauvegardé, ne pas continuer.
2. Fermer CHIRP, CPS, les autres onglets Studio et la connexion normale de ce site.
3. Éteindre la radio. Maintenir PTT appuyé et l’allumer : la LED reste allumée
   et l’écran éteint. Relâcher PTT et brancher le câble USB-C.
4. Dans [UV Studio](https://armel.github.io/uvstudio/) ou
   [Bricohams Studio](https://brico-hams.github.io/Bricohams-Studio/), sélectionner le
   port. Le bootloader doit annoncer `7.00.07` (UV-K5 V3) ou `7.02.02`/`7.03.0x`
   (UV-K1). Toute autre version : arrêter et vérifier le modèle.
5. Choisir le `.bin` non empaqueté de l’édition. Jamais un `*.packed.bin` (pour le
   programme de mise à jour officiel) ni une image V1.
6. Confirmer et ne pas toucher à la radio ni au câble tant que toutes les pages ne sont pas
   confirmées. En cas d’interruption, la radio reste en mode mise à jour : reprendre à
   l’étape 3 avec le même fichier.
7. La radio redémarre automatiquement. Après avoir flashé F4HWN, enregistrer de nouveau l’étalonnage
   avec UV Studio, comme le recommande le projet.

### Phase 5 : premier démarrage

- Ouvrir SysInf et noter la version et l’édition. Si elles ne correspondent pas au fichier, ne pas
  continuer : reprendre à la phase 4.
- L’étalonnage n’est pas effacé lors du flashage. Si la batterie indique 0 V ou si le squelch
  se comporte anormalement, vérifier que l’étalonnage provient bien de cette radio avant toute intervention.
- Si les menus affichent des valeurs incohérentes après un changement de firmware,
  utiliser Reset uniquement après vérification des sauvegardes : sa portée dépend du build.

### Phase 6 : réglages de base recommandés

| Menu | Valeur initiale raisonnable | Motif |
| --- | --- | --- |
| SetNav | Selon le modèle (K1 ou K5 V3) | Si les flèches semblent inversées, il s’agit de ce réglage |
| BatTyp | Capacité réelle de votre batterie | Indicateur de charge correct |
| SetCtr, BLMin, BLMax, BLTime | Lisibles avec la consommation la plus faible | Confort et autonomie |
| Sql | 3-4 pour commencer | Ferme le bruit sans perdre les signaux faibles |
| Step | Grille du service (12.5 ou 25 kHz en VHF/UHF) | Syntoniser les canaux réels |
| RxMode | MAIN ONLY au début | Toujours savoir par où s’effectue l’émission |
| SetPTT | Classique | OnePush peut continuer à émettre après relâchement |
| VOX | OFF | Éviter les émissions accidentelles |
| TxTOut | 60-120 s | Coupe un PTT bloqué |
| F Lock | Profil de votre région | Limite TX aux bandes concernées |
| SetLck | Touches (et PTT si nécessaire) | Évite les changements dans la poche |
| ChDisp | Nom | Afficher le nom de mémoire en mode MR |

Après les réglages, éteindre et rallumer pour confirmer qu’ils ont été enregistrés.
La signification de chaque menu figure dans le [dictionnaire des menus](#dictionnaire-des-menus-de-la-radio).

### Phases 7 et 8 : canaux et balayage

- Ce site prépare les canaux à partir d’un modèle et les écrit avec sauvegarde et
  relecture ([mémoires FM](#préparer-et-envoyer-des-mémoires-fm)). Vous pouvez aussi utiliser
  le pilote CHIRP de chaque release F4HWN ou Bricohams Studio.
- Les canaux importés sont verrouillés TX. Ne retirer ce verrou que pour des canaux vérifiés
  et autorisés ([dictionnaire des canaux](AYUDA-CONFIGURACION.md#référentiel-des-canaux-analogiques)).
- Affecter chaque mémoire à sa liste (ScList), choisir les priorités (PriCh1/PriCh2)
  et le mode de reprise (ScnRev). Tester le balayage avec SQL réglé.

## Retour aux paramètres d’usine et récupération

| Situation | Action |
| --- | --- |
| Vous voulez revenir au firmware d’usine | Restauration guidée d’[UV Studio](https://armel.github.io/uvstudio/) : reconstruit la flash externe sans toucher à l’étalonnage. Flasher uniquement le `.bin` d’usine peut empêcher le K1 de démarrer |
| La radio ne démarre pas après flashage | Entrer en mode mise à jour (PTT à l’allumage) et flasher de nouveau un `.bin` du bon modèle |
| Le bootloader ne répond pas ou le port n’apparaît pas | Essayer un autre câble de données et un autre port ; vérifier qu’aucun autre programme n’utilise le port |
| Impossible d’entrer en mode mise à jour | Récupération par SWD avec ST-Link ([SWD](ATLAS-UV-K5-V3.md#swd-et-récupération)). Réservé aux personnes expérimentées |
| Étalonnage perdu ou provenant d’une autre radio | Restaurer la sauvegarde de la phase 2. Ne pas utiliser l’étalonnage d’un autre appareil |

## Beta : test USB réel et canaux

### BH Labs démarré : vérification réelle du 26-10-2026
Après avoir sélectionné manuellement le slot 2, COM4 identifie **F4HWN v6.1.0**.
Les CRC de Main et des quatre slots Bricohams du tableau précédent ont été vérifiés,
et 38 canaux de la banque active de BH Labs ont été lus.

La première sauvegarde a révélé que `0x073E` rejette une plage de 2 MiB :
le firmware limite chaque requête CRC à 4 KiB. Après correction du site, la sauvegarde
des 2 MiB a été achevée et enregistrée, avec vérification de ses 512 secteurs.
L’étalonnage de 512 octets et Main de 120832 octets ont également été enregistrés.
L’étalonnage conserve le SHA-256 antérieur
`f9c537df7a1764b31c73b3021dae69a1a654e267315f8c58c12bc4a3f1dd1a1b`.
16 emplacements d’apps ont été consultés et Tetris a été reconstruit et exporté depuis
la Flash physique, avec validation du format et des CRC du fichier.

La configuration active a été relue sans changement. Sur une copie locale de
cette lecture réelle, la création, la modification et la suppression d’un canal RX-only ont été vérifiées,
tout en conservant les 38 canaux d’origine et les réglages protégés. **Aucun canal,
app, firmware, étalonnage ni ressource n’a été écrit pendant cette vérification.**
Les opérations CRUD écrites sur la radio et l’isolation physique des autres banques ne sont pas démontrées par ce test de lecture.

### Lectures historiques avec Main/Fusion v6.0.0

Test en lecture seule effectué le 25-10-2026 sur COM4 (USB CDC
VID 36B7 / PID FFFF), modèle déclaré par le propriétaire : **UV-K5 V3**.
La radio indique **F4HWN v6.0.0** ; la carte n’est pas déduite automatiquement.

- Identification, étalonnage de 512 octets et configuration logique de 41344 octets :
  corrects. Deux lectures indépendantes concordent octet par octet et par SHA-256.
- 200 canaux existants sont reconnus. Les mémoires dont la fréquence est effacée
  (`0`/`0xFFFFFFFF`) ne sont pas affichées même si des attributs résiduels subsistent,
  conformément à la vérification du firmware.
- Consultation des slots : Main/Fusion, FieldOps, Labs, Doppler et Ardf, tous en v6.0.0.
  Cela lit les en-têtes ; cela ne revient pas à vérifier le CRC de chaque image.
- La commande Flash physique `0x0738` ne répond pas sur ce firmware. Elle était auparavant
  exécutée pendant la sauvegarde automatique et le timeout invalidait la connexion.
  Désormais v6.0 enregistre une copie **partielle** (étalonnage/configuration), maintient la
  connexion de lecture et explique le blocage de l’écriture, sans tenter cette commande.
- Aucun canal physique, firmware, slot ou étalonnage n’a été écrit ni effacé.
  Aucun test RF ni test matériel OpenGD77 n’a été effectué.

Nouvelle lecture le **26-10-2026** : COM4 répond avec F4HWN v6.0.0 et renvoie
41344 octets avec 200 mémoires. Sur une copie de cette lecture, 16 nouveaux PMR
(216 canaux), la modification, l’affectation à une liste et la suppression locale sont vérifiés,
sans changer les octets à partir de `0x8800`. Le navigateur ouvre également cette lecture réelle
et relit les 16 PMR ajoutés. Aucune écriture persistante n’a été envoyée. CAT n’a pas été testé
sur ce firmware : il n’implémente pas la commande CAT v1 de l’image Bricohams Satellite.

### Préparer et envoyer des mémoires FM

1. Sélectionner UV-K5 V3 ou UV-K1 selon l’appareil et confirmer le modèle. Pour lire
   sans attendre la Flash complète, utiliser **Connecter en lecture seule / CAT**.
   Cette session ne crée pas de sauvegarde et n’autorise pas les écritures persistantes.
   La connexion normale conserve la sauvegarde automatique obligatoire pour écrire.
2. Cliquer sur **Lire les canaux de la banque active**. En v6.0, ils sont affichés automatiquement
   depuis la copie partielle ; après une sauvegarde complète, la configuration active est aussi lue.
   Pour travailler sans radio, ouvrir une configuration logique F4HWN v6 de exactement 41344 octets,
   pas un firmware ni une Flash complète.
3. Préparer **PMR446 analogiques 1-16 (réception uniquement)**, les relais FM ou les mémoires SAT/Doppler
   depuis le planificateur. Sélectionner une mémoire FM existante comme modèle et cliquer
   sur **Ajouter des canaux au fichier local ouvert**. Le premier modèle FM est sélectionné à l’ouverture du fichier
   et conservé lors de la mise à jour du tableau.
   Une configuration sans mémoire FM nécessite un modèle valide de son propre firmware ; aucun enregistrement arbitraire n’est généré.
   Il est aussi possible d’importer des canaux FM depuis un CSV CHIRP ou OpenGD77 CPS ; seules les fréquences VHF/UHF
   prises en charge sont acceptées et les lignes DMR/autres formats sont exclues avec motif. Le champ de fichier des relais
   accepte ces mêmes CSV et les ajoute directement aux canaux préparés. Le JSON RepeaterBook nécessite de confirmer l’autorisation
   et passe d’abord par le tableau de sélection.
4. Les nouvelles mémoires ont TXLock activé, tonalités et DTMF désactivés et Reverse
   désactivé. PMR est préparé en étroit. Seuls les RX/TX nominaux entre
   136-174 ou 400-470 MHz sont importés ; cela n’autorise pas l’émission. Noms : 10
   premiers caractères ASCII. Les doublons ne sont ignorés que si la mémoire équivalente est déjà
   verrouillée TX ; une correspondance autorisant TX n’est pas considérée valide.
5. **Modifier** change le nom/RX/TX d’une mémoire FM et **Supprimer du fichier**
   supprime cette mémoire de la copie locale. La modification active le verrouillage TX et conserve
   les octets qui ne font pas partie de ces champs ; les deux opérations travaillent sur une
   copie en mémoire. Vérifier de nouveau le canal affiché par l’analyseur,
   cliquer sur **Enregistrer la configuration locale** et enregistrer le binaire modifié à part de
   l’original. Si Chrome/Edge propose un sélecteur de fichier, le site écrit et
   ferme le fichier avant de confirmer. Dans les navigateurs sans ce sélecteur, il ne fait que demander un téléchargement : vérifier le dossier Téléchargements et ne pas confondre
   la demande avec un enregistrement confirmé. Enregistrer le projet JSON ou CSV ne remplace pas ce binaire.
6. **Écrire et relire les canaux (Beta)** n’est activé qu’avec une sauvegarde complète
   de cette session, au moyen de Labs v6.1+ avec lecture Flash et CRC. Vérifier que la
   radio est toujours dans le même état qu’à la lecture ; écrire des blocs de 8 octets et tout relire.
   Pendant l’écriture, les mémoires affectées sont temporairement marquées vides ;
   elles sont réactivées après leurs données/noms. Il ne s’agit pas d’une transaction résistante
   aux coupures d’alimentation. VFO, réglages, étalonnage et autres banques sont protégés.
7. Après réussite, redémarrer manuellement la radio pour recharger les caches. En cas d’échec,
   conserver la sauvegarde et le message exact ; ne pas supposer que l’opération a réussi à la réception d’un ACK.

L’envoi a été vérifié avec un transport simulé, **pas sur le matériel** :
l’unité connectée en v6.0 ne permet pas la sauvegarde complète requise. Cette unité n’est ni
mise à jour ni flashée comme effet secondaire. Le tableau orbital SAT natif n’est pas installé :
SAT/Doppler sont des mémoires FM. Le suivi continu CAT RX nécessite précisément l’image Bricohams Satellite avec CAT v1.

### Simuler le cycle multiboot sans écrire sur USB

La régression automatisée s’exécute avec :

```powershell
node --test --test-name-pattern="simulacion multiboot completa" tests\connectors.test.cjs
```

Elle utilise exclusivement un transport en mémoire : elle n’ouvre ni Web Serial, ni COM, ni USB.
Elle simule quatre installations avec des images de test, une sauvegarde complète et une autorisation
par session, un en-tête écrit en dernier et le CRC de chaque slot. Dans le modèle, elle sélectionne manuellement
des banques CFG distinctes du numéro de slot, afin de ne pas confondre les deux.
Dans chaque banque, elle importe 16 PMR, 11 REMER et un relais CSV fictif ; écrit,
relit, modifie, change la liste, supprime et réutilise la mémoire. Elle vérifie l’isolation
des banques, Main, de l’étalonnage et des réglages protégés. Dans Satellite, elle simule CAT RX et
STOP sans changement persistant. Elle rejette AM, que cet importateur ne convertit pas.

Les CSV acceptent les zéros décimaux finaux tels que `145.600000` et un décalage `0.600000`,
sans arrondir les valeurs nécessitant plus de cinq décimales significatives.
Les relais de test ne constituent pas un répertoire actuel de fréquences réelles.
Cette simulation n’exécute pas le firmware compilé et ne teste ni démarrage, RF,
écran, audio ni isolation physique des banques de la radio connectée.
Elle n’autorise pas les écritures et ne remplace pas la sauvegarde complète de cet appareil.

### Sections de la page et tables de canaux

Les étapes latérales (Sauvegardes et connexion, Canaux, Satellites, Firmware, Outils) affichent uniquement la section choisie. Le menu outils ouvre la section de sa cible.

Les anciens liens avec fragment ouvrent la vue correspondante, puis le fragment est retiré de l'URL. Le menu latéral défile indépendamment dans les fenêtres basses. Les modifications des canaux sont conservées lors des changements de vue ; l'éditeur précède les catalogues de préparation.

Glissez une ligne sélectionnée pour déplacer toute la sélection dans son ordre initial, ou une ligne non sélectionnée pour déplacer uniquement ce canal. Déposez dans la moitié supérieure de la ligne cible pour placer avant, ou dans la moitié inférieure pour placer après. Tous les octets sont conservés, y compris tonalités, DCS et attributs non modifiables.

**Télécharger les canaux du talkie (sauvegarde originale)** relit et sauvegarde la banque active sans remplacer les modifications locales. **Enregistrer la configuration locale** sauvegarde la version modifiée. Modèle, autorisation de lecture, état, progression et déconnexion sont disponibles dans Canaux.

**Ajouter un canal** demande numéro de mémoire, nom, RX, TX nominale et liste de balayage (0, 1-24 ou 25). Sans numéro, ajout à la fin, ou dans un emplacement libre si la mémoire 1024 est occupée. Pour un numéro occupé, choisissez **Avant**, **Après** ou **Annuler** ; annuler ne modifie pas le fichier. Les nouveaux canaux sont en réception seule sur un modèle FM existant. Seul **Écrire et relire les canaux** modifie la radio, avec une sauvegarde complète vérifiée.

Deux tables : **Canaux de la radio**, lus depuis la banque active ou le fichier, et **Canaux à charger**, préparés depuis répéteurs, REMER, PMR446, SAT/Doppler, aéroports, FM/CSV ou copiés de la radio. Glisser une ligne la déplace et décale les intermédiaires. Depuis la table à charger vers la radio, insertion avant la cible ou à la fin en zone vide. La copie radio conserve tous les octets, DCS compris. Sélectionnez et utilisez Copier la sélection / Coller ici, ou Ctrl+C / Ctrl+V avec le focus dans la table. Coller dans la radio insère avant la première sélection ou à la fin sans sélection. Seules les mémoires contiguës jusqu’au premier trou se décalent ; les suivantes restent intactes. Modifications locales, pas d’écriture USB.

### Boutons Backup et Restore des canaux

#### Remplacement exceptionnel autorisé du firmware legacy

L’API avancée `BackupManager.authorizeSlotReplacement` permet d’autoriser
exclusivement des installations de firmware dans les slots 1-4 pour F4HWN legacy avec
sauvegarde partielle, après acceptation littérale de
`REEMPLAZAR SLOTS SIN RESPALDO DE FIRMWARE`. Cette acceptation signifie perdre
les anciennes images sans copie récupérable ; leurs CRC ne constituent pas une sauvegarde.
Elle n’est pas activée par la connexion, par PRO ni par l’importation d’un fichier.

Avant d’émettre cette autorisation, l’étalonnage et la configuration de la session actuelle sont lus et conservés.
L’enregistrement partiel conserve l’acceptation, les slots, noms, tailles et SHA-256 exacts des images.
Chaque installation vérifie de nouveau cet enregistrement et consomme une autorisation unique pour cette image et ce slot.
Une telle autorisation ne permet pas d’effacer séparément des slots, Main, de restaurer la Flash,
d’écrire des canaux, de réinitialiser CFG ni d’installer/supprimer des applications.
Le site normal conserve ses exigences de sauvegarde complète.

Cette voie suit le protocole d’installation d’UV Studio : effacement d’un slot,
blocs d’image, en-tête final et CRC. Elle ne constitue pas une sauvegarde complète ni
une preuve de démarrage. En cas d’échec d’écriture ou de vérification, arrêter et ne pas
démarrer ce slot. Tester chaque image manuellement et préserver Main.

**Backup de la banque active** effectue une nouvelle lecture et enregistre le binaire de
41344 octets avec la date et le SHA-256. Il ne télécharge pas l’édition locale à sa place et
ne remplace pas cette édition. Le résultat distingue un fichier écrit d’un téléchargement
sollicité. Il s’agit d’une copie logique, pas d’une sauvegarde de la Flash, du firmware ou de l’étalonnage.

**Restore : ouvrir une copie de canaux** nécessite de connecter et lire d’abord la banque
de destination. Vérifie la taille, la structure et une version identique ; copie uniquement les mémoires,
noms et attributs jusqu’à `0x8800` sur la lecture de destination. Conserve ses
réglages et demande confirmation avant de remplacer l’édition locale. Des canaux avec TX activée peuvent être restaurés : à vérifier avant l’écriture. L’opération n’écrit pas à elle seule :
pour envoyer, utiliser **Écrire et relire les canaux**, avec ses exigences de sauvegarde
complète, de confirmation et de relecture. N’importe pas de sauvegardes Flash ni de paquets UV Studio.

### Modèles régionaux et fichiers préconfigurés

Dans Relais, **Préparer 3 relais Bricohams Murcia** ajoute ED5YBF
Carrascoy, ED5YAK et ED5YAL Sierra Espuna, retranscrits du `PRESET_CSV` du ZIP
Bricohams Studio fourni. Le fichier CHIRP CSV peut être téléchargé sans dépendre
de services externes. Le tout est en réception uniquement ; le CSV utilise Duplex off et TX nominal dans
les commentaires. La validité n’est pas confirmée et le CTCSS n’est pas programmé.

**Modèles Murcia** affiche et télécharge séparément :

- Aéroports LEMI, LELC et LEAL et garde 121.500 MHz : 15 services AM en JSON.
  Les porteuses RF et désignateurs 8.33 kHz restent séparés. Source :
  [AIP ENAIRE](https://aip.enaire.es/), AD 2.18 de chaque aéroport,
  consultée le 26-10-2026. Les coordonnées de l’aérodrome sont approximatives.
  Confirmer l’AIP et les NOTAM en vigueur ; ne pas utiliser ce modèle pour une opération aéronautique.
- FM Murcia : 15 entrées d’Onda Regional et OR Musica, tirées de
  [Où nous écouter](https://www.orm.es/donde-escucharnos/), consultée le
  26-10-2026. Il s’agit d’une sélection de radiodiffusion, pas de toutes les stations commerciales.
  Les coordonnées des émetteurs ne sont pas vérifiées et aucun filtrage par proximité n’est appliqué.
- REMER : téléchargement des 11 canaux VHF déjà disponibles en CSV RX uniquement.
  La sélection et la préparation individuelles restent dans l’onglet REMER.

L’AM et la radiodiffusion WFM sont des modèles à consulter/exporter, ils ne sont pas convertis
en FM de communications. L’éditeur de mémoires Quansheng actuel ne les installe pas ;
un récepteur et un format compatibles sont nécessaires. Les téléchargements ne prouvent ni réception,
ni activité, ni écriture sur le matériel.

### Listes de balayage par zone ou géographie

Les nouvelles mémoires participent par défaut à toutes les listes (valeur 25) ;
elles n’ont pas une participation nulle. Il est possible de choisir une seule liste 1-24 pour
le lot, zéro pour ne participer à aucune, ou de grouper par zone, province/région ou
localité. Le regroupement réserve des listes numériques libres sans remplacer
les listes existantes. Si le champ choisi manque ou s’il n’y a pas de liste libre,
le lot est refusé sans modifier l’image. Aucune province n’est déduite de la fréquence et aucune géolocalisation n’est utilisée implicitement.

REMER inclut sa zone ; RepeaterBook conserve région/localité. Un CSV peut
inclure des colonnes supplémentaires `Zone`, `Region`/`State`, `City` et `Country`.
Sans ces colonnes, vous pouvez utiliser une liste unique ou la zone générique du format CSV.
Le rapport indique le numéro affecté à chaque nouveau groupe : notez-le avant de fermer.
Les noms de liste, priorités, ALL/MIX ni réglages globaux ne sont modifiés.
Les doublons ignorés conservent leur liste précédente.

Pour modifier des canaux existants, les sélectionner dans le tableau, choisir **Affecter
la sélection à une liste** et cliquer sur **Appliquer la liste au fichier local**. Il est aussi possible
de modifier la liste d’une mémoire individuelle. L’affectation supprime son exclusion du balayage,
mais conserve les fréquences, tonalités, modes et le verrouillage TX. Enregistrer le binaire et
vérifier ScList dans la radio après une écriture autorisée. Il ne s’agit pas de zones DMR ni de plusieurs groupes simultanés par
canal ; chaque mémoire a un numéro de participation natif.

### Passages enregistrés et CAT RX

**Enregistrer le plan des passages JSON** conserve TLE, position, horaires et la fréquence
FM sélectionnée. **Rouvrir le plan des passages JSON** nécessite l’autorisation d’utiliser la
position du fichier, valide les données et recalcule les horaires pour l’heure actuelle sans consulter de fournisseur.
Les anciens horaires ne sont pas utilisés pour contrôler CAT. Un TLE périmé est refusé : mettre à jour les éléments et recalculer.
Les anciens plans sans fréquence peuvent être ouverts, mais il faut consulter et sélectionner de nouveau la fréquence FM.

Pour transférer un passage dans la configuration : sélectionner fréquence et passage,
**Préparer les canaux avec Doppler corrigé**, **Charger SAT / Doppler préparés**
et **Enregistrer la configuration locale**. L’enregistrement des horaires n’installe pas le TLE dans le
firmware. Ces options n’enregistrent pas l’audio de la radio.

Pour CAT : se connecter en lecture seule, démarrer manuellement la bonne image Bricohams
Satellite, passer en SAT RX, appuyer sur 8 et cocher la confirmation du firmware dans le panneau. Ne pas essayer CAT sur F4HWN d’origine, ARDF ou Espectro : ils n’implémentent pas la commande privée. Sélectionner un passage visible actuellement et garder la page au premier plan. Les commandes RX expirent au bout de 3 secondes ; la cadence du navigateur soustrait le temps de réponse de chaque commande.
Arrêter n’envoie pas une nouvelle syntonisation si SAT RX est déjà désactivé.

Les tests automatisés et du navigateur vérifient PMR, modifications, listes et
exportations sur des données synthétiques et sur la configuration lue de l’appareil.
La lecture USB réelle n’équivaut pas à vérifier l’écriture, l’écran ou la RF. Sans
sauvegarde complète et banque identifiée sans ambiguïté, l’écriture physique n’est pas déclarée
vérifiée et les slots ni l’étalonnage ne sont modifiés.

### Multiboot et canaux indépendants par profil

Le connecteur ne lit que la configuration logique présentée par la radio démarrée.
Il ne sélectionne ni slots de firmware ni banques CFG, et ne démontre pas que le profil ou
le slot visible correspond au stockage qui sera écrit. Aucune opération web ne
répartit un plan de canaux dans tous les slots.

Pour maintenir des profils séparés, démarrer manuellement chaque profil/banque à gérer
et répéter le flux de lecture et d’exportation **séparément**. Étiqueter chaque fichier avec modèle/révision,
version et profil du firmware, banque CFG si elle peut être vérifiée sur la radio, et date ;
conserver également son hash SHA-256. Avant de modifier un autre profil, enregistrer et fermer le fichier précédent. Comparer les lectures : si le firmware ne permet pas d’identifier le slot ou si deux sauvegardes ne démontrent pas l’isolation, considérer la séparation comme non vérifiée et ne pas écrire.
Ne pas copier un fichier d’un profil vers un autre en supposant que les mémoires sont partagées ou restent indépendantes.

Aucun nouveau test USB n’a été réalisé pendant cette session. Pour l’appareil précédemment
documenté (F4HWN v6.0.0), la sauvegarde disponible reste partielle et l’écriture physique demeure bloquée. Les nouvelles fonctions de modification, suppression
et vérification des canaux après leur importation sont des validations du fichier local,
pas une preuve que le firmware les affiche à l’écran ni que le changement a été
appliqué à un slot physique. Consultez [REMER, aéroports et FM commerciale](AYUDA-ANYTONE.md)
pour les différences entre préparation locale, compatibilité de l’analyseur et test RF.
## Choisir le matériel avant le firmware

| Radio/révision | Relation avec ce site | Règle |
| --- | --- | --- |
| UV-K1 / UV-K1(8) PY32 | Cible UV-K1 du catalogue/connecteur | Vérifier la carte et l’identification ; pas d’image V1 |
| UV-K5 V3 PY32 | Cible UV-K5-V3 | Le fait d’appartenir à la même famille ne permet pas d’ignorer la révision réelle |
| UV-K5(8), UV-K6, UV-K5+ V1 | Karina V1/OneOfEleven ou autres projets V1 | Hors du connecteur de slots PY32 |
| UV-K5 V2 | Matériel différent | Ni V1 ni V3 en raison de la ressemblance extérieure |
| UV-K5(99) et étiquettes commerciales | Le nom peut désigner différentes révisions | Identifier le MCU/la révision à partir de la source du projet |
| TK-11 et Baofeng d’apparence similaire | Ne sont pas des cibles du connecteur | Ne pas utiliser ces images |

Le manuel ARDF avertit que des appareils V2 peuvent même porter une étiquette V3. L’étiquette
est utile, mais n’est pas une preuve unique. L’USB-C ne garantit pas que tous les firmwares parlent
le même protocole ni que le port puisse servir à la programmation sur toutes les révisions.

## Matrice des versions et formats

| Branche | Catalogue | Éditions/variantes | Écriture depuis ce site |
| --- | --- | --- | --- |
| F4HWN v4.x | Versions stables reconnues avec fichier spécifique `k1` ou `k5v3` | Fusion, éventuellement SA818 selon la release | Téléchargement uniquement |
| F4HWN v5.x | Versions stables reconnues et hash publié | Fusion, éventuellement SA818 | Téléchargement uniquement |
| F4HWN v6.x | Versions stables reconnues et hash publié | Fusion, FieldOps, Transfer, Labs selon la release | Images non SA818 uniquement, inspectées et avec sauvegarde complète |
| Développement/beta/rolling | Exclues du catalogue stable | Non assimilées à des releases | La bibliothèque bloque les noms connus de ces variantes |
| ARDF V3/UV-K1 | Source reald distincte | Versions ARDF-K5v3_K1 | Téléchargement uniquement ; voir [ARDF](AYUDA-ARDF.md) |
| Stock | Non sélectionné comme F4HWN | Image du fabricant | Non installé dans les slots par cet inspecteur |
| Karina V1 | Documentation du paquet | RAW et packed V1 | Bloqué pour incompatibilité PY32 |
| Karina V3/K1 de Dim0s | ZIP inspecté séparément, avec vecteurs PY32 | RAW et packed par matériel | Non activé : multiboot Armel et sources non vérifiés |
| Bricohams V3 | Constructeur local v6.1.0 | Fusion et Labs générés | Préparation dans les slots, mêmes barrières, expérimental |

Les anciens noms Bandscope, Broadcast, Basic, RescueOps ou Game présents dans
les anciens documents ne correspondent pas un à un aux presets v6.
Ne convertissez pas leurs réglages selon la position du menu. Pour l’inventaire exact des
options et valeurs par défaut, consultez [options](AYUDA-OPCIONES-F4HWN.md) et
[presets par commit](F4HWN-PRESETS.md).

Le sélecteur consulte les releases autorisées, écarte les prereleases/drafts,
vérifie le nom, la version, la taille et le digest SHA-256 publié par GitHub.
En cas d’erreur, il ne présente pas un catalogue partiel comme s’il était complet.
La version installée doit être lue dans SysInf, et non déduite du dernier fichier
téléchargé. Une mise à jour peut modifier la persistance et la compatibilité CFG.

### Inventaire des releases reconnu le 25-10-2026

Consultation en direct effectuée pour UV-K5-V3 : 41 images reconnues, et non la liste
de tous les fichiers des dépôts. Pour UV-K1, les v4 doivent être les images
spécifiques à K1. Chaque lien contient les notes de cette version ;
ce tableau n’invente pas de différences fonctionnelles non vérifiées entre les correctifs.

| Version | Éditions reconnues | Traitement |
| --- | --- | --- |
| [v6.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.3.0) | Fusion, FieldOps, Labs, Transfer | Préparation possible après vérifications et sauvegarde |
| [v6.2.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.2.0) | Fusion, FieldOps, Labs, Transfer | Idem ; vérifier les changements de données/API |
| [v6.1.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.1.0) | Fusion, FieldOps, Labs, Transfer | Base locale Bricohams, identité d’édition différente |
| [v6.0.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v6.0.0) | Fusion, FieldOps, Labs, Transfer | Ne pas présumer du lecteur physique Labs v6.1+ |
| [v5.9.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.9.0) | Fusion et SA818 | Téléchargement uniquement |
| [v5.8.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.8.0) | Fusion et SA818 | Téléchargement uniquement |
| [v5.7.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.7.0) | Fusion et SA818 | Téléchargement uniquement |
| [v5.6.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.6.1) | Fusion et SA818 | Téléchargement uniquement |
| [v5.6.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.6.0) | Fusion et SA818 | Téléchargement uniquement |
| [v5.5.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.5.0) | Fusion et SA818 | Téléchargement uniquement |
| [v5.4.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.4.0) | Fusion et SA818 | Téléchargement uniquement |
| [v5.3.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.3.1) | Fusion | Téléchargement uniquement |
| [v5.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.3.0) | Fusion | Téléchargement uniquement |
| [v5.2.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.2.0) | Fusion | Téléchargement uniquement |
| [v5.1.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v5.1.0) | Fusion | Téléchargement uniquement |
| [v4.3.2](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v4.3.2) | Fusion par matériel | Téléchargement uniquement |
| [v4.3.1](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v4.3.1) | Fusion par matériel | Téléchargement uniquement |
| [v4.3.0](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases/tag/v4.3.0) | Fusion par matériel | Téléchargement uniquement |
| [ARDF v0.5.1](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.5.1) | ARDF | Téléchargement uniquement |
| [ARDF v0.5](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.5) | ARDF | Téléchargement uniquement |
| [ARDF v0.4](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.4) | ARDF | Téléchargement uniquement |
| [ARDF v0.2](https://github.com/reald/uv-k1-k5v3-firmware-custom/releases/tag/ARDF-K5v3_K1-v0.2) | ARDF | Téléchargement uniquement |

## Quelle édition choisir

| Édition | Orientation du profil v6 | Précaution |
| --- | --- | --- |
| Fusion | Usage général, spectre, balayage, multiboot/CFG selon le preset | Ne contient pas pour autant le lecteur physique complet de Labs |
| FieldOps | Fonctions de terrain, Fox Hunt/Beacon et RescueOps selon le preset | Examiner les fonctions TX ; ne constitue pas une homologation d’urgence |
| Transfer | Accent mis sur le transfert/AirCopy selon le preset | Nécessite un autre appareil/protocole compatible, ne remplace pas une sauvegarde complète |
| Labs | Apps overlay, diagnostic et lecture/écriture externe lorsqu’elle est activée | Expérimental ; ABI/API et commandes évoluent |
| Max | Profil présent dans le catalogue d’options v6.3.0 | Ne pas présumer de l’existence d’un binaire release ni de sa capacité après tout changement |
| Custom | Profil réduit configurable | Multiboot non garanti ; le builder local ne l’accepte pas ici |
| Bricohams | Identité d’édition propre reposant sur les profils v6.1.0 fixés | Ni Karina ni firmware officiel signé |

Les valeurs ON/OFF exactes sont plus fiables que le nom commercial du profil.
Par exemple, Labs nécessite les options précises de Flash physique pour la
sauvegarde exigée par ce site.

## Dictionnaire des menus de la radio

Les noms ci-dessous proviennent de `MenuList` du code v6.1 inspecté.
Un menu conditionnel peut être absent de votre compilation. On utilise le nom,
et non un numéro fixe qui change lorsque des fonctions sont incluses/exclues.
« Enregistrer le canal » signifie persister la mémoire ; les modifications temporaires en MR
ne sont pas toutes enregistrées automatiquement.
### Canal, réception et tonalités

| Menu | Explication et vérification |
| --- | --- |
| Step | Pas du VFO ; ce n’est pas la largeur du filtre. Choisir la grille du service écouté |
| Power | Niveau RF par canal/VFO. Les valeurs nominales ne garantissent pas la puissance mesurée |
| RxDCS / RxCTCS | Filtre subaudible en réception. Désactiver pour diagnostiquer une absence de son |
| TxDCS / TxCTCS | Code/tonalité transmis. Uniquement celui exigé par le système |
| TxODir | Sens du décalage TX : OFF, + ou - dans la base inspectée |
| TxOffs | Amplitude du décalage. Vérifier la fréquence TX résultante |
| W/N | Canal FM large/étroit ; SetNFM peut sélectionner la variante étroite |
| BusyCL | Empêche TX lorsque le critère de canal occupé le détecte |
| Compnd | Compander audio ; nécessite la compatibilité de l’interlocuteur |
| Mode | Démodulation RX disponible dans ce build ; ne change ni le matériel ni les autorisations TX |
| TXLock | Verrouillage d’émission du canal ; à conserver sur les canaux d’écoute |
| Sql | Seuil de squelch ; zéro peut laisser le bruit ouvert en continu |
| RxMode | Détermine l’écoute et la réponse TX ; vérifier le VFO qui émettra |
| ChList | Consultation/sélection des mémoires selon le contexte de l’interface |
| ChSave | Enregistrer dans la mémoire ; vérifier la destination avant de remplacer |
| ChDele | Effacer la mémoire ; différent de supprimer uniquement le nom |
| ChName | Nom du canal ; ne modifie pas la fréquence |

### Balayage, priorités et touches

| Menu | Explication et vérification |
| --- | --- |
| ScList | Liste de balayage active ; vérifier qu’elle n’est pas vide |
| ScPri | Utilisation des canaux prioritaires dans le cycle |
| PriCh1 / PriCh2 | Mémoires prioritaires ; ce ne sont pas VFO A/B |
| ScnRev | Reprise : porteuse, temporisation ou arrêt selon le build |
| F1Shrt / F1Long | Fonction associée à un appui court/long sur le bouton latéral 1 |
| F2Shrt / F2Long | Fonction associée à un appui court/long sur le bouton latéral 2 |
| M Long | Action affectée à l’appui long sur MENU |
| KeyLck | Verrouillage automatique et délai ; différent de SetLck |
| 1 Call | Canal d’appel rapide ; vérifier que la mémoire choisie est correcte |
| SetScn | Mode/vitesse de balayage lorsqu’il est compilé ; une vitesse accrue ne garantit pas une meilleure détection |
| SetKey | Réglages des touches RescueOps ; uniquement si le profil l’inclut |

En v6.1, 24 listes nommées sont décrites, avec les combinaisons ALL et MIX. ALL
ignore les mémoires exclues et MIX combine les listes sélectionnées. Ne pas extrapoler
cette capacité aux v4/v5. Les priorités de Full Watch proviennent des
priorités de liste ; les doublons/entrées invalides ne créent pas de nouveaux récepteurs.

### Audio, DTMF et émission

| Menu | Explication et vérification |
| --- | --- |
| TxTOut | Limite de TX continue ; différent du choix de l’alerte SetTOT |
| Mic | Gain du microphone ; un niveau trop élevé provoque de la distorsion, pas plus de puissance utile |
| MicBar | Indicateur de niveau ; ne remplace pas une mesure de déviation |
| Beep | Alertes clavier/interface ; régler le volume avant d’utiliser un casque |
| Voice | Annonces vocales uniquement si elles sont compilées |
| Roger | Tonalité de fin de TX ; uniquement là où elle est autorisée et appropriée |
| STE / RP STE | Traitement de la queue du squelch local/relais, selon l’autre extrémité |
| ANI ID | Identifiant DTMF lorsque les appels DTMF sont compilés |
| UPCode / DWCode | Séquences configurées d’identification/commande DTMF ; ne pas envoyer à des systèmes sans autorisation |
| PTT ID | Moment/utilisation de l’identification lors de l’activation du PTT |
| D ST | Audio local associé au DTMF selon l’implémentation ; ce n’est pas un Time Slot DMR |
| D Resp / D Hold | Réponse et maintien des appels DTMF lorsqu’ils sont activés |
| D Prel | Paramètre de préambule/temporisation DTMF ; conserver la valeur par défaut sauf exigence du système |
| D Decd / D List | Décodage/liste DTMF de la fonction d’appel |
| D Live | Affichage du DTMF reçu ; ne rend pas le signal privé |
| VOX | Déclenchement par audio ; désactiver pour le diagnostic et éviter une émission accidentelle |
| SetPwr | Niveau utilisateur utilisé avec Power=USER |
| SetPTT | PTT classique ou à verrouillage OnePush ; le second peut continuer à émettre après relâchement |
| SetTOT | Type d’alerte de timeout, pas sa durée |
| SetEOT | Alerte de fin d’émission ; vérifier le signal sonore/visuel selon l’usage |
| SetRxA | Profil audio RX lorsque AUDIO est activé |
| SetVol | Réglage audio RX par le firmware, différent du bouton physique |
| SetNFM | Variante du filtre étroit 12.5/6.25 kHz documentée par upstream ; pas un pas de VFO |

### Écran, énergie et options avancées

| Menu | Explication et vérification |
| --- | --- |
| BatSav | Économie en réception ; peut retarder la détection d’activité |
| BatTxt | Affichage de la batterie |
| ChDisp | Nom/fréquence/numéro selon le mode d’affichage |
| POnMsg | Message de démarrage ; ne prouve pas l’authenticité du firmware |
| BLTime | Durée du rétroéclairage |
| BLMin / BLMax | Luminosité minimale/maximale ; elles doivent rester lisibles |
| BLTxRx | Activation de l’éclairage pendant TX/RX |
| SysInf | Version/build, batterie et pages de diagnostic selon les options |
| SetCtr | Contraste de l’écran, pas gain RF |
| SetInv | Inversion des couleurs/pixels |
| SetLck | Portée du verrouillage : touches ou aussi PTT selon le build |
| SetMet | Style du S-meter ; les chiffres ne correspondent pas à un instrument de banc étalonné |
| SetGUI | Style/taille des informations VFO |
| SetTmr | Affichage des durées RX/TX |
| SetOff | Temporisateur de deep sleep ; peut interrompre une session |
| SetSav | Affichage/logo d’économie lorsqu’il est compilé |
| SetCfg | Appliquer une autre banque de configuration sans changer de firmware |
| SetNWR | Fonction NOAA si elle est compilée et applicable à la région |
| F Lock | Profil de bandes ; ne constitue ni homologation ni autorisation d’étendre TX |
| 350 En | Accès en réception à une plage supplémentaire selon le build ; n’implique pas l’autorisation d’émettre |
| FrCali | Réglage de la référence de fréquence si compilé ; nécessite un instrument |
| BatCal | Étalonnage de la lecture de tension ; ne pas charger les valeurs d’un autre appareil |
| BatTyp | Profil de capacité de batterie ; ne répare ni n’étalonne la RF |
| SetNav | Disposition de navigation UV-K1 par rapport à UV-K5 V3 |
| Reset | Restauration des réglages ; portée dépendante du build, avec risque de perte |

Les menus `Scramb`, `Tx 200`, `Tx 350`, `Tx 500`, `ScraEn` ou `NOAA-S` peuvent
apparaître dans des branches sans couche F4HWN. Ils sont cités pour l’identification historique,
pas comme options activées dans les profils publiés ni comme instructions de
déverrouillage d’émission. Un scrambler ne doit pas être considéré comme un chiffrement sécurisé.

## RxMode et Full Watch

En v6.1, Full Watch parcourt VFO A, B et les priorités valides. Il ne s’agit pas de quatre
récepteurs indépendants. FULL RX/RESPOND peut répondre sur le dernier canal
reçu ; MAIN TX/FULL RX maintient TX sur le canal principal. Avant d’utiliser le PTT, vérifier
la destination indiquée. Pour le diagnostic, choisir MAIN ONLY.
Les modes DUAL/CROSS à l’écran ne doivent pas être confondus avec une configuration de
relais ni être considérés comme une répétition automatique entre bandes.

## Slots et banques CFG : opérations distinctes

| Élément | Contenu | Conséquence d’un changement |
| --- | --- | --- |
| Main | Copie de base gérée par le firmware, pas le bootloader | Protégée par le site |
| Slot 1-4 | Image de firmware supplémentaire dans la Flash externe | Restaurer une image dans le processeur depuis la radio |
| CFG M/1-4 | Canaux, VFO, réglages et listes indépendants | Charger une autre configuration compatible |
| App Labs | Code/ressources avec ABI/API spécifique | Exécuter une fonction en overlay RAM, sans changer le firmware complet |

Dans l’upstream v6.1 inspecté, le sélecteur s’ouvre avec MENU lors de l’allumage.
Confirmer la restauration sur la radio elle-même ; ne pas éteindre pendant l’opération.
SetCfg change de banque sans restaurer le firmware. Le site n’invente aucune commande distante
pour ces actions.

Pour préparer depuis la bibliothèque, choisir le dossier, sélectionner une entrée acceptée,
vérifier le nom/hash et cliquer sur Préparer. Aucune écriture n’est effectuée. L’installation nécessite une connexion
compatible, une sauvegarde Flash complète et une confirmation. Le CRC du slot est vérifié.
Des vecteurs et une chaîne F4HWN corrects ne prouvent pas que le code est authentique.

## Labs et applications

La base inspectée documente 16 emplacements et des apps radio, APRS, SSTV,
diagnostic et démos. L’ensemble varie selon les releases ; toutes les apps ne sont
pas disponibles ni compatibles avec tous les builds.

**Catalogue d’apps Labs précompilées :** comprend SystemInfo, BroadcastFM,
Cube3D, Tetris, Breakout et Minesweeper, de la release upstream v6.1.0.
Elles sont fournies avec le site, y compris dans l’exportation statique, sans compilation.
Elles sont sous Apache-2.0 et conservent leur attribution d’origine ; elles ne sont pas renommées comme créations propres.
SHA-256, taille, FAP1, nom, version, ABI et API minimale sont vérifiés.
Toutes nécessitent ABI 1 et API minimale 2 ; confirmer la compatibilité avec le Labs
actif. Aucun démarrage n’est certifié sur cette unité.

Sélectionner le modèle et l’app, confirmer la compatibilité et cliquer sur **Vérifier et
préparer l’app**. Cela ne fait que préparer le fichier : consulter les emplacements,
sélectionner la destination et cliquer séparément sur **Installer l’app et vérifier**.
Il est aussi possible de télécharger le fichier et son manifeste. Les apps ne sont ni installées ni exécutées automatiquement. Le catalogue de test exclut les balises et apps de secours ; le catalogue complet reste dans UV Studio. Il ne garantit pas l’isolation : toute app native a accès à la radio.

Le mainteneur régénère ce catalogue avec
`node scripts/publish-firmware.cjs --apps-only` : seuls les six
fichiers archivés et hashs fixés sont acceptés ; tout changement est refusé.

Le connecteur vérifie FAP1, les limites de code/ressources et le CRC des ressources, puis
relit les blocs écrits. L’acceptation de l’en-tête ne prouve pas qu’une app puisse
s’exécuter : ABI, API et capacités peuvent la refuser au chargement/à l’exécution.
Utiliser un firmware et des apps de la même release. Installer une app d’origine
inconnue revient à donner au code natif accès à la radio.

**Exporter l’app depuis l’emplacement** reconstruit le fichier FAP1 à partir de l’en-tête,
du code et des ressources physiques, et vérifie leur CRC avant de demander le téléchargement.
Nécessite un firmware avec lecture Flash physique ; il ne s’agit pas d’un téléchargement du catalogue.

**Déplacer l’app vers l’emplacement vide** permet de réorganiser sans écraser une autre app.
Sélectionner l’origine et la destination vide, puis saisir la confirmation affichée.
D’abord, installer/relire/vérifier la destination ; ensuite seulement effacer l’origine et
vérifier qu’elle est vide. Ce n’est pas atomique : une interruption peut laisser deux
copies ou une copie de destination incomplète avec l’origine intacte. Conserver
la sauvegarde et consulter de nouveau les emplacements avant de réessayer. Pour
échanger deux apps occupées, utiliser temporairement un troisième emplacement vide.
Aucune app n’est exécutée et la compatibilité ABI/API n’est pas certifiée.

**Effacer toutes les apps** nécessite une sauvegarde complète et la phrase
`BORRAR TODAS LAS APPS`, également en mode avancé. Le nombre réel
d’emplacements est consulté (16 ou 48 selon le firmware), seuls ceux qui sont occupés sont effacés et
il est vérifié qu’ils sont tous vides. Une erreur arrête le processus sans annoncer
une réussite globale ; une suppression partielle n’est pas automatiquement annulée.
Cela ne touche ni les canaux, ni la configuration, ni le firmware, ni l’étalonnage. Ces nouvelles opérations
ont été vérifiées avec une radio simulée ; elles n’ont pas été exécutées sur l’unité physique.

APRS TX nécessite une configuration légale d’indicatif/SSID, de position et d’itinéraire.
Ce site ne transmet pas en chargeant un fichier `.app` ; les balises automatiques ne sont pas configurées
dans le cadre d’une sauvegarde. Les fonctions d’urgence/EPIRB sont citées comme
inventaire upstream : ne pas tester d’émissions sur des fréquences de détresse.

## Problèmes courants

| Symptôme | Vérification |
| --- | --- |
| Démarre mais SetCfg n’apparaît pas | Vérifier les options multiboot du build, pas seulement la version |
| Slot visible avec données mais CRC incorrect | Ne pas restaurer ; conserver le fichier et la sauvegarde |
| USB identifié mais lecture Flash en échec | La commande Labs physique peut manquer ; fermer les autres programmes et relever le build |
| Les touches semblent inversées | Vérifier SetNav/modèle ; ne pas flasher une autre famille pour corriger cela |
| Un changement de réglage disparaît | Enregistrer la mémoire ou vérifier la banque CFG et la persistance |
| Aucun son d’un relais | RX, mode, SQL et filtre RX ; ne pas commencer par augmenter la puissance TX |
| Une app ne s’exécute pas | Vérifier ABI/API/caps et release, ne pas répéter des écritures à l’aveugle |
| SA818 ou packed bloqué | C’est intentionnel ; ne pas renommer pour contourner la restriction |

## Sources et maintenance

- [Projet PY32 et README](https://github.com/armel/uv-k1-k5v3-firmware-custom).
- [Releases par version](https://github.com/armel/uv-k1-k5v3-firmware-custom/releases).
- [Presets v6.3.0 fixés](https://github.com/armel/uv-k1-k5v3-firmware-custom/blob/ca3a4271386049e7b459b215cef0ad0eea1a30ca/CMakePresets.json).
- [Menu v6.1 inspecté](https://github.com/armel/uv-k1-k5v3-firmware-custom/blob/f556a96e73c3e423a00cf473aeb37f827cac05a5/App/ui/menu.c).
- [UVTOOLS2 du projet](https://armel.github.io/uvtools2/).
- [Pilote CHIRP dédié](https://github.com/armel/uv-k5-chirp-driver).
- [Bricohams, hashs et compilation](BRICOHAMS-FIRMWARE.md).
- [Karina V1 et limites de licence/sources](KARINA.md).
- [Atlas technique UV-K5 V3 : matériel, protocoles et schémas](ATLAS-UV-K5-V3.md).

Pour un firmware stock, UVMOD ou OneOfEleven, consulter le projet et le matériel
exacts : aucune équivalence des menus/EEPROM n’est garantie avec ce guide.
Pour les liens ajoutés par l’utilisateur, voir [Egzumer V1](AYUDA-EGZUMER.md) et
[pack Dim0s avec Karina V3/K1](AYUDA-PACK-DIM0S.md).
