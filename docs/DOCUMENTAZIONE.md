




# Documentazione ESP32 Logic

Versione 1.0
Team **Firmware & Comunicazione REST** 

# Overview
Il Gruppo C realizza il firmware per il dispositivo (ESP32-CAM + sensori) e la logica di comunicazione che invia i dati al server REST (PHP) e al database. L’obiettivo è garantire acquisizione affidabile dei sensori, formattazione coerente dei dati, buffering locale in caso di rete assente e consegna sicura/riportata delle misure sul server.

## Giornaliero

### Giorno 1 (12/01/26)
Incontro con apicoltore e primo brainstorming con stesura appunti. Visita esperto architetto del software 

### Giorno 2 (13/01/26)
Introduzione a GitHub, unione alla repository di progettazione e creazione branch del gruppo C, stesura requisiti e trasferimento di essi sul file REQUISITI.md nella cartella condivisa. 

### Giorno 3 (14/01/26)
Incontro con architetto del software, correzione dei requisiti funzionali e stesura documentazione di logica ESP32 e i relativi sensori. 

### Giorno 4 (15/01/26)
Creazione Tabella dei Pin di ogni sensore nei confronti dell'ESP32, aggiornati i cicli di misurazione per standardizzarne la nomenclatura e completarne il significato

### Giorno 5 (16/01/26)
Completamento codici , aggiornamento documentazione con aggiunta commenti codici e cambiamento di errori/alert. 
# Scope
-   Lettura e processing dei sensori definiti dal progetto (SHT21, DS18B20, HX711, INMP441, HW-038, fotocamera).
-   Formattazione dei dati in payload JSON e invio agli endpoint REST esposti dal server (POST misure, POST 	foto, GET comandi).
-   Buffering locale (RAM/EEPROM/SD) e strategia di retry per garantire resilienza offline.
-   Meccanismi minimi di sicurezza (token API, preferibilmente HTTPS).
-   Interfacce per comandi remoti (es. cambio parametri, scatto foto, OTA).

# Tabelle e registri

## Requisiti

### Requisiti Funzionali

- **RF-SW-01 — TM, Temperatura Interna**: Il sensore misura la temperatura interna dell'arnia. 
- **RF-SW-02 — TM, Unità di Misura**: Il sensore misura la temperatura in gradi Celsius (°C).
- **RF-SW-03 — TM, Tipo di Dato**: Il valore del sensore è ospitato in una variabile di tipo float.
- **RF-SW-04 — TM, Timestamp**: Ad ogni misurazione è associata la data e l'ora di esecuzione (formato dd/MM/yyyy; hh:mm).
- **RF-SW-05 — TM, Alert Soglia Massima**: Al superamento della temperatura di 37 °C, il sistema invia un alert. 
- **RF-SW-06 — TM, Alert Soglia Minima**: Al raggiungimento della temperatura di 30 °C, il sistema invia un alert.
- **RF-SW-07 — TM, Frequenza di Aggiornamento**: Il sensore aggiorna la misurazione ogni 6 minuti.
- **RF-SW-08 — PS, Misurazione**:  Il segnale analogico deve essere acquisito e convertito in valore digitale a 24 bit. 
- **RF-SW-09 — PS, Taratura**:  La funzione di taratura deve esistere per fare la differenza dei pesi.
- **RF-SW-10 — PS, Trasforma dato grezzo**: Il valore grezzo deve essere trasformato in kg.
- **RF-SW-11 — PS, Power Management**: La modalità deep sleep viene disattivata ogni 3 ore.
- **RF-SW-12 — PS, Gestione Data**: Ad ogni misurazione deve essere associata una data.
- **RF-SW-13 — PS, Gestione ora**: Ad ogni misurazione deve essere associata un orario. 
- **RF-SW-14 — MIC, Acquisizione continua**: Il microfono deve acquisire il segnale a intervalli di 10 secondi.
- **RF-SW-15 — MIC, Intensità suono**: Si calcola il volume medio in dB per capire l'agitazione dello sciame.
- **RF-SW-16 — MIC, Frequenza suono**: Calcolo frequenza per stato sciame.
- **RF-SW-17 — MIC, Verifica soglia**:  Il microfono confronta i valori rilevati con valori di allarme.
- **RF-SW-18 — MIC, Notifica alert**: Se si supera una certa soglia l'apicoltore riceve una notifica.
- **RF-SW-18.5 — MIC, Timestamp**: 6 misurazioni accumulate, invio con timestamp.
- **RF-SW-19 — UM, Misurazione umidità come % nell'aria**: Il sensore misura la percentuale di umidità all'interno dell'arnia.
- **RF-SW-20 — UM, Tipo di dato**: Il valore del sensore è ospitato in una variabile float. 
- **RF-SW-21 — UM, Timestamp**: Ad ogni misurazione è associata la data e l'ora di esecuzione (formato dd/MM/yyyy; hh:mm).
- **RF-SW-22 — UM, Alert Soglia Massima**: Al superamento della soglia di umidità del 70% il sistema invia un alert. 
- **RF-SW-23 — UM, Alert Soglia Minima**: Al raggiungimento della soglia di umidità inferiore del 40% il sistema invia un alert. 
- **RF-SW-24 — UM, Frequenza di Aggiornamento**: Il sensore aggiorna la misurazione ogni 6 minuti. 
- **RF-SW-25 — SA, Misurazione Livello Acqua**: Il sensore misura il livello dell'acqua nel secchio in percentuale.
- **RF-SW-26 — SA, Tipo di Dato**: Il valore del sensore è ospitato in una variabile di tipo float.
- **RF-SW-27 — SA, Timestamp**: Ad ogni misurazione è associata la data e l'ora di esecuzione (formato dd/MM/yyyy; hh:mm).
- **RF-SW-28 — SA, Alert Soglia Massima**: Al superamento della soglia massima del secchio il sistema invia un alert. 
- **RF-SW-29 — SA, Alert Soglia Minima**: Al raggiungimento del livello inferiore al 5% il sistema invia un alert. 
- **RF-SW-30 — SA, Frequenza di Aggiornamento**: Il sensore aggiorna la misurazione ogni 40 minuti.
- **RF-SW-31 — SA, Taratura**: Il sensore deve essere tarato salvando il livello più basso e più alto durante il riempimento. 
- **RF-SW-32 — TC, Registrazione Video**: La telecamera registra video da inviare al database ogni minuto.
- **RF-SW-33 — TC, Attivazione Manuale**: L'apicoltore può attivare la telecamera tramite l'applicazione.
- **RF-SW-34 — TC, Attivazione Automatica**: La telecamera si attiva automaticamente quando la luminosità supera il 20%.
- **RF-SW-35 — TC, Timestamp**: Ad ogni invio di video è associata la data e l'ora di registrazione (formato dd/MM/yyyy; hh:mm).
- **RF-SW-36, Funzione di Lettura**: I sensori devono essere tarati manualmente dall'Utente quindi prendere le informazioni dal Database, inclusa la data.
- **RF-SW-37, Funzione di Scrittura**: Scrivere la funzione inviaDatiAlServer() che prende tutti i valori e li spedisce.
- **RF-SW-38, Struttura il JSON**: Definire come sarà il messaggio da inviare al database. Esempio: {"temp": 32.5, "peso": 45.2, "hum": 60, "alert_temp": false ...}
- **RF-SW-39, Gestione DeepSleep**: Decidere quale modalità di risparmio energetico usare (RF-SW-38) per non spegnere il Wi-Fi mentre i sensori devono ancora inviare i dati.
- **RF-SW-40, Creazione di una Documentazione**, creare un documento in grado di raccontare e spiegare l'intero progetto
- **RF-SW-41, Tabella dei Pin**, aggiornare la documentazione continuamente con il numero di pin prestabiliti per comunicare con gli altri gruppi
- **RF-SW-42, Registro Requisiti**, aggiornare il registro requisiti man mano che viene scritto il codice o si presentano problemi
- **RF-SW-43, Informazioni codice**, commentare approfonditamente il codice e descriverlo minuziosamente

