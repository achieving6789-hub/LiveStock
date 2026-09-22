import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { RiskBadge } from '../../components/common/RiskBadge';
import { Stethoscope, CheckCircle2, X, FileCheck } from 'lucide-react';

export const PriorityQueuePage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [investigatingReport, setInvestigatingReport] = useState<any | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modal form states
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState('Foot-and-Mouth Disease (FMD)');
  const [clinicalNotes, setClinicalNotes] = useState('Vesicular erosions observed on tongue pad and dental cushion. Pyrexia present.');
  const [containmentMeasures, setContainmentMeasures] = useState('Immediate isolation from common herd. Footbath with 4% sodium carbonate deployed.');

  useEffect(() => {
    api.get('/health-reports')
      .then((res) => {
        const sorted = (res.data.data.reports || []).sort(
          (a: any, b: any) => (b.assessedRisk?.ruleScore || 0) - (a.assessedRisk?.ruleScore || 0)
        );
        setReports(sorted);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSaveInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!investigatingReport) return;

    setReports((prev) =>
      prev.map((r) =>
        r.id === investigatingReport.id
          ? {
              ...r,
              investigationStatus: 'INVESTIGATED',
              clinicalDiagnosis,
              clinicalNotes,
              containmentMeasures,
            }
          : r
      )
    );

    const id = investigatingReport.id;
    setInvestigatingReport(null);
    setSuccessToast(`Investigation protocol completed for ${id}. Tentative Diagnosis: ${clinicalDiagnosis}`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Veterinary Priority Triage Queue</h1>
        <p className="text-xs text-slate-500">
          Ranked dynamically by case velocity, mortality signal, and symptom severity.
        </p>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <th className="py-3 px-4">Case / Report</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Risk Assessment</th>
                <th className="py-3 px-4">Symptoms</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {r.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900">{r.species}</span>
                    {r.breed && <span className="text-slate-500"> ({r.breed})</span>}
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskBadge level={r.assessedRisk?.riskLevel || 'MODERATE'} score={r.assessedRisk?.ruleScore || 45} />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {r.symptoms?.map((s: string) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {r.investigationStatus === 'INVESTIGATED' ? (
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Investigated
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded font-medium text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                        Pending Triage
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(r.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => setInvestigatingReport(r)}
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition shadow-xs"
                    >
                      {r.investigationStatus === 'INVESTIGATED' ? 'Review Record' : 'Investigate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Investigation Modal */}
      {investigatingReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Clinical Field Investigation</h3>
                  <p className="text-xs text-slate-500 font-mono">Case: {investigatingReport.id}</p>
                </div>
              </div>
              <button
                onClick={() => setInvestigatingReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInvestigation} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-700 block">Subject:</span>
                <span className="text-slate-900 font-bold">
                  {investigatingReport.species} ({investigatingReport.breed || 'Indigenous'}) &bull; Symptoms: {investigatingReport.symptoms?.join(', ')}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tentative Clinical Diagnosis <span className="text-rose-500">*</span>
                </label>
                <select
                  value={clinicalDiagnosis}
                  onChange={(e) => setClinicalDiagnosis(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="Foot-and-Mouth Disease (FMD)">Foot-and-Mouth Disease (FMD)</option>
                  <option value="Lumpy Skin Disease (LSD)">Lumpy Skin Disease (LSD)</option>
                  <option value="Peste des Petits Ruminants (PPR)">Peste des Petits Ruminants (PPR)</option>
                  <option value="Anthrax (Suspected)">Anthrax (Suspected)</option>
                  <option value="Hemorrhagic Septicemia">Hemorrhagic Septicemia</option>
                  <option value="Other Non-Infectious Condition">Other Non-Infectious Condition</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Clinical Examination Findings
                </label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Biocontainment & Quarantine Measures
                </label>
                <textarea
                  rows={2}
                  value={containmentMeasures}
                  onChange={(e) => setContainmentMeasures(e.target.value)}
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setInvestigatingReport(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Save Clinical Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
