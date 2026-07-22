import React from 'react';
import { X, Code, Cpu, Copy, Check, Zap } from 'lucide-react';

export function ArduinoModal({ isOpen, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopySketch = () => {
    const sketchText = `/*
  ESP32 + 6x DFRobot Capacitive Soil Moisture Sensor v1.0 -> ThingSpeak
  Pin ADC1: 32, 33, 34, 35, 25, 26
*/
#include <WiFi.h>
#include <HTTPClient.h>

const char* WIFI_SSID     = "NAMA_WIFI";
const char* WIFI_PASSWORD = "PASSWORD_WIFI";
const char* TS_API_KEY   = "WRITE_API_KEY_ANDA";
const char* TS_SERVER    = "http://api.thingspeak.com/update";

const int NUM_SENSORS = 6;
const int SOIL_PINS[NUM_SENSORS] = {32, 33, 34, 35, 25, 26};
int DRY_VALUES[NUM_SENSORS] = {3000, 3000, 3000, 3000, 3000, 3000};
int WET_VALUES[NUM_SENSORS] = {1200, 1200, 1200, 1200, 1200, 1200};
`;
    navigator.clipboard.writeText(sketchText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-slate-200 shadow-2xl"
        style={{ boxShadow: '0 25px 60px rgba(15,23,42,0.18)' }}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-cyan-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Integrasi ESP32 & Wiring Guide</h2>
              <p className="text-[11px] text-slate-400">Panduan koneksi sensor & konfigurasi ThingSpeak API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Wiring Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-600" /> Pemetaan Pin ESP32 ADC1
            </h3>
            <p className="text-xs text-slate-500">
              Menggunakan ADC1 (aman dipakai bersama WiFi tanpa konflik hardware):
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Sensor</th>
                    <th className="py-2.5 px-4">Field ThingSpeak</th>
                    <th className="py-2.5 px-4">Pin ESP32</th>
                    <th className="py-2.5 px-4">Tipe ADC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono bg-white">
                  <tr className="hover:bg-slate-50"><td className="py-2 px-4 font-sans font-semibold">Sensor 1</td><td className="py-2 px-4 text-sky-600 font-bold">field1</td><td className="py-2 px-4">GPIO 32</td><td className="py-2 px-4 text-slate-400">ADC1_CH4</td></tr>
                  <tr className="hover:bg-slate-50"><td className="py-2 px-4 font-sans font-semibold">Sensor 2</td><td className="py-2 px-4 text-sky-600 font-bold">field2</td><td className="py-2 px-4">GPIO 33</td><td className="py-2 px-4 text-slate-400">ADC1_CH5</td></tr>
                  <tr className="hover:bg-slate-50"><td className="py-2 px-4 font-sans font-semibold">Sensor 3</td><td className="py-2 px-4 text-sky-600 font-bold">field3</td><td className="py-2 px-4">GPIO 34</td><td className="py-2 px-4 text-slate-400">ADC1_CH6</td></tr>
                  <tr className="hover:bg-slate-50"><td className="py-2 px-4 font-sans font-semibold">Sensor 4</td><td className="py-2 px-4 text-sky-600 font-bold">field4</td><td className="py-2 px-4">GPIO 35</td><td className="py-2 px-4 text-slate-400">ADC1_CH7</td></tr>
                  <tr className="hover:bg-slate-50"><td className="py-2 px-4 font-sans font-semibold">Sensor 5</td><td className="py-2 px-4 text-sky-600 font-bold">field5</td><td className="py-2 px-4">GPIO 25</td><td className="py-2 px-4 text-slate-400">ADC2_CH8*</td></tr>
                  <tr className="hover:bg-slate-50"><td className="py-2 px-4 font-sans font-semibold">Sensor 6</td><td className="py-2 px-4 text-sky-600 font-bold">field6</td><td className="py-2 px-4">GPIO 26</td><td className="py-2 px-4 text-slate-400">ADC2_CH9*</td></tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-700">
              <Zap className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>Pasang VCC sensor ke <strong>3.3V</strong> (bukan 5V) dan GND ke GND ESP32.</span>
            </div>
          </div>

          {/* Code Reference */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Format Endpoint ThingSpeak Update
              </h3>
              <button
                onClick={handleCopySketch}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-sky-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Cuplikan'}</span>
              </button>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
              <code className="whitespace-pre-wrap break-all">
                GET http://api.thingspeak.com/update?api_key=WRITE_KEY&field1=45.2&field2=60.1&field3=32.0&field4=18.5&field5=55.0&field6=72.4
              </code>
            </div>

            <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-700">
              <strong>Response sukses</strong>: Server ThingSpeak mengembalikan Entry ID (angka positif). 
              Jika <code className="bg-sky-100 px-1 rounded">0</code>, berarti interval kirim terlalu cepat (min 15 detik antara update).
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
