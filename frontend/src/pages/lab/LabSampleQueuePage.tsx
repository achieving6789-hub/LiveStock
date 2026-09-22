import React, { useState } from 'react';
import { FlaskConical, CheckCircle2, X, Play, Clock } from 'lucide-react';

interface AccessionQueueItem {
  id: string;
  sampleCode: string;
  type: string;
  condition: string;
  assay: string;
  status: 'PENDING_ACCESSION' | 'PROCESSING' | 'COMPLETED';
  benchAssignment?: string;
}

const INITIAL_QUEUE: AccessionQueueItem[] = [
  {
    id: '1',
    sampleCode: 'SMP-2026-0042',
    type: 'Vesicular Lesion Fluid',
    condition: 'Cold Chain 4°C',
    assay: 'Multiplex FMDV RT-PCR',
    status: 'PENDING_ACCESSION',
  },
  {
    id: '2',
    sampleCode: 'SMP-2026-0043',
    type: 'EDTA Blood',
    condition: 'Cold Chain 4°C',
    assay: 'Pasteurella Multocida PCR',
    status: 'PROCESSING',
    benchAssignment: 'Bacteriology Bench 2 (Incubating)',
  },
];

export const LabSampleQueuePage: React.FC = () => {
  const [queue, setQueue] = useState<AccessionQueueItem[]>(INITIAL_QUEUE);
  const [activeItem, setActiveItem] = useState<AccessionQueueItem | null>(null);
  const [bench, setBench] = useState('Virology Molecular Bench A (Thermocycler 3)');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleStartProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    setQueue((prev) =>
      prev.map((item) =>
        item.id === activeItem.id
          ? { ...item, status: 'PROCESSING', benchAssignment: bench }
          : item
      )
    );

    const code = activeItem.sampleCode;
    setActiveItem(null);
    setSuccessToast(`Accession verified for ${code}. Sample allocated to ${bench}.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Laboratory Sample Accession Queue</h1>
        <p className="text-xs text-slate-500">
          Verify sample integrity, log barcode accession, and route to designated diagnostic benches.
        </p>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <th className="py-3 px-4">Sample Code</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Condition</th>
              <th className="py-3 px-4">Assay Target</th>
              <th className="py-3 px-4">Bench Assignment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {queue.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition">
                <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{item.sampleCode}</td>
                <td className="py-3.5 px-4">{item.type}</td>
                <td className="py-3.5 px-4 text-emerald-700 font-medium">{item.condition}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">{item.assay}</td>
                <td className="py-3.5 px-4 text-slate-500">{item.benchAssignment || 'Unassigned'}</td>
                <td className="py-3.5 px-4">
                  {item.status === 'PROCESSING' ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                      PROCESSING
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                      PENDING ACCESSION
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  {item.status === 'PENDING_ACCESSION' ? (
                    <button
                      onClick={() => setActiveItem(item)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-1 ml-auto shadow-xs"
                    >
                      <Play className="w-3 h-3" />
                      <span>Process Assay</span>
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 justify-end">
                      <Clock className="w-3.5 h-3.5" /> Bench Active
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900">Process Assay Accession</h3>
              </div>
              <button onClick={() => setActiveItem(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStartProcess} className="space-y-4 text-xs">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="font-bold text-purple-900 font-mono">{activeItem.sampleCode}</div>
                <div className="text-purple-700">{activeItem.type} &bull; {activeItem.assay}</div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign Diagnostic Bench</label>
                <select
                  value={bench}
                  onChange={(e) => setBench(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Virology Molecular Bench A (Thermocycler 3)">Virology Molecular Bench A (Thermocycler 3)</option>
                  <option value="Serology Bench (Spectrophotometer ELISA)">Serology Bench (Spectrophotometer ELISA)</option>
                  <option value="Microbiology / Culture Hood 2">Microbiology / Culture Hood 2</option>
                  <option value="Rapid Immunoassay Bench">Rapid Immunoassay Bench</option>
                </select>
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
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold"
                >
                  Start Bench Processing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
