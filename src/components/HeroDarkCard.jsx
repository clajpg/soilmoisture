import React from 'react';
import { 
  Droplets, 
  User, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Sprout, 
  Activity, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { getMoistureStatus } from '../services/thingspeak';

export function HeroDarkCard({ latestValues, thresholds, sensorNames }) {
  // Calculate valid average
  const validVals = latestValues.filter((v) => v !== null && !isNaN(v));
  const avg = validVals.length > 0
    ? (validVals.reduce((sum, val) => sum + val, 0) / validVals.length).toFixed(1)
    : '0';

  const numericAvg = parseFloat(avg);
  const avgStatus = getMoistureStatus(numericAvg, thresholds);

  // Target threshold calculation percentage (between 0% and 100%)
  const targetPct = Math.min(100, Math.max(0, Math.round(numericAvg)));

  // Display top 4 sensors in the mini list
  const miniSensorsList = sensorNames.slice(0, 4).map((name, idx) => {
    const val = latestValues[idx] !== null && !isNaN(latestValues[idx]) ? latestValues[idx] : 0;
    const status = getMoistureStatus(val, thresholds);
    return {
      name: name.split('(')[0].trim(),
      pin: `Pin ${[32, 33, 34, 35][idx]}`,
      val: val.toFixed(1),
      status
    };
  });

  return (
    <div className="hero-dark-card p-6 flex flex-col justify-between h-full min-h-[440px]">
      
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">
              Total Rata-Rata
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-1.5 mt-0.5">
              {avg}<span className="text-base font-normal text-cyan-400">%</span>
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <div className="p-2.5 rounded-full bg-slate-800/90 border border-slate-700 text-cyan-400">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Total Flow / Sparkline Sub-box */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Status Lahan Utama</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full text-[11px]">
              <TrendingUp className="w-3 h-3" /> Optimal
            </span>
          </div>

          {/* Mini Wave SVG Sparkline */}
          <div className="h-9 w-full flex items-end my-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 30" fill="none">
              <defs>
                <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,20 Q20,10 40,18 T80,12 T120,22 T160,8 T200,15"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />
              <path
                d="M0,20 Q20,10 40,18 T80,12 T120,22 T160,8 T200,15 L200,30 L0,30 Z"
                fill="url(#heroGradient)"
              />
              <circle cx="160" cy="8" r="4" fill="#06b6d4" className="animate-ping" />
              <circle cx="160" cy="8" r="3" fill="#ffffff" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
            <span>Ambang Ideal: {thresholds.dry}% - {thresholds.wet}%</span>
            <span className="text-cyan-300 font-bold">{avgStatus.label}</span>
          </div>
        </div>

        {/* Target Range Progress Bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
            <span className="flex items-center gap-1">
              Target Kelembapan
            </span>
            <span className="text-cyan-400">{targetPct}% / 100%</span>
          </div>
          <div className="w-full bg-slate-800/90 h-2.5 rounded-full overflow-hidden p-0.5">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-sky-400 h-full rounded-full transition-all duration-700 ease-out shadow-sm shadow-cyan-500/50"
              style={{ width: `${targetPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mini List of Individual Sensors (Matching bottom part of Left Card in reference image) */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
          <span>Ringkasan Node Sensor</span>
          <span className="text-[11px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-800/40">
            4 / 6 Active
          </span>
        </div>

        <div className="space-y-2.5">
          {miniSensorsList.map((s, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                  <Sprout className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200">{s.name}</div>
                  <div className="text-[10px] text-slate-400">{s.pin}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono font-bold text-white">{s.val}%</div>
                <span className={`text-[10px] font-semibold ${s.status.textClass}`}>
                  {s.status.code}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
