import React from 'react';
import { Droplet, Cpu, Info, AlertCircle } from 'lucide-react';
import { getMoistureStatus } from '../services/thingspeak';

export function SensorCard({ 
  index, 
  value, 
  sensorName, 
  gpioPin, 
  thresholds 
}) {
  const moistureVal = value !== null && !isNaN(value) ? parseFloat(value) : null;
  const status = getMoistureStatus(moistureVal, thresholds);

  // Approximate ADC raw value based on Arduino sketch mapping:
  // map(raw, 3000, 1200, 0, 100) -> raw = 3000 - (percent * 18)
  const approxADC = moistureVal !== null
    ? Math.round(3000 - (moistureVal * 18))
    : 'N/A';

  // Gauge calculation for circular SVG arc
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const validPercent = moistureVal !== null ? Math.min(100, Math.max(0, moistureVal)) : 0;
  const strokeDashoffset = circumference - (validPercent / 100) * circumference;

  return (
    <div className={`glass-card p-5 relative overflow-hidden flex flex-col justify-between border transition-all duration-300 ${status.borderClass}`}>
      
      {/* Background Subtle Glow */}
      <div 
        className="absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: status.gaugeColor }}
      />

      {/* Card Top Info */}
      <div>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700">
                #{index + 1}
              </span>
              <h3 className="text-sm font-bold text-white tracking-wide truncate max-w-[140px] sm:max-w-[170px]" title={sensorName}>
                {sensorName}
              </h3>
            </div>
            <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-mono bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-800">
                <Cpu className="w-3 h-3 text-cyan-400" /> GPIO {gpioPin}
              </span>
              <span>&bull;</span>
              <span>ADC: ~{approxADC}</span>
            </div>
          </div>

          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${status.badgeClass}`}>
            {moistureVal !== null ? `${moistureVal}%` : 'Offline'}
          </span>
        </div>

        {/* Circular Gauge Centerpiece */}
        <div className="relative my-4 flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90">
            {/* Background Track Circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800/80"
              fill="transparent"
            />
            {/* Foreground Arc */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke={status.gaugeColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Value Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <Droplet className={`w-5 h-5 mb-0.5 ${status.colorClass}`} />
            <span className="text-2xl font-black text-white tracking-tight">
              {moistureVal !== null ? moistureVal.toFixed(1) : '--'}
              <span className="text-xs text-slate-400 font-normal">%</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Kelembapan
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar & Indicator */}
      <div className="mt-2 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <span 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: status.gaugeColor }}
          />
          <span className={`text-xs font-semibold ${status.colorClass}`}>
            {status.label}
          </span>
        </div>

        {moistureVal < thresholds.dry && (
          <span className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" /> Siram!
          </span>
        )}
      </div>

    </div>
  );
}
