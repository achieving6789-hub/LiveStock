import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatCard } from '../../components/common/StatCard';
import { RiskBadge } from '../../components/common/RiskBadge';
import { PlusCircle, AlertTriangle, ShieldCheck, HeartPulse, Sparkles, MapPin, Eye, CheckCircle2, PhoneCall, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ObservationItem {
  tag: string;
  speciesEn: string;
  speciesTa: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  score: number;
  symptomsEn: string;
  symptomsTa: string;
  statusEn: string;
  statusTa: string;
  timeAgoEn: string;
  timeAgoTa: string;
  temp: string;
  milkDropEn: string;
  milkDropTa: string;
  assignedVetEn: string;
  assignedVetTa: string;
  vetNotesEn: string;
  vetNotesTa: string;
}

const OBSERVATIONS: ObservationItem[] = [
  {
    tag: 'Tag #IN-TN-9821',
    speciesEn: 'Dairy Cow (Crossbred Holstein)',
    speciesTa: 'கறவை மாடு (கலப்பின ஹோல்ஸ்டீன்)',
    riskLevel: 'HIGH',
    score: 68,
    symptomsEn: 'High fever (104.2 F), vesicular lesions on gums and tongue, acute salivation.',
    symptomsTa: 'அதிக காய்ச்சல் (104.2°F), நாக்கு மற்றும் ஈறுகளில் புண்கள், அதிக உமிழ்நீர் வடிதல்.',
    statusEn: 'Assigned to Dr. Sundaramurthy (Vet Surgeon) - Sample Dispatched to RADDL',
    statusTa: 'டாக்டர் சுந்தரமூர்த்தி அவர்களுக்கு ஒதுக்கப்பட்டுள்ளது - மாதிரி ஆய்வகத்திற்கு அனுப்பப்பட்டது',
    timeAgoEn: '2h ago',
    timeAgoTa: '2 மணி நேரம் முன்',
    temp: '40.1°C (104.2°F)',
    milkDropEn: '65% drop in morning milking',
    milkDropTa: 'காலை பால் கறவையில் 65% குறைவு',
    assignedVetEn: 'Dr. Sundaramurthy B.V.Sc (Mobile Vet Unit #3)',
    assignedVetTa: 'டாக்டர் சுந்தரமூர்த்தி B.V.Sc (நடமாடும் மருத்துவ ஊர்தி #3)',
    vetNotesEn: 'Clinical signs highly consistent with vesicular stomatitis / FMD. Quarantine ordered; sample sent to lab via cold chain.',
    vetNotesTa: 'அறிகுறிகள் கோமாரி நோய் (FMD) தாக்கத்தை காட்டுகின்றன. கால்நடையை தனிமைப்படுத்த உத்தரவிடப்பட்டுள்ளது; குளிர்சங்கிலி மூலம் மாதிரி ஆய்வகத்திற்கு அனுப்பப்பட்டுள்ளது.',
  },
  {
    tag: 'Tag #IN-TN-9824',
    speciesEn: 'Calf (Female, 4 Months)',
    speciesTa: 'கன்றுக்குட்டி (பெண், 4 மாதங்கள்)',
    riskLevel: 'LOW',
    score: 15,
    symptomsEn: 'Mild dullness, appetite normalized post-electrolyte rehydration.',
    symptomsTa: 'மிதமான சோர்வு, எலக்ட்ரோலைட் நீர் வழங்கிய பின் தீவனம் எடுத்துக்கொள்கிறது.',
    statusEn: 'Routine monitoring advised',
    statusTa: 'வழக்கமான கண்காணிப்பு பரிந்துரைக்கப்பட்டது',
    timeAgoEn: '1d ago',
    timeAgoTa: '1 நாள் முன்',
    temp: '38.7°C (Normal)',
    milkDropEn: 'N/A',
    milkDropTa: 'பொருந்தாது',
    assignedVetEn: 'Para-vet Arumugam (Attur Center)',
    assignedVetTa: 'கால்நடை ஆய்வாளர் ஆறுமுகம் (ஆத்தூர் மையம்)',
    vetNotesEn: 'Mild dehydration resolved. Temperature and mucosal color normal.',
    vetNotesTa: 'நீரிழப்பு சரியானது. உடல் வெப்பநிலை மற்றும் சளிச்சவ்வு நிறம் இயல்பாக உள்ளது.',
  },
];

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [selectedObs, setSelectedObs] = useState<ObservationItem | null>(null);
  const [biosecurityAcknowledged, setBiosecurityAcknowledged] = useState(false);
  const [helplineModalOpen, setHelplineModalOpen] = useState(false);

  const isTa = language === 'ta';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              {t('farmer.portalBadge')}
            </span>
            <span className="text-xs text-emerald-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {isTa ? 'சேலம் மாவட்டம், கல்லாநூர் கிராமம்' : 'Salem District, Kallanur Village'}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            {t('farmer.welcome')}, {user?.fullName}
          </h1>
          <p className="text-xs text-emerald-200/90 mt-1 max-w-xl">
            {isTa
              ? 'உங்கள் கால்நடைகளுக்கான நேரடி கண்காணிப்பு மற்றும் முன் எச்சரிக்கை அமைப்பு. உடனடி மருத்துவ உதவிக்கு தகவல்களை புதுப்பிக்கவும்.'
              : 'Live surveillance and early-warning decision support for your livestock. Keep observations updated for prompt veterinary assistance.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/farmer/report"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('farmer.reportBtn')}</span>
          </Link>
          <Link
            to="/farmer/mortality"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition border border-white/20"
          >
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>{t('farmer.mortalityBtn')}</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('farmer.registeredLivestock')}
          value="18"
          subtitle={isTa ? '12 மாடுகள், 6 ஆடுகள்' : '12 Cattle, 6 Goats'}
          icon={<HeartPulse className="w-4 h-4" />}
        />
        <StatCard
          title={t('farmer.activeReports')}
          value="2"
          subtitle={isTa ? '1 மருத்துவர் ஆய்வில் உள்ளது' : '1 Under Vet Investigation'}
          icon={<PlusCircle className="w-4 h-4" />}
        />
        <StatCard
          title={t('farmer.vaccinationStatus')}
          value="88%"
          subtitle={t('farmer.fmdDue')}
          icon={<ShieldCheck className="w-4 h-4" />}
        />
        <StatCard
          title={t('farmer.villageRisk')}
          value={isTa ? 'மிதமானது' : 'MODERATE'}
          subtitle={t('farmer.clusterRisk')}
          badge={<RiskBadge level="MODERATE" score={42} />}
        />
      </div>

      {/* Actionable Feeds & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Animal Health Status */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('farmer.recentObs')}</h3>
              <p className="text-xs text-slate-500">
                {isTa ? 'பிராந்திய கால்நடை மருத்துவ பதிவேட்டுடன் ஒத்திசைக்கப்பட்டது' : 'Auto-synced with regional veterinary registry'}
              </p>
            </div>
            <Link
              to="/farmer/animals"
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              {t('farmer.viewLivestock')}
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {OBSERVATIONS.map((obs) => (
              <div key={obs.tag} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">
                      {obs.tag} ({isTa ? obs.speciesTa : obs.speciesEn})
                    </span>
                    <RiskBadge level={obs.riskLevel} score={obs.score} />
                  </div>
                  <p className="text-xs text-slate-600">
                    {isTa ? obs.symptomsTa : obs.symptomsEn}
                  </p>
                  <div className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded inline-block border border-amber-200 font-medium">
                    {isTa ? obs.statusTa : obs.statusEn}
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <span className="text-xs text-slate-400">{isTa ? obs.timeAgoTa : obs.timeAgoEn}</span>
                  <button
                    onClick={() => setSelectedObs(obs)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition border border-slate-200"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('common.view')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI-Assisted Preventive Advisory */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">{t('farmer.aiAdvisory')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {isTa
                ? 'உங்கள் கிராமத்திலிருந்து 8 கி.மீ சுற்றளவில் கால் புண் மற்றும் கொப்புளங்கள் தொடர்பான புகார்கள் பதிவாகியுள்ளன.'
                : 'Our regional surveillance model flagged a potential emerging cluster of vesicular lesion reports within 8 km of your village.'}
            </p>
            <div className="space-y-2.5">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200/80 text-xs">
                <span className="font-bold text-emerald-900 block mb-0.5">
                  {isTa ? 'உயிரியல் பாதுகாப்பு பரிந்துரை:' : 'Biosecurity Recommendation:'}
                </span>
                <span className="text-emerald-800">
                  {isTa
                    ? 'அடுத்த 7 நாட்களுக்கு பொது நீர்நிலைகளில் மேய்ப்பதை தவிர்க்கவும்.'
                    : 'Restrict common grazing at community waterholes for the next 7 days.'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-0.5">
                  {isTa ? 'தடுப்பூசி சரிபார்ப்பு:' : 'Vaccination Review:'}
                </span>
                <span className="text-slate-600">
                  {isTa
                    ? 'கோமாரி நோய் (FMD) பூஸ்டர் தடுப்பூசியை உள்ளூர் மருத்துவரிடம் சரிபார்க்கவும்.'
                    : 'Verify booster records for Foot-and-Mouth Disease (FMD) with local para-vet.'}
                </span>
              </div>
            </div>

            <div className="mt-4">
              {biosecurityAcknowledged ? (
                <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-lg text-xs text-emerald-900 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{isTa ? 'பாதுகாப்பு ஆலோசனைகள் ஏற்கப்பட்டன.' : 'Biosecurity precautions acknowledged & active.'}</span>
                </div>
              ) : (
                <button
                  onClick={() => setBiosecurityAcknowledged(true)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                >
                  {isTa ? 'பாதுகாப்பு ஆலோசனையை ஏற்கவும்' : 'Acknowledge Biosecurity Advice'}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">{isTa ? 'அவசர உதவி எண்:' : 'Emergency Helpline:'}</span>
            <button
              onClick={() => setHelplineModalOpen(true)}
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>1800-425-0012</span>
            </button>
          </div>
        </div>
      </div>

      {/* Observation Modal */}
      {selectedObs && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{selectedObs.tag}</h3>
                  <p className="text-xs text-slate-500">{isTa ? selectedObs.speciesTa : selectedObs.speciesEn}</p>
                </div>
              </div>
              <button onClick={() => setSelectedObs(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">{isTa ? 'பதிவான வெப்பநிலை:' : 'Recorded Temperature:'}</span>
                  <span className="font-bold text-slate-800">{selectedObs.temp}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">{isTa ? 'பால் உற்பத்தி பாதிப்பு:' : 'Milk Yield Impact:'}</span>
                  <span className="font-bold text-slate-800">{isTa ? selectedObs.milkDropTa : selectedObs.milkDropEn}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <span className="font-bold block mb-1">{isTa ? 'தற்போதைய மருத்துவ நிலை:' : 'Current Veterinary Status:'}</span>
                <p className="leading-relaxed">{isTa ? selectedObs.statusTa : selectedObs.statusEn}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                <span className="font-bold block mb-1">
                  {isTa ? 'கால்நடை மருத்துவர் குறிப்பு:' : 'Attending Surgeon Notes:'} ({isTa ? selectedObs.assignedVetTa : selectedObs.assignedVetEn})
                </span>
                <p className="text-slate-600 leading-relaxed">{isTa ? selectedObs.vetNotesTa : selectedObs.vetNotesEn}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedObs(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Helpline Modal */}
      {helplineModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  {isTa ? 'கால்நடை அவசர உதவி சேவை' : 'Veterinary Emergency Response'}
                </h3>
              </div>
              <button onClick={() => setHelplineModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <div className="font-bold">{isTa ? 'சேலம் மாவட்ட விரைவு உதவி மையம்:' : 'Salem On-Duty Rapid Response Desk:'}</div>
                <div className="text-lg font-mono font-bold mt-1 text-emerald-800">1800-425-0012</div>
                <div className="text-[11px] text-emerald-700 mt-1">
                  {isTa ? 'இலவச 24x7 அவசர சிகிச்சை உதவி' : 'Toll-free 24x7 livestock emergency assistance'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800">{isTa ? 'வட்டார மருத்துவ அலுவலர்:' : 'Attending Block Officer:'}</div>
                <div className="text-slate-600 mt-0.5">{isTa ? 'டாக்டர் சுந்தரமூர்த்தி B.V.Sc' : 'Dr. Sundaramurthy B.V.Sc'}</div>
                <div className="text-slate-500 font-mono text-[11px] mt-0.5">+91 94432-88192</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setHelplineModalOpen(false)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
