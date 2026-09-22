import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, FileCheck, Send } from 'lucide-react';

export const LabResultsPage: React.FC = () => {
  const [isCertified, setIsCertified] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [confirmingAuthority, setConfirmingAuthority] = useState('Dr. K. Swaminathan (Lead Microbiologist)');
  const [reportNote, setReportNote] = useState('Confirmatory multiplex RT-PCR verified positive for FMDV VP1 capsular gene. Immediate ring-vaccination advisory recommended to District Officer.');

  const handleCertify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCertified(true);
    setCertModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Diagnostic Results & Validation</h1>
        <p className="text-xs text-slate-500">
          Certify positive/negative diagnostic assay findings and trigger closed-loop feedback to the AI risk registry.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Result Certification Protocol</h3>
            <p className="text-xs text-slate-500">Sample Reference: <span className="font-mono font-semibold">SMP-2026-0042</span></p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Assay: RT-PCR
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Sample <strong>SMP-2026-0042</strong> (RT-PCR for Foot-and-Mouth Disease Virus) has completed thermocycling with a Ct value of <strong>21.4</strong> (Strong positive amplification of serotype O).
        </p>

        {isCertified ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Official Diagnostic Certificate Issued & Transmitted</span>
            </div>
            <p className="text-xs text-emerald-700">
              <strong>Certificate ID:</strong> CERT-2026-RADDL-091 &bull; <strong>Certifying Officer:</strong> {confirmingAuthority}
            </p>
            <p className="text-[11px] text-emerald-600">
              Notice broadcasted to Salem District Surveillance, State Epidemiological Command, and closed-loop reinforcement weights updated in early-warning model.
            </p>
          </div>
        ) : (
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => setCertModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Certify & Issue Diagnostic Report</span>
            </button>
          </div>
        )}
      </div>

      {certModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Certify Diagnostic Result</h3>
              </div>
            </div>

            <form onSubmit={handleCertify} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Certifying Microbiologist / Authority</label>
                <input
                  type="text"
                  value={confirmingAuthority}
                  onChange={(e) => setConfirmingAuthority(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Epidemiological Alert Advisory</label>
                <textarea
                  rows={3}
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Authorize & Issue Alert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
