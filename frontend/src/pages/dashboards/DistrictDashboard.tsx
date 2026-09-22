import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { RiskBadge } from '../../components/common/RiskBadge';
import { ShieldCheck, MapPin, Syringe, Ambulance, CheckCircle2, X } from 'lucide-react';

import { GISSurveillanceMap } from '../../components/common/GISSurveillanceMap';

export const DistrictDashboard: React.FC = () => {
  const { user } = useAuth();
  const [vaccineModalOpen, setVaccineModalOpen] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [ringTarget, setRingTarget] = useState('Attur Block (5km Ring)');
  const [doses, setDoses] = useState('2500');
  const [deployTeam, setDeployTeam] = useState('Mobile Veterinary Unit #3 (Salem Central)');

  const handleIssueVaccination = (e: React.FormEvent) => {
    e.preventDefault();
    setVaccineModalOpen(false);
    setSuccessToast(`Ring-Vaccination Directive authorized: ${doses} doses mobilized for ${ringTarget}.`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const handleDeployTeam = (e: React.FormEvent) => {
    e.preventDefault();
    setDeployModalOpen(false);
    setSuccessToast(`${deployTeam} deployed to Cluster #CL-SLM-001 (Attur-Omalur Belt).`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
              District Surveillance Command
            </span>
            <span className="text-xs text-slate-500">Salem District Animal Husbandry Office</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            District Command: {user?.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated block-level indicators, mortality detection, and veterinary deployment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVaccineModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm"
          >
            <Syringe className="w-4 h-4" />
            <span>Issue Ring-Vaccination Directive</span>
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
        <StatCard title="Monitored Villages" value="384" subtitle="Across 20 Blocks" icon={<MapPin className="w-4 h-4 text-slate-500" />} />
        <StatCard title="Reports (Last 7 Days)" value="142" trend={{ value: '+18%', isPositive: false, label: 'vs last week' }} />
        <StatCard title="Suspected Emerging Clusters" value="2" badge={<RiskBadge level="HIGH" score={74} />} />
        <StatCard title="Vaccination Coverage" value="79.4%" subtitle="Target: 85%" icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />} />
      </div>

      {/* Spatial Hotspot Map & Summary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">District Geospatial Surveillance Map</h3>
          <span className="text-xs text-slate-500">Live PostGIS Cluster Rings & Reports</span>
        </div>
        <GISSurveillanceMap centerLat={11.5985} centerLng={78.5991} zoom={11} height="360px" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Suspected Emerging Clusters</h3>
            <span className="text-xs text-slate-500">PostGIS Spatio-Temporal Query</span>
          </div>
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">Cluster #CL-SLM-001 (Attur-Omalur Belt)</span>
                <RiskBadge level="CRITICAL" score={84} />
              </div>
              <p className="text-xs text-slate-600">
                4 villages affected within 6.2 km radius &bull; 9 reported cases &bull; 2 acute deaths
              </p>
              <div className="text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-rose-100">
                <span>Suspected Profile: Foot-and-Mouth Disease (Vesicular)</span>
                <button
                  onClick={() => setDeployModalOpen(true)}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold transition flex items-center gap-1 self-start sm:self-auto"
                >
                  <Ambulance className="w-3 h-3" />
                  <span>Deploy Response Unit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Vaccination Coverage Gaps</h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100">
              <span className="font-medium text-slate-800">Attur Block</span>
              <span className="text-rose-600 font-bold">64.2% (Deficit: 20.8%)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100">
              <span className="font-medium text-slate-800">Bhavani Block</span>
              <span className="text-amber-600 font-bold">76.8% (Deficit: 8.2%)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-100">
              <span className="font-medium text-slate-800">Omalur Block</span>
              <span className="text-emerald-600 font-bold">88.1% (Above Target)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vaccination Directive Modal */}
      {vaccineModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Syringe className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Issue Ring-Vaccination Directive</h3>
              </div>
              <button onClick={() => setVaccineModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIssueVaccination} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Surveillance Zone</label>
                <input
                  type="text"
                  value={ringTarget}
                  onChange={(e) => setRingTarget(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vaccine Doses to Mobilize</label>
                <input
                  type="number"
                  value={doses}
                  onChange={(e) => setDoses(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVaccineModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Issue Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deploy Unit Modal */}
      {deployModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Ambulance className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-sm text-slate-900">Deploy Rapid Veterinary Response</h3>
              </div>
              <button onClick={() => setDeployModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDeployTeam} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Cluster</label>
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 font-bold">
                  Cluster #CL-SLM-001 (Attur-Omalur Belt, 4 Villages)
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Veterinary Unit</label>
                <input
                  type="text"
                  value={deployTeam}
                  onChange={(e) => setDeployTeam(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeployModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold"
                >
                  Confirm Deployment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
