import React from 'react';
import { 
  Droplets, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Flame,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { getMoistureStatus } from '../services/thingspeak';

export function SummaryCards({ latestValues, thresholds }) {
  // Calculate average percentage across non-null values
  const validVals = latestValues.filter((v) => v !== null && !isNaN(v));
  const avg = validVals.length > 0
    ? (validVals.reduce((sum, val) => sum + val, 0) / validVals.length).toFixed(1)
    : 0;

  // Count dry sensors (< dry threshold)
  const drySensors = latestValues
    .map((val, idx) => ({ val, idx }))
    .filter(({ val }) => val !== null && val < thresholds.dry);

  // Count wet sensors (> wet threshold)
  const wetSensors = latestValues
    .map((val, idx) => ({ val, idx }))
    .filter(({ val }) => val !== null && val > thresholds.wet);

  const avgStatus = getMoistureStatus(parseFloat(avg), thresholds);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Rata-Rata Kelembapan */}
      <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-emerald-500">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Rata-Rata Kelembapan
          </span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Droplets className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {avg}<span className="text-lg font-medium text-slate-400 ml-1">%</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${avgStatus.badgeClass}`}>
            {avgStatus.code}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Dihitung dari {validVals.length} sensor aktif
        </p>
      </div>

      {/* 2. Perlunya Penyiraman (Dry Alert) */}
      <div className={`glass-card p-4 flex flex-col justify-between border-l-4 ${
        drySensors.length > 0 ? 'border-l-amber-500 bg-amber-500/5' : 'border-l-slate-700'
      }`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Butuh Penyiraman
          </span>
          <div className={`p-2 rounded-lg ${drySensors.length > 0 ? 'bg-amber-500/20 text-amber-400 animate-bounce' : 'bg-slate-800 text-slate-500'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {drySensors.length} <span className="text-sm font-normal text-slate-400">/ 6 Sensor</span>
          </div>
          {drySensors.length > 0 ? (
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
              🔴 Perlu Air
            </span>
          ) : (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              🟢 Lembap
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          {drySensors.length > 0 
            ? `Sensor ${drySensors.map(s => s.idx + 1).join(', ')} di bawah ${thresholds.dry}%`
            : 'Semua sensor kelembapan tercukupi'
          }
        </p>
      </div>

      {/* 3. Sensor Terhubung */}
      <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-cyan-500">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Status Hardware ESP32
          </span>
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold text-white tracking-tight">
            6 / 6 <span className="text-sm font-normal text-slate-400">Channel</span>
          </div>
          <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
            ADC1 Safe
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          GPIO 32, 33, 34, 35, 25, 26
        </p>
      </div>

      {/* 4. Status Kondisi Kebun */}
      <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-teal-500">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Kondisi Lahan
          </span>
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <div className="text-xl font-bold text-white tracking-tight">
            {drySensors.length === 0 ? 'Sangat Baik' : `${drySensors.length} Area Kering`}
          </div>
          <span className="text-xs font-semibold text-slate-300">
            {thresholds.dry}% - {thresholds.wet}%
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Target ambang batas kelembapan tanah
        </p>
      </div>

    </div>
  );
}
