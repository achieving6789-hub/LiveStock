import React from 'react';
import { Link } from 'react-router-dom';
import { RiskBadge } from '../../components/common/RiskBadge';
import { ShieldAlert, ArrowLeft, MapPin, Bell } from 'lucide-react';

export const AdvisoriesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/farmer"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Farmer Dashboard</span>
      </Link>

      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Regional Advisories & Risk Alerts</h1>
          <p className="text-xs text-slate-500">
            Real-time disease intelligence and biosecurity protocols issued by veterinary authorities.
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
                  Potential Emerging Cluster: Vesicular Lesions (Attur-Omalur Belt)
                </h3>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-600" /> Salem District &bull; Issued by State Surveillance Unit
                </span>
              </div>
            </div>
            <RiskBadge level="HIGH" score={68} />
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Epidemiological models detect a rise in vesicular lesions and sudden pyrexia among cloven-hoofed animals in villages adjacent to Attur. Farmers are advised to restrict shared water trough access and monitor cattle daily for lameness or mouth erosions.
          </p>

          <div className="p-3 bg-amber-50/70 rounded-xl text-xs text-amber-900 space-y-1">
            <span className="font-bold block">Recommended Preventive Measures:</span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              <li>Isolate animals showing mouth erosions or stringy salivation immediately.</li>
              <li>Disinfect shed entryways with 4% sodium carbonate or approved agricultural biocide.</li>
              <li>Report any sudden mortality immediately through the platform or toll-free helpline 1800-425-0012.</li>
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
                  Upcoming Prophylactic Vaccination Campaign: Foot-and-Mouth Disease (FMD)
                </h3>
                <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  Scheduled for Oct 1st - Oct 15th
                </span>
              </div>
            </div>
            <RiskBadge level="LOW" score={15} />
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Free door-to-door vaccination will be conducted by Department para-vets for all eligible cattle and buffalo older than 4 months. Please ensure ear tags are visible for recording.
          </p>
        </div>
      </div>
    </div>
  );
};