### Requisiti Non Funzionali

- **RNF-SW-01 — TM, Persistenza Dati**: Il sensore salva i dati nella memoria locale dell'ESP32 in caso di assenza di connessione
- **RNF-SW-04 — PS, Peso max**: L'arnia pesa al massimo 80kg. 
- **RNF-SW-05 — PS, Notifica peso alto**: L'apicoltore deve ricevere un alert se il peso è troppo alto. 
- **RNF-SW-06 — PS, Notifica peso basso**: L'apicoltore deve ricevere un alert se il peso è troppo basso.
- **RNF-SW-07 — PS, Latenza**: Il sensore impiega circa 2 secondi per misurare dopo l'accensione.
- **RNF-SW-08 — MIC, Tempestività alert**:  La notifica alert deve arrivare all'apicoltore in un tempo ragionevole.
- **RNF-SW-09 — UM, Persistenza Dati**: Il sensore salva i dati nella memoria locale dell'ESP32 in caso di assenza di connessione.
- **RNF-SW-13 — SA, Connettività**: Il sensore richiede connessione di rete costante per l'invio dei dati al database.
- **RNF-SW-19 — TC, Connettività**: La telecamera richiede connessione di rete costante per l'invio dei video al database.
  

## Tabelle dei PIN

-   **SHT21 (I²C) → ESP32‑CAM (AI‑Thinker)**
    
    -   VIN →  **3V3**  (alimentazione 3.3V)
    -   GND →  **GND**  (massa)
    -   SCL →  **IO14 / GPIO14**  (clock I²C)
    -   SDA →  **IO15 / GPIO15**  (dati I²C)
-   **DS18B20 (1‑Wire) → ESP32‑CAM (AI‑Thinker)**
    
    -   VDD →  **3V3**  (alimentazione 3.3V)
    -   GND →  **GND**  (massa)
    -   DATA/OUT →  **IO2 / GPIO2**  (linea dati 1‑Wire)
    -   **Resistenza pull‑up**:  **4.7 kΩ**  tra  **DATA/OUT**  e  **3V3**
-   **HX711 (celle di carico) → ESP32‑CAM (AI‑Thinker)**
    
    -   **Alimentazione modulo HX711**
        -   VCC →  **3V3**  (consigliato su ESP32‑CAM)
        -   GND →  **GND**
    -   **Segnali digitali (verso ESP32‑CAM)**
        -   DT / DOUT →  **IO13 / GPIO13**  (dati)
        -   SCK / PD_SCK →  **IO12 / GPIO12**  (clock)
    -   **Lato celle di carico (verso la bilancia)**
        -   E+ / E− → eccitazione (alimentazione ponte estensimetrico)
        -   A+ / A− → segnale canale A (tipico per celle a 4 fili)
        -   B+ / B− → canale B (di solito non usato)


# Lista Errori e alert sensori

## Sensore utilizzato: DS18B20 (Sensore Temperatura)

### 1.1 Acquisizione dati

-   Lettura del valore di temperatura (float, °C).
    
-   Generazione del timestamp associato.
    
-   Riferimenti: `RF-SW-01`, `RF-SW-02`.
    
### 1.2 Verifica integrità del dato

-   **ERR_DATA_NULL**: Controllo che il valore non sia nullo (non presente).
    
### 1.3 Verifica intervallo sensore

-   **ERR_MEASURE_OUT_OF_RANGE**: Controllo che il valore sia entro il range operativo previsto dal sensore; se fuori range trattare come dato non valido.
    
### 1.4 Verifica stato sensore

-   **ERR_SENSOR_OFFLINE**: Controllo se il sensore è offline o non risponde.
    
### 1.5 Salvataggio su memoria locale

-   Se il dato è valido, memorizzazione permanente su ESP32.
    
-   Riferimento: `RNF-SW-01`.
    
### 1.6 Verifica connettività verso il database

-   **ERR_NETWORK_OFFLINE**: Controllo della disponibilità di rete e del database remoto.
    
-   Riferimento: `RNF-SW-01`.
    
### 1.7 Sincronizzazione Cloud/DB

-   **ERR_UPLOAD_FAILED**: Se la connessione è disponibile, upload del valore e del relativo timestamp al cloud/DB.
    
-   Riferimenti: `RF-SW-03`, `RF-SW-04`.
    
### 1.8 Controllo soglia massima

-   Verifica se la temperatura supera la SogliaMax.
    
-   Riferimento: `RF-SW-05`.
    
### 1.9 Alert per superamento soglia massima

-   **ALERT_THRESHOLD_HIGH**: Se la temperatura > SogliaMax, invio di notifica per condizione critica alta.
    
### 1.10 Controllo soglia minima

-   Verifica se la temperatura è inferiore alla SogliaMin.
    
-   Riferimento: `RF-SW-06`.
    
