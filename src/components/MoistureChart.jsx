import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { BarChart3, TrendingUp, Filter, Sparkles } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BAR_COLORS = [
  '#0f172a',
  '#06b6d4',
  '#0f172a',
  '#06b6d4',
  '#0284c7',
  '#0f172a'
];

export function InflowBarChart({ feeds, sensorNames }) {
  const [filterMode, setFilterMode] = useState('inflow'); // 'inflow', 'sensors', 'average'

  // Extract recent timestamps (last 10 entries)
  const recentFeeds = feeds.slice(-10);
  const labels = recentFeeds.map((feed) => {
    const d = new Date(feed.created_at);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  });

  // Calculate average moisture per timestamp for the bar heights
  const avgData = recentFeeds.map((feed) => {
    const vals = [1, 2, 3, 4, 5, 6]
      .map((i) => parseFloat(feed[`field${i}`]))
      .filter((v) => !isNaN(v));
    return vals.length > 0 ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)) : 0;
  });

  // Latest average total
  const currentAvg = avgData.length > 0 ? avgData[avgData.length - 1] : 0;

  const barData = {
    labels: labels.length > 0 ? labels : ['00:00', '00:20', '00:40', '01:00', '01:20', '01:40'],
    datasets: [
      {
        label: 'Rata-Rata Kelembapan (%)',
        data: avgData.length > 0 ? avgData : [45, 52, 68, 58, 62, 70],
        backgroundColor: (context) => {
          const index = context.dataIndex;
          return index % 2 === 0 ? '#0f172a' : '#06b6d4';
        },
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 20
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `Kelembapan: ${ctx.raw}%`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11, weight: '500' } }
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div className="neo-card p-6 flex flex-col justify-between h-full min-h-[440px]">
      {/* Card Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Volume Kelembapan Lahan
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          {/* Pill Selector (Matching Top Inflow Filter Pills in reference image) */}
          <div className="flex items-center p-1 rounded-full bg-slate-100 border border-slate-200">
            <button
              onClick={() => setFilterMode('sensors')}
              className={`pill-btn ${filterMode === 'sensors' ? 'pill-btn-active' : 'pill-btn-inactive'}`}
            >
              Sensor
            </button>
            <button
              onClick={() => setFilterMode('inflow')}
              className={`pill-btn ${filterMode === 'inflow' ? 'pill-btn-active' : 'pill-btn-inactive'}`}
            >
              Inflow Air
            </button>
            <button
              onClick={() => setFilterMode('average')}
              className={`pill-btn ${filterMode === 'average' ? 'pill-btn-active' : 'pill-btn-inactive'}`}
            >
              Rata-Rata
            </button>
          </div>

          <div className="hidden lg:block text-right ml-4">
            <span className="text-xl font-extrabold text-slate-900 font-mono">
              {currentAvg}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Canvas */}
      <div className="flex-1 w-full relative min-h-[300px]">
        <Bar data={barData} options={options} />
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Sampling Rate: <strong className="text-slate-700">Setiap 20 Detik</strong></span>
        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Live ThingSpeak Feed
        </span>
      </div>
    </div>
  );
}

export function AreaCompareChart({ feeds, sensorNames }) {
  const [toggleZone, setToggleZone] = useState(true);

  // Extract feeds
  const recentFeeds = feeds.slice(-12);
  const labels = recentFeeds.map((f) => {
    const d = new Date(f.created_at);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  });

  // Zone A (Sensors 1-3) vs Zone B (Sensors 4-6)
  const zoneAData = recentFeeds.map((f) => {
    const v = [1, 2, 3].map((i) => parseFloat(f[`field${i}`])).filter((x) => !isNaN(x));
    return v.length > 0 ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : 0;
  });

  const zoneBData = recentFeeds.map((f) => {
    const v = [4, 5, 6].map((i) => parseFloat(f[`field${i}`])).filter((x) => !isNaN(x));
    return v.length > 0 ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : 0;
  });

  const chartData = {
    labels: labels.length > 0 ? labels : ['10:00', '10:20', '10:40', '11:00', '11:20', '11:40'],
    datasets: [
      {
        label: 'Zone Utara (GPIO 32,33,34)',
        data: zoneAData.length > 0 ? zoneAData : [30, 45, 55, 60, 58, 65],
        borderColor: '#06b6d4',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
          return gradient;
        },
        pointRadius: 3,
        pointBackgroundColor: '#06b6d4'
      },
      ...(toggleZone ? [{
        label: 'Zone Selatan (GPIO 35,25,26)',
        data: zoneBData.length > 0 ? zoneBData : [40, 50, 48, 62, 70, 75],
        borderColor: '#0284c7',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(2, 132, 199, 0.2)');
          gradient.addColorStop(1, 'rgba(2, 132, 199, 0)');
          return gradient;
        },
        pointRadius: 3,
        pointBackgroundColor: '#0284c7'
      }] : [])
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'start',
        labels: { boxWidth: 10, usePointStyle: true, font: { size: 11, weight: '600' } }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } } },
      y: { grid: { color: 'rgba(226, 232, 240, 0.6)' }, ticks: { color: '#94a3b8', font: { size: 10 } }, min: 0, max: 100 }
    }
  };

  return (
    <div className="neo-card p-5 flex flex-col justify-between h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-slate-800">
          Perbandingan Zone Lahan
        </h3>

        {/* Toggle Pill Switches (Matching Bottom Left Card Pill in reference image) */}
        <div className="flex items-center p-1 rounded-full bg-slate-100 border border-slate-200">
          <button
            onClick={() => setToggleZone(!toggleZone)}
            className={`pill-btn ${toggleZone ? 'pill-btn-active' : 'pill-btn-inactive'}`}
          >
            {toggleZone ? 'Semua Zone' : 'Single Zone'}
          </button>
        </div>
      </div>

      <div className="flex-1 w-full relative min-h-[220px] my-1">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
