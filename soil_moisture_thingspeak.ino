/*
  ESP32 + 6x DFRobot Capacitive Soil Moisture Sensor v1.0 -> ThingSpeak
  ---------------------------------------------------------------
  - 6 sensor dibaca via 6 pin ADC1 (aman dipakai bersamaan WiFi)
  - Nilai mentah tiap sensor dikonversi ke persen kelembapan (perlu kalibrasi per sensor)
  - Data dikirim ke ThingSpeak field1-field6 setiap interval tertentu

  PENTING soal pemilihan pin:
    ESP32 punya 2 unit ADC: ADC1 (GPIO32-39) dan ADC2 (GPIO0,2,4,12-15,25-27).
    ADC2 TIDAK BISA dipakai bersamaan dengan WiFi aktif (konflik hardware,
    hasil baca bisa 0 / error). Karena itu semua 6 sensor di bawah
    menggunakan pin ADC1 saja: 32, 33, 34, 35, 36, 39.
    (GPIO25 & GPIO26 sengaja tidak dipakai karena termasuk ADC2.)

  Wiring (untuk tiap sensor):
    Sensor VCC -> 3V3 (JANGAN 5V kalau langsung ke pin ADC ESP32)
    Sensor GND -> GND
    Sensor AOUT -> salah satu pin di SOIL_PINS[] di bawah

  Library yang dibutuhkan (Library Manager):
    - WiFi.h        (built-in ESP32 core)
    - HTTPClient.h  (built-in ESP32 core)
*/

#include <WiFi.h>
#include <HTTPClient.h>

// ---------- KONFIGURASI WIFI ----------
const char* WIFI_SSID     = "NAMA_WIFI";
const char* WIFI_PASSWORD = "PASSWORD_WIFI";

// ---------- KONFIGURASI THINGSPEAK ----------
const char* TS_API_KEY   = "WRITE_API_KEY_ANDA";      // Write API Key channel ThingSpeak
const char* TS_SERVER    = "http://api.thingspeak.com/update";
const unsigned long TS_INTERVAL_MS = 20000UL;         // ThingSpeak free tier min. 15 detik antar update

// ---------- KONFIGURASI SENSOR (6 SENSOR) ----------
const int NUM_SENSORS = 6;
const int SOIL_PINS[NUM_SENSORS] = {32, 33, 34, 35, 25, 26};  // semua ADC1

// Nilai kalibrasi ADC per sensor (HARUS disesuaikan sendiri, sensor capacitive
// bisa punya variasi pabrikan antar unit, jadi idealnya dikalibrasi satu-satu).
// Cara kalibrasi tiap sensor:
//   1. Ukur ADC saat sensor benar-benar KERING (di udara)    -> DRY_VALUES[i]
//   2. Ukur ADC saat sensor dicelup penuh ke AIR/tanah basah -> WET_VALUES[i]
int DRY_VALUES[NUM_SENSORS] = {3000, 3000, 3000, 3000, 3000, 3000};
int WET_VALUES[NUM_SENSORS] = {1200, 1200, 1200, 1200, 1200, 1200};

unsigned long lastSendTime = 0;

void connectWiFi() {
  Serial.print("Menghubungkan ke WiFi");
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("WiFi terhubung, IP: ");
  Serial.println(WiFi.localIP());
}

// Baca satu sensor di pin tertentu, kembalikan rata-rata beberapa sampel biar stabil
int readSoilRaw(int pin) {
  const int SAMPLES = 10;
  long total = 0;
  for (int i = 0; i < SAMPLES; i++) {
    total += analogRead(pin);
    delay(10);
  }
  return total / SAMPLES;
}

// Konversi nilai ADC mentah ke persen kelembapan (0-100%) untuk sensor ke-idx
float rawToPercent(int raw, int idx) {
  float percent = map(raw, DRY_VALUES[idx], WET_VALUES[idx], 0, 100);
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;
  return percent;
}

// Kirim semua 6 nilai persen kelembapan ke field1-field6 ThingSpeak
void sendToThingSpeak(float percents[NUM_SENSORS]) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi terputus, mencoba reconnect...");
    connectWiFi();
  }

  HTTPClient http;
  String url = String(TS_SERVER) + "?api_key=" + TS_API_KEY;
  for (int i = 0; i < NUM_SENSORS; i++) {
    url += "&field" + String(i + 1) + "=" + String(percents[i], 1);
  }

  http.begin(url);
  int httpCode = http.GET();

  if (httpCode > 0) {
    String response = http.getString();
    Serial.print("ThingSpeak response code: ");
    Serial.println(httpCode);
    Serial.print("Entry ID: ");
    Serial.println(response);
  } else {
    Serial.print("Gagal kirim data, error: ");
    Serial.println(http.errorToString(httpCode));
  }

  http.end();
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  analogReadResolution(12);      // ESP32 ADC 12-bit (0-4095)
  for (int i = 0; i < NUM_SENSORS; i++) {
    pinMode(SOIL_PINS[i], INPUT);
  }

  connectWiFi();
}

void loop() {
  unsigned long now = millis();

  if (now - lastSendTime >= TS_INTERVAL_MS || lastSendTime == 0) {
    int rawValues[NUM_SENSORS];
    float percents[NUM_SENSORS];

    for (int i = 0; i < NUM_SENSORS; i++) {
      rawValues[i] = readSoilRaw(SOIL_PINS[i]);
      percents[i]  = rawToPercent(rawValues[i], i);

      Serial.print("Sensor ");
      Serial.print(i + 1);
      Serial.print(" (pin ");
      Serial.print(SOIL_PINS[i]);
      Serial.print(") - ADC mentah: ");
      Serial.print(rawValues[i]);
      Serial.print("  |  Kelembapan: ");
      Serial.print(percents[i], 1);
      Serial.println(" %");
    }

    sendToThingSpeak(percents);

    lastSendTime = now;
  }

  delay(100);
}
