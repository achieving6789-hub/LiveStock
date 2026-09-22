import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  Stethoscope,
  FlaskConical,
  Building2,
  MapPin,
  Users,
  FileText,
  ShieldAlert,
  ClipboardList,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeRole } = useAuth();
  const { t } = useLanguage();

  const getNavLinks = () => {
    switch (activeRole) {
      case 'FARMER':
        return [
          { to: '/farmer', label: t('menu.farmerDashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/farmer/animals', label: t('menu.myLivestock'), icon: <ClipboardList className="w-4 h-4" /> },
          { to: '/farmer/report', label: t('menu.reportHealth'), icon: <Activity className="w-4 h-4" /> },
          { to: '/farmer/mortality', label: t('menu.reportMortality'), icon: <AlertTriangle className="w-4 h-4" /> },
          { to: '/farmer/advisories', label: t('menu.advisories'), icon: <ShieldAlert className="w-4 h-4" /> },
        ];
      case 'FIELD_WORKER':
        return [
          { to: '/field-worker', label: t('menu.fieldDashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/field-worker/reports', label: t('menu.allReports'), icon: <ClipboardList className="w-4 h-4" /> },
          { to: '/field-worker/assigned', label: t('menu.assignedCases'), icon: <Activity className="w-4 h-4" /> },
        ];
      case 'VETERINARIAN':
        return [
          { to: '/veterinarian', label: t('menu.vetDashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/veterinarian/queue', label: t('menu.priorityQueue'), icon: <AlertTriangle className="w-4 h-4" /> },
          { to: '/veterinarian/investigations', label: t('menu.investigations'), icon: <Stethoscope className="w-4 h-4" /> },
          { to: '/veterinarian/samples', label: t('menu.samples'), icon: <FlaskConical className="w-4 h-4" /> },
        ];
      case 'LAB_STAFF':
        return [
          { to: '/lab', label: t('menu.labDashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/lab/samples', label: t('menu.sampleQueue'), icon: <FlaskConical className="w-4 h-4" /> },
          { to: '/lab/results', label: t('menu.resultsValidation'), icon: <FileText className="w-4 h-4" /> },
        ];
      case 'DISTRICT_OFFICER':
        return [
          { to: '/district', label: t('menu.districtCommand'), icon: <Building2 className="w-4 h-4" /> },
          { to: '/district/surveillance', label: t('menu.gisHotspots'), icon: <MapPin className="w-4 h-4" /> },
          { to: '/district/mortality', label: t('menu.mortalityTracking'), icon: <AlertTriangle className="w-4 h-4" /> },
        ];
      case 'STATE_ADMIN':
        return [
          { to: '/state', label: t('menu.stateSurveillance'), icon: <Building2 className="w-4 h-4" /> },
          { to: '/state/districts', label: t('menu.districtComparison'), icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/state/gis', label: t('menu.stateGis'), icon: <MapPin className="w-4 h-4" /> },
        ];
      case 'SUPER_ADMIN':
      default:
        return [
          { to: '/admin', label: t('menu.adminCommand'), icon: <LayoutDashboard className="w-4 h-4" /> },
          { to: '/admin/users', label: t('menu.userManagement'), icon: <Users className="w-4 h-4" /> },
          { to: '/admin/audit', label: t('menu.securityAudit'), icon: <ShieldAlert className="w-4 h-4" /> },
          { to: '/veterinarian', label: t('menu.vetDashboard'), icon: <Stethoscope className="w-4 h-4" /> },
          { to: '/state', label: t('menu.stateSurveillance'), icon: <Building2 className="w-4 h-4" /> },
        ];
    }
  };

  const links = getNavLinks();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-3">
            {t('menu.surveillanceMenu')}
          </div>
          <nav className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-xs text-slate-500">
        <div className="font-semibold text-slate-700 mb-1">{t('disclaimerTitle')}</div>
        <p className="leading-relaxed">
          {t('disclaimerText')}
        </p>
      </div>
    </aside>
  );
};
