import React, { useState, useEffect } from 'react';
import { X, Save, Key, Cpu, Sliders, RotateCcw, Check, Settings } from 'lucide-react';
import { DEFAULT_CONFIG } from '../services/thingspeak';

export function SettingsModal({ isOpen, onClose, config, onSaveConfig }) {
  const [formData, setFormData] = useState(config);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('api');

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

  const sections = [
    { id: 'api', label: 'API Key', icon: Key },
    { id: 'sensors', label: 'Label Sensor', icon: Cpu },
    { id: 'thresholds', label: 'Ambang Batas', icon: Sliders },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-slate-200 shadow-2xl"
        style={{ boxShadow: '0 25px 60px rgba(15,23,42,0.18)' }}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Pengaturan Dashboard</h2>
              <p className="text-[11px] text-slate-400">ThingSpeak API, Sensor Label & Ambang Batas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="px-6 pt-4 flex items-center space-x-2 border-b border-slate-100 pb-0">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all -mb-px ${
                activeSection === id
                  ? 'border-sky-600 text-sky-700'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Section 1: ThingSpeak API Credentials */}
          {activeSection === 'api' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
                <p className="text-xs text-sky-700 font-medium leading-relaxed">
                  🔑 Masukkan <strong>Channel ID</strong> dan <strong>Read API Key</strong> dari dashboard ThingSpeak Anda. 
                  Biarkan kosong untuk menjalankan Mode Simulasi Demo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Channel ID ThingSpeak
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 2489012"
                    value={formData.channelId}
                    onChange={(e) => setFormData({ ...formData, channelId: e.target.value.trim() })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Read API Key (Opsional – Channel Publik)
                  </label>
                  <input
                    type="password"
                    placeholder="Contoh: 9X8KABCDEF..."
                    value={formData.readApiKey}
                    onChange={(e) => setFormData({ ...formData, readApiKey: e.target.value.trim() })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-mono transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Jumlah Hasil Fetch (max 8000)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="8000"
                    value={formData.resultsCount}
                    onChange={(e) => setFormData({ ...formData, resultsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-mono transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Interval Auto-Refresh (detik, min 15)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="600"
                    value={formData.autoRefreshInterval}
                    onChange={(e) => setFormData({ ...formData, autoRefreshInterval: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-mono transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Sensor Renaming */}
          {activeSection === 'sensors' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-xs text-slate-600 font-medium">
                  📌 Sesuaikan label nama untuk setiap node sensor yang terhubung ke ESP32 GPIO ADC1.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.sensorNames.map((name, i) => (
                  <div key={i}>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      Sensor #{i + 1} — Field {i + 1} (GPIO {[32, 33, 34, 35, 25, 26][i]})
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleSensorNameChange(i, e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Thresholds */}
          {activeSection === 'thresholds' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <p className="text-xs text-amber-700 font-medium">
                  ⚠️ Sensor yang membaca nilai di bawah ambang <strong>Kering</strong> akan memicu notifikasi siram. 
                  Sesuaikan berdasarkan hasil kalibrasi sensor Anda.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Ambang Kering (%) → Siram!
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
                    className="w-full px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800 font-bold focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Di bawah {formData.thresholds.dry}% → Kering</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Ambang Sangat Basah (%)
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
                    className="w-full px-3 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sm text-sky-800 font-bold focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Di atas {formData.thresholds.wet}% → Sangat Basah</p>
                </div>
              </div>

              {/* Visual range preview */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-2">Preview Range Status:</p>
                <div className="relative w-full h-5 rounded-full overflow-hidden flex">
                  <div className="bg-amber-400 flex items-center justify-center text-[10px] font-bold text-white transition-all" style={{ width: `${formData.thresholds.dry}%` }}>
                    Kering
                  </div>
                  <div className="bg-sky-500 flex items-center justify-center text-[10px] font-bold text-white transition-all" style={{ width: `${formData.thresholds.wet - formData.thresholds.dry}%` }}>
                    Optimal
                  </div>
                  <div className="bg-cyan-400 flex-1 flex items-center justify-center text-[10px] font-bold text-white">
                    Basah
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>0%</span>
                  <span>{formData.thresholds.dry}%</span>
                  <span>{formData.thresholds.wet}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}

        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all active:scale-95"
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

      </div>
    </div>
  );
}
