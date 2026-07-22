import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { PieChart, Layers, Droplets, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getMoistureStatus } from '../services/thingspeak';

ChartJS.register(ArcElement, Tooltip, Legend);

export function DonutConditionCard({ latestValues, thresholds }) {
  // Count sensors by status category
  let optimalCount = 0;
  let dryCount = 0;
  let wetCount = 0;

  latestValues.forEach((val) => {
    if (val === null || isNaN(val)) return;
    const status = getMoistureStatus(val, thresholds);
    if (status.code === 'DRY') dryCount++;
    else if (status.code === 'WET') wetCount++;
    else optimalCount++;
  });

  const totalSensors = latestValues.filter(v => v !== null && !isNaN(v)).length || 6;

  const data = {
    labels: ['Lembap / Optimal', 'Kering (Butuh Air)', 'Sangat Basah'],
    datasets: [
      {
        data: [optimalCount, dryCount, wetCount],
        backgroundColor: ['#0284c7', '#f59e0b', '#06b6d4'],
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} Sensor`
        }
      }
    }
  };

  const optimalPct = Math.round((optimalCount / totalSensors) * 100);
  const dryPct = Math.round((dryCount / totalSensors) * 100);

  return (
    <div className="neo-card p-5 flex flex-col justify-between h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-slate-800">
          Kondisi Lahan Kebun
        </h3>
        <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
          <PieChart className="w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center my-2">
        {/* Donut with Center Text */}
        <div className="relative h-44 w-full flex items-center justify-center">
          <Doughnut data={data} options={options} />
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-xl font-extrabold text-slate-900">{optimalPct}%</span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Optimal</span>
          </div>
        </div>

        {/* Side Metrics & Legend */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span> Lembap Optimal
              </span>
              <span className="text-slate-900">{optimalPct}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-600 h-full rounded-full" style={{ width: `${optimalPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Perlu Air (Kering)
              </span>
              <span className="text-slate-900">{dryPct}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${dryPct}%` }} />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Total Sensor Active</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
              {totalSensors} Node
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DonutSensorsCard({ latestValues, sensorNames }) {
  const dataValues = latestValues.map(v => (v !== null && !isNaN(v) ? Math.round(v) : 0));
  const colors = ['#0f172a', '#0284c7', '#06b6d4', '#38bdf8', '#64748b', '#94a3b8'];

  const data = {
    labels: sensorNames.map(s => s.split('(')[0].trim()),
    datasets: [
      {
        data: dataValues,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`
        }
      }
    }
  };

  const validVals = latestValues.filter(v => v !== null && !isNaN(v));
  const avg = validVals.length > 0 ? (validVals.reduce((a, b) => a + b, 0) / validVals.length).toFixed(1) : '0';

  return (
    <div className="neo-card p-5 flex flex-col justify-between h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-slate-800">
          Distribusi Kelembapan
        </h3>
        <span className="text-xs font-semibold text-slate-400">Per Sensor</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center my-2">
        {/* Donut with Center Average */}
        <div className="relative h-44 w-full flex items-center justify-center">
          <Doughnut data={data} options={options} />
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-lg font-black text-slate-900">{avg}%</span>
            <span className="text-[10px] font-medium text-slate-400">Rata-Rata</span>
          </div>
        </div>

        {/* Sensor Breakdown List (Matching right card list in reference photo) */}
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {sensorNames.map((name, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[i] }}></span>
                <span className="font-medium text-slate-600">{name.split('(')[0].trim()}</span>
              </div>
              <span className="font-mono font-bold text-slate-900">
                {latestValues[i] !== null ? `${latestValues[i].toFixed(0)}%` : '-'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
