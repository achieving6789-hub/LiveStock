import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StatCard } from '../../components/common/StatCard';
import { Users, ShieldAlert, Cpu } from 'lucide-react';
import api from '../../api/client';

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, logsRes] = await Promise.all([
          api.get('/auth/users'),
          api.get('/auth/audit-logs'),
        ]);
        setUsersList(usersRes.data.data.users || []);
        setAuditLogs(logsRes.data.data.auditLogs || []);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-white">
              Super Administration & Security Center
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            System Administration: {user?.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-Based Access Control management, audit trail inspection, and model versioning.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active System Users" value={usersList.length || '7'} icon={<Users className="w-4 h-4 text-slate-600" />} />
        <StatCard title="Configured Roles" value="7 Roles" subtitle="RBAC Matrix active" />
        <StatCard title="Security Audit Events" value={auditLogs.length} icon={<ShieldAlert className="w-4 h-4 text-emerald-600" />} />
        <StatCard title="ML Model Registry" value="rf-baseline-v1" subtitle="Status: Live" icon={<Cpu className="w-4 h-4 text-purple-600" />} />
      </div>

      {/* Two columns: User List & Audit Log Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management Overview */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Provisioned Platform Users</h3>
            <span className="text-xs text-slate-500">{usersList.length} Accounts</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto custom-scrollbar">
            {usersList.map((u) => (
              <div key={u.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900">{u.fullName}</div>
                  <div className="text-slate-500">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {u.roles.join(', ')}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Audit Trail */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Live Audit Trail (Immutable)</h3>
            <span className="text-xs text-slate-500">Security & Mutation Events</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto custom-scrollbar text-xs">
            {auditLogs.length === 0 ? (
              <p className="text-slate-400 py-4 text-center">No audit records logged yet.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-slate-800">{log.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    User: {log.userEmail || 'System / Unauthenticated'} &bull; IP: {log.ipAddress}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