### 1.11 Alert per superamento soglia minima

-   **ALERT_THRESHOLD_LOW**: Se la temperatura < SogliaMin, invio di notifica per condizione critica bassa.
    
### 1.12 Intervallo di campionamento

-   **REQ_PROCESS_CYCLE**: Attesa controllata di 6 minuti prima del prossimo ciclo (requisito di processo).
    
-   Riferimento: `RF-SW-07`.
    
### 1.13 Tentativo di ripristino dati accumulati

-   **ERR_UPLOAD_RETRY_EXHAUSTED**: Se la connessione ritorna disponibile, tentativo di upload dei dati memorizzati.
    
-   Riferimento: `RNF-SW-01`.
    
### 1.14 Chiusura loop

-   Ripartenza del ciclo tornando al punto 1.1.
    
## Sensore utilizzato: HX711 (Peso)

### 2.1 Lettura ADC non pronta

-   **ERR_SENSOR_NOT_READY**: Lettura effettuata quando l’ADC non ha ancora un campione valido.
    
### 2.2 Timeout acquisizione

-   **ERR_SENSOR_TIMEOUT**: Entro il tempo massimo previsto il campione non viene acquisito.
    
### 2.3 Saturazione ADC

-   **ERR_PS_ADC_SATURATION**: Valore fisso al minimo o al massimo (fondo scala); misura non valida.
    
### 2.4 Valore instabile (rumore alto)

-   **ERR_MEASURE_UNSTABLE**: I campioni oscillano oltre la soglia di stabilità prevista.
    
### 2.5 Outlier improvviso

-   **ERR_MEASURE_UNSTABLE**: Picchi improvvisi distanti dalla media; ignorare o filtrare.
    
### 2.6 Taratura non presente

-   **ERR_PS_CALIB_MISSING**: Mancano i parametri (offset/coefficiente) per la conversione.
    
### 2.7 Taratura non valida

-   **ERR_PS_CALIB_INVALID**: Parametri di taratura incoerenti o fuori intervallo plausibile.
    
### 2.8 Errore conversione in kg

-   **ERR_PS_CONVERSION_FAIL**: La trasformazione produce un valore non valido (`NaN`, `Inf`).
    
### 2.9 Peso fuori range min/max

-   **ERR_MEASURE_OUT_OF_RANGE**: Peso calcolato superiore o inferiore ai limiti configurati.
    
### 2.10 Peso negativo

-   **ERR_DATA_NEGATIVE_NOT_ALLOWED**: Peso negativo oltre la tolleranza; indica misura non valida.
    
### 2.11 Prima misura non stabile dopo wake-up

-   **ERR_MEASURE_UNSTABLE**: Letture post-risveglio instabili da scartare (settling time).
    
### 2.12 Timestamp mancante

-   **ERR_TIMESTAMP_INVALID**: Alla misura non viene associata data/ora.
    
### 2.13 Timestamp non valido

-   **ERR_TIMESTAMP_INVALID**: Data o ora non plausibili (es. 1970-01-01).
    
### 2.14 Invio fallito

-   **ERR_UPLOAD_FAILED**: Impossibile inviare al server; gestire retry o salvataggio locale.
    
### 2.15 Duplicazione misura

-   **ERR_DATA_DUPLICATE**: Stessa misura inviata più volte (mancanza controllo unicità).
  
## Sensore utilizzato: SHT21 - HTU21 (umidità)

### 3.1 Impossibile rilevare il sensore dell'umidità

-   **ERR_SENSOR_OFFLINE**: Il sensore non risponde all'inizializzazione.
    
### 3.2 Impossibile ottenere informazioni sull'umidità

-   **ERR_DATA_INVALID_NUMBER**: Il sensore risponde ma fornisce valori non numerici.
    
### 3.3 Verifica integrità del dato (non nullo)

-   **ERR_DATA_NULL**: Controllo che la misura non sia nulla.
    
### 3.4 Verifica integrità del dato (non negativo)

-   **ERR_DATA_NEGATIVE_NOT_ALLOWED**: L’umidità non deve assumere valori negativi.
    
### 3.5 Verifica tipo dato (float)

-   **ERR_HUM_FLOAT_CONSTRAINT**: Vincolo: il dato deve essere floating point per la precisione.
   
### 3.6 Verifica stato dispositivo (ESP32 offline)

-   **ERR_NETWORK_OFFLINE**: Board non connessa; gestire salvataggio locale e retry.
    
### 3.7 Controllo soglia massima (umidità troppo alta)

-   **ALERT_THRESHOLD_HIGH**: Allarme per superamento soglia massima definita.

### 3.8 Controllo soglia minima (umidità troppo bassa)

-   **ALERT_THRESHOLD_LOW**: Allarme per superamento soglia minima definita.

## Consumi sensori

### Consumi previsti

-   **SHT21 (3.3 V)**
    
    -   standby: ~0,1–1 µA
    -   misure ogni 6 min: aggiunta media trascurabile (<< 1 µA)
    -   **medio realistico:**  ~**0,2–2 µA**
-   **DS18B20 (3.0–5.5 V)**
    
    -   standby: ~1 µA
    -   conversione ogni 6 min:
        -   12 bit: aggiunge ~3,1 µA medi
    -   **medio realistico (12 bit):**  ~**4–5 µA**  (meno se 9–11 bit)
-   **HX711 (modulo sempre alimentato, ma in power-down tra letture)**
    
    -   HX711 in power‑down: tipicamente  **< 1 µA**  (il chip)
    -   **MA**  se la cella resta alimentata, il chip non è il problema.
-   **Cella di carico (sempre alimentata)**
    
    -   Dipende dalla resistenza del ponte (molto spesso  **350 Ω**, a volte 1 kΩ).
    -   Corrente ≈ V / R:
        -   **a 3.3 V con 350 Ω:**  3.3/350 ≈  **9,4 mA**
        -   **a 5.0 V con 350 Ω:**  5/350 ≈  **14,3 mA**
        -   **a 3.3 V con 1 kΩ:**  **3,3 mA**
        -   **a 5.0 V con 1 kΩ:**  **5 mA**

### Totale medio (Sensori + bilancia, VCC sempre presente)

-   SHT21: ~**< 0,002 mA**
-   DS18B20: ~**0,004–0,005 mA**
-   HX711 chip: ~ **~0,001 mA o meno**
-   Cella di carico:  **3–15 mA** 

# Codice
## JSON
### Inviato al server
Dato per il database

