import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroDarkCard } from './components/HeroDarkCard';
import { RadarZoneCard } from './components/RadarZoneCard';
import { InflowBarChart, AreaCompareChart } from './components/MoistureChart';
import { DonutConditionCard, DonutSensorsCard } from './components/DonutBreakdownCard';
import { SensorCard } from './components/SensorCard';
import { DataTable } from './components/DataTable';
import { SettingsModal } from './components/SettingsModal';
import { ArduinoModal } from './components/ArduinoModal';
import { loadConfig, saveConfig, fetchThingSpeakFeeds } from './services/thingspeak';
import { Github, Globe, Terminal, Sparkles, Sprout, Cpu } from 'lucide-react';

const GPIO_PINS = [32, 33, 34, 35, 25, 26];

export function App() {
  const [config, setConfig] = useState(loadConfig);
  const [feedsData, setFeedsData] = useState({ channel: null, feeds: [], isMock: true });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

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
    <div className="min-h-screen flex flex-col justify-between bg-[#f0f4f9]">
      
      <div>
        {/* Header Bar with Pill Navigation */}
        <Header
          isMock={feedsData.isMock}
          lastUpdated={lastUpdated}
          isLoading={isLoading}
          onRefresh={loadData}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCodeModal={() => setIsCodeModalOpen(true)}
          channelId={config.channelId || 'Demo'}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main Dashboard Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          
          {/* Demo Mode Alert Banner if no Channel ID is set */}
          {feedsData.isMock && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    Mode Simulasi Demo Aktif
                  </h4>
                  <p className="text-xs text-amber-700">
                    Website sedang menggunakan data simulasi 6 sensor kelembapan. Masukkan Channel ID & Read API Key ThingSpeak Anda di Pengaturan.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs whitespace-nowrap shadow-sm transition-all"
              >
                Hubungkan API Key
              </button>
            </div>
          )}

          {/* TOP ROW GRID (Matching Reference Photo Top Row):
              Col 1: Hero Dark Card (~30%)
              Col 2: Inflow Bar Chart (~45%)
              Col 3: Radar Zone Balance (~25%)
          */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
            <div className="lg:col-span-4">
              <HeroDarkCard
                latestValues={latestValues}
                thresholds={config.thresholds}
                sensorNames={config.sensorNames}
              />
            </div>
            <div className="lg:col-span-5">
              <InflowBarChart
                feeds={feedsData.feeds || []}
                sensorNames={config.sensorNames}
              />
            </div>
            <div className="lg:col-span-3">
              <RadarZoneCard
                latestValues={latestValues}
                sensorNames={config.sensorNames}
              />
            </div>
          </div>

          {/* MIDDLE ROW GRID (Matching Reference Photo Middle Row):
              Col 1: Soil Condition Donut Chart
              Col 2: Sensor Distribution Donut Chart
          */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            <DonutConditionCard
              latestValues={latestValues}
              thresholds={config.thresholds}
            />
            <DonutSensorsCard
              latestValues={latestValues}
              sensorNames={config.sensorNames}
            />
          </div>

          {/* BOTTOM ROW GRID (Matching Reference Photo Bottom Row):
              Col 1: Smooth Area Comparison Chart
              Col 2: 6 Individual Sensor Node Cards Grid
          */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
            <div className="lg:col-span-6">
              <AreaCompareChart
                feeds={feedsData.feeds || []}
                sensorNames={config.sensorNames}
              />
            </div>

            <div className="lg:col-span-6 neo-card p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-sky-600" />
                  Status 6 Sensor Kelembapan
                </h3>
                <span className="text-xs font-semibold text-slate-400">
                  Update tiap ~{config.autoRefreshInterval}s
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[300px] pr-1">
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
          </div>

          {/* Detailed Data Telemetry Table */}
          <DataTable
            feeds={feedsData.feeds || []}
            sensorNames={config.sensorNames}
            thresholds={config.thresholds}
          />

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-sky-600" />
            <span>ESP32 Soil Moisture Monitoring &bull; ThingSpeak IoT Cloud</span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1 text-slate-600">
              <Github className="w-4 h-4 text-slate-700" /> Vercel & GitHub Ready
            </span>
            <span className="flex items-center gap-1 text-slate-400">
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
