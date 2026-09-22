import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api.get('/auth/users')
      .then((res) => setUsers(res.data.data.users || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">User & RBAC Role Management</h1>
        <p className="text-xs text-slate-500">
          Provision institutional accounts, assign RBAC permissions, and configure territorial jurisdictions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Assigned Roles</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-semibold text-slate-900">{u.fullName}</td>
                <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-wrap gap-1">
                    {u.roles.map((r: string) => (
                      <span key={r} className="px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px]">
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