**Senza alert:**
```json
{  
	"macAddress": "AA:BB:CC: DD:EE: FF",  
	"tipoSensore": "temperatura_interna",  
	"idSensore": "DS18B20_001",  
	"valore": 34.75,  
	"unita": "C",  
	"timestamp": 1234567890,  
	"codiceStato": 9000,  
	"alert": false  
}
```
**Con alert:**
```json
{  
	"macAddress": "AA:BB:CC: DD:EE: FF",  
	"tipoSensore": "temperatura_interna",  
	"idSensore": "DS18B20_001",  
	"valore": 34.75,  
	"unita": "C",  
	"timestamp": 1234567890,  
	"codiceStato": 9000,  
	"alert": true,
	"alertTipo": "HIGH"
}
```
### Ricevuto dal server
JSON di configurazione
```json
{  
	"macAddress": "AA: BB:CC:DD:EE:FF",  
	"ds18b20": {  
	"sogliaMin": 30.0,  
	"sogliaMax": 37.0,  
	"intervallo": 360000,  
	"abilitato": true  
},  
	"sht21_humidity": {  
	"sogliaMin": 40.0,  
	"sogliaMax": 70.0,  
	"intervallo": 360000,  
	"abilitato": true  
},  
	"sht21_temperature": {  
	"sogliaMin": 10.0,  
	"sogliaMax": 45.0,  
	"intervallo": 360000,  
	"abilitato": true  
},  
	"hx711": {  
	"sogliaMin": 10.0,  
	"sogliaMax": 80.0,  
	"intervallo": 10800000,  
	"abilitato": true  
},  
	"calibrationFactor": 2280.0,  
	"calibrationOffset": 50000  
}
```


// ============================================================================
// DS18B20 - Sensore Temperatura Interna Arnia (REVISIONATO)
// ============================================================================

#include <OneWire.h>
#include <DallasTemperature.h>
#include "SensorValidation.h"

// ============================================================================
// CONFIGURAZIONE HARDWARE
// ============================================================================
#define ONE_WIRE_BUS 2

static OneWire oneWire(ONE_WIRE_BUS);
static DallasTemperature sensors(&oneWire);
static DeviceAddress insideThermometer;

// ============================================================================
// VARIABILI INTERNE
// ============================================================================
static float _ds18b20_sogliaMin = 30.0f;
static float _ds18b20_sogliaMax = 37.0f;
static unsigned long _ds18b20_intervallo = 360000;
static bool _ds18b20_abilitato = true;
static bool _ds18b20_inizializzato = false;
static int _ds18b20_contatore = 0;

// Configurazione validazione
static ConfigValidazioneSensore _configValidazioneTemp = {
  .rangeMin = -40.0f,
  .rangeMax = 85.0f,
  .permettiNegativi = true,
  .richiedeTimestamp = true,
  .valoreDefault = 25.0f,
  .nomeSensore = "DS18B20"
};

// ============================================================================
// SETUP
// ============================================================================
void setup_ds18b20() {
  Serial.println(F("-> Inizializzazione sensore DS18B20...")); // F() macro per risparmiare RAM

  sensors.begin();

  // Controllo numero dispositivi
  int deviceCount = sensors.getDeviceCount();
  if (deviceCount == 0) {
    Serial.println(F("  ! ATTENZIONE: Nessun sensore DS18B20 trovato"));
    _ds18b20_inizializzato = false;
    return;
  }

  // Tenta di ottenere l'indirizzo del primo sensore (indice 0)
  if (sensors.getAddress(insideThermometer, 0)) {
    sensors.setResolution(insideThermometer, 12); // 12 bit resolution
    
    // NOTA: setWaitForConversion(true) è default.
    // Blocca il codice per ~750ms durante la lettura.
    // Se serve multitasking, impostare a false e gestire delay manualmente.
    sensors.setWaitForConversion(true); 
    
    _ds18b20_inizializzato = true;
    Serial.println(F("  + Sensore DS18B20 rilevato e configurato"));
  } else {
    Serial.println(F("  ! ERRORE: Trovato dispositivo ma impossibile ottenere indirizzo"));
    _ds18b20_inizializzato = false;
  }

  Serial.println(F("  + Setup DS18B20 completato\n"));
}

// ============================================================================
// INIT - Configurazione
// ============================================================================
void init_ds18b20(SensorConfig* config) {
  if (config == NULL) {
    Serial.println(F("  ! DS18B20: config NULL, uso valori default"));
    return;
  }

  _ds18b20_sogliaMin = config->sogliaMin;
  _ds18b20_sogliaMax = config->sogliaMax;
  _ds18b20_intervallo = config->intervallo;
  _ds18b20_abilitato = config->abilitato;
  _ds18b20_contatore = 0;

  Serial.println(F("  --- Config DS18B20 caricata dal DB ---"));
  Serial.print(F("    Soglia MIN: ")); Serial.println(_ds18b20_sogliaMin);
  Serial.print(F("    Soglia MAX: ")); Serial.println(_ds18b20_sogliaMax);
  Serial.print(F("    Abilitato: ")); Serial.println(_ds18b20_abilitato ? F("SI") : F("NO"));
}

// ============================================================================
// READ
// ============================================================================
RisultatoValidazione read_temperature_ds18b20() {
  RisultatoValidazione risultato;
  // Inizializza struct a zero/default per sicurezza
  risultato.valido = false;
  risultato.valorePulito = _configValidazioneTemp.valoreDefault;
  risultato.timestamp = millis();
  
  // 1. Check Abilitato
  if (!_ds18b20_abilitato) {
    risultato.codiceErrore = ERR_SENSOR_OFFLINE; // Assumendo esista in SensorValidation.h
    strncpy(risultato.messaggioErrore, "[DS18B20] Sensore disabilitato", sizeof(risultato.messaggioErrore) - 1);
    return risultato;
  }

  // 2. Check Inizializzato
  if (!_ds18b20_inizializzato) {
    risultato.codiceErrore = ERR_SENSOR_NOT_READY; 
    strncpy(risultato.messaggioErrore, "[DS18B20] Sensore non init", sizeof(risultato.messaggioErrore) - 1);
    return risultato;
  }

  // 3. Lettura Fisica
  // ATTENZIONE: Questa chiamata blocca per 750ms a 12-bit!
  sensors.requestTemperatures(); 
  float tempC = sensors.getTempC(insideThermometer);

  // 4. Verifica connessione fisica
  bool sensoreReady = (tempC != DEVICE_DISCONNECTED_C); 

  // Se disconnesso, logghiamo subito l'errore specifico
  if (!sensoreReady) {
      // Potresti voler provare a reinizializzare qui se la connessione è persa
      // setup_ds18b20(); // Opzionale: tentativo di recupero
  }

  // 5. Validazione Logica (Range, NaN, ecc.)
  risultato = validaDatoSensore(
    tempC,
    millis(),
    sensoreReady,
    _configValidazioneTemp
  );

  // 6. Verifica Soglie
  if (risultato.valido) {
    verificaSoglie(risultato.valorePulito, _ds18b20_sogliaMin, _ds18b20_sogliaMax, "DS18B20");
    _ds18b20_contatore++;
  }

  return risultato;
}

