import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export const AdminAuditPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    api.get('/auth/audit-logs')
      .then((res) => setLogs(res.data.data.auditLogs || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Security Audit Logs (Immutable)</h1>
        <p className="text-xs text-slate-500">
          Cryptographically auditable trace of user authentications, role elevations, and report submissions.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase font-sans">
              <th className="py-3 px-4">Event ID</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">IP Address</th>
              <th className="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-400">{l.id}</td>
                <td className="py-3 px-4 font-bold text-slate-800">{l.action}</td>
                <td className="py-3 px-4 text-slate-600 font-sans">{l.userEmail || 'System'}</td>
                <td className="py-3 px-4 text-slate-500">{l.ipAddress}</td>
                <td className="py-3 px-4 text-slate-400 font-sans">{new Date(l.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
