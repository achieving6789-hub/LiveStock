import React from 'react';
import { GISSurveillanceMap } from '../../components/common/GISSurveillanceMap';
import { RiskBadge } from '../../components/common/RiskBadge';

export const DistrictSurveillancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
              Salem District Geo-Surveillance
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            District GIS Hotspot Surveillance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Spatial cluster detection, quarantine ring monitoring, and veterinary mobile response dispatch.
          </p>
        </div>
      </div>

      {/* Interactive Map */}
      <GISSurveillanceMap
        centerLat={11.5985}
        centerLng={78.5991}
        zoom={11}
        height="500px"
      />

      {/* Cluster Analysis & Immediate Directives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Cluster #CL-SLM-001 Spatial Analysis</h3>
            <RiskBadge level="CRITICAL" score={84} />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Centroid detected at <strong>11.5985° N, 78.5991° E</strong> with a 5.5 km radius enclosing 4 village holdings: Kallanur, Attur West, Manivilundan, and Pethanaickenpalayam.
          </p>
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 space-y-1">
            <div className="font-bold">Active Bio-Containment Directives:</div>
            <div>&bull; Common watering pond grazing restricted for 14 days</div>
            <div>&bull; Weekly livestock market at Attur halted</div>
            <div>&bull; Mobile Veterinary Unit #3 on active surveillance patrol</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Vaccine Ring Defense Status</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">Ring Perimeter Coverage</span>
              <span className="text-emerald-700 font-bold">78.5% (2,500 Doses Administered)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">Buffer Zone Depth</span>
              <span className="text-slate-700 font-medium">5.5 km containment radius</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="font-semibold text-slate-800">Rapid Response Unit</span>
              <span className="text-emerald-700 font-medium">En Route to Kallanur Hamlet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
