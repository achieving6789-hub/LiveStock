import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { FlaskConical, CheckCircle2, Clock, AlertCircle, PlusCircle, X, Check, Send, FileCheck } from 'lucide-react';

interface LabSample {
  id: string;
  sampleCode: string;
  caseId: string;
  animal: string;
  sampleType: string;
  transportCondition: string;
  assayTarget: string;
  status: 'IN_TRANSIT' | 'RECEIVED' | 'TESTING' | 'VALIDATED';
  result?: {
    assay: string;
    ctValue?: string;
    outcome: 'POSITIVE' | 'NEGATIVE' | 'INCONCLUSIVE';
    notes?: string;
    validatedAt?: string;
  };
}

const INITIAL_SAMPLES: LabSample[] = [
  {
    id: 'smp-1',
    sampleCode: 'SMP-2026-0042',
    caseId: 'CASE-2026-081',
    animal: 'Cow #TN-9821 (Kallanur)',
    sampleType: 'Vesicular Fluid & Tongue Epithelium',
    transportCondition: 'Cold Chain (4°C) - Verified',
    assayTarget: 'FMDV Multiplex RT-PCR',
    status: 'TESTING',
  },
  {
    id: 'smp-2',
    sampleCode: 'SMP-2026-0043',
    caseId: 'CASE-2026-085',
    animal: 'Buffalo #TN-7712 (Attur)',
    sampleType: 'Whole Blood (EDTA) & Nasal Swab',
    transportCondition: 'Cold Chain (4°C) - In Transit',
    assayTarget: 'Hemorrhagic Septicemia (HS) PCR',
    status: 'IN_TRANSIT',
  },
];