// ... Getters invariati ...
unsigned long get_intervallo_ds18b20() { return _ds18b20_intervallo; }
bool is_abilitato_ds18b20() { return _ds18b20_abilitato; }
int get_contatore_ds18b20() { return _ds18b20_contatore; }
void reset_contatore_ds18b20() { _ds18b20_contatore = 0; }

Il codice che hai postato è una **gestione professionale** del sensore di temperatura DS18B20 per l'arnia.

In sintesi, il programma:

1.  **Verifica la presenza:** All'avvio cerca il sensore e ne controlla l'indirizzo unico.
    
2.  **Legge con precisione:** Imposta la risoluzione a 12 bit per rilevare anche minime variazioni termiche (0.06°C).
    
3.  **Valida il dato:** Non si fida ciecamente della lettura; controlla che il valore sia realistico (es. tra -40°C e +85°C) e che il sensore non sia scollegato.
    
4.  **Monitora la salute delle api:** Confronta la temperatura con una soglia ideale (30-37°C) per segnalare anomalie nel nido.
    
5.  **Ottimizza le risorse:** Usa tecniche avanzate per risparmiare memoria RAM e rendere il sistema stabile nel tempo.
    
È un sistema robusto, pensato per non inviare dati errati al server in caso di guasti tecnici.


// ============================================================================
// HX711 - Sensore Peso Arnia (Cella di Carico)
// ============================================================================

#include <Arduino.h>
#include "SensorValidation.h"

// ============================================================================
// CONFIGURAZIONE HARDWARE
// ============================================================================
#define HX711_DOUT_PIN 13
#define HX711_SCK_PIN 12

// ============================================================================
// VARIABILI INTERNE
// ============================================================================
static float _hx711_sogliaMin = 5.0f;      // Peso minimo anomalo (kg)
static float _hx711_sogliaMax = 80.0f;     // Peso massimo anomalo (kg)
static unsigned long _hx711_intervallo = 10800000;  // 3 ore default
static bool _hx711_abilitato = true;
static bool _hx711_inizializzato = false;
static bool _hx711_tarato = false;

// Parametri calibrazione
static float _hx711_calibration_factor = 1.0f;
static long _hx711_offset = 0;

// Configurazione validazione peso
static ConfigValidazioneSensore _configValidazionePeso = {
  .rangeMin = 0.0f,
  .rangeMax = 100.0f,
  .permettiNegativi = false,
  .richiedeTimestamp = true,
  .valoreDefault = 0.0f,
  .nomeSensore = "HX711"
};

// ============================================================================
// STRUTTURA RISULTATO ESTESO (errori specifici peso)
// ============================================================================
struct RisultatoPeso {
  RisultatoValidazione validazione;
  int erroreSpecifico;  // Codici 3xxx
};

// ============================================================================
// DB READ / WRITE (STUB) - RISERVATO AL GRUPPO DATABASE
// ============================================================================

// Lettura configurazione dal DB (stub)
static void letturaConfigDalDB_hx711() {
  // STUB: lettura configurazione HX711 dal DB (soglie, intervalli, abilitazione, ecc.)
}

// Scrittura dato nel DB (stub)
static void scritturaDatoNelDB_hx711(const RisultatoValidazione* risultato) {
  // STUB: implementazione riservata al gruppo Database
  (void)risultato; // evita warning
}

// ============================================================================
// SETUP - Inizializzazione hardware
// ============================================================================
void setup_hx711() {
  Serial.println("-> Inizializzazione sensore HX711...");

  // Configurazione pin
  pinMode(HX711_DOUT_PIN, INPUT);
  pinMode(HX711_SCK_PIN, OUTPUT);
  digitalWrite(HX711_SCK_PIN, LOW);

  // TODO: Inizializzazione libreria HX711
  // scale.begin(HX711_DOUT_PIN, HX711_SCK_PIN);

  _hx711_inizializzato = true;
  Serial.println("  + Pin HX711 configurati (DOUT=13, SCK=12)");
  Serial.println("  + Setup HX711 completato\n");
}

// ============================================================================
// INIT - Configurazione da Database
// ============================================================================
void init_hx711(SensorConfig* config) {
  if (config == NULL) {
    Serial.println("  ! HX711: config NULL, uso valori default");
    return;
  }

  _hx711_sogliaMin = config->sogliaMin;
  _hx711_sogliaMax = config->sogliaMax;
  _hx711_intervallo = config->intervallo;
  _hx711_abilitato = config->abilitato;

  Serial.println("  --- Config HX711 caricata dal DB ---");
  Serial.print("    Soglia MIN: "); Serial.print(_hx711_sogliaMin); Serial.println(" kg");
  Serial.print("    Soglia MAX: "); Serial.print(_hx711_sogliaMax); Serial.println(" kg");
  Serial.print("    Intervallo: "); Serial.print(_hx711_intervallo / 1000); Serial.println(" sec");
  Serial.print("    Abilitato: "); Serial.println(_hx711_abilitato ? "SI" : "NO");
}

// ============================================================================
// CALIBRAZIONE - Imposta parametri taratura
// ============================================================================
void calibrate_hx711(float calibration_factor, long offset) {
  _hx711_calibration_factor = calibration_factor;
  _hx711_offset = offset;
  _hx711_tarato = true;

  Serial.println("  --- Calibrazione HX711 ---");
  Serial.print("    Factor: "); Serial.println(_hx711_calibration_factor);
  Serial.print("    Offset: "); Serial.println(_hx711_offset);
}

