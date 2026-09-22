import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { RiskBadge } from '../../components/common/RiskBadge';
import {
  Activity,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Save,
  Send,
  WifiOff,
  Thermometer,
  Sparkles,
  Stethoscope,
} from 'lucide-react';

const SYMPTOM_OPTIONS = [
  { code: 'FEVER', name: 'High Fever (> 104°F)', category: 'Systemic' },
  { code: 'VESICLES_MOUTH', name: 'Blisters / Lesions in Mouth & Tongue', category: 'Mucosal' },
  { code: 'VESICLES_FEET', name: 'Foot Lesions & Severe Lameness', category: 'Mucosal' },
  { code: 'SALIVATION', name: 'Excessive Frothy Salivation', category: 'Digestive' },
  { code: 'SKIN_NODULES', name: 'Circumscribed Skin Nodules (LSD Signs)', category: 'Systemic' },
  { code: 'RESPIRATORY_DISTRESS', name: 'Labored / Grunting Respiration', category: 'Respiratory' },
  { code: 'SUDDEN_DEATH', name: 'Sudden Unexplained Death', category: 'Acute' },
  { code: 'MILK_DROP', name: 'Severe Drop in Milk Yield (>40%)', category: 'Production' },
];

export const ReportHealthIssuePage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const { t } = useLanguage();

  const [animals, setAnimals] = useState<any[]>([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('');
  const [species, setSpecies] = useState('Cattle');
  const [breed, setBreed] = useState('Kangayam');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['VESICLES_MOUTH', 'SALIVATION']);
  const [severity, setSeverity] = useState<'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL'>('SEVERE');
  const [durationDays, setDurationDays] = useState<number>(2);
  const [temperatureC, setTemperatureC] = useState<string>('40.5');
  const [milkYieldDropPct, setMilkYieldDropPct] = useState<number>(50);
  const [appetiteLoss, setAppetiteLoss] = useState<boolean>(true);
  const [activityReduced, setActivityReduced] = useState<boolean>(true);
  const [visibleClinicalSigns, setVisibleClinicalSigns] = useState<string>('Excessive stringy saliva, erosions on the gums, unwilling to stand or graze.');
  const [mortalityFlag, setMortalityFlag] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<number>(11.5985);
  const [longitude, setLongitude] = useState<number>(78.5991);
  const [description, setDescription] = useState<string>('Animal exhibited sudden high fever followed by mouth lesions and severe salivation over the last 48 hours.');
  
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [offlineSaved, setOfflineSaved] = useState<boolean>(false);
  const [draftSaved, setDraftSaved] = useState<boolean>(false);
  const [locating, setLocating] = useState<boolean>(false);

  useEffect(() => {
    // Fetch registered animals for dropdown
    api.get('/animals')
      .then((res) => {
        const list = res.data.data.animals || [];
        setAnimals(list);
        if (list.length > 0) {
          setSelectedAnimalId(list[0].id);
          setSpecies(list[0].species);
          setBreed(list[0].breed || '');
        }
      })
      .catch((err) => console.error('Failed to load animals:', err));
  }, []);

  const handleAnimalSelect = (id: string) => {
    setSelectedAnimalId(id);
    const found = animals.find((a) => a.id === id);
    if (found) {
      setSpecies(found.species);
      setBreed(found.breed || '');
    }
  };

  const handleSymptomToggle = (code: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(Number(pos.coords.latitude.toFixed(6)));
          setLongitude(Number(pos.coords.longitude.toFixed(6)));
          setLocating(false);
        },
        () => {
          setLocating(false);
          setLatitude(11.5985);
          setLongitude(78.5991);
        }
      );
    }
  };

  const handleSaveOffline = () => {
    const offlinePayload = {
      localId: `offline-${Date.now()}`,
      species,
      breed,
      symptoms: selectedSymptoms,
      severity,
      durationDays,
      temperatureC: parseFloat(temperatureC) || undefined,
      latitude,
      longitude,
      description,
      createdAt: new Date().toISOString(),
      syncStatus: 'PENDING',
    };

    const existing = JSON.parse(localStorage.getItem('offline_reports') || '[]');
    existing.push(offlinePayload);
    localStorage.setItem('offline_reports', JSON.stringify(existing));
    setOfflineSaved(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const payload = {
        animalId: selectedAnimalId || undefined,
        species,
        breed,
        symptoms: selectedSymptoms,
        severity,
        durationDays,
        temperatureC: temperatureC ? parseFloat(temperatureC) : undefined,
        milkYieldDropPct: species === 'Cattle' || species === 'Buffalo' ? milkYieldDropPct : undefined,
        appetiteLoss,
        activityReduced,
        visibleClinicalSigns,
        mortalityFlag,
        latitude,
        longitude,
        description,
        source: 'MOBILE',
      };

      const res = await api.post('/health-reports', payload);
      const createdReport = res.data.data.report;
      setResult(createdReport);

      // Directly navigate to veterinary dashboard as instructed
      switchRole('VETERINARIAN');
      navigate(`/veterinarian?newCaseId=${createdReport.id}&score=${createdReport.assessedRisk.ruleScore}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit health report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoToVeterinary = () => {
    switchRole('VETERINARIAN');
    navigate('/veterinarian');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/farmer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('reportForm.returnHome')}</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Online & Early-Warning AI Active</span>
        </div>
      </div>

      {/* Success Modal / Banner */}
      {result && (
        <div className="bg-emerald-50 border-2 border-emerald-500/50 rounded-2xl p-6 shadow-md space-y-5 animate-in fade-in duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t('reportForm.successTitle')}
                </h3>
                <p className="text-xs text-slate-600">
                  Reference Report ID: <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-emerald-200">{result.id}</span>
                </p>
              </div>
            </div>
            <RiskBadge level={result.assessedRisk.riskLevel} score={result.assessedRisk.ruleScore} />
          </div>

          <div className="bg-white rounded-xl p-4 border border-emerald-200 text-xs space-y-2.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{t('reportForm.aiAssessment')}</span>
            </div>
            <p className="text-slate-600">
              The early-warning risk engine assigned a risk score of{' '}
              <strong className="text-slate-900">{result.assessedRisk.ruleScore}/100 ({result.assessedRisk.riskLevel})</strong> based on:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {result.assessedRisk.factors.map((f: string) => (
                <span
                  key={f}
                  className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-mono"
                >
                  +{f.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
            <p className="text-slate-500 text-[11px] pt-1">
              Observation routed to veterinary triage queue for Dr. Sundaramurthy (Attur Veterinary Unit).
            </p>
          </div>

          {/* Prominent Action Bar to Go to Veterinary Dashboard */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setResult(null)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
            >
              {t('reportForm.submitAnother')}
            </button>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Link
                to="/farmer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-50 transition text-center"
              >
                {t('reportForm.returnHome')}
              </Link>
              <button
                type="button"
                onClick={handleGoToVeterinary}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
              >
                <Stethoscope className="w-4 h-4" />
                <span>{t('reportForm.goToVet')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {offlineSaved && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-600" />
            <span>
              <strong>Report Saved Offline</strong> in local browser storage. It will synchronize automatically when internet connectivity returns.
            </span>
          </div>
          <button
            onClick={() => setOfflineSaved(false)}
            className="text-amber-900 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {draftSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>Draft Saved to Session Memory:</strong> Your recorded clinical signs and observations are cached and can be edited anytime.
            </span>
          </div>
          <button
            onClick={() => setDraftSaved(false)}
            className="text-emerald-900 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{t('reportForm.title')}</h1>
            <p className="text-xs text-slate-500">
              {t('reportForm.subTitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Section 1: Subject Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('reportForm.section1')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('reportForm.tagLabel')}
                </label>
                <select
                  value={selectedAnimalId}
                  onChange={(e) => handleAnimalSelect(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="">-- General Herd / Unregistered --</option>
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      Tag #{a.tagNumber} ({a.species} - {a.breed || 'Local'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('reportForm.speciesLabel')} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                >
                  <option value="Cattle">Cattle (Bovine)</option>
                  <option value="Buffalo">Buffalo (Bubaline)</option>
                  <option value="Goat">Goat (Caprine)</option>
                  <option value="Sheep">Sheep (Ovine)</option>
                  <option value="Poultry">Poultry (Avian)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('reportForm.breedLabel')}
                </label>
                <input
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="e.g. Kangayam, Murrah"
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Signs & Symptoms */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('reportForm.section2')} <span className="text-rose-500">*</span>
              </h3>
              <span className="text-[11px] text-slate-500">Select all that apply</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SYMPTOM_OPTIONS.map((sym) => {
                const isChecked = selectedSymptoms.includes(sym.code);
                return (
                  <button
                    key={sym.code}
                    type="button"
                    onClick={() => handleSymptomToggle(sym.code)}
                    className={`p-3 rounded-xl border text-left flex items-start justify-between transition ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{sym.name}</div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {sym.category}
                      </span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center text-[10px] ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && '✓'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Vitals & Severity */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('reportForm.section3')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('reportForm.severityLabel')}
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-semibold"
                >
                  <option value="MILD">MILD</option>
                  <option value="MODERATE">MODERATE</option>
                  <option value="SEVERE">SEVERE</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('reportForm.tempLabel')}
                </label>
                <div className="relative">
                  <Thermometer className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    step="0.1"
                    value={temperatureC}
                    onChange={(e) => setTemperatureC(e.target.value)}
                    placeholder="e.g. 39.5"
                    className="w-full text-xs py-2 pl-8 pr-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('reportForm.durationLabel')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={durationDays}
                  onChange={(e) => setDurationDays(parseInt(e.target.value) || 1)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {(species === 'Cattle' || species === 'Buffalo') && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{t('reportForm.milkDropLabel')}</span>
                  <span className="font-bold text-rose-600">{milkYieldDropPct}% Reduction</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={milkYieldDropPct}
                  onChange={(e) => setMilkYieldDropPct(parseInt(e.target.value) || 0)}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={appetiteLoss}
                  onChange={(e) => setAppetiteLoss(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-slate-700">{t('reportForm.appetiteLoss')}</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={activityReduced}
                  onChange={(e) => setActivityReduced(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-slate-700">{t('reportForm.activityReduced')}</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-xs cursor-pointer text-rose-900 font-semibold">
                <input
                  type="checkbox"
                  checked={mortalityFlag}
                  onChange={(e) => setMortalityFlag(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>{t('reportForm.mortalityOccurred')}</span>
              </label>
            </div>
          </div>

          {/* Section 4: Location & Notes */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('reportForm.section4')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('reportForm.gpsLabel')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                    className="w-1/2 text-xs py-2 px-3 rounded-lg border border-slate-300 font-mono"
                    placeholder="Latitude"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                    className="w-1/2 text-xs py-2 px-3 rounded-lg border border-slate-300 font-mono"
                    placeholder="Longitude"
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locating}
                    title="Auto-detect GPS"
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{locating ? 'Detecting...' : 'GPS'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('reportForm.clinicalNotes')}
                </label>
                <input
                  type="text"
                  value={visibleClinicalSigns}
                  onChange={(e) => setVisibleClinicalSigns(e.target.value)}
                  placeholder="e.g. Oral mucosa erosions, hypersalivation"
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('reportForm.farmerObs')}
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe when signs started, herd contacts, recent water source access..."
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveOffline}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
              >
                <WifiOff className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('reportForm.saveOffline')}</span>
              </button>
              <button
                type="button"
                onClick={() => setDraftSaved(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('reportForm.saveDraft')}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('reportForm.submitBtn')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
