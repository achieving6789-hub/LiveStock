import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HeartPulse,
  Stethoscope,
  FlaskConical,
  MapPin,
  Building2,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import type { UserRole } from '../../types/auth';

interface RoleProfile {
  role: UserRole;
  title: string;
  name: string;
  badge: string;
  email: string;
  icon: React.ReactNode;
  colorClass: string;
}

const ROLE_PROFILES: RoleProfile[] = [
  {
    role: 'FARMER',
    title: 'Farmer / Herd Keeper',
    name: 'Ramesh Kumar (Livestock Holding)',
    badge: 'Farmer Portal',
    email: 'farmer@livestock.gov',
    icon: <HeartPulse className="w-5 h-5 text-emerald-600" />,
    colorClass: 'border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/50',
  },
  {
    role: 'VETERINARIAN',
    title: 'Veterinary Surgeon',
    name: 'Dr. Sundaramurthy B.V.Sc',
    badge: 'Priority Triage & Rx',
    email: 'vet@livestock.gov',
    icon: <Stethoscope className="w-5 h-5 text-blue-600" />,
    colorClass: 'border-blue-200 hover:border-blue-500 hover:bg-blue-50/50',
  },
  {
    role: 'LAB_STAFF',
    title: 'Diagnostic Lab Pathologist',
    name: 'Dr. Priya Sharma (RADDL)',
    badge: 'Assays & PCR Verification',
    email: 'lab@livestock.gov',
    icon: <FlaskConical className="w-5 h-5 text-purple-600" />,
    colorClass: 'border-purple-200 hover:border-purple-500 hover:bg-purple-50/50',
  },
  {
    role: 'FIELD_WORKER',
    title: 'Grassroots Field Worker',
    name: 'Anitha S. (Para-Veterinary)',
    badge: 'Field Inspections',
    email: 'fieldworker@livestock.gov',
    icon: <MapPin className="w-5 h-5 text-teal-600" />,
    colorClass: 'border-teal-200 hover:border-teal-500 hover:bg-teal-50/50',
  },
  {
    role: 'DISTRICT_OFFICER',
    title: 'District Surveillance Officer',
    name: 'Dr. Natarajan (Salem DAH)',
    badge: 'Hotspot Surveillance',
    email: 'district@livestock.gov',
    icon: <Building2 className="w-5 h-5 text-amber-600" />,
    colorClass: 'border-amber-200 hover:border-amber-500 hover:bg-amber-50/50',
  },
  {
    role: 'STATE_ADMIN',
    title: 'State Epidemiologist',
    name: 'Dr. Rajendran (State HQ)',
    badge: 'Statewide GIS Command',
    email: 'state@livestock.gov',
    icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
    colorClass: 'border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50',
  },
  {
    role: 'SUPER_ADMIN',
    title: 'Super Administrator',
    name: 'Platform Administration Desk',
    badge: 'Full RBAC Access',
    email: 'admin@livestock.gov',
    icon: <UserCheck className="w-5 h-5 text-slate-700" />,
    colorClass: 'border-slate-200 hover:border-slate-600 hover:bg-slate-50',
  },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOneClickLogin = async (profile: RoleProfile) => {
    setError(null);
    setLoadingRole(profile.role);

    try {
      await login(profile.email, 'DemoPass123!');
      const routeMap: Record<UserRole, string> = {
        FARMER: '/farmer',
        VETERINARIAN: '/veterinarian',
        LAB_STAFF: '/lab',
        FIELD_WORKER: '/field-worker',
        DISTRICT_OFFICER: '/district',
        STATE_ADMIN: '/state',
        SUPER_ADMIN: '/admin',
      };
      navigate(routeMap[profile.role] || '/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to authenticate role. Please try again.');
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900">Select Role to Enter Portal</h3>
        <p className="text-xs text-slate-500 mt-1">
          Click any role below for instant one-click access
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-700 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* One-Click Role Profiles Grid - No emails or passwords */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLE_PROFILES.map((p) => {
          const isLoading = loadingRole === p.role;
          return (
            <button
              key={p.role}
              type="button"
              disabled={loadingRole !== null}
              onClick={() => handleOneClickLogin(p)}
              className={`p-3.5 text-left rounded-xl border bg-white shadow-xs transition flex items-center gap-3 relative cursor-pointer ${
                p.colorClass
              } ${isLoading ? 'ring-2 ring-emerald-500' : ''}`}
            >
              <div className="p-2.5 rounded-xl bg-slate-50 shrink-0">
                {p.icon}
              </div>

              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-xs text-slate-900 truncate">{p.title}</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                    {p.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium truncate">{p.name}</div>
              </div>

              {isLoading ? (
                <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
