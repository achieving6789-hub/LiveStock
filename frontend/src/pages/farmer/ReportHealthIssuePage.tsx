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
  Mic,
  Volume2,
  Zap,
  RotateCcw,
  Sparkle,
} from 'lucide-react';

const SYMPTOM_OPTIONS = [
  { code: 'FEVER', icon: '🌡️', categoryCode: 'Systemic' },
  { code: 'VESICLES_MOUTH', icon: '👄', categoryCode: 'Mucosal' },
  { code: 'VESICLES_FEET', icon: '🐾', categoryCode: 'Mucosal' },
  { code: 'SALIVATION', icon: '💧', categoryCode: 'Digestive' },
  { code: 'SKIN_NODULES', icon: '🔘', categoryCode: 'Systemic' },
  { code: 'RESPIRATORY_DISTRESS', icon: '🫁', categoryCode: 'Respiratory' },
  { code: 'SUDDEN_DEATH', icon: '⚠️', categoryCode: 'Acute' },
  { code: 'MILK_DROP', icon: '🥛', categoryCode: 'Production' },
  { code: 'DIARRHEA', icon: '🚰', categoryCode: 'Digestive' },
  { code: 'THROAT_SWELLING', icon: '🔴', categoryCode: 'Respiratory' },
];

const QUICK_BREEDS = [
  { en: 'Kangayam', ta: 'காங்கேயம்', hi: 'कांगायम', mr: 'कांगायम' },
  { en: 'Umblachery', ta: 'உம்பளச்சேரி', hi: 'उम्बलाचेरी', mr: 'उम्बलाचेरी' },
  { en: 'Alambadi', ta: 'ஆலம்பாடி', hi: 'आलम्बाडी', mr: 'आलम्बाडी' },
  { en: 'Murrah', ta: 'முர்ரா', hi: 'मुर्राह', mr: 'मुर्राह' },
  { en: 'Bargur', ta: 'பார்கூர்', hi: 'बारगुर', mr: 'बारगुर' },
  { en: 'Local Country', ta: 'நாட்டு இனம்', hi: 'देशी नस्ल', mr: 'देशी जात' },
  { en: 'Crossbred Jersey', ta: 'கலப்பின ஜெர்சி', hi: 'क्रॉसब्रीड जर्सी', mr: 'संकरित जर्सी' },
];

