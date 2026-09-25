import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft, CheckCircle2, Send, Skull, MapPin, Mic } from 'lucide-react';

export const ReportMortalityPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [species, setSpecies] = useState('Cattle');
  const [numberOfDeaths, setNumberOfDeaths] = useState<number>(1);
  const [suspectedCause, setSuspectedCause] = useState(
    language === 'ta'
      ? 'முன் அறிகுறிகள் இன்றி அதிக காய்ச்சல் மற்றும் திடீர் மயங்கி இறப்பு'
      : 'Acute fever and collapse without premonitory signs'
  );
  const [dateOfDeath, setDateOfDeath] = useState(new Date().toISOString().split('T')[0]);
  const [latitude, setLatitude] = useState(11.5985);
  const [longitude, setLongitude] = useState(78.5991);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [locating, setLocating] = useState(false);
  const [isListening, setIsListening] = useState(false);

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
        }
      );
    }
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t('farmerInputs.voiceNotSupported'));
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
      setIsListening(true);

      recognition.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setSuspectedCause((prev) => (prev ? `${prev} ${text}` : text));
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await api.post('/mortality', {
        species,
        numberOfDeaths,
        suspectedCause,
        dateOfDeath,
        latitude,
        longitude,
      });
      setResult(res.data.data.report);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit mortality report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/farmer"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('mortalityForm.back')}</span>
      </Link>

      {result && (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-rose-600" />
            <div>
              <h3 className="font-bold text-sm text-rose-950">{t('mortalityForm.successTitle')}</h3>
              <p className="text-xs text-rose-700">Reference: {result.id}</p>
            </div>
          </div>
          <p className="text-xs text-rose-800">
            {t('mortalityForm.successDesc')}
          </p>
          <div className="pt-2">
            <Link
              to="/farmer"
              className="inline-block px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700"
            >
              {t('mortalityForm.returnBtn')}
            </Link>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <Skull className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">{t('mortalityForm.title')}</h1>
            <p className="text-xs text-slate-500">
              {t('mortalityForm.subTitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('mortalityForm.species')} <span className="text-rose-500">*</span>
              </label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 font-medium bg-white"
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
                {t('mortalityForm.numberDeaths')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={numberOfDeaths}
                onChange={(e) => setNumberOfDeaths(parseInt(e.target.value) || 1)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 font-bold text-rose-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('mortalityForm.dateOfDeath')}</label>
              <input
                type="date"
                required
                value={dateOfDeath}
                onChange={(e) => setDateOfDeath(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t('mortalityForm.gps')}</label>
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
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{locating ? '...' : 'GPS'}</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                {t('mortalityForm.suspectedCause')}
              </label>
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md transition ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Mic className="w-3 h-3" />
                <span>{isListening ? t('farmerInputs.stopListening') : t('farmerInputs.voiceInput')}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={suspectedCause}
              onChange={(e) => setSuspectedCause(e.target.value)}
              placeholder={t('mortalityForm.suspectedPlaceholder')}
              className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t('mortalityForm.submit')}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
