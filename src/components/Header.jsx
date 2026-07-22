import React from 'react';
import { 
  Sprout, 
  RefreshCw, 
  Settings, 
  Code, 
  Wifi, 
  WifiOff, 
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';

export function Header({
  isMock,
  lastUpdated,
  isLoading,
  onRefresh,
  onOpenSettings,
  onOpenCodeModal,
  channelId
}) {
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    : '-';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 rounded-none mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20">
            <Sprout className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Soil Moisture Monitor
              </h1>
              {isMock ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <Sparkles className="w-3 h-3" /> DEMO MODE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Wifi className="w-3 h-3 animate-pulse" /> LIVE (CH: {channelId})
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium">
              ESP32 + 6x DFRobot Soil Moisture Sensors &bull; ThingSpeak IoT Cloud
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Last Update Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-400">Sync Terakhir:</span>
            <span className="font-mono font-semibold text-emerald-400">{formattedTime}</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-medium transition-all active:scale-95 disabled:opacity-50"
            title="Refresh Data Manual"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isLoading ? 'Memuat...' : 'Refresh'}</span>
          </button>

          {/* Arduino Code Button */}
          <button
            onClick={onOpenCodeModal}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-medium transition-all active:scale-95"
            title="Lihat Skema Wiring & Kode ESP32"
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Kode ESP32</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-emerald-600/20 active:scale-95"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Pengaturan API</span>
          </button>
        </div>

      </div>
    </header>
  );
}
