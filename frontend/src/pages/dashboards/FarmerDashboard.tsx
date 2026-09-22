import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { RiskBadge } from '../../components/common/RiskBadge';
import { PlusCircle, AlertTriangle, ShieldCheck, HeartPulse, Sparkles, MapPin, Eye, CheckCircle2, PhoneCall, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ObservationItem {
  tag: string;
  species: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  score: number;
  symptoms: string;
  status: string;
  timeAgo: string;
  temp: string;
  milkDrop: string;
  assignedVet: string;
  vetNotes: string;
}

const OBSERVATIONS: ObservationItem[] = [
  {
    tag: 'Tag #IN-TN-9821',
    species: 'Dairy Cow (Crossbred Holstein)',
    riskLevel: 'HIGH',
    score: 68,
    symptoms: 'High fever (104.2 F), vesicular lesions on gums and tongue, acute salivation.',
    status: 'Assigned to Dr. Sundaramurthy (Vet Surgeon) - Sample Dispatched to RADDL',
    timeAgo: '2h ago',
    temp: '40.1°C (104.2°F)',
    milkDrop: '65% drop in morning milking',
    assignedVet: 'Dr. Sundaramurthy B.V.Sc (Mobile Vet Unit #3)',
    vetNotes: 'Clinical signs highly consistent with vesicular stomatitis / FMD. Quarantine ordered; sample sent to lab via cold chain.',
  },
  {
    tag: 'Tag #IN-TN-9824',
    species: 'Calf (Female, 4 Months)',
    riskLevel: 'LOW',
    score: 15,
    symptoms: 'Mild dullness, appetite normalized post-electrolyte rehydration.',
    status: 'Routine monitoring advised',
    timeAgo: '1d ago',
    temp: '38.7°C (Normal)',
    milkDrop: 'N/A',
    assignedVet: 'Para-vet Arumugam (Attur Center)',
    vetNotes: 'Mild dehydration resolved. Temperature and mucosal color normal.',
  },
];

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedObs, setSelectedObs] = useState<ObservationItem | null>(null);
  const [biosecurityAcknowledged, setBiosecurityAcknowledged] = useState(false);
  const [helplineModalOpen, setHelplineModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              Farmer / Herd Keeper Portal
            </span>
            <span className="text-xs text-emerald-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Salem District, Kallanur Village
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Welcome back, {user?.fullName}
          </h1>
          <p className="text-xs text-emerald-200/90 mt-1 max-w-xl">
            Live surveillance and early-warning decision support for your livestock. Keep observations updated for prompt veterinary assistance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/farmer/report"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Health Issue</span>
          </Link>
          <Link
            to="/farmer/mortality"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition border border-white/20"
          >
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span>Report Mortality</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Livestock"
          value="18"
          subtitle="12 Cattle, 6 Goats"
          icon={<HeartPulse className="w-4 h-4" />}
        />
        <StatCard
          title="Active Health Reports"
          value="2"
          subtitle="1 Under Vet Investigation"
          icon={<PlusCircle className="w-4 h-4" />}
        />
        <StatCard
          title="Vaccination Status"
          value="88%"
          subtitle="FMD Due in 14 Days"
          icon={<ShieldCheck className="w-4 h-4" />}
        />
        <StatCard
          title="Village Risk Advisory"
          value="MODERATE"
          subtitle="Foot Lesion signals in cluster"
          badge={<RiskBadge level="MODERATE" score={42} />}
        />
      </div>

      {/* Actionable Feeds & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Animal Health Status */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Animal Observations</h3>
              <p className="text-xs text-slate-500">Auto-synced with regional veterinary registry</p>
            </div>
            <Link
              to="/farmer/animals"
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              View All Livestock
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {OBSERVATIONS.map((obs) => (
              <div key={obs.tag} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">{obs.tag} ({obs.species})</span>
                    <RiskBadge level={obs.riskLevel} score={obs.score} />
                  </div>
                  <p className="text-xs text-slate-600">
                    {obs.symptoms}
                  </p>
                  <div className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded inline-block border border-amber-200">
                    {obs.status}
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <span className="text-xs text-slate-400">{obs.timeAgo}</span>
                  <button
                    onClick={() => setSelectedObs(obs)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition border border-slate-200"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Record</span>
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
              <h3 className="text-sm font-bold text-slate-900">AI-Assisted Risk Advisory</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Our regional surveillance model flagged a <strong>potential emerging cluster</strong> of vesicular lesion reports within 8 km of your village.
            </p>
            <div className="space-y-2.5">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200/80 text-xs">
                <span className="font-bold text-emerald-900 block mb-0.5">Biosecurity Recommendation:</span>
                <span className="text-emerald-800">
                  Restrict common grazing at community waterholes for the next 7 days.
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-800 block mb-0.5">Vaccination Review:</span>
                <span className="text-slate-600">
                  Verify booster records for Foot-and-Mouth Disease (FMD) with local para-vet.
                </span>
              </div>
            </div>

            <div className="mt-4">
              {biosecurityAcknowledged ? (
                <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-lg text-xs text-emerald-900 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Biosecurity precautions acknowledged & active.</span>
                </div>
              ) : (
                <button
                  onClick={() => setBiosecurityAcknowledged(true)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                >
                  Acknowledge Biosecurity Advice
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Emergency Helpline:</span>
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
                  <p className="text-xs text-slate-500">{selectedObs.species}</p>
                </div>
              </div>
              <button onClick={() => setSelectedObs(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Recorded Temperature:</span>
                  <span className="font-bold text-slate-800">{selectedObs.temp}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Milk Yield Impact:</span>
                  <span className="font-bold text-slate-800">{selectedObs.milkDrop}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <span className="font-bold block mb-1">Current Veterinary Status:</span>
                <p className="leading-relaxed">{selectedObs.status}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                <span className="font-bold block mb-1">Attending Surgeon Notes ({selectedObs.assignedVet}):</span>
                <p className="text-slate-600 leading-relaxed">{selectedObs.vetNotes}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedObs(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Close Record
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
                <h3 className="font-bold text-sm text-slate-900">Veterinary Emergency Response</h3>
              </div>
              <button onClick={() => setHelplineModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <div className="font-bold">Salem On-Duty Rapid Response Desk:</div>
                <div className="text-lg font-mono font-bold mt-1 text-emerald-800">1800-425-0012</div>
                <div className="text-[11px] text-emerald-700 mt-1">Toll-free 24x7 livestock emergency assistance</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800">Attending Block Officer:</div>
                <div className="text-slate-600 mt-0.5">Dr. Sundaramurthy B.V.Sc</div>
                <div className="text-slate-500 font-mono text-[11px] mt-0.5">+91 94432-88192</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setHelplineModalOpen(false)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