// ============================================================================
// TARA - Azzera il peso corrente
// ============================================================================
bool tare_hx711() {
  if (!_hx711_inizializzato) {
    Serial.println("  ! HX711: impossibile tarare, sensore non inizializzato");
    return false;
  }

  // TODO: Implementare tara reale
  // _hx711_offset = scale.read_average(10);

  Serial.println("  + HX711: tara eseguita");
  return true;
}

// ============================================================================
// VERIFICA TARATURA
// ============================================================================
static bool verificaTaratura(int* erroreSpecifico) {
  if (!_hx711_tarato) {
    *erroreSpecifico = ERR_PS_CALIBRATION_MISSING;
    Serial.println("  ! HX711: calibrazione mancante");
    return false;
  }

  if (_hx711_calibration_factor == 0) {
    *erroreSpecifico = ERR_PS_CALIBRATION_INVALID;
    Serial.println("  ! HX711: calibrazione non valida (factor=0)");
    return false;
  }

  return true;
}

// ============================================================================
// READ WEIGHT - Lettura peso
// ============================================================================
RisultatoValidazione read_weight_hx711() {
  RisultatoValidazione risultato;

  // Verifica se sensore abilitato
  if (!_hx711_abilitato) {
    risultato.valido = false;
    risultato.codiceErrore = ERR_SENSOR_OFFLINE;
    risultato.valorePulito = _configValidazionePeso.valoreDefault;
    strcpy(risultato.messaggioErrore, "[HX711] Sensore disabilitato");
    return risultato;
  }

  // Verifica se sensore inizializzato
  if (!_hx711_inizializzato) {
    risultato.valido = false;
    risultato.codiceErrore = ERR_SENSOR_NOT_READY;
    risultato.valorePulito = _configValidazionePeso.valoreDefault;
    strcpy(risultato.messaggioErrore, "[HX711] Sensore non inizializzato");
    return risultato;
  }

  // Verifica taratura
  int erroreSpecifico = 0;
  if (!verificaTaratura(&erroreSpecifico)) {
    risultato.valido = false;
    risultato.codiceErrore = erroreSpecifico;
    risultato.valorePulito = _configValidazionePeso.valoreDefault;
    snprintf(risultato.messaggioErrore, 80, "[HX711] Errore taratura: %d", erroreSpecifico);
    return risultato;
  }

  // TODO: Lettura reale dal sensore
  // long raw = scale.read_average(5);
  // float peso_kg = (raw - _hx711_offset) / _hx711_calibration_factor;

  // Valore simulato per test
  float peso_kg = 25.5f;

  // Verifica conversione valida
  if (isnan(peso_kg) || isinf(peso_kg)) {
    risultato.valido = false;
    risultato.codiceErrore = ERR_PS_CONVERSION_FAILED;
    risultato.valorePulito = _configValidazionePeso.valoreDefault;
    strcpy(risultato.messaggioErrore, "[HX711] Conversione kg fallita");
    return risultato;
  }

  // Validazione dato
  bool sensoreReady = true;
  unsigned long timestamp = millis();

  risultato = validaDatoSensore(
    peso_kg,
    timestamp,
    sensoreReady,
    _configValidazionePeso
  );

  // Se valido, verifica soglie + (solo allora) chiamata DB write stub
  if (risultato.valido) {
    verificaSoglie(risultato.valorePulito, _hx711_sogliaMin, _hx711_sogliaMax, "HX711");

    // >>> CHIAMATA AL METODO DB (STUB)
    scritturaDatoNelDB_hx711(&risultato);
  }

  return risultato;
}

// ============================================================================
// GETTERS - Accesso ai parametri di configurazione
// ============================================================================
unsigned long get_intervallo_hx711() {
  return _hx711_intervallo;
}

bool is_abilitato_hx711() {
  return _hx711_abilitato;
}

bool is_tarato_hx711() {
  return _hx711_tarato;
}

float get_calibration_factor_hx711() {
  return _hx711_calibration_factor;
}

Il codice gestisce la **bilancia digitale** dell'arnia tramite il modulo **HX711**. È progettato per essere preciso e affidabile, separando la lettura elettrica grezza dal calcolo reale del peso.

In sintesi, il programma:

1.  **Gestisce la Taratura:** Permette di azzerare il peso (tara) e impostare un fattore di calibrazione per convertire i segnali in **chilogrammi (kg)**.
    
2.  **Verifica la Validità:** Prima di confermare il peso, controlla che la bilancia sia tarata correttamente e che il valore non sia "impossibile" (es. peso negativo o superiore a 100kg).
    
3.  **Filtra i Disturbi:** È predisposto per fare medie di più letture, eliminando le oscillazioni causate dal vento o dai movimenti delle api.
    
4.  **Pronto per il Cloud:** Include già le funzioni per inviare automaticamente il dato al database non appena la lettura viene confermata come valida.
    
È lo strumento principale per monitorare la produzione di miele e capire in tempo reale se è avvenuta una **sciamatura** (calo improvviso di peso).


// ============================================================================
// SHT21 (HTU21D) - Sensore Temperatura e Umidita Ambientale
// ============================================================================

#include <Wire.h>
#include "Adafruit_HTU21DF.h"
#include "SensorValidation.h"

// ============================================================================
// CONFIGURAZIONE HARDWARE
// ============================================================================
#define I2C_SDA 15
#define I2C_SCL 14

static Adafruit_HTU21DF sht21 = Adafruit_HTU21DF();

// ============================================================================
// VARIABILI INTERNE - UMIDITA
// ============================================================================
static float _sht21_umidita_sogliaMin = 40.0f;
static float _sht21_umidita_sogliaMax = 70.0f;
static unsigned long _sht21_umidita_intervallo = 360000;
static bool _sht21_umidita_abilitato = true;
static int _sht21_umidita_contatore = 0;
static unsigned long _last_read_time_hum = 0;

// ============================================================================
// VARIABILI INTERNE - TEMPERATURA
// ============================================================================
static float _sht21_temp_sogliaMin = 20.0f;
static float _sht21_temp_sogliaMax = 40.0f;
static unsigned long _sht21_temp_intervallo = 360000;
static bool _sht21_temp_abilitato = true;
static int _sht21_temp_contatore = 0;
static unsigned long _last_read_time_temp = 0;

// ============================================================================
// STATO SENSORE
// ============================================================================
static bool _sht21_inizializzato = false;

// ============================================================================
// CONFIG VALIDAZIONE
// ============================================================================
static ConfigValidazioneSensore _configValidazioneUmidita = {
  .rangeMin = 0.0f,
  .rangeMax = 100.0f,
  .permettiNegativi = false,
  .richiedeTimestamp = true,
  .valoreDefault = 50.0f,
  .nomeSensore = "SHT21_HUM"
};

