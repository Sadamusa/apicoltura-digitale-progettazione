## **DOCUMENTAZIONE REQUISITI HARDWARE**

# ESP32-CAM

## Tipo

Funzionale: Microcontrollore ESP

## Descrizione

L'ESP 32‑CAM è un piccolo modulo basato sul microcontrollore ESP32, progettato per integrare in un unico dispositivo capacità di calcolo, connettività Wi‑Fi e Bluetooth e una telecamera, Dispone di diversi pin GPIO utilizzabili come input o output per sensori, attuatori, LED, relè e altri componenti. Ha uno slot per microSD, utile per salvare foto, log di dati.

## Motivazione

Fondamentale per il nostro progetto, poiché consente di raccogliere i dati provenienti dai sensori distribuiti sul progetto e di inviarli in modo affidabile al server.

## Priorità

Critica

## Criteri di accettazione

Raccoglie i dati provenienti dai sensori, invia i dati al server quando alimentazione e connessione Internet sono disponibili, e in assenza di corrente e/o connessione Internet non effettua l'invio ma è in grado di salvarli sulla scheda SD per un successivo recupero.

## Fonte

[**Espressif Systems**](https://www.espressif.com/en/products/socs/esp32-cam?utm_source=copilot.com)

## Dipendenze

Alimentazione, Internet, sensori ben collegati.

# SHT21 - HTU21

## Tipo

Funzionale: Sensore ambientale (Umidità e Temperatura)

## Descrizione

Si tratta di un sensore digitale progettato per monitorare le condizioni climatiche dell'ambiente in cui è immerso. È in grado di misurare con precisione sia il calore dell'aria che la percentuale di umidità relativa, comunicando questi valori alla centralina tramite un linguaggio digitale (I2C).

## Motivazione

Indispensabile per monitorare il benessere biologico delle api. Un'umidità troppo alta all'interno dell'arnia può favorire malattie o muffe, mentre la temperatura costante indica quanto efficacemente le api stanno ventilando l'alveare.

## Priorità

Alta

## Criteri di accettazione

Deve rilevare correttamente le variazioni di umidità e temperatura all'interno dell'arnia e trasmettere i dati in modo leggibile alla centralina. Deve essere in grado di funzionare con continuità anche in ambienti con tassi di umidità elevati senza perdere la calibrazione.

## Fonte

[Sensirion_Datasheet](https://sensirion.com/media/documents/120BBE4C/63500094/Sensirion_Datasheet_Humidity_Sensor_SHT21.pdf)

## Dipendenze

Collegamento ai pin di comunicazione della centralina e protezione fisica (una retina o membrana) per evitare che le api lo occludano con la propoli..

- VIN
- GND
- SCL
- SDA

# DS18B20

## Tipo

Funzionale: Sonda Termica di Precisione

## Descrizione

È un sensore di temperatura racchiuso in una sonda metallica impermeabile dotata di un lungo cavo. Grazie alla sua forma, può essere inserito direttamente tra i telaini dell'arnia, arrivando nel cuore del glomere (il gruppo di api) senza subire danni o interferire con il movimento degli insetti.

## Motivazione

Fondamentale per monitorare la salute della covata. La temperatura nel centro dell'arnia deve rimanere costante intorno ai **35°C** se la regina è attiva; una variazione improvvisa può segnalare la morte della regina, una sciamatura imminente o lo stato di svernamento della famiglia.

## Priorità

Alta

## Criteri di accettazione

Deve fornire letture stabili della temperatura nel punto esatto in cui viene posizionata la sonda. Deve essere riconosciuto dalla centralina anche se collegato insieme ad altre sonde identiche e deve resistere all'ambiente umido e appiccicoso dell'alveare.

## Fonte

[alldatasheet](https://www.alldatasheet.com/view.jsp?Searchword=Ds18b20%20datasheet&gad_source=1&gad_campaignid=163458844&gbraid=0AAAAADcdDU-Dg64H9SWDSHikuW11cr5Xy&gclid=CjwKCAiA95fLBhBPEiwATXUsxBtv5gpCGU7pAOnzTdbspDxrShhXCcSMP89sizkZ4pQbwyunAXActhoCSt8QAvD_BwE)

## Dipendenze

Centralina ESP32-CAM e un piccolo componente elettrico (resistenza) necessario per stabilizzare il segnale sul cavo.

# INMP441

## Tipo

Funzionale: Microfono digitale

## Descrizione

L'INMP441 è un microfono digitale che utilizza l'interfaccia I²S per trasmettere il segnale audio in formato digitale direttamente al microcontrollore. Offre un'elevata sensibilità, un buon rapporto segnale/rumore. È ideale per applicazioni di acquisizione audio, riconoscimento vocale e analisi del suono.

## Motivazione

Utile per il nostro progetto perché permette di acquisire segnali audio dell rumore delle api dentro la cassetta in modo preciso e stabile, fornendo dati digitali pronti per l'elaborazione.

## Priorità

Media

## Criteri di accettazione

Acquisisce correttamente il segnale audio tramite interfaccia I²S, manda un sengale digitale stabile e compatibile al il microcontrollore,

## Fonte

[Tdk](https://invensense.tdk.com/products/digital/inmp441/)

## Dipendenze

Alimentazione e Librerie adatte.

# HW-038

## Tipo

Funzionale: Modulo Sensore livello acqua

## Descrizione

Il modulo HW‑038 è un sensore progettato per rilevare il livello dell'acqua tramite una serie di piste conduttive che variano la loro resistenza in base alla quantità di liquido presente. Fornisce un segnale analogico proporzionale al livello rilevato, permettendo al microcontrollore di monitorare in modo semplice e affidabile la presenza o l'altezza dell'acqua.

## Motivazione

Utile per il progetto perché consente di monitorare il livello dell'acqua nel contenitore in tempo reale, permettendo di allertare l'apicoltore.

## Priorità

Media

## Criteri di accettazione

Rileva correttamente il livello dell'acqua, fornisce un segnale stabile e interpretabile dal microcontrollore.

## Fonte

Vari Produttori

## Dipendenze

Alimentazione stabile, collegamento analogico, librerie.

- Signal
- VCC +
- GND -

# **HX711** (~40kg)

## Tipo

Funzionale: Sistema di Pesatura (Bilancia)

## Descrizione

Si tratta di un modulo amplificatore di precisione (HX711) collegato a una cella di carico capace di misurare pesi fino a 40kg. Questo sistema rileva la pressione fisica esercitata dall'arnia e la trasforma in dati numerici che vengono inviati alla centralina ESP32-CAM.

## Motivazione

Fondamentale per la gestione produttiva e la sicurezza dell'alveare. Permette di monitorare quanto miele stanno producendo le api, verificare se hanno abbastanza scorte per superare l'inverno e, soprattutto, inviare un allarme immediato in caso di sciamatura (rilevabile da un calo improvviso e drastico del peso).

## Priorità

Media

## Criteri di accettazione

Deve essere in grado di pesare l'arnia con precisione, permettendo di distinguere le variazioni di peso dovute al raccolto giornaliero. Il sistema deve poter essere "azzerato" (tara) via software e deve mantenere letture stabili nel tempo, resistendo alle sollecitazioni atmosferiche sotto il peso costante dell'arnia.

## Fonte

[sparkfun](https://cdn.sparkfun.com/datasheets/Sensors/ForceFlex/hx711_english.pdf)

## Dipendenze

Necessita di una base meccanica rigida su cui montare la cella di carico, di una corretta calibrazione iniziale con un peso noto e del collegamento ai pin della centralina per la trasmissione dei dati.

- GND
- DT (Data)
- SCK (Clock)
- VCC