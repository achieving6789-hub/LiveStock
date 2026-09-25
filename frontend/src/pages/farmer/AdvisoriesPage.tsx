import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { RiskBadge } from '../../components/common/RiskBadge';
import { ShieldAlert, ArrowLeft, MapPin, Bell } from 'lucide-react';

export const AdvisoriesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const isTa = language === 'ta';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/farmer"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('advisoriesPage.back')}</span>
      </Link>

      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{t('advisoriesPage.title')}</h1>
          <p className="text-xs text-slate-500">
            {t('advisoriesPage.subTitle')}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Advisory 1 */}
        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-50 text-amber-700 font-bold">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {isTa
                    ? 'நோய் பரவல் எச்சரிக்கை: கொப்புளங்கள் மற்றும் வாய் புண்கள் (ஆத்தூர்-ஓமலூர் பகுதி)'
                    : 'Potential Emerging Cluster: Vesicular Lesions (Attur-Omalur Belt)'}
                </h3>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  {isTa ? 'சேலம் மாவட்டம் • மாநில கண்காணிப்பு பிரிவு வழங்கியது' : 'Salem District • Issued by State Surveillance Unit'}
                </span>
              </div>
            </div>
            <RiskBadge level="HIGH" score={68} />
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {isTa
              ? 'ஆத்தூர் சுற்றியுள்ள கிராமங்களில் குளம்பு கால்நடைகளுக்கு கொப்புளங்கள் மற்றும் திடீர் காய்ச்சல் அதிகரித்துள்ளதாக பதிவாகியுள்ளது. விவசாயிகள் பொது நீர்நிலைகளில் நீர் புகட்டுவதை தவிர்க்கவும், கால்நடைகளுக்கு நொண்டல் அல்லது வாய் புண் உள்ளதா என்பதை தினசரி கண்காணிக்கவும்.'
              : 'Epidemiological models detect a rise in vesicular lesions and sudden pyrexia among cloven-hoofed animals in villages adjacent to Attur. Farmers are advised to restrict shared water trough access and monitor cattle daily for lameness or mouth erosions.'}
          </p>

          <div className="p-3 bg-amber-50/70 rounded-xl text-xs text-amber-900 space-y-1">
            <span className="font-bold block">{t('advisoriesPage.preventiveTitle')}</span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              {isTa ? (
                <>
                  <li>வாய் புண் அல்லது உமிழ்நீர் வடியும் கால்நடைகளை உடனடியாக தனிமைப்படுத்தவும்.</li>
                  <li>கொட்டகை வாசலில் 4% சோடியம் கார்பனேட் கரைசல் கொண்டு கிருமி நீக்கம் செய்யவும்.</li>
                  <li>திடீர் இறப்பு அல்லது தீவிர அறிகுறிகள் தென்பட்டால் 1800-425-0012 என்ற இலவச எண்ணை அழைக்கவும்.</li>
                </>
              ) : (
                <>
                  <li>Isolate animals showing mouth erosions or stringy salivation immediately.</li>
                  <li>Disinfect shed entryways with 4% sodium carbonate or approved agricultural biocide.</li>
                  <li>Report any sudden mortality immediately through the platform or toll-free helpline 1800-425-0012.</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Advisory 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-blue-50 text-blue-700 font-bold">
                <Bell className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {isTa
                    ? 'முன்னெச்சரிக்கை தடுப்பூசி முகாம்: கோமாரி நோய் (FMD)'
                    : 'Upcoming Prophylactic Vaccination Campaign: Foot-and-Mouth Disease (FMD)'}
                </h3>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  {isTa ? 'திட்டமிடப்பட்ட காலம்: அக் 1 - அக் 15' : 'Scheduled for Oct 1st - Oct 15th'}
                </span>
              </div>
            </div>
            <RiskBadge level="LOW" score={15} />
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {isTa
              ? '4 மாதத்திற்கு மேற்பட்ட அனைத்து மாடுகள் மற்றும் எருமைகளுக்கு கால்நடை பராமரிப்புத்துறை மூலம் வீடு வீடாக சென்று இலவச தடுப்பூசி போடப்படும். பதிவிற்காக காது டேக் இருப்பதை உறுதிசெய்யவும்.'
              : 'Free door-to-door vaccination will be conducted by Department para-vets for all eligible cattle and buffalo older than 4 months. Please ensure ear tags are visible for recording.'}
          </p>
        </div>
      </div>
    </div>
  );
};