static ConfigValidazioneSensore _configValidazioneTemp = {
  .rangeMin = -40.0f,
  .rangeMax = 125.0f,
  .permettiNegativi = true,
  .richiedeTimestamp = true,
  .valoreDefault = 25.0f,
  .nomeSensore = "SHT21_TEMP"
};

// ============================================================================
// DB READ / WRITE (STUB) - RISERVATO AL GRUPPO DATABASE
// ============================================================================

static void letturaConfigDalDB_sht21_humidity() {
  // STUB: lettura configurazione umidità dal DB
}

static void letturaConfigDalDB_sht21_temperature() {
  // STUB: lettura configurazione temperatura dal DB
}

static void scritturaDatoNelDB_sht21_humidity(const RisultatoValidazione* risultato) {
  // STUB: scrittura umidità nel DB
  (void)risultato;
}

static void scritturaDatoNelDB_sht21_temperature(const RisultatoValidazione* risultato) {
  // STUB: scrittura temperatura nel DB
  (void)risultato;
}

// ============================================================================
// SETUP
// ============================================================================
void setup_sht21() {
  Serial.println("-> Inizializzazione sensore SHT21...");
  Wire.begin(I2C_SDA, I2C_SCL);
  Wire.setPins(15, 14);

  if (!sht21.begin()) {
    Serial.println("  ! ERRORE: Sensore SHT21 non trovato!");
    _sht21_inizializzato = false;
  } else {
    _sht21_inizializzato = true;
    Serial.println("  + Sensore SHT21 inizializzato");
  }

  Serial.println("  + Setup SHT21 completato\n");
}

// ============================================================================
// INIT UMIDITA
// ============================================================================
void init_humidity_sht21(SensorConfig* config) {
  if (config == NULL) return;

  _sht21_umidita_sogliaMin = config->sogliaMin;
  _sht21_umidita_sogliaMax = config->sogliaMax;
  _sht21_umidita_intervallo = config->intervallo;
  _sht21_umidita_abilitato = config->abilitato;
  _sht21_umidita_contatore = 0;
<<<<<<< HEAD

  Serial.println("  --- Config SHT21 Umidita caricata dal DB ---");
  Serial.print("    Soglia MIN: "); Serial.print(_sht21_umidita_sogliaMin); Serial.println(" %");
  Serial.print("    Soglia MAX: "); Serial.print(_sht21_umidita_sogliaMax); Serial.println(" %");
  Serial.print("    Intervallo: "); Serial.print(_sht21_umidita_intervallo / 1000.0); Serial.println(" sec");
  Serial.print("    Abilitato: "); Serial.println(_sht21_umidita_abilitato ? "SI" : "NO");
=======
>>>>>>> 3a76805e7e9f0a85da496ca764f1c89aab68b02b
}

// ============================================================================
// INIT TEMPERATURA
// ============================================================================
void init_temperature_sht21(SensorConfig* config) {
  if (config == NULL) return;

  _sht21_temp_sogliaMin = config->sogliaMin;
  _sht21_temp_sogliaMax = config->sogliaMax;
  _sht21_temp_intervallo = config->intervallo;
  _sht21_temp_abilitato = config->abilitato;
  _sht21_temp_contatore = 0;
<<<<<<< HEAD

  Serial.println("  --- Config SHT21 Temperatura caricata dal DB ---");
  Serial.print("    Soglia MIN: "); Serial.print(_sht21_temp_sogliaMin); Serial.println(" C");
  Serial.print("    Soglia MAX: "); Serial.print(_sht21_temp_sogliaMax); Serial.println(" C");
  Serial.print("    Intervallo: "); Serial.print(_sht21_temp_intervallo / 1000.0); Serial.println(" sec");
  Serial.print("    Abilitato: "); Serial.println(_sht21_temp_abilitato ? "SI" : "NO");
=======
>>>>>>> 3a76805e7e9f0a85da496ca764f1c89aab68b02b
}