export const ReportHealthIssuePage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const { language, t } = useLanguage();

  const [animals, setAnimals] = useState<any[]>([]);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>('');
  const [species, setSpecies] = useState('Cattle');
  const [breed, setBreed] = useState(language === 'ta' ? 'காங்கேயம்' : 'Kangayam');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['VESICLES_MOUTH', 'SALIVATION']);
  const [severity, setSeverity] = useState<'MILD' | 'MODERATE' | 'SEVERE' | 'CRITICAL'>('SEVERE');
  const [durationDays, setDurationDays] = useState<number>(2);
  const [temperatureC, setTemperatureC] = useState<string>('40.5');
  const [milkYieldDropPct, setMilkYieldDropPct] = useState<number>(50);
  const [appetiteLoss, setAppetiteLoss] = useState<boolean>(true);
  const [activityReduced, setActivityReduced] = useState<boolean>(true);
  const [visibleClinicalSigns, setVisibleClinicalSigns] = useState<string>(
    language === 'ta'
      ? 'வாயில் புண்கள், அளவுக்கு அதிகமான நுரை உமிழ்நீர், மேய்ச்சலுக்கு செல்ல மறுக்கிறது.'
      : 'Excessive stringy saliva, erosions on the gums, unwilling to stand or graze.'
  );
  const [mortalityFlag, setMortalityFlag] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<number>(11.5985);
  const [longitude, setLongitude] = useState<number>(78.5991);
  const [description, setDescription] = useState<string>(
    language === 'ta'
      ? 'கால்நடையில் 48 மணி நேரமாக அதிக காய்ச்சலுடன் வாயில் புண்களும் உமிழ்நீர் வடிதலும் காணப்படுகிறது.'
      : 'Animal exhibited sudden high fever followed by mouth lesions and severe salivation over the last 48 hours.'
  );

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<any | null>(null);
  const [offlineSaved, setOfflineSaved] = useState<boolean>(false);
  const [draftSaved, setDraftSaved] = useState<boolean>(false);
  const [locating, setLocating] = useState<boolean>(false);

  // Farmer Input Methods State
  const [isListeningObs, setIsListeningObs] = useState<boolean>(false);
  const [isListeningSigns, setIsListeningSigns] = useState<boolean>(false);
  const [voiceNotification, setVoiceNotification] = useState<string>('');
  const [appliedPresetName, setAppliedPresetName] = useState<string>('');

  useEffect(() => {
    // Fetch registered animals for dropdown
    api.get('/animals')
      .then((res) => {
        const list = res.data.data.animals || [];
        setAnimals(list);
        if (list.length > 0) {
          setSelectedAnimalId(list[0].id);
          setSpecies(list[0].species);
          setBreed(list[0].breed || (language === 'ta' ? 'காங்கேயம்' : 'Kangayam'));
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

  // Farmer Input Method: Web Speech Recognition (Voice Input)
  const toggleSpeechRecognition = (field: 'obs' | 'signs') => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t('farmerInputs.voiceNotSupported'));
      return;
    }

    if (field === 'obs' && isListeningObs) {
      setIsListeningObs(false);
      return;
    }
    if (field === 'signs' && isListeningSigns) {
      setIsListeningSigns(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';

      if (field === 'obs') {
        setIsListeningObs(true);
      } else {
        setIsListeningSigns(true);
      }
      setVoiceNotification(t('farmerInputs.listening'));

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (field === 'obs') {
          setDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
        } else {
          setVisibleClinicalSigns((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setVoiceNotification('');
      };

      recognition.onerror = (e: any) => {
        console.error('Speech error:', e);
        setIsListeningObs(false);
        setIsListeningSigns(false);
        setVoiceNotification('');
      };

      recognition.onend = () => {
        setIsListeningObs(false);
        setIsListeningSigns(false);
        setVoiceNotification('');
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListeningObs(false);
      setIsListeningSigns(false);
      setVoiceNotification('');
    }
  };

  // Farmer Input Method: Audio Read-Aloud / Text-to-Speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Farmer Input Method: Quick 1-Tap Disease Presets
  const applyDiseasePreset = (preset: 'FMD' | 'LSD' | 'HS' | 'ANTHRAX') => {
    if (preset === 'FMD') {
      setSelectedSymptoms(['FEVER', 'VESICLES_MOUTH', 'VESICLES_FEET', 'SALIVATION', 'MILK_DROP']);
      setSeverity('SEVERE');
      setTemperatureC('40.5');
      setAppetiteLoss(true);
      setActivityReduced(true);
      setAppliedPresetName(t('farmerInputs.presetFmd'));
      if (language === 'ta') {
        setVisibleClinicalSigns('வாய் மற்றும் நாக்கில் கொப்புளங்கள், அதிக நுரை போன்ற உமிழ்நீர், காலில் புண்கள் காரணமாக நொண்டல்.');
        setDescription('கால்நடையில் தீவிர காய்ச்சலுடன் வாய் மற்றும் கால்களில் புண்கள் காணப்படுகின்றன. கோமாரி நோய் அறிகுறி தென்படுகிறது.');
      } else {
        setVisibleClinicalSigns('Oral mucosa erosions, heavy frothy salivation, lameness with interdigital lesions.');
        setDescription('Animal exhibiting acute fever with oral vesicles and foot lesions typical of suspected FMD.');
      }
    } else if (preset === 'LSD') {
      setSelectedSymptoms(['FEVER', 'SKIN_NODULES']);
      setSeverity('MODERATE');
      setTemperatureC('39.8');
      setAppetiteLoss(true);
      setAppliedPresetName(t('farmerInputs.presetLsd'));
      if (language === 'ta') {
        setVisibleClinicalSigns('உடல் முழுவதும் உருண்டையான தோல் கட்டிகள், கணுக்கால் வீக்கம்.');
        setDescription('உடலெங்கும் தோல் கழலை / அம்மை கட்டிகள் தென்படுகின்றன.');
      } else {
        setVisibleClinicalSigns('Circumscribed round skin nodules across body, limb edema.');
        setDescription('Nodular skin lesions suspected for Lumpy Skin Disease (LSD).');
      }
    } else if (preset === 'HS') {
      setSelectedSymptoms(['FEVER', 'RESPIRATORY_DISTRESS', 'THROAT_SWELLING']);
      setSeverity('CRITICAL');
      setTemperatureC('41.0');
      setAppetiteLoss(true);
      setActivityReduced(true);
      setAppliedPresetName(t('farmerInputs.presetHs'));
      if (language === 'ta') {
        setVisibleClinicalSigns('தொண்டை வீக்கம், கடினமான இரைப்பு சுவாசம், அதிக காய்ச்சல்.');
        setDescription('திடீர் அதிக காய்ச்சலுடன் தொண்டை வீக்கம் மற்றும் இரைப்பு சுவாசம் காணப்படுகிறது. தொண்டை அடைப்பான் சந்தேகம்.');
      } else {
        setVisibleClinicalSigns('Submandibular hot painful edema, labored grunting respiration.');
        setDescription('Acute onset of high fever and throat swelling with respiratory distress (suspected HS).');
      }
    } else if (preset === 'ANTHRAX') {
      setSelectedSymptoms(['FEVER', 'SUDDEN_DEATH']);
      setSeverity('CRITICAL');
      setMortalityFlag(true);
      setAppliedPresetName(t('farmerInputs.presetAnthrax'));
      if (language === 'ta') {
        setVisibleClinicalSigns('முன் அறிகுறிகள் இன்றி திடீர் மரணம், ரத்த ஒழுக்கு.');
        setDescription('எந்தவொரு முன் அறிகுறியுமின்றி கால்நடை திடீரென உயிரிழந்தது.');
      } else {
        setVisibleClinicalSigns('Sudden collapse and mortality with dark unclotted discharge.');
        setDescription('Peracute sudden death without prior illness, suspecting Anthrax.');
      }
    }
  };

  const handleClearSelection = () => {
    setSelectedSymptoms([]);
    setAppliedPresetName('');
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

      // Navigate to vet triage queue if requested
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
          <span>{t('onlineStatus')}</span>
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
                  {t('reportForm.referenceId')}{' '}
                  <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {result.id}
                  </span>
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
              {result.assessedRisk.ruleScore}/100 ({result.assessedRisk.riskLevel})
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
              {t('reportForm.assignedVetInfo')}
            </p>
          </div>

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
            <span>{t('reportForm.offlineNotice')}</span>
          </div>
          <button
            onClick={() => setOfflineSaved(false)}
            className="text-amber-900 font-bold hover:underline"
          >
            {t('common.dismiss')}
          </button>
        </div>
      )}

      {draftSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t('reportForm.draftNotice')}</span>
          </div>
          <button
            onClick={() => setDraftSaved(false)}
            className="text-emerald-900 font-bold hover:underline"
          >
            {t('common.dismiss')}
          </button>
        </div>
      )}

      {/* Voice Notification Banner */}
      {voiceNotification && (
        <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-center gap-3 text-xs text-rose-800 animate-pulse">
          <Mic className="w-4 h-4 text-rose-600 animate-bounce" />
          <span className="font-semibold">{voiceNotification}</span>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
        {/* Form Title & Subtitle */}
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

        {/* FARMER INPUT METHOD: Quick 1-Tap Disease Outbreak Presets */}
        <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 rounded-2xl border border-emerald-200 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{t('farmerInputs.quickPresets')}</span>
            </div>
            {selectedSymptoms.length > 0 && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 transition self-start sm:self-auto"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('farmerInputs.clearAll')}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => applyDiseasePreset('FMD')}
              className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition flex flex-col gap-1 ${
                appliedPresetName === t('farmerInputs.presetFmd')
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-800 border-emerald-200 hover:bg-emerald-100/60'
              }`}
            >
              <span className="text-base">🐄 🦶</span>
              <span>{t('farmerInputs.presetFmd')}</span>
              <span className={`text-[10px] ${appliedPresetName === t('farmerInputs.presetFmd') ? 'text-emerald-100' : 'text-slate-500'}`}>
                {language === 'ta' ? 'வாய், கால் புண், உமிழ்நீர்' : 'Blisters, Hoof sores, Saliva'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => applyDiseasePreset('LSD')}
              className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition flex flex-col gap-1 ${
                appliedPresetName === t('farmerInputs.presetLsd')
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-800 border-emerald-200 hover:bg-emerald-100/60'
              }`}
            >
              <span className="text-base">🐂 🔘</span>
              <span>{t('farmerInputs.presetLsd')}</span>
              <span className={`text-[10px] ${appliedPresetName === t('farmerInputs.presetLsd') ? 'text-emerald-100' : 'text-slate-500'}`}>
                {language === 'ta' ? 'தோல் கட்டிகள், காய்ச்சல்' : 'Nodules, Pyrexia'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => applyDiseasePreset('HS')}
              className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition flex flex-col gap-1 ${
                appliedPresetName === t('farmerInputs.presetHs')
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-slate-800 border-emerald-200 hover:bg-emerald-100/60'
              }`}
            >
              <span className="text-base">🫁 🔴</span>
              <span>{t('farmerInputs.presetHs')}</span>
              <span className={`text-[10px] ${appliedPresetName === t('farmerInputs.presetHs') ? 'text-emerald-100' : 'text-slate-500'}`}>
                {language === 'ta' ? 'தொண்டை வீக்கம், மூச்சுத்திணறல்' : 'Throat edema, Distress'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => applyDiseasePreset('ANTHRAX')}
              className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition flex flex-col gap-1 ${
                appliedPresetName === t('farmerInputs.presetAnthrax')
                  ? 'bg-rose-700 text-white border-rose-800 shadow-xs'
                  : 'bg-white text-rose-900 border-rose-200 hover:bg-rose-100/60'
              }`}
            >
              <span className="text-base">⚠️ 💀</span>
              <span>{t('farmerInputs.presetAnthrax')}</span>
              <span className={`text-[10px] ${appliedPresetName === t('farmerInputs.presetAnthrax') ? 'text-rose-100' : 'text-slate-500'}`}>
                {language === 'ta' ? 'திடீர் மரணம், காய்ச்சல்' : 'Sudden Death, High Fever'}
              </span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                  <option value="">{t('reportForm.generalHerd')}</option>
                  {animals.map((a) => {
                    const speciesLabel = t(`species.${a.species}`) || a.species;
                    return (
                      <option key={a.id} value={a.id}>
                        Tag #{a.tagNumber} ({speciesLabel} - {a.breed || (language === 'ta' ? 'நாட்டு இனம்' : 'Local')})
                      </option>
                    );
                  })}
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
                  <option value="Cattle">{t('species.Cattle')}</option>
                  <option value="Buffalo">{t('species.Buffalo')}</option>
                  <option value="Goat">{t('species.Goat')}</option>
                  <option value="Sheep">{t('species.Sheep')}</option>
                  <option value="Poultry">{t('species.Poultry')}</option>
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
                  placeholder={t('reportForm.breedPlaceholder')}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Quick Breeds Selection Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">{t('farmerInputs.quickBreeds')}</span>
              {QUICK_BREEDS.map((b) => {
                const label = language === 'ta' ? b.ta : language === 'hi' ? b.hi : language === 'mr' ? b.mr : b.en;
                return (
                  <button
                    key={b.en}
                    type="button"
                    onClick={() => setBreed(label)}
                    className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 border border-slate-200 transition"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Clinical Signs & Symptoms */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('reportForm.section2')} <span className="text-rose-500">*</span>
              </h3>
              <span className="text-[11px] text-slate-500">{t('reportForm.selectAll')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SYMPTOM_OPTIONS.map((sym) => {
                const isChecked = selectedSymptoms.includes(sym.code);
                const name = t(`symptoms.${sym.code}.name`);
                const desc = t(`symptoms.${sym.code}.desc`);
                const category = t(`symptoms.${sym.code}.category`);

                return (
                  <div
                    key={sym.code}
                    className={`p-3 rounded-xl border text-left flex items-start justify-between gap-2 transition ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      onClick={() => handleSymptomToggle(sym.code)}
                      className="flex-1 cursor-pointer flex items-start gap-2.5"
                    >
                      <span className="text-lg leading-none mt-0.5">{sym.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{name}</div>
                        {desc && <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>}
                        <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {category}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {/* Checkbox Icon */}
                      <button
                        type="button"
                        onClick={() => handleSymptomToggle(sym.code)}
                        className={`w-5 h-5 rounded border flex items-center justify-center text-xs transition ${
                          isChecked
                            ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && '✓'}
                      </button>

                      {/* Text-To-Speech Listen Button for Farmers */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(name);
                        }}
                        title={t('farmerInputs.listenSymptom')}
                        className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-100/50 transition"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
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
                  <option value="MILD">{t('severity.MILD')}</option>
                  <option value="MODERATE">{t('severity.MODERATE')}</option>
                  <option value="SEVERE">{t('severity.SEVERE')}</option>
                  <option value="CRITICAL">{t('severity.CRITICAL')}</option>
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
                    placeholder={t('reportForm.tempPlaceholder')}
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
                  <span className="font-bold text-rose-600">
                    {milkYieldDropPct}% {t('reportForm.milkReduction')}
                  </span>
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
              <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs cursor-pointer hover:bg-slate-100 transition">
                <input
                  type="checkbox"
                  checked={appetiteLoss}
                  onChange={(e) => setAppetiteLoss(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="font-medium text-slate-700">{t('reportForm.appetiteLoss')}</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs cursor-pointer hover:bg-slate-100 transition">
                <input
                  type="checkbox"
                  checked={activityReduced}
                  onChange={(e) => setActivityReduced(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="font-medium text-slate-700">{t('reportForm.activityReduced')}</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-xs cursor-pointer text-rose-900 font-semibold hover:bg-rose-100 transition">
                <input
                  type="checkbox"
                  checked={mortalityFlag}
                  onChange={(e) => setMortalityFlag(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
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
                    <span>{locating ? t('reportForm.gpsDetecting') : t('reportForm.gpsDetect')}</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {t('reportForm.clinicalNotes')}
                  </label>
                  {/* Farmer Voice Input Button for Clinical Notes */}
                  <button
                    type="button"
                    onClick={() => toggleSpeechRecognition('signs')}
                    title={t('farmerInputs.voiceInput')}
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md transition ${
                      isListeningSigns
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isListeningSigns ? t('farmerInputs.stopListening') : t('farmerInputs.voiceInput')}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={visibleClinicalSigns}
                  onChange={(e) => setVisibleClinicalSigns(e.target.value)}
                  placeholder={t('reportForm.clinicalPlaceholder')}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {t('reportForm.farmerObs')}
                </label>
                {/* Farmer Voice Input Button for Observations */}
                <button
                  type="button"
                  onClick={() => toggleSpeechRecognition('obs')}
                  title={t('farmerInputs.voiceInput')}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                    isListeningObs
                      ? 'bg-rose-600 text-white animate-pulse shadow-sm'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isListeningObs ? t('farmerInputs.stopListening') : t('farmerInputs.voiceInput')}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('reportForm.farmerObsPlaceholder')}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Sparkle className="w-3 h-3 text-amber-500" />
                <span>{t('farmerInputs.voiceHelp')}</span>
              </p>
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
