import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { RiskBadge } from '../../components/common/RiskBadge';
import api from '../../api/client';
import {
  Stethoscope,
  AlertOctagon,
  FlaskConical,
  Activity,
  Sparkles,
  CheckCircle2,
  X,
  Send,
  FileCheck,
} from 'lucide-react';
import { GISSurveillanceMap } from '../../components/common/GISSurveillanceMap';

export const VeterinarianDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [reports, setReports] = useState<any[]>([]);
  const [activeBanner, setActiveBanner] = useState<{ id: string; score: string } | null>(null);

  // Modal States
  const [investigatingCase, setInvestigatingCase] = useState<any | null>(null);
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState('Foot-and-Mouth Disease (FMD)');
  const [clinicalNotes, setClinicalNotes] = useState('Vesicular erosions observed on tongue, dental pad and interdigital cleft. Pyrexia 104.2 F.');
  const [containmentMeasures, setContainmentMeasures] = useState('Immediate quarantine of holding. Disinfect water troughs with 4% sodium carbonate. Restrict common grazing.');

  const [samplingCase, setSamplingCase] = useState<any | null>(null);
  const [sampleType, setSampleType] = useState('Vesicular Epithelium & Fluid');
  const [transportCondition, setTransportCondition] = useState('Cold Chain (2°C - 8°C)');
  const [destinationLab, setDestinationLab] = useState('Regional Animal Disease Diagnostic Lab (RADDL) - Salem');

  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchSuccess, setBatchSuccess] = useState(false);

  // Status mapping for local interactive state changes
  const [caseStatuses, setCaseStatuses] = useState<Record<string, { label: string; color: string }>>({});

  useEffect(() => {
    // Check if redirected directly from Farmer Report
    const params = new URLSearchParams(location.search);
    const newCaseId = params.get('newCaseId');
    const score = params.get('score');
    if (newCaseId) {
      setActiveBanner({ id: newCaseId, score: score || '95' });
    }

    api.get('/health-reports')
      .then((res) => {
        const fetched = res.data.data.reports || [];
        setReports(fetched);
      })
      .catch((err) => console.error(err));
  }, [location.search]);

  const handleSaveInvestigation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!investigatingCase) return;

    setCaseStatuses((prev) => ({
      ...prev,
      [investigatingCase.id]: {
        label: 'Investigation Active',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      },
    }));

    setInvestigatingCase(null);
  };

  const handleSaveSampleRequisition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!samplingCase) return;

    setCaseStatuses((prev) => ({
      ...prev,
      [samplingCase.id]: {
        label: 'Sample Dispatched',
        color: 'bg-purple-100 text-purple-800 border-purple-300',
      },
    }));

    setSamplingCase(null);
  };

  const handleDispatchBatch = () => {
    setBatchSuccess(true);
    setTimeout(() => {
      setBatchSuccess(false);
      setBatchModalOpen(false);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner when arrived directly from Farmer Report */}
      {activeBanner && (
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl p-5 shadow-lg border-2 border-emerald-400/40 flex items-start justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  New Incident Transmitted to Veterinary Triage
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white">
                  Score: {activeBanner.score}/100
                </span>
              </div>
              <h3 className="text-base font-bold mt-1">
                Report #{activeBanner.id} successfully queued for Priority 1 Clinical Triage
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                The farmer observation has been registered into the surveillance database. You can now start the clinical investigation or order diagnostic lab sampling below.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveBanner(null)}
            className="p-1 rounded-lg text-emerald-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Clinical Triage & Investigation Portal
            </span>
            <span className="text-xs text-slate-500">Salem District Surveillance Unit</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            Veterinary Triage: {user?.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            AI-assisted risk ranking and clinical priority queue for rapid response.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBatchModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm cursor-pointer"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Dispatch Sample Batch</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Critical Alerts"
          value={reports.filter((r) => r.assessedRisk?.riskLevel === 'CRITICAL').length || '1'}
          subtitle="Immediate response required"
          badge={<RiskBadge level="CRITICAL" score={86} />}
          icon={<AlertOctagon className="w-4 h-4 text-rose-600" />}
        />
        <StatCard
          title="High-Risk Cases"
          value={reports.filter((r) => r.assessedRisk?.riskLevel === 'HIGH').length || '2'}
          subtitle="Priority 1 & 2 triage"
          badge={<RiskBadge level="HIGH" score={68} />}
          icon={<Activity className="w-4 h-4 text-orange-500" />}
        />
        <StatCard
          title="Active Investigations"
          value={Object.values(caseStatuses).filter((s) => s.label === 'Investigation Active').length + 4}
          subtitle="Provisional biocontainment active"
          icon={<Stethoscope className="w-4 h-4 text-blue-600" />}
        />
        <StatCard
          title="Pending Lab Results"
          value={Object.values(caseStatuses).filter((s) => s.label === 'Sample Dispatched').length + 5}
          subtitle="RT-PCR & ELISA in testing"
          icon={<FlaskConical className="w-4 h-4 text-indigo-600" />}
        />
      </div>

      {/* Dynamic Priority Triage Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Veterinary Priority Triage Queue</h3>
            <p className="text-xs text-slate-500">
              Live reports ranked dynamically by AI risk score, clinical severity, and mortality flag
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            {reports.length} Cases in Queue
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Assessed Risk</th>
                <th className="py-3 px-4">Symptoms & Signals</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((r) => {
                const isCrit = r.assessedRisk?.riskLevel === 'CRITICAL';
                const customStatus = caseStatuses[r.id];

                return (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          isCrit
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {isCrit ? `P1 - URGENT` : `P2 - HIGH`}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                      {r.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{r.species}</div>
                      <div className="text-[11px] text-slate-500">
                        {r.breed || 'Indigenous'} &bull; {r.animalId ? `Tag #${r.animalId}` : 'Herd Holding'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge
                        level={r.assessedRisk?.riskLevel || 'HIGH'}
                        score={r.assessedRisk?.ruleScore || 70}
                      />
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-slate-800 truncate">
                        {r.symptoms?.join(', ') || 'Vesicular lesions, Pyrexia'}
                      </div>
                      {r.mortalityFlag && (
                        <div className="text-[11px] text-rose-600 font-bold mt-0.5">
                          + Mortality flag detected in holding
                        </div>
                      )}
                      {r.assessedRisk?.factors && (
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {r.assessedRisk.factors.map((f: string) => f.replace(/_/g, ' ')).join(' • ')}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {customStatus ? (
                        <span className={`px-2 py-0.5 rounded font-semibold text-[11px] border ${customStatus.color}`}>
                          {customStatus.label}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-amber-50 text-amber-700 border border-amber-200">
                          Pending Triage
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setInvestigatingCase(r)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 shadow-xs cursor-pointer"
                      >
                        Investigate
                      </button>
                      <button
                        onClick={() => setSamplingCase(r)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 border border-slate-200 cursor-pointer"
                      >
                        Request Sample
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Geospatial Outbreak & Report Mapping */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Geospatial Triage & Outbreak Vector Map</h3>
            <p className="text-xs text-slate-500">Live spatial mapping of clinical reports, suspect clusters, and containment perimeters</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
            Salem & Regional Vectors
          </span>
        </div>
        <GISSurveillanceMap centerLat={11.5985} centerLng={78.5991} zoom={11} height="360px" />
      </div>

      {/* Explainable AI Evidence Banner */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-5 border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Explainable AI Reasoning (Early-Warning Engine)
          </h4>
        </div>
        <p className="text-xs text-slate-300 mb-3">
          Why are top cases prioritized as <strong>Critical or High Risk</strong>?
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-rose-400 font-bold block mb-1">+35 pts Mortality Signal</span>
            <span className="text-slate-400">Acute mortality flag triggered in livestock holding.</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-amber-400 font-bold block mb-1">+25 pts Vesicular Contagion</span>
            <span className="text-slate-400">Oral/feet vesicular lesions characteristic of high-contagion viral profiles.</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-amber-400 font-bold block mb-1">+15 pts Lactation Collapse</span>
            <span className="text-slate-400">Milk yield drop &gt; 40% indicating acute systemic disease progression.</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-blue-400 font-bold block mb-1">+15 pts Pyrexia / Hyperthermia</span>
            <span className="text-slate-400">Elevated core body temperature exceeding 39.5°C (103°F).</span>
          </div>
        </div>
      </div>

      {/* MODAL 1: Clinical Investigation Modal */}
      {investigatingCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Clinical Field Investigation</h3>
                  <p className="text-xs text-slate-500 font-mono">Case: {investigatingCase.id}</p>
                </div>
              </div>
              <button
                onClick={() => setInvestigatingCase(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInvestigation} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-700 block">Subject:</span>
                <span className="text-slate-900 font-bold">
                  {investigatingCase.species} ({investigatingCase.breed || 'Indigenous'}) &bull; Symptoms: {investigatingCase.symptoms?.join(', ')}
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
                  onClick={() => setInvestigatingCase(null)}
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

      {/* MODAL 2: Request Diagnostic Sample Modal */}
      {samplingCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Request Diagnostic Sample</h3>
                  <p className="text-xs text-slate-500 font-mono">Requisition for: {samplingCase.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSamplingCase(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSampleRequisition} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sample Specimen Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={sampleType}
                  onChange={(e) => setSampleType(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="Vesicular Epithelium & Fluid">Vesicular Epithelium & Fluid (FMD/LSD)</option>
                  <option value="EDTA Whole Blood">EDTA Whole Blood (Viremia / Blood smears)</option>
                  <option value="Serum">Clotted Blood / Serum (ELISA Serology)</option>
                  <option value="Nasal Swab">Nasal Swab in Viral Transport Medium (VTM)</option>
                  <option value="Milk Sample">Composite Mastitis / Milk Sample</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Destination Laboratory <span className="text-rose-500">*</span>
                </label>
                <select
                  value={destinationLab}
                  onChange={(e) => setDestinationLab(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="Regional Animal Disease Diagnostic Lab (RADDL) - Salem">
                    Regional Animal Disease Diagnostic Lab (RADDL) - Salem
                  </option>
                  <option value="Central University Laboratory - TANUVAS Chennai">
                    Central University Laboratory - TANUVAS Chennai
                  </option>
                  <option value="ICAR - NIVEDI National Reference Lab">
                    ICAR - NIVEDI National Reference Lab (Bengaluru)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chain-of-Custody Transport Condition
                </label>
                <select
                  value={transportCondition}
                  onChange={(e) => setTransportCondition(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="Cold Chain (2°C - 8°C)">Cold Chain (2°C - 8°C with Ice Gel Packs)</option>
                  <option value="Dry Ice Frozen (-20°C)">Dry Ice Frozen (-20°C for viral RNA)</option>
                  <option value="Ambient / Fixed in 10% Formalin">Ambient / Fixed in 10% Formalin</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSamplingCase(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Requisition</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Dispatch Sample Batch Modal */}
      {batchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Dispatch Sample Batch</h3>
              </div>
              <button
                onClick={() => setBatchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {batchSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-xs text-emerald-900">
                  Batch Dispatched Successfully!
                </h4>
                <p className="text-[11px] text-emerald-700">
                  Batch #BATCH-2026-042 sent via Cold Chain to Regional Diagnostic Lab.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600">
                  You are preparing to dispatch all pending collected samples from Salem District to RADDL.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Pending Samples in Batch:</span>
                    <span className="text-emerald-700">3 Specimens</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Transport Protocol:</span>
                    <span>Cold Chain (4°C Insulated Cooler)</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setBatchModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDispatchBatch}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                  >
                    Confirm & Dispatch Batch
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
