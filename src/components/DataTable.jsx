import React, { useState } from 'react';
import { Table, Download, Search, Filter } from 'lucide-react';
import { getMoistureStatus } from '../services/thingspeak';

export function DataTable({ feeds, sensorNames, thresholds }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Export current feeds to CSV
  const handleExportCSV = () => {
    if (!feeds || feeds.length === 0) return;

    const headers = ['Entry ID', 'Timestamp (ISO)', ...sensorNames];
    const csvRows = [headers.join(',')];

    feeds.forEach((feed) => {
      const row = [
        feed.entry_id || '',
        `"${feed.created_at || ''}"`,
        feed.field1 || '',
        feed.field2 || '',
        feed.field3 || '',
        feed.field4 || '',
        feed.field5 || '',
        feed.field6 || ''
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `soil_moisture_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredFeeds = feeds.filter((f) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const dateStr = f.created_at ? new Date(f.created_at).toLocaleString('id-ID').toLowerCase() : '';
    return dateStr.includes(term) || String(f.entry_id).includes(term);
  });

  return (
    <div className="glass-panel p-5 mb-6">
      
      {/* Table Top Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-cyan-400" />
            Tabel Log Telemetri Data
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar sampel kelembapan tanah yang diterima dari ThingSpeak API
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari timestamp/ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44"
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-xs font-semibold transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-300 font-semibold border-b border-slate-800 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Entry ID</th>
              <th className="py-3 px-4">Waktu</th>
              {sensorNames.map((name, i) => (
                <th key={i} className="py-3 px-3 text-center">
                  S{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
            {filteredFeeds.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                  Tidak ada data telemetri ditemukan.
                </td>
              </tr>
            ) : (
              filteredFeeds.slice().reverse().slice(0, 15).map((feed, idx) => (
                <tr key={feed.entry_id || idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-400">
                    #{feed.entry_id}
                  </td>
                  <td className="py-2.5 px-4 font-sans text-slate-300 whitespace-nowrap">
                    {feed.created_at ? new Date(feed.created_at).toLocaleString('id-ID') : '-'}
                  </td>
                  {[1, 2, 3, 4, 5, 6].map((num) => {
                    const val = parseFloat(feed[`field${num}`]);
                    const st = getMoistureStatus(val, thresholds);
                    return (
                      <td key={num} className="py-2.5 px-3 text-center">
                        {!isNaN(val) ? (
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${st.badgeClass}`}>
                            {val.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-500 mt-2">
        * Menampilkan 15 entry log terbaru dari total {filteredFeeds.length} data.
      </p>

    </div>
  );
}
