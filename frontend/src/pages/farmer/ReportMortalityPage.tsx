import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { ArrowLeft, CheckCircle2, Send, Skull } from 'lucide-react';

export const ReportMortalityPage: React.FC = () => {
  const [species, setSpecies] = useState('Cattle');
  const [numberOfDeaths, setNumberOfDeaths] = useState<number>(1);
  const [suspectedCause, setSuspectedCause] = useState('Acute fever and collapse without premonitory signs');
  const [dateOfDeath, setDateOfDeath] = useState(new Date().toISOString().split('T')[0]);
  const [latitude, setLatitude] = useState(11.5985);
  const [longitude, setLongitude] = useState(78.5991);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await api.post('/mortality', {
        species,
        numberOfDeaths,
        suspectedCause,
        dateOfDeath,
        latitude,
        longitude,
      });
      setResult(res.data.data.report);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit mortality report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/farmer"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Farmer Dashboard</span>
      </Link>

      {result && (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-rose-600" />
            <div>
              <h3 className="font-bold text-sm text-rose-950">Mortality Report Logged</h3>
              <p className="text-xs text-rose-700">Reference: {result.id}</p>
            </div>
          </div>
          <p className="text-xs text-rose-800">
            This mortality event has been flagged for rapid veterinary autopsy and carcass disposal protocol under state biosecurity regulations.
          </p>
          <div className="pt-2">
            <Link
              to="/farmer"
              className="inline-block px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <Skull className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Report Livestock Mortality</h1>
            <p className="text-xs text-slate-500">
              Promptly report livestock deaths for epidemic cluster detection and autopsy coordination.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Species Affected <span className="text-rose-500">*</span>
              </label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 font-medium"
              >
                <option value="Cattle">Cattle</option>
                <option value="Buffalo">Buffalo</option>
                <option value="Goat">Goat</option>
                <option value="Sheep">Sheep</option>
                <option value="Poultry">Poultry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Number of Deaths <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={numberOfDeaths}
                onChange={(e) => setNumberOfDeaths(parseInt(e.target.value) || 1)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 font-bold text-rose-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Death</label>
              <input
                type="date"
                required
                value={dateOfDeath}
                onChange={(e) => setDateOfDeath(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location Coordinates</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  className="w-1/2 text-xs py-2 px-3 rounded-lg border border-slate-300 font-mono"
                />
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                  className="w-1/2 text-xs py-2 px-3 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Suspected Cause & Autopsy Notes
            </label>
            <textarea
              rows={3}
              value={suspectedCause}
              onChange={(e) => setSuspectedCause(e.target.value)}
              placeholder="Describe circumstances, prior clinical signs, or sudden collapse..."
              className="w-full text-xs p-3 rounded-lg border border-slate-300"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Transmit Mortality Alert</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
