import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { RiskBadge } from '../../components/common/RiskBadge';
import { MapPin, CheckCircle2, X, PlusCircle, ShieldCheck, RefreshCw, Send } from 'lucide-react';

interface VerificationCase {
  id: string;
  village: string;
  animal: string;
  farmer: string;
  symptoms: string[];
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  status: 'PENDING' | 'VERIFIED';
  verifiedNotes?: string;
  verifiedAt?: string;
}

const INITIAL_CASES: VerificationCase[] = [
  {
    id: 'CASE-2026-081',
    village: 'Kallanur Village',
    animal: 'Cow #TN-9821 (Dairy Cattle)',
    farmer: 'Murugan (Phone: +91 98421-22910)',
    symptoms: ['Acute Salivation', 'High Fever (104.2°F)', 'Oral Vesicular Lesions'],
    riskLevel: 'CRITICAL',
    riskScore: 84,
    status: 'PENDING',
  },
  {
    id: 'CASE-2026-085',
    village: 'Attur West Hamlet',
    animal: 'Buffalo #TN-7712',
    farmer: 'Kavitha R. (Phone: +91 94432-11094)',
    symptoms: ['Lameness in Hind Hoof', 'Milk Drop 40%'],
    riskLevel: 'HIGH',
    riskScore: 68,
    status: 'PENDING',
  },
];

