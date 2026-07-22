import React from 'react';
import { 
  Sprout, 
  RefreshCw, 
  Settings, 
  Code, 
  Wifi, 
  Sparkles,
  Layers,
  Activity,
  BarChart2
} from 'lucide-react';

export function Header({
  isMock,
  lastUpdated,
  isLoading,
  onRefresh,
  onOpenSettings,
  onOpenCodeModal,
  channelId,
  activeTab,
  setActiveTab
}) {
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    : '-';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand Logo & Title (Matching top left of reference photo) */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-500/20">
            <Sprout className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-black tracking-tight text-slate-900">
                SoilMoisture <span className="text-cyan-600 font-semibold">Pro</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              ESP32 &bull; 6x ADC Soil Sensors &bull; ThingSpeak Cloud
            </p>
          </div>
        </div>

        {/* Center Pill Navigation Bar (Matching middle header in reference photo) */}
        <div className="flex items-center justify-center p-1 rounded-full bg-slate-100 border border-slate-200 self-center md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab && setActiveTab('dashboard')}
            className={`pill-btn ${(!activeTab || activeTab === 'dashboard') ? 'pill-btn-active' : 'pill-btn-inactive'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab('sensors')}
            className={`pill-btn ${activeTab === 'sensors' ? 'pill-btn-active' : 'pill-btn-inactive'}`}
          >
            Sensor Zone
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab('radar')}
            className={`pill-btn ${activeTab === 'radar' ? 'pill-btn-active' : 'pill-btn-inactive'}`}
          >
            Radar Analisis
          </button>
          <button
            onClick={() => setActiveTab && setActiveTab('history')}
            className={`pill-btn ${activeTab === 'history' ? 'pill-btn-active' : 'pill-btn-inactive'}`}
          >
            Riwayat Data
          </button>
        </div>

        {/* Right Quick Action Pills & Status */}
        <div className="flex items-center space-x-2 justify-end">
          {/* Status Badge Pill */}
          {isMock ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5" /> DEMO
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Wifi className="w-3.5 h-3.5 animate-pulse" /> CH {channelId}
            </span>
          )}

          {/* Refresh Button Pill */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-50"
            title="Sync Data Telemetri"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-600' : ''}`} />
          </button>

          {/* ESP32 Arduino Code Pill */}
          <button
            onClick={onOpenCodeModal}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-cyan-600" />
            <span>Kode ESP32</span>
          </button>

          {/* Settings API Key Action Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md shadow-sky-600/20 active:scale-95"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Pengaturan API</span>
          </button>
        </div>

      </div>
    </header>
  );
}
