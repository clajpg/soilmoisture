import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { LineChart, Calendar, Sliders } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SENSOR_COLORS = [
  { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.08)' }, // Sensor 1 Emerald
  { stroke: '#06b6d4', fill: 'rgba(6, 182, 212, 0.08)' },  // Sensor 2 Cyan
  { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.08)' }, // Sensor 3 Blue
  { stroke: '#a855f7', fill: 'rgba(168, 85, 247, 0.08)' }, // Sensor 4 Purple
  { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.08)' }, // Sensor 5 Amber
  { stroke: '#ec4899', fill: 'rgba(236, 72, 153, 0.08)' }  // Sensor 6 Pink
];

export function MoistureChart({ feeds, sensorNames, thresholds }) {
  const [selectedSensors, setSelectedSensors] = useState([true, true, true, true, true, true]);

  // Extract timestamps for X axis
  const labels = feeds.map((feed) => {
    if (!feed.created_at) return '';
    const d = new Date(feed.created_at);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  const toggleSensor = (index) => {
    const updated = [...selectedSensors];
    updated[index] = !updated[index];
    setSelectedSensors(updated);
  };

  const datasets = sensorNames
    .map((name, idx) => {
      if (!selectedSensors[idx]) return null;
      const data = feeds.map((f) => {
        const val = parseFloat(f[`field${idx + 1}`]);
        return isNaN(val) ? null : val;
      });

      return {
        label: name,
        data: data,
        borderColor: SENSOR_COLORS[idx].stroke,
        backgroundColor: SENSOR_COLORS[idx].fill,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: feeds.length > 40 ? 1 : 3,
        pointHoverRadius: 6,
        fill: false
      };
    })
    .filter(Boolean);

  const chartData = {
    labels,
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Using custom sensor toggle buttons below
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        usePointStyle: true,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}%`
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)'
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 }
        }
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          callback: (val) => `${val}%`
        }
      }
    }
  };

  return (
    <div className="glass-panel p-5 mb-6">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <LineChart className="w-5 h-5 text-emerald-400" />
            Grafik Riwayat Kelembapan (6 Sensor)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tren kelembapan tanah real-time dari data feed ThingSpeak
          </p>
        </div>

        {/* Legend Threshold Markers */}
        <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-400 rounded-full"></span>
            <span>Kering (&lt;{thresholds.dry}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-cyan-400 rounded-full"></span>
            <span>Sangat Basah (&gt;{thresholds.wet}%)</span>
          </div>
        </div>
      </div>

      {/* Sensor Toggle Checkboxes */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sensorNames.map((name, idx) => (
          <button
            key={idx}
            onClick={() => toggleSensor(idx)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
              selectedSensors[idx]
                ? 'bg-slate-800 text-slate-100 border-slate-700 shadow-sm'
                : 'bg-slate-900/40 text-slate-500 border-slate-800 line-through opacity-60'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: SENSOR_COLORS[idx].stroke }}
            />
            <span className="truncate max-w-[120px]">{name}</span>
          </button>
        ))}
      </div>

      {/* Chart Canvas Area */}
      <div className="h-72 w-full relative">
        {feeds.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
            Memuat data tren...
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>

    </div>
  );
}
