import React, { useState } from 'react';
import { PlusCircle, FlaskConical, CheckCircle2, X, Send } from 'lucide-react';

interface SampleItem {
  id: string;
  caseId: string;
  specimen: string;
  transport: string;
  targetLab: string;
  status: string;
  createdAt: string;
}

const INITIAL_SAMPLES: SampleItem[] = [
  {
    id: 'SMP-2026-0042',
    caseId: 'CASE-2026-081',
    specimen: 'Vesicular Fluid & Bullae Epithelium',
    transport: 'Cold Chain 4°C Insulated Cooler',
    targetLab: 'RADDL Salem',
    status: 'Testing (RT-PCR)',
    createdAt: 'Today, 09:30 AM',
  },
  {
    id: 'SMP-2026-0043',
    caseId: 'CASE-2026-085',
    specimen: 'EDTA Whole Blood & Nasal Swab',
    transport: 'Cold Chain 4°C',
    targetLab: 'RADDL Salem',
    status: 'In Transit',
    createdAt: 'Today, 11:15 AM',
  },
];

export const SampleRequestsPage: React.FC = () => {
  const [samples, setSamples] = useState<SampleItem[]>(INITIAL_SAMPLES);
  const [modalOpen, setModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form states
  const [caseId, setCaseId] = useState('CASE-2026-091');
  const [specimen, setSpecimen] = useState('Tongue Epithelium / Vesicle Fluid');
  const [transport, setTransport] = useState('Cold Chain 4°C (Insulated Icebox)');
  const [targetLab, setTargetLab] = useState('Regional Animal Disease Diagnostic Lab (RADDL) Salem');

  const handleSubmitRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    const newSample: SampleItem = {
      id: `SMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      caseId,
      specimen,
      transport,
      targetLab,
      status: 'Dispatched (Cold Chain)',
      createdAt: 'Just now',
    };

    setSamples((prev) => [newSample, ...prev]);
    setModalOpen(false);
    setSuccessToast(`Diagnostic sample ${newSample.id} dispatched to ${targetLab}.`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Diagnostic Sample Requests</h1>
          <p className="text-xs text-slate-500">
            Order diagnostic sample collections and track cold-chain shipment to regional labs.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 flex items-center gap-2 shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Sample Requisition</span>
        </button>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Sample Dispatches</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {samples.map((s) => (
            <div key={s.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{s.id}</span>
                  <span className="text-[11px] text-slate-500 font-mono">({s.caseId})</span>
                </div>
                <p className="text-slate-600">
                  {s.specimen} &bull; <span className="text-emerald-700 font-medium">{s.transport}</span>
                </p>
                <div className="text-[11px] text-slate-400">Destination: {s.targetLab} &bull; {s.createdAt}</div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold self-start sm:self-center ${
                  s.status.includes('Dispatched')
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900">New Diagnostic Sample Order</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequisition} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Case Number</label>
                <input
                  type="text"
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specimen Matrix</label>
                <select
                  value={specimen}
                  onChange={(e) => setSpecimen(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Tongue Epithelium / Vesicle Fluid">Tongue Epithelium / Vesicle Fluid</option>
                  <option value="Interdigital Lesion Scraping">Interdigital Lesion Scraping</option>
                  <option value="Whole Blood (EDTA)">Whole Blood (EDTA)</option>
                  <option value="Serum for ELISA Serology">Serum for ELISA Serology</option>
                  <option value="Nasal Swab (VTM)">Nasal Swab (VTM)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transport Condition</label>
                <select
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Cold Chain 4°C (Insulated Icebox)">Cold Chain 4°C (Insulated Icebox)</option>
                  <option value="Liquid Nitrogen Vapor Shipper (-196°C)">Liquid Nitrogen Vapor Shipper (-196°C)</option>
                  <option value="Ambient Fixative (10% Formalin)">Ambient Fixative (10% Formalin)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Laboratory</label>
                <select
                  value={targetLab}
                  onChange={(e) => setTargetLab(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Regional Animal Disease Diagnostic Lab (RADDL) Salem">
                    Regional Animal Disease Diagnostic Lab (RADDL) Salem
                  </option>
                  <option value="Institute of Veterinary Preventive Medicine (IVPM) Ranipet">
                    Institute of Veterinary Preventive Medicine (IVPM) Ranipet
                  </option>
                  <option value="National Institute of Veterinary Epidemiology (NIVEDI)">
                    National Institute of Veterinary Epidemiology (NIVEDI)
                  </option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Requisition</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
