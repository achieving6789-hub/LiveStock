import React, { useState } from 'react';
import { FlaskConical, Stethoscope, PlusCircle, CheckCircle2, X, FileCheck } from 'lucide-react';

interface InvestigationItem {
  id: string;
  caseId: string;
  location: string;
  leadVet: string;
  findings: string;
  sampleStatus: string;
  status: 'In Progress' | 'Biocontained' | 'Completed';
}

const INITIAL_INVESTIGATIONS: InvestigationItem[] = [
  {
    id: 'INV-2026-001',
    caseId: 'CASE-2026-081',
    location: 'Kallanur Holding, Salem',
    leadVet: 'Dr. Sundaramurthy B.V.Sc',
    findings: 'Acute pyrexia (40.1°C), extensive vesicular lesions on tongue and dental pad, profuse salivation.',
    sampleStatus: 'Sample Dispatched to RADDL',
    status: 'In Progress',
  },
  {
    id: 'INV-2026-002',
    caseId: 'CASE-2026-085',
    location: 'Attur West Block',
    leadVet: 'Dr. R. Meenakshi B.V.Sc',
    findings: 'Lameness with coronet vesicles. Ring biosecurity perimeter established around 500m farm radius.',
    sampleStatus: 'EDTA blood in transit',
    status: 'Biocontained',
  },
];

export const InvestigationsPage: React.FC = () => {
  const [investigations, setInvestigations] = useState<InvestigationItem[]>(INITIAL_INVESTIGATIONS);
  const [activeItem, setActiveItem] = useState<InvestigationItem | null>(null);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Edit form state
  const [updatedFindings, setUpdatedFindings] = useState('');
  const [updatedStatus, setUpdatedStatus] = useState<'In Progress' | 'Biocontained' | 'Completed'>('Biocontained');

  // New form state
  const [newCaseId, setNewCaseId] = useState('CASE-2026-092');
  const [newLocation, setNewLocation] = useState('Omalur Panchayat, Salem');
  const [newVet, setNewVet] = useState('Dr. Sundaramurthy B.V.Sc');
  const [newFindings, setNewFindings] = useState('Dullness, nasal discharge, pyrexia. Biosecurity warning communicated.');

  const handleOpenEdit = (inv: InvestigationItem) => {
    setActiveItem(inv);
    setUpdatedFindings(inv.findings);
    setUpdatedStatus(inv.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    setInvestigations((prev) =>
      prev.map((inv) =>
        inv.id === activeItem.id
          ? { ...inv, findings: updatedFindings, status: updatedStatus }
          : inv
      )
    );

    const id = activeItem.id;
    setActiveItem(null);
    setSuccessToast(`Investigation ${id} findings updated successfully.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const created: InvestigationItem = {
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      caseId: newCaseId,
      location: newLocation,
      leadVet: newVet,
      findings: newFindings,
      sampleStatus: 'Cold Chain Requisition Pending',
      status: 'In Progress',
    };
    setInvestigations((prev) => [created, ...prev]);
    setNewModalOpen(false);
    setSuccessToast(`New field investigation record ${created.id} initiated.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Clinical Field Investigations</h1>
          <p className="text-xs text-slate-500">
            Track on-site veterinary visits, tentative diagnoses, and biocontainment measures.
          </p>
        </div>
        <button
          onClick={() => setNewModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Field Investigation</span>
        </button>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {investigations.map((inv) => (
          <div key={inv.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                {inv.id}
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  inv.status === 'Completed'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : inv.status === 'Biocontained'
                    ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : 'text-blue-700 bg-blue-50 border-blue-200'
                }`}
              >
                {inv.status}
              </span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              Case #{inv.caseId} &bull; {inv.location}
            </h3>
            <p className="text-xs text-slate-600">
              Lead Vet: <strong>{inv.leadVet}</strong> &bull; {inv.findings}
            </p>
            <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
              <span className="text-slate-500 flex items-center gap-1">
                <FlaskConical className="w-3.5 h-3.5 text-purple-600" /> {inv.sampleStatus}
              </span>
              <button
                onClick={() => handleOpenEdit(inv)}
                className="text-emerald-700 font-bold hover:underline"
              >
                Update Findings
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Findings Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Update Investigation Findings</h3>
              </div>
              <button onClick={() => setActiveItem(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Biocontained">Biocontained (Ring Quarantine Active)</option>
                  <option value="Completed">Completed (Lab Validated & Closed)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical & Biocontainment Notes</label>
                <textarea
                  rows={4}
                  value={updatedFindings}
                  onChange={(e) => setUpdatedFindings(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Investigation Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Initiate Field Investigation</h3>
              </div>
              <button onClick={() => setNewModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Case Number</label>
                <input
                  type="text"
                  value={newCaseId}
                  onChange={(e) => setNewCaseId(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Holding Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attending Veterinary Surgeon</label>
                <input
                  type="text"
                  value={newVet}
                  onChange={(e) => setNewVet(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Findings & Protocol</label>
                <textarea
                  rows={3}
                  value={newFindings}
                  onChange={(e) => setNewFindings(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Create Investigation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
