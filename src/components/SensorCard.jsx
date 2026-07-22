import React from 'react';
import { 
  Sprout, 
  Cpu, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { getMoistureStatus } from '../services/thingspeak';

export function SensorCard({ index, sensorName, gpioPin, value, thresholds }) {
  const hasValue = value !== null && !isNaN(value);
  const numericVal = hasValue ? value : 0;
  const status = getMoistureStatus(numericVal, thresholds);

  // Status visual configurations
  let badgeColor = 'bg-sky-50 text-sky-600 border-sky-100';
  let progressColor = 'from-sky-500 to-cyan-400';

  if (status.code === 'DRY') {
    badgeColor = 'bg-amber-50 text-amber-600 border-amber-200';
    progressColor = 'from-amber-500 to-orange-400';
  } else if (status.code === 'WET') {
    badgeColor = 'bg-cyan-50 text-cyan-600 border-cyan-200';
    progressColor = 'from-cyan-500 to-blue-500';
  }

  return (
    <div className="neo-card p-5 flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200">
      
      {/* Header Info */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-700">
            <Sprout className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
              {sensorName.split('(')[0].trim()}
            </h4>
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-medium">
              <Cpu className="w-3 h-3 text-slate-400" />
              <span>ADC1 GPIO {gpioPin}</span>
            </div>
          </div>
        </div>

        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
          {status.label}
        </span>
      </div>

      {/* Numerical Value Display */}
      <div className="my-3 flex items-baseline justify-between">
        <div>
          <span className="text-3xl font-black text-slate-900 tracking-tight font-mono">
            {hasValue ? numericVal.toFixed(1) : '--'}
          </span>
          <span className="text-sm font-bold text-slate-400 ml-1">%</span>
        </div>

        <div className="text-right text-[11px] text-slate-400">
          Target Range: <br />
          <span className="font-semibold text-slate-600">{thresholds.dry}% - {thresholds.wet}%</span>
        </div>
      </div>

      {/* Moisture Level Progress Bar */}
      <div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all duration-500 ease-out`}
            style={{ width: `${Math.min(100, Math.max(0, numericVal))}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
          <span>Kering (0%)</span>
          <span>Sangat Basah (100%)</span>
        </div>
      </div>

    </div>
  );
}
