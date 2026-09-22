import React from 'react';
import { RiskBadge } from '../../components/common/RiskBadge';

export const StateDistrictsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Inter-District Epidemiological Comparison</h1>
        <p className="text-xs text-slate-500">
          State-wide comparative metrics on report frequency, clusters, and vaccination coverage.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <th className="py-3 px-4">District</th>
              <th className="py-3 px-4">Active Reports</th>
              <th className="py-3 px-4">Suspected Clusters</th>
              <th className="py-3 px-4">Vaccination Index</th>
              <th className="py-3 px-4">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-3.5 px-4 font-bold text-slate-900">Salem</td>
              <td className="py-3.5 px-4">142</td>
              <td className="py-3.5 px-4 font-semibold text-rose-600">2 Emerging</td>
              <td className="py-3.5 px-4">79.4%</td>
              <td className="py-3.5 px-4"><RiskBadge level="HIGH" score={74} /></td>
            </tr>
            <tr>
              <td className="py-3.5 px-4 font-bold text-slate-900">Erode</td>
              <td className="py-3.5 px-4">98</td>
              <td className="py-3.5 px-4 font-semibold text-amber-600">1 Emerging</td>
              <td className="py-3.5 px-4">82.1%</td>
              <td className="py-3.5 px-4"><RiskBadge level="MODERATE" score={48} /></td>
            </tr>
            <tr>
              <td className="py-3.5 px-4 font-bold text-slate-900">Coimbatore</td>
              <td className="py-3.5 px-4">64</td>
              <td className="py-3.5 px-4 text-slate-400">0</td>
              <td className="py-3.5 px-4 text-emerald-600 font-bold">91.3%</td>
              <td className="py-3.5 px-4"><RiskBadge level="LOW" score={18} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
