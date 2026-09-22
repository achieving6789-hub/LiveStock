import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { RiskBadge } from '../../components/common/RiskBadge';
import { Download, ShieldAlert, CheckCircle2, X } from 'lucide-react';

export const StateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [quarantineModalOpen, setQuarantineModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [quarantineDistricts, setQuarantineDistricts] = useState('Salem - Erode Border Corridor');
  const [restrictionType, setRestrictionType] = useState('Livestock Transit Halt & Cattle Market Closure (14 Days)');

  const handleExportBulletin = () => {
    setSuccessToast('Generating Statewide Epidemiological Intelligence Bulletin (PDF)... Download initiated.');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleDeclareQuarantine = (e: React.FormEvent) => {
    e.preventDefault();
    setQuarantineModalOpen(false);
    setSuccessToast(`State Biosecurity Declaration issued for ${quarantineDistricts}. Directives broadcasted to District Magistrates.`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              State Epidemiological Surveillance
            </span>
            <span className="text-xs text-slate-500">Department of Animal Husbandry & Veterinary Services</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            State Command Center: {user?.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inter-district trend surveillance, regional early-warning models, and biological asset protection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportBulletin}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Bulletin</span>
          </button>
          <button
            onClick={() => setQuarantineModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-sm"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Declare Biosecurity Zone</span>
          </button>
        </div>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monitored Districts" value="38" subtitle="Tamil Nadu State" />
        <StatCard title="Active Suspected Clusters" value="5" badge={<RiskBadge level="HIGH" score={69} />} />
        <StatCard title="State Mortality Spike Flag" value="NORMAL" subtitle="No statistical aberration" />
        <StatCard title="State Vaccination Index" value="84.2%" subtitle="Annual prophylactic cycle" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">District Risk Ranking</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <th className="py-2.5 px-3">District</th>
              <th className="py-2.5 px-3">Active Reports</th>
              <th className="py-2.5 px-3">Suspected Clusters</th>
              <th className="py-2.5 px-3">Vaccination Coverage</th>
              <th className="py-2.5 px-3">Risk Assessment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-3 px-3 font-semibold text-slate-900">Salem</td>
              <td className="py-3 px-3">142</td>
              <td className="py-3 px-3 font-medium text-rose-600">2 Emerging</td>
              <td className="py-3 px-3">79.4%</td>
              <td className="py-3 px-3"><RiskBadge level="HIGH" score={74} /></td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-semibold text-slate-900">Erode</td>
              <td className="py-3 px-3">98</td>
              <td className="py-3 px-3 font-medium text-amber-600">1 Emerging</td>
              <td className="py-3 px-3">82.1%</td>
              <td className="py-3 px-3"><RiskBadge level="MODERATE" score={48} /></td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-semibold text-slate-900">Coimbatore</td>
              <td className="py-3 px-3">64</td>
              <td className="py-3 px-3 text-slate-400">0</td>
              <td className="py-3 px-3 text-emerald-600 font-semibold">91.3%</td>
              <td className="py-3 px-3"><RiskBadge level="LOW" score={18} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Quarantine Modal */}
      {quarantineModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">Declare Biosecurity Containment Zone</h3>
              </div>
              <button onClick={() => setQuarantineModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDeclareQuarantine} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target District / Corridor</label>
                <input
                  type="text"
                  value={quarantineDistricts}
                  onChange={(e) => setQuarantineDistricts(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quarantine Order Directive</label>
                <textarea
                  rows={3}
                  value={restrictionType}
                  onChange={(e) => setRestrictionType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuarantineModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                >
                  Issue State Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
