import React from 'react';
import { X, Code, Cpu, ExternalLink, Copy, Check } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-700 shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Integrasi ESP32 & Wiring Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Wiring Table */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Pemetaan Pin ESP32 ADC1
            </h3>
            <p className="text-xs text-slate-400">
              Menggunakan ADC1 (aman dipakai bersama WiFi tanpa konflik hardware):
            </p>

            <div className="overflow-x-auto rounded-lg border border-slate-800 mt-2">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-300">
                  <tr>
                    <th className="py-2 px-3">Sensor</th>
                    <th className="py-2 px-3">Field ThingSpeak</th>
                    <th className="py-2 px-3">Pin ESP32</th>
                    <th className="py-2 px-3">Tipe ADC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  <tr><td className="py-2 px-3 font-sans font-semibold">Sensor 1</td><td className="py-2 px-3 text-emerald-400">field1</td><td className="py-2 px-3">GPIO 32</td><td className="py-2 px-3 text-slate-400">ADC1_CH4</td></tr>
                  <tr><td className="py-2 px-3 font-sans font-semibold">Sensor 2</td><td className="py-2 px-3 text-emerald-400">field2</td><td className="py-2 px-3">GPIO 33</td><td className="py-2 px-3 text-slate-400">ADC1_CH5</td></tr>
                  <tr><td className="py-2 px-3 font-sans font-semibold">Sensor 3</td><td className="py-2 px-3 text-emerald-400">field3</td><td className="py-2 px-3">GPIO 34</td><td className="py-2 px-3 text-slate-400">ADC1_CH6</td></tr>
                  <tr><td className="py-2 px-3 font-sans font-semibold">Sensor 4</td><td className="py-2 px-3 text-emerald-400">field4</td><td className="py-2 px-3">GPIO 35</td><td className="py-2 px-3 text-slate-400">ADC1_CH7</td></tr>
                  <tr><td className="py-2 px-3 font-sans font-semibold">Sensor 5</td><td className="py-2 px-3 text-emerald-400">field5</td><td className="py-2 px-3">GPIO 25</td><td className="py-2 px-3 text-slate-400">ADC2_CH8*</td></tr>
                  <tr><td className="py-2 px-3 font-sans font-semibold">Sensor 6</td><td className="py-2 px-3 text-emerald-400">field6</td><td className="py-2 px-3">GPIO 26</td><td className="py-2 px-3 text-slate-400">ADC2_CH9*</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-amber-400/90 mt-1">
              💡 Pasang VCC sensor ke 3.3V (bukan 5V) dan GND ke GND ESP32.
            </p>
          </div>

          {/* Code Reference */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-cyan-400">
                Format Endpoint ThingSpeak Update
              </h3>
              <button
                onClick={handleCopySketch}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Cuplikan'}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
              <code>
                GET http://api.thingspeak.com/update?api_key=WRITE_KEY&field1=45.2&field2=60.1&field3=32.0&field4=18.5&field5=55.0&field6=72.4
              </code>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end bg-slate-900/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
