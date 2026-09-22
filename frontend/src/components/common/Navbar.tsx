import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage, type SupportedLanguage } from '../../contexts/LanguageContext';
import { ShieldCheck, LogOut, Globe, Sparkles } from 'lucide-react';
import type { UserRole } from '../../types/auth';

import { useNavigate } from 'react-router-dom';

const ALL_ROLES: UserRole[] = [
  'FARMER',
  'FIELD_WORKER',
  'VETERINARIAN',
  'LAB_STAFF',
  'DISTRICT_OFFICER',
  'STATE_ADMIN',
  'SUPER_ADMIN',
];

const ROLE_DASHBOARDS: Record<UserRole, string> = {
  FARMER: '/farmer',
  FIELD_WORKER: '/field-worker',
  VETERINARIAN: '/veterinarian',
  LAB_STAFF: '/lab',
  DISTRICT_OFFICER: '/district',
  STATE_ADMIN: '/state',
  SUPER_ADMIN: '/admin',
};

export const Navbar: React.FC = () => {
  const { user, activeRole, switchRole, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    navigate(ROLE_DASHBOARDS[role] || '/');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Platform Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900 tracking-tight">
                {t('platformTitle')}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                {t('aiBadge')}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {t('subTitle')}
            </p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-3">
          {/* Active Multilingual Selector */}
          <div className="flex items-center gap-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition px-2.5 py-1.5 rounded-lg border border-slate-300">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer text-slate-800"
            >
              <option value="en">English (EN)</option>
              <option value="ta">தமிழ் (TA)</option>
              <option value="mr">मराठी (MR)</option>
              <option value="hi">हिन्दी (HI)</option>
            </select>
          </div>

          {/* Quick Role Switcher for Test / Demo Users */}
          {user && (
            <div className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1.5 rounded-md">
              <span className="font-medium text-emerald-800">{t('role')}:</span>
              <select
                value={activeRole || ''}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="bg-transparent font-semibold focus:outline-none cursor-pointer text-emerald-950"
              >
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="text-right hidden lg:block">
              <div className="text-xs font-semibold text-slate-800">{user?.fullName}</div>
              <div className="text-[11px] text-slate-500">{user?.email}</div>
            </div>
            <button
              onClick={logout}
              title={t('signOut')}
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
