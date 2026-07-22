import React, { useState } from 'react';
import { Table, Download, Search, Database, Clock } from 'lucide-react';
import { getMoistureStatus } from '../services/thingspeak';

export function DataTable({ feeds, sensorNames, thresholds }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Reverse feeds so newest is on top
  const sortedFeeds = [...feeds].reverse();

  // Filter feeds
  const filteredFeeds = sortedFeeds.filter((feed) => {
    const timeStr = new Date(feed.created_at).toLocaleString('id-ID');
    return timeStr.toLowerCase().includes(searchTerm.toLowerCase()) || String(feed.entry_id).includes(searchTerm);
  });

  const displayedFeeds = filteredFeeds.slice(0, rowsPerPage);

  // Export to CSV
  const handleExportCSV = () => {
    if (!feeds || feeds.length === 0) return;
    
    let csv = 'Entry ID,Waktu,' + sensorNames.map(n => `"${n}"`).join(',') + '\n';
    feeds.forEach((feed) => {
      const time = new Date(feed.created_at).toLocaleString('id-ID');
      const vals = [1, 2, 3, 4, 5, 6].map(i => feed[`field${i}`] || '');
      csv += `${feed.entry_id},"${time}",${vals.join(',')}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `soil_moisture_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="neo-card p-6 mb-8">
      
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-600" />
            Riwayat Log Telemetri 6 Sensor
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Menampilkan data mentah pengiriman dari ESP32 ke ThingSpeak IoT Server
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari waktu / ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 w-40 sm:w-48"
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold border border-sky-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Entry ID</th>
              <th className="py-3 px-4">Waktu Sync</th>
              {sensorNames.map((name, i) => (
                <th key={i} className="py-3 px-4">
                  {name.split('(')[0].trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
            {displayedFeeds.length > 0 ? (
              displayedFeeds.map((feed) => {
                const formattedTime = new Date(feed.created_at).toLocaleString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                });

                return (
                  <tr key={feed.entry_id} className="hover:bg-slate-50/80 transition-colors font-medium">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      #{feed.entry_id}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {formattedTime}
                    </td>
                    {[1, 2, 3, 4, 5, 6].map((fieldNum) => {
                      const rawVal = parseFloat(feed[`field${fieldNum}`]);
                      const hasVal = !isNaN(rawVal);
                      const status = hasVal ? getMoistureStatus(rawVal, thresholds) : null;

                      return (
                        <td key={fieldNum} className="py-3 px-4">
                          {hasVal ? (
                            <span className="inline-flex items-center gap-1 font-mono font-semibold text-slate-800">
                              {rawVal.toFixed(1)}%
                              <span className={`w-2 h-2 rounded-full ${
                                status.code === 'DRY' ? 'bg-amber-500' : status.code === 'WET' ? 'bg-cyan-500' : 'bg-sky-500'
                              }`} />
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Tidak ada data telemetri ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
        <span>Menampilkan {displayedFeeds.length} dari {filteredFeeds.length} log</span>
        <div className="flex items-center space-x-2">
          <span>Tampilkan:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value={10}>10 Baris</option>
            <option value={25}>25 Baris</option>
            <option value={50}>50 Baris</option>
          </select>
        </div>
      </div>

    </div>
  );
}
