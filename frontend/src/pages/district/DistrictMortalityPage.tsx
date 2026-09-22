import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export const DistrictMortalityPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    api.get('/mortality')
      .then((res) => setReports(res.data.data.reports || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">District Mortality Surveillance</h1>
        <p className="text-xs text-slate-500">
          Track acute livestock death events across all blocks to detect statistical aberrations early.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <th className="py-3 px-4">Record ID</th>
              <th className="py-3 px-4">Species</th>
              <th className="py-3 px-4">Deaths</th>
              <th className="py-3 px-4">Suspected Cause</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{m.id}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{m.species}</td>
                <td className="py-3.5 px-4 font-bold text-rose-600">{m.numberOfDeaths}</td>
                <td className="py-3.5 px-4 text-slate-600">{m.suspectedCause}</td>
                <td className="py-3.5 px-4 text-slate-400">{m.dateOfDeath}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
