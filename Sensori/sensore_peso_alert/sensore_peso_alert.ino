#include <Arduino.h>
#include "SensorValidation.h"  // ← IMPORTIAMO LA LIBRERIA COMUNE

// ============================================================================
// CONFIGURAZIONE TEST
// ============================================================================
static const float TEST_peso_min_kg = 0.0f;
static const float TEST_peso_max_kg = 40.0f;
static const uint64_t TEST_sleep_us = 20ULL * 1000000ULL; // 20 secondi

// ============================================================================
// CATALOGO ERRORI SPECIFICI PESO (PS)
// ============================================================================
enum ErrorePeso {
  ERR_PS_NONE = 0,
  ERR_PS_SATURAZIONE_ADC = 2030,
  ERR_PS_TARATURA_NON_PRESENTE = 2060,
  ERR_PS_TARATURA_NON_VALIDA = 2070,
  ERR_PS_CONVERSIONE_KG_FALLITA = 2080
};

// ============================================================================
// CONFIGURAZIONE VALIDAZIONE PESO
// ============================================================================
ConfigValidazioneSensore configPeso = {
  .rangeMin = TEST_peso_min_kg,
  .rangeMax = TEST_peso_max_kg,
  . permettiNegativi = false,
  .richiedeTimestamp = true,
  . valoreDefault = 0.0f,
  .nomeSensore = "PESO"
};

// ============================================================================
// STRUTTURA RISULTATO VALIDAZIONE PESO (estesa)
// ============================================================================
struct RisultatoValidazionePeso {
  RisultatoValidazione validazioneComune; // ← Riutilizziamo la struct comune
  ErrorePeso erroreSpecifico;
};

// ============================================================================
// FUNZIONI SPECIFICHE PESO
// ============================================================================

static bool verificaTaraturaPeso(ErrorePeso* errore) {
  // TEST:  simulazione taratura presente e valida
  // In produzione: controllare presenza calibrazione in EEPROM/NVS
  
  bool taratura_presente = true;
  bool taratura_valida = true;
  
  if (! taratura_presente) {
    *errore = ERR_PS_TARATURA_NON_PRESENTE;
    Serial.println("ERR_PS_TARATURA_NON_PRESENTE:  calibrazione mancante");
    return false;
  }
  
  if (!taratura_valida) {
    *errore = ERR_PS_TARATURA_NON_VALIDA;
    Serial.println("ERR_PS_TARATURA_NON_VALIDA: calibrazione corrotta");
    return false;
  }
  
  return true;
}

static void taraturaDifferenzaPeso() {
  Serial.println("Esecuzione taratura peso...");
  // TEST: senza sensore fisico, la taratura non fa nulla
  // In produzione: applicare offset di taratura dal valore memorizzato
}

static RisultatoValidazionePeso acquisisciEValidaPeso() {
  RisultatoValidazionePeso risultato;
  risultato.erroreSpecifico = ERR_PS_NONE;
  
  // STEP 1: Verifica taratura presente e valida
  if (!verificaTaraturaPeso(&risultato.erroreSpecifico)) {
    risultato.validazioneComune.valido = false;
    risultato.validazioneComune.codiceErrore = ERR_SENSOR_NOT_READY;
    risultato.validazioneComune.valorePulito = configPeso.valoreDefault;
    strcpy(risultato.validazioneComune.messaggioErrore, "[PESO] Taratura non valida");
    return risultato;
  }
  
  // STEP 2: Lettura ADC (simulata in TEST)
  // In produzione: leggere valore ADC reale da load cell
  float valore_adc_raw = 12.5f; // TEST
  
  // STEP 3: Controllo saturazione ADC
  // In produzione: verificare se ADC è a 0 o full-scale
  // const uint32_t ADC_MIN = 0;
  // const uint32_t ADC_MAX = 8388607; // 24-bit ADC esempio
  // if (adc_reading <= ADC_MIN || adc_reading >= ADC_MAX) {
  //   risultato.erroreSpecifico = ERR_PS_SATURAZIONE_ADC;
  //   Serial.println("ERR_PS_SATURAZIONE_ADC:  ADC saturo");
  //   risultato.validazioneComune.valido = false;
  //   return risultato;
  // }
  
  // STEP 4: Conversione in kg con taratura
  float valore_kg = valore_adc_raw; // TEST:  conversione simulata
  // In produzione: applicare formula calibrazione
  // valore_kg = (adc_raw - offset_taratura) * fattore_scala;
  
  if (isnan(valore_kg) || isinf(valore_kg)) {
    risultato.erroreSpecifico = ERR_PS_CONVERSIONE_KG_FALLITA;
    risultato.validazioneComune.valido = false;
    risultato.validazioneComune.codiceErrore = ERR_DATA_INVALID_NUMBER;
    risultato.validazioneComune.valorePulito = configPeso. valoreDefault;
    strcpy(risultato.validazioneComune.messaggioErrore, 
           "[PESO] Conversione kg fallita");
    return risultato;
  }
  
  // STEP 5: VALIDAZIONE COMUNE
  bool sensoreReady = true; // Taratura OK, quindi sensore pronto
  unsigned long timestamp = millis();
  
  risultato.validazioneComune = validaDatoSensore(
    valore_kg,
    timestamp,
    sensoreReady,
    configPeso
  );
  
  return risultato;
}