export const FieldWorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<VerificationCase[]>(INITIAL_CASES);
  const [verifyingCase, setVerifyingCase] = useState<VerificationCase | null>(null);
  const [quickInspectOpen, setQuickInspectOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Verification form state
  const [rectalTemp, setRectalTemp] = useState('39.5');
  const [hoofLesions, setHoofLesions] = useState(true);
  const [mouthVesicles, setMouthVesicles] = useState(true);
  const [isolatedFromHerd, setIsolatedFromHerd] = useState(true);
  const [fieldNotes, setFieldNotes] = useState('Observed ruptured vesicle on interdigital space. Recommended isolation from village common watering pond.');

  // Quick Inspection form state
  const [inspectVillage, setInspectVillage] = useState('Kallanur');
  const [inspectAnimal, setInspectAnimal] = useState('Calf #TN-9904');
  const [inspectFinding, setInspectFinding] = useState('Normal appetite, body temperature 38.6°C, booster vaccine verified.');

  const handleSyncOffline = () => {
    setSyncStatus('Synchronizing offline cache with district server...');
    setTimeout(() => {
      setSyncStatus('All offline field observations synchronized successfully (HTTP 200).');
      setTimeout(() => setSyncStatus(null), 4000);
    }, 900);
  };

  const handleCompleteVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingCase) return;

    setCases((prev) =>
      prev.map((c) =>
        c.id === verifyingCase.id
          ? {
              ...c,
              status: 'VERIFIED',
              verifiedNotes: `Temp: ${rectalTemp}°C | Hoof: ${hoofLesions ? 'Yes' : 'No'} | Mouth: ${mouthVesicles ? 'Yes' : 'No'} | ${fieldNotes}`,
              verifiedAt: new Date().toLocaleTimeString(),
            }
          : c
      )
    );
    setVerifyingCase(null);
  };

  const handleAddQuickInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: VerificationCase = {
      id: `INSP-${Date.now().toString().slice(-4)}`,
      village: inspectVillage,
      animal: inspectAnimal,
      farmer: 'Routine Field Screen',
      symptoms: ['Routine Prophylactic Check'],
      riskLevel: 'LOW',
      riskScore: 12,
      status: 'VERIFIED',
      verifiedNotes: inspectFinding,
      verifiedAt: new Date().toLocaleTimeString(),
    };
    setCases((prev) => [newCase, ...prev]);
    setQuickInspectOpen(false);
  };

  const pendingCount = cases.filter((c) => c.status === 'PENDING').length;
  const verifiedCount = cases.filter((c) => c.status === 'VERIFIED').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Grassroots Para-Veterinary Worker
            </span>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Attur Block - 6 Assigned Villages
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Field Command: {user?.fullName}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Record on-field observations, verify offline submissions, and assist veterinarians with clinical investigation protocols.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setQuickInspectOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-semibold shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Rapid Inspection</span>
          </button>
          <button
            onClick={handleSyncOffline}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-emerald-400 font-medium transition"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" />
            <span>Sync Records</span>
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned Villages" value="6" subtitle="1,420 Livestock head" />
        <StatCard title="Reports Collected Today" value={8 + verifiedCount} subtitle={`${verifiedCount} Verified, ${pendingCount} Pending`} />
        <StatCard title="Pending Field Checks" value={pendingCount} subtitle="Immediate clinical check" />
        <StatCard title="Active Clusters in Block" value="1" badge={<RiskBadge level="HIGH" score={72} />} />
      </div>

      {/* Field Verification Queue */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Field Clinical Verification Queue</h3>
            <p className="text-xs text-slate-500">Para-vet ground confirmation on reported animal signs</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {pendingCount} Pending Action
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {cases.map((c) => (
            <div key={c.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-900">{c.village} - {c.animal}</span>
                  <RiskBadge level={c.riskLevel} score={c.riskScore} />
                  {c.status === 'VERIFIED' && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Field Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600">
                  Farmer: <strong className="text-slate-800">{c.farmer}</strong> &bull; Symptoms: {c.symptoms.join(', ')}
                </p>
                {c.verifiedNotes && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded border border-emerald-100 mt-1">
                    <strong>Verification Record:</strong> {c.verifiedNotes} ({c.verifiedAt})
                  </div>
                )}
              </div>

              <div className="shrink-0">
                {c.status === 'PENDING' ? (
                  <button
                    onClick={() => setVerifyingCase(c)}
                    className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition shadow-xs"
                  >
                    Start Verification
                  </button>
                ) : (
                  <button
                    onClick={() => setVerifyingCase(c)}
                    className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition border border-slate-200"
                  >
                    View / Edit Findings
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Field Verification Modal */}
      {verifyingCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Field Clinical Verification</h3>
                  <p className="text-xs text-slate-500">{verifyingCase.animal} &bull; {verifyingCase.village}</p>
                </div>
              </div>
              <button onClick={() => setVerifyingCase(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCompleteVerification} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-700 block">Farmer Description:</span>
                <span className="text-slate-900 font-medium">
                  {verifyingCase.farmer} reported {verifyingCase.symptoms.join(', ')}.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Rectal Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={rectalTemp}
                    onChange={(e) => setRectalTemp(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-medium"
                  />
                </div>
                <div className="space-y-2 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hoofLesions}
                      onChange={(e) => setHoofLesions(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-slate-700">Vesicles on Hoof / Coronet</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mouthVesicles}
                      onChange={(e) => setMouthVesicles(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-slate-700">Oral Drooling / Dental Lesions</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                  <input
                    type="checkbox"
                    checked={isolatedFromHerd}
                    onChange={(e) => setIsolatedFromHerd(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Animal physically quarantined from common village grazing</span>
                </label>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Field Observations & Para-Vet Notes
                </label>
                <textarea
                  rows={3}
                  value={fieldNotes}
                  onChange={(e) => setFieldNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                  placeholder="Record lesion characteristics, milk status, herd contact..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setVerifyingCase(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Verification & Escalate to Vet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: New Rapid Field Inspection Modal */}
      {quickInspectOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">New Rapid Field Inspection</h3>
              </div>
              <button onClick={() => setQuickInspectOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddQuickInspection} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Village / Location</label>
                <input
                  type="text"
                  value={inspectVillage}
                  onChange={(e) => setInspectVillage(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Livestock Tag / Subject</label>
                <input
                  type="text"
                  value={inspectAnimal}
                  onChange={(e) => setInspectAnimal(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inspection Findings</label>
                <textarea
                  rows={3}
                  value={inspectFinding}
                  onChange={(e) => setInspectFinding(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setQuickInspectOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Save Field Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