export const LabDashboard: React.FC = () => {
  const { user } = useAuth();
  const [samples, setSamples] = useState<LabSample[]>(INITIAL_SAMPLES);
  const [activeSampleForResults, setActiveSampleForResults] = useState<LabSample | null>(null);
  const [accessionModalOpen, setAccessionModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states for entering results
  const [assayMethod, setAssayMethod] = useState('Real-Time RT-PCR (TaqMan)');
  const [ctValue, setCtValue] = useState('21.4');
  const [outcome, setOutcome] = useState<'POSITIVE' | 'NEGATIVE' | 'INCONCLUSIVE'>('POSITIVE');
  const [serotype, setSerotype] = useState('Serotype O (Ind-2001 lineage)');
  const [labNotes, setLabNotes] = useState('Strong exponential amplification curve detected. High viral load in tongue vesicular epithelium.');

  // Accession modal states
  const [accessionCase, setAccessionCase] = useState('CASE-2026-090');
  const [accessionAnimal, setAccessionAnimal] = useState('Goat #TN-3319 (Omalur)');
  const [accessionType, setAccessionType] = useState('Oral Swab & Serum');
  const [coolerTemp, setCoolerTemp] = useState('3.8');

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSampleForResults) return;

    setSamples((prev) =>
      prev.map((s) =>
        s.id === activeSampleForResults.id
          ? {
              ...s,
              status: 'VALIDATED',
              result: {
                assay: assayMethod,
                ctValue: ctValue,
                outcome,
                notes: `${serotype} - ${labNotes}`,
                validatedAt: new Date().toLocaleTimeString(),
              },
            }
          : s
      )
    );

    const code = activeSampleForResults.sampleCode;
    setActiveSampleForResults(null);
    setSuccessToast(`Sample ${code} verified as ${outcome}! Confirmation logged into AI early-warning surveillance loop.`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const handleAccessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSample: LabSample = {
      id: `smp-${Date.now()}`,
      sampleCode: `SMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      caseId: accessionCase,
      animal: accessionAnimal,
      sampleType: accessionType,
      transportCondition: `Cold Chain (${coolerTemp}°C) - Accessioned`,
      assayTarget: 'PPR Antigen Detection ELISA',
      status: 'RECEIVED',
    };
    setSamples((prev) => [newSample, ...prev]);
    setAccessionModalOpen(false);
    setSuccessToast(`New sample ${newSample.sampleCode} accessioned and routed to virology bench.`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const validatedCount = samples.filter((s) => s.status === 'VALIDATED').length;
  const testingCount = samples.filter((s) => s.status === 'TESTING').length;
  const inTransitCount = samples.filter((s) => s.status === 'IN_TRANSIT').length;
  const receivedCount = samples.filter((s) => s.status === 'RECEIVED').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              Diagnostic Laboratory Workflow
            </span>
            <span className="text-xs text-slate-500">Regional Animal Disease Diagnostic Lab (RADDL)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            Laboratory Portal: {user?.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Accept samples, log real-time assay results, and validate diagnostic confirmations into the AI loop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAccessionModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Accession Incoming Cooler</span>
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
        <StatCard title="Samples In Transit" value={inTransitCount} subtitle="Expected within 6h" icon={<Clock className="w-4 h-4 text-amber-500" />} />
        <StatCard title="Samples Received" value={receivedCount + 2} subtitle="Accession logged" icon={<FlaskConical className="w-4 h-4 text-purple-600" />} />
        <StatCard title="Assays in Progress" value={testingCount} subtitle="RT-PCR / ELISA running" icon={<AlertCircle className="w-4 h-4 text-blue-500" />} />
        <StatCard title="Validated Assays" value={19 + validatedCount} subtitle="Closed-loop verified" icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />} />
      </div>

      {/* Lab Samples Workflow Queue */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Laboratory Diagnostic Queue</h3>
            <p className="text-xs text-slate-500">Chain of Custody, Assay Verification & Confirmatory Reporting</p>
          </div>
          <span className="text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full font-semibold border border-purple-200">
            {samples.length} Active Specimens
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Sample Code</th>
                <th className="py-3 px-4">Case & Animal</th>
                <th className="py-3 px-4">Sample Type</th>
                <th className="py-3 px-4">Transport Condition</th>
                <th className="py-3 px-4">Assay Target</th>
                <th className="py-3 px-4">Workflow Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {samples.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{s.sampleCode}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{s.caseId}</div>
                    <div className="text-[11px] text-slate-500">{s.animal}</div>
                  </td>
                  <td className="py-3.5 px-4">{s.sampleType}</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-medium">{s.transportCondition}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{s.assayTarget}</td>
                  <td className="py-3.5 px-4">
                    {s.status === 'VALIDATED' ? (
                      <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                        <Check className="w-3 h-3" /> {s.result?.outcome}
                      </span>
                    ) : s.status === 'TESTING' ? (
                      <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-blue-100 text-blue-800">
                        TESTING
                      </span>
                    ) : s.status === 'RECEIVED' ? (
                      <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-amber-100 text-amber-800">
                        RECEIVED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-slate-100 text-slate-700">
                        IN TRANSIT
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    {s.status === 'VALIDATED' ? (
                      <button
                        onClick={() => setActiveSampleForResults(s)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition border border-slate-200"
                      >
                        View Certificate
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveSampleForResults(s)}
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold transition shadow-xs"
                      >
                        Enter Results
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Enter Results Modal */}
      {activeSampleForResults && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Diagnostic Assay Result Entry</h3>
                  <p className="text-xs text-slate-500 font-mono">{activeSampleForResults.sampleCode} &bull; {activeSampleForResults.caseId}</p>
                </div>
              </div>
              <button onClick={() => setActiveSampleForResults(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveResult} className="space-y-4 text-xs">
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-purple-900">
                <span className="font-semibold block">Sample Subject:</span>
                <span className="font-bold">{activeSampleForResults.animal}</span>
                <div className="text-[11px] text-purple-700 mt-1">Specimen: {activeSampleForResults.sampleType}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assay Technique</label>
                <select
                  value={assayMethod}
                  onChange={(e) => setAssayMethod(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Real-Time RT-PCR (TaqMan)">Real-Time RT-PCR (TaqMan)</option>
                  <option value="Antigen-Capture Sandwich ELISA">Antigen-Capture Sandwich ELISA</option>
                  <option value="Lateral Flow Rapid Immunochromatography">Lateral Flow Rapid Immunochromatography</option>
                  <option value="Direct Microscopic Smear Exam">Direct Microscopic Smear Exam</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Diagnostic Outcome</label>
                  <select
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-bold bg-white"
                  >
                    <option value="POSITIVE">POSITIVE (+)</option>
                    <option value="NEGATIVE">NEGATIVE (-)</option>
                    <option value="INCONCLUSIVE">INCONCLUSIVE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ct / Threshold Value</label>
                  <input
                    type="text"
                    value={ctValue}
                    onChange={(e) => setCtValue(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    placeholder="e.g. 21.4"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirmed Pathogen / Serotype</label>
                <input
                  type="text"
                  value={serotype}
                  onChange={(e) => setSerotype(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  placeholder="e.g. FMDV Serotype O"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bench Technologist Observations</label>
                <textarea
                  rows={3}
                  value={labNotes}
                  onChange={(e) => setLabNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveSampleForResults(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Certify & Transmit to AI Loop</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Accession Incoming Cooler Modal */}
      {accessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900">Accession Incoming Specimen Cooler</h3>
              </div>
              <button onClick={() => setAccessionModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAccessionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Case Number</label>
                <input
                  type="text"
                  value={accessionCase}
                  onChange={(e) => setAccessionCase(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Animal Tag & Location</label>
                <input
                  type="text"
                  value={accessionAnimal}
                  onChange={(e) => setAccessionAnimal(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specimen Matrix</label>
                  <input
                    type="text"
                    value={accessionType}
                    onChange={(e) => setAccessionType(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cooler Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={coolerTemp}
                    onChange={(e) => setCoolerTemp(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAccessionModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold"
                >
                  Confirm Accession
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