// ============================================================================
// GESTIONE ALERT E CONFERME
// ============================================================================

static void invioAlertPesoFuoriRange(RisultatoValidazionePeso* risultato) {
  Serial.println("\n╔════════════════════════════════════╗");
  Serial.println("║        ALERT PESO ANOMALO         ║");
  Serial.println("╚════════════════════════════════════╝");
  
  // Errore comune (se presente)
  if (risultato->validazioneComune.codiceErrore != ERR_COMMON_NONE) {
    Serial.print("Errore comune: ");
    Serial.println(risultato->validazioneComune.messaggioErrore);
  }
  
  // Errore specifico peso (se presente)
  if (risultato->erroreSpecifico != ERR_PS_NONE) {
    Serial.print("Errore specifico: ");
    Serial.print(risultato->erroreSpecifico);
    Serial.print(" (");
    switch(risultato->erroreSpecifico) {
      case ERR_PS_SATURAZIONE_ADC:  Serial.print("Saturazione ADC"); break;
      case ERR_PS_TARATURA_NON_PRESENTE: Serial.print("Taratura assente"); break;
      case ERR_PS_TARATURA_NON_VALIDA: Serial.print("Taratura non valida"); break;
      case ERR_PS_CONVERSIONE_KG_FALLITA: Serial.print("Conversione fallita"); break;
      default:  Serial.print("Altro"); break;
    }
    Serial.println(")");
  }
  
  Serial.print("Valore letto: ");
  Serial.print(risultato->validazioneComune.valorePulito, 3);
  Serial.println(" kg");
  
  // TODO: In produzione: inviare alert via MQTT/HTTP
  // Payload esempio: {"error_common": 200, "error_ps": 2030, "value": 45.3, "timestamp": ... }
  
  Serial.println();
}

static void confermaPesoValido(float valore_peso_kg) {
  Serial.println("\n✓ PESO VALIDO");
  Serial.print("  Peso misurato: ");
  Serial.print(valore_peso_kg, 3);
  Serial.println(" kg");
  
  // TODO: In produzione:  inviare misura al cloud/database
  // Payload esempio: {"weight_kg": 12.5, "device_id": "PS001", "timestamp": ...}
  
  Serial.println();
}

// ============================================================================
// DEEP SLEEP
// ============================================================================

static void ritornoInDeepSleep() {
  Serial.print("→ Deep Sleep per ");
  Serial.print(TEST_sleep_us / 1000000);
  Serial.println(" secondi\n");
  
  delay(100); // Flush seriale
  
  esp_sleep_enable_timer_wakeup(TEST_sleep_us);
  esp_deep_sleep_start();
}

// ============================================================================
// FUNZIONE PRINCIPALE PESO (da chiamare nel Main)
// ============================================================================

void funzionePeso() {
  Serial.println("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  Serial.println("  CICLO SENSORE PESO - AVVIO");
  Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  // 1) Esegui taratura
  taraturaDifferenzaPeso();
  
  // 2) Acquisizione e validazione completa
  RisultatoValidazionePeso risultato = acquisisciEValidaPeso();
  
  // 3) Gestione risultato
  if (!risultato.validazioneComune.valido) {
    invioAlertPesoFuoriRange(&risultato);
  } else {
    confermaPesoValido(risultato.validazioneComune.valorePulito);
  }
  
  // 4) Ritorno in deep sleep
  ritornoInDeepSleep();
}

// ============================================================================
// SETUP E LOOP
// ============================================================================

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n");
  Serial.println("╔═══════════════════════════════════════╗");
  Serial.println("║   SENSORE PESO - Sistema Validazione ║");
  Serial.println("║   Firmware v1.0 - TEST MODE          ║");
  Serial.println("╚═══════════════════════════════════════╝");
  
  funzionePeso();
}

void loop() {
  // Non utilizzato:  tutto gestito da deep sleep
}
