import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
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
  const { language, t } = useLanguage();
  const location = useLocation();

  const isTa = language === 'ta';

  const [reports, setReports] = useState<any[]>([]);
  const [activeBanner, setActiveBanner] = useState<{ id: string; score: string } | null>(null);

  // Modal States
  const [investigatingCase, setInvestigatingCase] = useState<any | null>(null);
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState('Foot-and-Mouth Disease (FMD)');
  const [clinicalNotes, setClinicalNotes] = useState(
    isTa
      ? 'நாக்கு மற்றும் கால் விரலிடை குளம்புகளில் கொப்புளங்கள் மற்றும் புண்கள் காணப்படுகின்றன. உடல் உஷ்ணம் 104.2 F.'
      : 'Vesicular erosions observed on tongue, dental pad and interdigital cleft. Pyrexia 104.2 F.'
  );
  const [containmentMeasures, setContainmentMeasures] = useState(
    isTa
      ? 'உடனடி தனிமைப்படுத்தல் உத்தரவு. நீர் தொட்டிகளை 4% சோடியம் கார்பனேட் கொண்டு கிருமி நீக்கம் செய்க. பொது மேய்ச்சல் தடை செய்யப்பட்டுள்ளது.'
      : 'Immediate quarantine of holding. Disinfect water troughs with 4% sodium carbonate. Restrict common grazing.'
  );

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
        label: isTa ? 'புலனாய்வு நடப்பில் உள்ளது' : 'Investigation Active',
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
        label: isTa ? 'மாதிரி அனுப்பப்பட்டது' : 'Sample Dispatched',
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
                  {isTa ? 'புதிய அறிக்கை மருத்துவ முன்னுரிமை வரிசைக்கு அனுப்பப்பட்டது' : 'New Incident Transmitted to Veterinary Triage'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white">
                  {isTa ? 'இடர் மதிப்பெண்:' : 'Score:'} {activeBanner.score}/100
                </span>
              </div>
              <h3 className="text-base font-bold mt-1">
                {isTa
                  ? `அறிக்கை #${activeBanner.id} முன்னுரிமை வரிசையில் வெற்றிகரமாக சேர்க்கப்பட்டது`
                  : `Report #${activeBanner.id} successfully queued for Priority 1 Clinical Triage`}
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                {isTa
                  ? 'விவசாயியின் அவதானிப்பு கண்காணிப்பு தளத்தில் பதிவு செய்யப்பட்டது. மருத்துவ ஆய்வை தொடங்கவும் அல்லது ஆய்வக மாதிரி கோரிக்கை விடுக்கவும்.'
                  : 'The farmer observation has been registered into the surveillance database. You can now start the clinical investigation or order diagnostic lab sampling below.'}
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
              {isTa ? 'மருத்துவ முன்னுரிமை & ஆய்வு தளம்' : 'Clinical Triage & Investigation Portal'}
            </span>
            <span className="text-xs text-slate-500">
              {isTa ? 'சேலம் மாவட்ட கண்காணிப்பு பிரிவு' : 'Salem District Surveillance Unit'}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            {isTa ? 'கால்நடை மருத்துவர் முன்னுரிமை மையம்:' : 'Veterinary Triage:'} {user?.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTa
              ? 'AI இடர் மதிப்பீடு மற்றும் உடனடி நடவடிக்கைக்கான முன்னுரிமை வரிசை.'
              : 'AI-assisted risk ranking and clinical priority queue for rapid response.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBatchModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm cursor-pointer"
          >
            <FlaskConical className="w-4 h-4" />
            <span>{isTa ? 'மாதிரி தொகுப்பை அனுப்பு' : 'Dispatch Sample Batch'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={isTa ? 'அபாயகரமான எச்சரிக்கைகள்' : 'Critical Alerts'}
          value={reports.filter((r) => r.assessedRisk?.riskLevel === 'CRITICAL').length || '1'}
          subtitle={isTa ? 'உடனடி கவனம் தேவை' : 'Immediate response required'}
          badge={<RiskBadge level="CRITICAL" score={86} />}
          icon={<AlertOctagon className="w-4 h-4 text-rose-600" />}
        />
        <StatCard
          title={isTa ? 'அதிக ஆபத்து வழக்குகள்' : 'High-Risk Cases'}
          value={reports.filter((r) => r.assessedRisk?.riskLevel === 'HIGH').length || '2'}
          subtitle={isTa ? 'முன்னுரிமை 1 & 2' : 'Priority 1 & 2 triage'}
          badge={<RiskBadge level="HIGH" score={68} />}
          icon={<Activity className="w-4 h-4 text-orange-500" />}
        />
        <StatCard
          title={isTa ? 'செயலில் உள்ள ஆய்வுகள்' : 'Active Investigations'}
          value={Object.values(caseStatuses).filter((s) => s.label.includes('Investigation') || s.label.includes('புலனாய்வு')).length + 4}
          subtitle={isTa ? 'தனிமைப்படுத்துதல் நடைமுறையில் உள்ளது' : 'Provisional biocontainment active'}
          icon={<Stethoscope className="w-4 h-4 text-blue-600" />}
        />
        <StatCard
          title={isTa ? 'அனுப்பப்பட்ட மாதிரிகள்' : 'Pending Lab Results'}
          value={Object.values(caseStatuses).filter((s) => s.label.includes('Sample') || s.label.includes('மாதிரி')).length + 5}
          subtitle={isTa ? 'PCR & ELISA ஆய்வக பரிசோதனையில்' : 'RT-PCR & ELISA in testing'}
          icon={<FlaskConical className="w-4 h-4 text-indigo-600" />}
        />
      </div>

      {/* Dynamic Priority Triage Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isTa ? 'கால்நடை மருத்துவர் முன்னுரிமை வரிசை' : 'Veterinary Priority Triage Queue'}
            </h3>
            <p className="text-xs text-slate-500">
              {isTa
                ? 'AI இடர் மதிப்பீடு மற்றும் தீவிர நிலை அடிப்படையில் வரிசைப்படுத்தப்பட்ட நேரடி அறிக்கைகள்'
                : 'Live reports ranked dynamically by AI risk score, clinical severity, and mortality flag'}
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            {reports.length} {isTa ? 'வழக்குகள் வரிசையில் உள்ளன' : 'Cases in Queue'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">{isTa ? 'முன்னுரிமை' : 'Priority'}</th>
                <th className="py-3 px-4">{isTa ? 'வழக்கு எண்' : 'Case ID'}</th>
                <th className="py-3 px-4">{isTa ? 'கால்நடை இனம்' : 'Subject'}</th>
                <th className="py-3 px-4">{isTa ? 'மதிப்பிடப்பட்ட இடர்' : 'Assessed Risk'}</th>
                <th className="py-3 px-4">{isTa ? 'அறிகுறிகள்' : 'Symptoms & Signals'}</th>
                <th className="py-3 px-4">{isTa ? 'நிலை' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{isTa ? 'செயல்கள்' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((r) => {
                const isCrit = r.assessedRisk?.riskLevel === 'CRITICAL';
                const customStatus = caseStatuses[r.id];
                const speciesName = t(`species.${r.species}`) || r.species;

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
                      <div className="font-semibold text-slate-900">{speciesName}</div>
                      <div className="text-[11px] text-slate-500">
                        {r.breed || (isTa ? 'நாட்டு இனம்' : 'Indigenous')} &bull; {r.animalId ? `Tag #${r.animalId}` : (isTa ? 'மந்தை' : 'Herd')}
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
                        {r.symptoms?.map((s: string) => t(`symptoms.${s}.name`) || s).join(', ') || (isTa ? 'கொப்புளங்கள், காய்ச்சல்' : 'Vesicular lesions, Pyrexia')}
                      </div>
                      {r.mortalityFlag && (
                        <div className="text-[11px] text-rose-600 font-bold mt-0.5">
                          {isTa ? '+ மந்தையில் இறப்பு பதிவாகியுள்ளது' : '+ Mortality flag detected in holding'}
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
                          {isTa ? 'ஆய்வு நிலுவையில்' : 'Pending Triage'}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setInvestigatingCase(r)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 shadow-xs cursor-pointer"
                      >
                        {isTa ? 'புலனாய்வு' : 'Investigate'}
                      </button>
                      <button
                        onClick={() => setSamplingCase(r)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 border border-slate-200 cursor-pointer"
                      >
                        {isTa ? 'மாதிரி கோரு' : 'Request Sample'}
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
            <h3 className="text-sm font-bold text-slate-900">
              {isTa ? 'புவியியல் வரைபடம் & நோய் பரவல் பகுப்பாய்வு' : 'Geospatial Triage & Outbreak Vector Map'}
            </h3>
            <p className="text-xs text-slate-500">
              {isTa
                ? 'மருத்துவ அறிக்கைகள், இடர் கொத்துகள் மற்றும் தடுப்பு எல்லைகளின் நேரடி வரைபடம்'
                : 'Live spatial mapping of clinical reports, suspect clusters, and containment perimeters'}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
            {isTa ? 'சேலம் மண்டலம்' : 'Salem & Regional Vectors'}
          </span>
        </div>
        <GISSurveillanceMap centerLat={11.5985} centerLng={78.5991} zoom={11} height="360px" />
      </div>

      {/* Explainable AI Evidence Banner */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-5 border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            {isTa ? 'AI பகுப்பாய்வு விளக்கக் காரணங்கள் (முன் எச்சரிக்கை அமைப்பு)' : 'Explainable AI Reasoning (Early-Warning Engine)'}
          </h4>
        </div>
        <p className="text-xs text-slate-300 mb-3">
          {isTa
            ? 'முக்கிய வழக்குகள் ஏன் அதிக ஆபத்துள்ளதாக முன்னுரிமைப்படுத்தப்பட்டுள்ளன?'
            : 'Why are top cases prioritized as Critical or High Risk?'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-rose-400 font-bold block mb-1">+35 pts {isTa ? 'இறப்பு அறிகுறி' : 'Mortality Signal'}</span>
            <span className="text-slate-400">{isTa ? 'மந்தையில் திடீர் இறப்பு பதிவானது.' : 'Acute mortality flag triggered in livestock holding.'}</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-amber-400 font-bold block mb-1">+25 pts {isTa ? 'கொப்புளங்கள் & பரவும் தன்மை' : 'Vesicular Contagion'}</span>
            <span className="text-slate-400">{isTa ? 'வாய், கால்களில் கொப்புளங்கள் மற்றும் புண்கள்.' : 'Oral/feet vesicular lesions characteristic of high-contagion viral profiles.'}</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-amber-400 font-bold block mb-1">+15 pts {isTa ? 'பால் உற்பத்தி வீழ்ச்சி' : 'Lactation Collapse'}</span>
            <span className="text-slate-400">{isTa ? 'பால் உற்பத்தி 40% க்கும் மேல் குறைந்தது.' : 'Milk yield drop > 40% indicating acute systemic disease progression.'}</span>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700">
            <span className="text-blue-400 font-bold block mb-1">+15 pts {isTa ? 'அதிக உடல் உஷ்ணம்' : 'Pyrexia / Hyperthermia'}</span>
            <span className="text-slate-400">{isTa ? 'உடல் வெப்பநிலை 39.5°C (103°F) க்கும் மேல் உயர்வு.' : 'Elevated core body temperature exceeding 39.5°C (103°F).'}</span>
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
                  <h3 className="font-bold text-sm text-slate-900">
                    {isTa ? 'கள மருத்துவ புலனாய்வு' : 'Clinical Field Investigation'}
                  </h3>
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
                <span className="font-semibold text-slate-700 block">{isTa ? 'கால்நடை:' : 'Subject:'}</span>
                <span className="text-slate-900 font-bold">
                  {investigatingCase.species} ({investigatingCase.breed || (isTa ? 'நாட்டு இனம்' : 'Indigenous')})
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isTa ? 'தற்காலிக மருத்துவ நோயறிதல்' : 'Tentative Clinical Diagnosis'} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={clinicalDiagnosis}
                  onChange={(e) => setClinicalDiagnosis(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="Foot-and-Mouth Disease (FMD)">{isTa ? 'கோமாரி நோய் (FMD)' : 'Foot-and-Mouth Disease (FMD)'}</option>
                  <option value="Lumpy Skin Disease (LSD)">{isTa ? 'தோல் கழலை நோய் (LSD)' : 'Lumpy Skin Disease (LSD)'}</option>
                  <option value="Peste des Petits Ruminants (PPR)">{isTa ? 'ஆட்டுக்கொல்லை நோய் (PPR)' : 'Peste des Petits Ruminants (PPR)'}</option>
                  <option value="Anthrax (Suspected)">{isTa ? 'ஆந்த்ராக்ஸ் (சந்தேகம்)' : 'Anthrax (Suspected)'}</option>
                  <option value="Hemorrhagic Septicemia">{isTa ? 'தொண்டை அடைப்பான் (HS)' : 'Hemorrhagic Septicemia'}</option>
                  <option value="Other Non-Infectious Condition">{isTa ? 'தொற்றாத பிற காரணங்கள்' : 'Other Non-Infectious Condition'}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isTa ? 'மருத்துவ பரிசோதனை விவரங்கள்' : 'Clinical Examination Findings'}
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
                  {isTa ? 'உயிரியல் பாதுகாப்பு & தனிமைப்படுத்தல் நடவடிக்கைகள்' : 'Biocontainment & Quarantine Measures'}
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
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{isTa ? 'மருத்துவ பதிவை சேமி' : 'Save Clinical Record'}</span>
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
                  <h3 className="font-bold text-sm text-slate-900">
                    {isTa ? 'ஆய்வக மாதிரி கோரிக்கை' : 'Request Diagnostic Sample'}
                  </h3>
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
                  {isTa ? 'மாதிரியின் வகை' : 'Sample Specimen Type'} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={sampleType}
                  onChange={(e) => setSampleType(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="Vesicular Epithelium & Fluid">{isTa ? 'கொப்புள திரவம் & திசு (FMD/LSD)' : 'Vesicular Epithelium & Fluid (FMD/LSD)'}</option>
                  <option value="EDTA Whole Blood">{isTa ? 'EDTA முழு ரத்தம்' : 'EDTA Whole Blood (Viremia / Blood smears)'}</option>
                  <option value="Serum">{isTa ? 'சீரம் ரத்த மாதிரி (ELISA)' : 'Clotted Blood / Serum (ELISA Serology)'}</option>
                  <option value="Nasal Swab">{isTa ? 'மூக்கு சளி மாதிரி (VTM)' : 'Nasal Swab in Viral Transport Medium (VTM)'}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isTa ? 'சேர வேண்டிய ஆய்வகம்' : 'Destination Laboratory'} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={destinationLab}
                  onChange={(e) => setDestinationLab(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="Regional Animal Disease Diagnostic Lab (RADDL) - Salem">
                    {isTa ? 'மண்டல கால்நடை நோய் கண்டறியும் ஆய்வகம் (RADDL) - சேலம்' : 'Regional Animal Disease Diagnostic Lab (RADDL) - Salem'}
                  </option>
                  <option value="Central University Laboratory - TANUVAS Chennai">
                    {isTa ? 'மத்திய பல்கலைக்கழக ஆய்வகம் - TANUVAS சென்னை' : 'Central University Laboratory - TANUVAS Chennai'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isTa ? 'போக்குவரத்து குளிர்சங்கிலி முறை' : 'Transport Condition'}
                </label>
                <select
                  value={transportCondition}
                  onChange={(e) => setTransportCondition(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="Cold Chain (2°C - 8°C)">{isTa ? 'குளிர்சங்கிலி முறை (2°C - 8°C)' : 'Cold Chain (2°C - 8°C)'}</option>
                  <option value="Dry Ice Frozen (-20°C)">{isTa ? 'உறைந்த நிலை (-20°C)' : 'Dry Ice Frozen (-20°C)'}</option>
                  <option value="Ambient">{isTa ? 'சாதாரண அறை வெப்பநிலை' : 'Ambient Temperature'}</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSamplingCase(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isTa ? 'மாதிரி கோரிக்கையை அனுப்பு' : 'Dispatch Requisition'}</span>
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
                <h3 className="font-bold text-sm text-slate-900">
                  {isTa ? 'மாதிரி தொகுப்பை அனுப்பு' : 'Dispatch Sample Batch'}
                </h3>
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
                  {isTa ? 'மாதிரி தொகுப்பு வெற்றிகரமாக அனுப்பப்பட்டது!' : 'Batch Dispatched Successfully!'}
                </h4>
                <p className="text-[11px] text-emerald-700">
                  Batch #BATCH-2026-042 sent via Cold Chain to Regional Diagnostic Lab.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600">
                  {isTa
                    ? 'சேலம் மாவட்டத்திலிருந்து சேகரிக்கப்பட்ட அனைத்து மாதிரிகளையும் RADDL ஆய்வகத்திற்கு குளிர்சங்கிலி மூலம் அனுப்ப உறுதிப்படுத்தவும்.'
                    : 'You are preparing to dispatch all pending collected samples from Salem District to RADDL.'}
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>{isTa ? 'தொகுப்பில் உள்ள மாதிரிகள்:' : 'Pending Samples in Batch:'}</span>
                    <span className="text-emerald-700">3 {isTa ? 'மாதிரிகள்' : 'Specimens'}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>{isTa ? 'போக்குவரத்து முறை:' : 'Transport Protocol:'}</span>
                    <span>Cold Chain (4°C Insulated Cooler)</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => setBatchModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleDispatchBatch}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                  >
                    {isTa ? 'உறுதிசெய்து அனுப்பவும்' : 'Confirm & Dispatch Batch'}
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
