import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { SensorCard } from './components/SensorCard';
import { MoistureChart } from './components/MoistureChart';
import { DataTable } from './components/DataTable';
import { SettingsModal } from './components/SettingsModal';
import { ArduinoModal } from './components/ArduinoModal';
import { loadConfig, saveConfig, fetchThingSpeakFeeds } from './services/thingspeak';
import { Github, Globe, Terminal, Sparkles } from 'lucide-react';

const GPIO_PINS = [32, 33, 34, 35, 25, 26];

export function App() {
  const [config, setConfig] = useState(loadConfig);
  const [feedsData, setFeedsData] = useState({ channel: null, feeds: [], isMock: true });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Fetch telemetry feeds
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchThingSpeakFeeds(
        config.channelId,
        config.readApiKey,
        config.resultsCount
      );
      setFeedsData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching feeds:', err);
    } finally {
      setIsLoading(false);
    }
  }, [config.channelId, config.readApiKey, config.resultsCount]);

  // Initial load & periodic polling
  useEffect(() => {
    loadData();
    const intervalSec = Math.max(15, config.autoRefreshInterval || 20);
    const timer = setInterval(() => {
      loadData();
    }, intervalSec * 1000);

    return () => clearInterval(timer);
  }, [loadData, config.autoRefreshInterval]);

  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  // Get latest telemetry sample values for 6 fields
  const latestFeed = feedsData.feeds && feedsData.feeds.length > 0
    ? feedsData.feeds[feedsData.feeds.length - 1]
    : null;

  const latestValues = [1, 2, 3, 4, 5, 6].map((fieldNum) => {
    if (!latestFeed) return null;
    const rawVal = parseFloat(latestFeed[`field${fieldNum}`]);
    return isNaN(rawVal) ? null : rawVal;
  });

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      <div>
        {/* Header Bar */}
        <Header
          isMock={feedsData.isMock}
          lastUpdated={lastUpdated}
          isLoading={isLoading}
          onRefresh={loadData}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCodeModal={() => setIsCodeModalOpen(true)}
          channelId={config.channelId || 'Demo'}
        />

        {/* Main Dashboard Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          
          {/* Demo Mode Alert Banner if no Channel ID is set */}
          {feedsData.isMock && (
            <div className="mb-6 glass-card p-4 border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-300">
                    Mode Simulasi Demo Berjalan
                  </h4>
                  <p className="text-xs text-amber-200/80">
                    Website sedang menggunakan data simulasi 6 sensor. Masukkan Channel ID & Read API Key ThingSpeak Anda di Pengaturan untuk live data.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap shadow-md shadow-amber-500/20 transition-all"
              >
                Hubungkan API Key
              </button>
            </div>
          )}

          {/* Executive KPI Summary Cards */}
          <SummaryCards
            latestValues={latestValues}
            thresholds={config.thresholds}
          />

          {/* 6 Sensor Cards Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Status 6 Sensor Kelembapan Tanah
              </h2>
              <span className="text-xs text-slate-400">
                Update tiap ~{config.autoRefreshInterval}s
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {config.sensorNames.map((name, i) => (
                <SensorCard
                  key={i}
                  index={i}
                  sensorName={name}
                  gpioPin={GPIO_PINS[i]}
                  value={latestValues[i]}
                  thresholds={config.thresholds}
                />
              ))}
            </div>
          </div>

          {/* Historical Interactive Chart */}
          <MoistureChart
            feeds={feedsData.feeds || []}
            sensorNames={config.sensorNames}
            thresholds={config.thresholds}
          />

          {/* Detailed Data Telemetry Table */}
          <DataTable
            feeds={feedsData.feeds || []}
            sensorNames={config.sensorNames}
            thresholds={config.thresholds}
          />

        </main>
      </div>

      {/* Footer & Deployment Guide Banner */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>ESP32 Soil Moisture Monitoring &bull; ThingSpeak IoT Cloud</span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1">
              <Github className="w-4 h-4 text-slate-300" /> Siap konek ke GitHub & Vercel
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Terminal className="w-4 h-4" /> Node 18+ / React 18 / Vite
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />

      <ArduinoModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

    </div>
  );
}
