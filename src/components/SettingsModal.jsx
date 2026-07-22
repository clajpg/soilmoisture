import React, { useState, useEffect } from 'react';
import { X, Save, Key, Cpu, Sliders, RotateCcw, Check, Sparkles } from 'lucide-react';
import { DEFAULT_CONFIG } from '../services/thingspeak';

export function SettingsModal({ isOpen, onClose, config, onSaveConfig }) {
  const [formData, setFormData] = useState(config);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSensorNameChange = (index, value) => {
    const updated = [...formData.sensorNames];
    updated[index] = value;
    setFormData({ ...formData, sensorNames: updated });
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setFormData(DEFAULT_CONFIG);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-700 shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Pengaturan ThingSpeak & Sensor</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto">
          
          {/* Section 1: ThingSpeak Credentials */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <Key className="w-4 h-4" /> Kredensial ThingSpeak REST API
              </h3>
              <span className="text-[11px] text-slate-400">Kosongkan ID untuk Demo Mode</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Channel ID ThingSpeak
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 2489012"
                  value={formData.channelId}
                  onChange={(e) => setFormData({ ...formData, channelId: e.target.value.trim() })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Read API Key (Optional jika Publik)
                </label>
                <input
                  type="password"
                  placeholder="Contoh: 9X8K..."
                  value={formData.readApiKey}
                  onChange={(e) => setFormData({ ...formData, readApiKey: e.target.value.trim() })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Sensor Renaming */}
          <div className="space-y-4">
            <div className="border-b border-slate-800/80 pb-2">
              <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Label & Nama 6 Sensor
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.sensorNames.map((name, i) => (
                <div key={i}>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Sensor #{i + 1} (Field {i + 1})
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleSensorNameChange(i, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Thresholds */}
          <div className="space-y-4">
            <div className="border-b border-slate-800/80 pb-2">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Sliders className="w-4 h-4" /> Ambang Batas Status Kelembapan (%)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Batas Kering (&lt; %) &rarr; Siram!
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={formData.thresholds.dry}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      thresholds: { ...formData.thresholds, dry: Number(e.target.value) }
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Batas Sangat Basah (&gt; %)
                </label>
                <input
                  type="number"
                  min="50"
                  max="95"
                  value={formData.thresholds.wet}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      thresholds: { ...formData.thresholds, wet: Number(e.target.value) }
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>

              <button
                type="submit"
                className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
