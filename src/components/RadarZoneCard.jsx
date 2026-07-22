import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { ShieldCheck } from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export function RadarZoneCard({ latestValues, sensorNames }) {
  const labels = sensorNames.map((name, i) => `Zone ${i + 1}`);
  const dataValues = latestValues.map((v) => (v !== null && !isNaN(v) ? Math.round(v) : 0));

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Kelembapan (%)',
        data: dataValues,
        backgroundColor: 'rgba(6, 182, 212, 0.25)',
        borderColor: '#06b6d4',
        borderWidth: 2,
        pointBackgroundColor: '#0284c7',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#0284c7',
        pointRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `Kelembapan: ${context.raw}%`
        }
      }
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(226, 232, 240, 0.8)'
        },
        grid: {
          color: 'rgba(226, 232, 240, 0.8)'
        },
        pointLabels: {
          color: '#475569',
          font: {
            size: 11,
            weight: '600'
          }
        },
        ticks: {
          display: false,
          stepSize: 20
        },
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div className="neo-card p-5 flex flex-col justify-between h-full min-h-[440px]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">
            Keseimbangan Zone
          </h3>
          <p className="text-xs text-slate-400">
            Sebaran 6 Sensor Lahan
          </p>
        </div>
        <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
          <ShieldCheck className="w-4 h-4" />
        </div>
      </div>

      <div className="flex-1 w-full relative min-h-[280px] my-2">
        <Radar data={chartData} options={options} />
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Cupan Lahan: <strong className="text-slate-700">6 Node ADC</strong></span>
        <span className="text-cyan-600 font-semibold bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-100">
          Radar Active
        </span>
      </div>
    </div>
  );
}
