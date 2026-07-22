# 🌐 Monitoring Kelembapan Tanah (ESP32 + ThingSpeak + Vercel)

Dashboard web modern, responsif, dan interaktif untuk memonitor 6 sensor kelembapan tanah (*soil moisture*) yang terhubung dengan **ESP32** melalui **ThingSpeak REST API**.

Aplikasi ini siap diunggah ke **GitHub** dan di-deploy secara instan ke **Vercel**.

---

## ✨ Fitur Utama

- 📊 **6 Sensor Gauge Cards**: Widget visual dengan gauge melingkar real-time untuk 6 channel (GPIO 32, 33, 34, 35, 25, 26).
- 📈 **Grafik Tren Interaktif**: Multi-line chart (Chart.js) untuk melihat riwayat kelembapan tanah per sensor.
- 🚨 **Indikator Status Penyiraman**: Peringatan otomatis (*Kering*, *Optimal*, *Sangat Basah*) sesuai batas persentase.
- ⚙️ **Pengaturan API & Rename Sensor**: Ubah nama sensor (contoh: *Cabai 1*, *Tomat 2*) & Channel ID ThingSpeak langsung dari UI web tanpa ubah kode.
- 📑 **Log Data & Ekspor CSV**: Riwayat data telemetri yang dapat difilter dan diunduh ke file CSV.
- 💻 **Mode Simulasi (Demo)**: Langsung berjalan dengan data simulasi realistis sebelum kredensial ThingSpeak dimasukkan.
- 📱 **Desain Glassmorphism Responsive**: Tampilan modern dark mode yang sangat responsif di desktop, tablet, dan smartphone.

---

## 🛠️ Panduan Jalankan di Lokal (Development)

Pastikan **Node.js** (v18+) telah terinstall di komputer Anda.

1. Buka terminal di folder proyek ini:
   ```bash
   cd d:\Users\Agung\Downloads\soil_moisture_thingspeak
   ```

2. Install dependency yang dibutuhkan:
   ```bash
   npm install
   ```

3. Jalankan server lokal Vite:
   ```bash
   npm run dev
   ```

4. Buka browser di alamat: `http://localhost:3000`

---

## 🚀 Panduan Deploy ke Vercel via GitHub

### Langkah 1: Push Proyek ke GitHub

1. Buat repository baru di [GitHub](https://github.com/new) (misalnya diberi nama `soil-moisture-monitoring`).
2. Buka terminal di folder ini dan jalankan perintah berikut:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Soil Moisture Dashboard"
   git branch -M main
   git remote add origin https://github.com/USERNAME_ANDA/soil-moisture-monitoring.git
   git push -u origin main
   ```
   *(Ganti `USERNAME_ANDA` dengan username GitHub Anda).*

### Langkah 2: Hubungkan ke Vercel

1. Buka dashboard [Vercel](https://vercel.com/) dan login dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** &rarr; **"Project"**.
3. Pilih repository `soil-moisture-monitoring` yang baru saja di-push.
4. Pada bagian pengaturan proyek:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Klik **"Deploy"**.

Dalam hitungan detik, website Anda akan live dan memiliki URL publik seperi `https://soil-moisture-monitoring.vercel.app`.

---

## 🔌 Pemetaan Hardware ESP32 & Arduino Sketch

Aplikasi ini selaras dengan sketch Arduino [`soil_moisture_thingspeak.ino`](soil_moisture_thingspeak.ino):

| Channel | Pin ESP32 | Tipe ADC | Sensor Field |
| :--- | :--- | :--- | :--- |
| **Sensor 1** | GPIO 32 | ADC1_CH4 | `field1` |
| **Sensor 2** | GPIO 33 | ADC1_CH5 | `field2` |
| **Sensor 3** | GPIO 34 | ADC1_CH6 | `field3` |
| **Sensor 4** | GPIO 35 | ADC1_CH7 | `field4` |
| **Sensor 5** | GPIO 25 | ADC2_CH8 | `field5` |
| **Sensor 6** | GPIO 26 | ADC2_CH9 | `field6` |

---

## 📝 Lisensi
MIT License &copy; 2026 Agung
