import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft, CheckCircle2, Clock, Activity, ShieldCheck, Stethoscope, FlaskConical } from 'lucide-react';

export const AnimalTimelinePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const isTa = language === 'ta';

  useEffect(() => {
    api.get(`/animals/${id}/timeline`)
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        {isTa ? 'கால்நடை சுகாதார காலவரிசை ஏற்றப்படுகிறது...' : 'Loading animal health timeline...'}
      </div>
    );
  }

  if (!data || !data.animal) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        {isTa ? 'கால்நடை பதிவு கிடைக்கவில்லை.' : 'Animal record not found.'}{' '}
        <Link to="/farmer/animals" className="text-emerald-600 font-bold">
          {isTa ? 'பதிவேட்டிற்குத் திரும்பு' : 'Return to Registry'}
        </Link>
      </div>
    );
  }

  const { animal, timeline } = data;
  const speciesName = t(`species.${animal.species}`) || animal.species;

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'REGISTRATION':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'VACCINATION':
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      case 'HEALTH_REPORT':
        return <Activity className="w-4 h-4 text-amber-600" />;
      case 'INVESTIGATION':
        return <Stethoscope className="w-4 h-4 text-indigo-600" />;
      case 'LABORATORY':
        return <FlaskConical className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/farmer/animals"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isTa ? 'கால்நடை பதிவேட்டிற்குத் திரும்பு' : 'Back to Livestock Registry'}</span>
      </Link>

      {/* Animal Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
              Tag #{animal.tagNumber}
            </span>
            <span className="text-xs text-slate-500">
              {isTa ? 'கிராமம்: கல்லாநூர்' : 'Village: Kallanur'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {animal.breed || speciesName}
          </h1>
          <p className="text-xs text-slate-500">
            {speciesName} &bull; {animal.gender === 'FEMALE' ? t('animalsRegistry.female') : t('animalsRegistry.male')} &bull; {animal.ageMonths} {isTa ? 'மாதங்கள்' : 'months'}
          </p>
        </div>

        <Link
          to="/farmer/report"
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 text-center"
        >
          {t('menu.reportHealth')}
        </Link>
      </div>

      {/* Unified Timeline Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100">
          {isTa ? 'ஒருங்கிணைந்த மருத்துவ காலவரிசை' : 'Unified Health & Clinical Timeline'}
        </h3>

        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {timeline.map((event: any) => (
            <div key={event.id} className="relative">
              <div className="absolute -left-[29px] top-0 w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center">
                {getTimelineIcon(event.type)}
              </div>
              <div className="text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">{event.title}</h4>
                  <span className="text-[11px] text-slate-400">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