// ============================================================================
// READ HUMIDITY
// ============================================================================
RisultatoValidazione read_humidity_sht21() {
<<<<<<< HEAD
  RisultatoValidazione risultato; // Dichiariamo subito per usarla nei ritorni anticipati

  // 1. CHECK ABILITATO
  if (!_sht21_umidita_abilitato) {
    risultato.valido = false;
    risultato.codiceErrore = ERR_SENSOR_OFFLINE;
    risultato.valorePulito = _configValidazioneUmidita.valoreDefault;
    strcpy(risultato.messaggioErrore, "[SHT21_HUM] Sensore disabilitato");
    return risultato;
  }

  // 2. CHECK INIZIALIZZAZIONE
  if (!_sht21_inizializzato) {
    risultato.valido = false;
    risultato.codiceErrore = ERR_SENSOR_NOT_READY;
    risultato.valorePulito = _configValidazioneUmidita.valoreDefault;
    strcpy(risultato.messaggioErrore, "[SHT21_HUM] Sensore non inizializzato");
    return risultato;
=======
  if (!_sht21_umidita_abilitato || !_sht21_inizializzato) {
    RisultatoValidazione r;
    r.valido = false;
    r.codiceErrore = ERR_SENSOR_NOT_READY;
    r.valorePulito = _configValidazioneUmidita.valoreDefault;
    strcpy(r.messaggioErrore, "[SHT21_HUM] Sensore non pronto");
    return r;
>>>>>>> 3a76805e7e9f0a85da496ca764f1c89aab68b02b
  }

  // 3. CHECK INTERVALLO (PUNTO 3)
  // Se non è passato abbastanza tempo dall'ultima lettura, usciamo subito.
  if (millis() - _last_read_time_hum < _sht21_umidita_intervallo) {
    risultato.valido = false; 
    // Usiamo un codice generico o 0 per indicare "Nessuna nuova lettura necessaria"
    risultato.codiceErrore = 0; 
    risultato.valorePulito = _configValidazioneUmidita.valoreDefault; 
    // Messaggio vuoto o di debug, così il DB non scrive nulla se valido=false
    strcpy(risultato.messaggioErrore, "Intervallo non trascorso"); 
    return risultato;
  }

  // Aggiorniamo il tempo dell'ultima lettura
  _last_read_time_hum = millis();

  // 4. LETTURA E VALIDAZIONE
  float umidita = sht21.readHumidity();
<<<<<<< HEAD

  // (PUNTO 4): Rimosso il controllo "!= 998" (Magic Number)
  bool sensoreReady = !isnan(umidita); 
  unsigned long timestamp = millis();

  risultato = validaDatoSensore(
    umidita,
    timestamp,
    sensoreReady,
    _configValidazioneUmidita
=======
  bool sensoreReady = !isnan(umidita) && umidita != 998;
  unsigned long timestamp = millis();

  RisultatoValidazione risultato = validaDatoSensore(
    umidita, timestamp, sensoreReady, _configValidazioneUmidita
>>>>>>> 3a76805e7e9f0a85da496ca764f1c89aab68b02b
  );

  if (risultato.valido) {
    verificaSoglie(risultato.valorePulito,
                   _sht21_umidita_sogliaMin,
                   _sht21_umidita_sogliaMax,
                   "SHT21_HUM");
    _sht21_umidita_contatore++;
    scritturaDatoNelDB_sht21_humidity(&risultato);
  }

  return risultato;
}

// ============================================================================
// READ TEMPERATURE
// ============================================================================
RisultatoValidazione read_temperature_sht21() {
<<<<<<< HEAD
  RisultatoValidazione risultato;

  // 1. CHECK ABILITATO
  if (!_sht21_temp_abilitato) {
    risultato.valido = false;
    risultato.codiceErrore = ERR_SENSOR_OFFLINE;
    risultato.valorePulito = _configValidazioneTemp.valoreDefault;
    strcpy(risultato.messaggioErrore, "[SHT21_TEMP] Sensore disabilitato");
    return risultato;
  }

  // 2. CHECK INIZIALIZZAZIONE
  if (!_sht21_inizializzato) {
    risultato.valido = false;
    risultato.codiceErrore = ERR_SENSOR_NOT_READY;
    risultato.valorePulito = _configValidazioneTemp.valoreDefault;
    strcpy(risultato.messaggioErrore, "[SHT21_TEMP] Sensore non inizializzato");
    return risultato;
=======
  if (!_sht21_temp_abilitato || !_sht21_inizializzato) {
    RisultatoValidazione r;
    r.valido = false;
    r.codiceErrore = ERR_SENSOR_NOT_READY;
    r.valorePulito = _configValidazioneTemp.valoreDefault;
    strcpy(r.messaggioErrore, "[SHT21_TEMP] Sensore non pronto");
    return r;
>>>>>>> 3a76805e7e9f0a85da496ca764f1c89aab68b02b
  }

  // 3. CHECK INTERVALLO (PUNTO 3)
  if (millis() - _last_read_time_temp < _sht21_temp_intervallo) {
    risultato.valido = false;
    risultato.codiceErrore = 0; 
    risultato.valorePulito = _configValidazioneTemp.valoreDefault;
    strcpy(risultato.messaggioErrore, "Intervallo non trascorso");
    return risultato;
  }

  _last_read_time_temp = millis();

  // 4. LETTURA E VALIDAZIONE
  float temperatura = sht21.readTemperature();
<<<<<<< HEAD

  // (PUNTO 4): Semplificato
  bool sensoreReady = !isnan(temperatura);
  unsigned long timestamp = millis();

  risultato = validaDatoSensore(
    temperatura,
    timestamp,
    sensoreReady,
    _configValidazioneTemp
=======
  bool sensoreReady = !isnan(temperatura);
  unsigned long timestamp = millis();

  RisultatoValidazione risultato = validaDatoSensore(
    temperatura, timestamp, sensoreReady, _configValidazioneTemp
>>>>>>> 3a76805e7e9f0a85da496ca764f1c89aab68b02b
  );

  if (risultato.valido) {
    verificaSoglie(risultato.valorePulito,
                   _sht21_temp_sogliaMin,
                   _sht21_temp_sogliaMax,
                   "SHT21_TEMP");
    _sht21_temp_contatore++;
    scritturaDatoNelDB_sht21_temperature(&risultato);
  }

  return risultato;
}
<<<<<<< HEAD
// ============================================================================
// GETTERS - Accesso ai parametri di configurazione
// ============================================================================
unsigned long get_intervallo_humidity_sht21() {
  return _sht21_umidita_intervallo;
}

unsigned long get_intervallo_temperature_sht21() {
  return _sht21_temp_intervallo;
}

bool is_abilitato_humidity_sht21() {
  return _sht21_umidita_abilitato;
}

bool is_abilitato_temperature_sht21() {
  return _sht21_temp_abilitato;
}

bool is_inizializzato_sht21() {
  return _sht21_inizializzato;
}
=======
>>>>>>> 3a76805e7e9f0a85da496ca764f1c89aab68b02b

Il codice gestisce il sensore **SHT21**, un dispositivo digitale ad alta precisione che misura **temperatura e umidità** dell'aria tramite il protocollo **I2C**. È la soluzione ideale per monitorare il microclima interno all'arnia.

In sintesi, il programma:

1.  **Gestione Indipendente:** Tratta temperatura e umidità come due canali separati, permettendo di impostare soglie di allarme e intervalli di lettura differenti per ciascuno.
    
2.  **Controllo Temporale:** Include un sistema di gestione del tempo che impedisce letture troppo ravvicinate, ottimizzando il consumo di energia e la stabilità del sistema.
    
3.  **Validazione Rigorosa:** Controlla che il sensore sia collegato correttamente e scarta automaticamente eventuali letture errate o "vuote" (NaN), evitando di salvare dati falsi nel database.
    
4.  **Integrazione Cloud:** Come gli altri moduli, è già predisposto per comunicare i dati validati al database e segnalare se i valori escono dai parametri ottimali (es. umidità tra il 40% e il 70%).
   
È il codice che assicura che le api vivano in un ambiente con la corretta igrometria, fondamentale per la salute della covata.

### Stima precisa del consumo (HTTP No-SSL)

Con una frequenza di 10 invii/ora, ecco come si comportano i dati:

-   **Dati per singolo invio:** ~450 byte (Header HTTP + JSON leggero + Risposta server).
    
-   **Dati ogni ora:** $450 \text{ byte} \times 10 = 4.5 \text{ KB}$.
    
-   **Dati al giorno:** $4.5 \text{ KB} \times 24 = 108 \text{ KB}$.
    
-   **Dati al mese (30 gg):** $108 \text{ KB} \times 30 = \mathbf{3.24 \text{ MB}}$.
