import React from 'react';
import { GISSurveillanceMap } from '../../components/common/GISSurveillanceMap';
import { MapPin, ShieldAlert, Syringe } from 'lucide-react';

export const StateGISPage: React.FC = () => {

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Statewide GIS Spatial Engine
            </span>
            <span className="text-xs text-slate-500">PostGIS Spatio-Temporal Cluster Analytics</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">
            State GIS Surveillance & Heatmaps
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time geospatial tracking of suspected disease clusters, quarantine buffer zones, and vaccination perimeters.
          </p>
        </div>
      </div>

      {/* Main Interactive Leaflet Map */}
      <GISSurveillanceMap
        centerLat={11.55}
        centerLng={78.2}
        zoom={10}
        height="550px"
      />

      {/* Cluster Intelligence Cards Below Map */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Active Spatial Outbreak Rings</span>
          </div>
          <div className="text-xl font-bold text-slate-900">2 Emerging Clusters</div>
          <p className="text-xs text-slate-500 mt-1">
            5.5 km containment buffer deployed in Salem Attur Belt; 4.2 km buffer in Bhavani Basin.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1">
            <Syringe className="w-4 h-4" />
            <span>Ring-Vaccination Perimeters</span>
          </div>
          <div className="text-xl font-bold text-slate-900">8,500 Doses Allocated</div>
          <p className="text-xs text-slate-500 mt-1">
            Targeting 7 peripheral villages within 10 km ring to prevent vector and transmission spread.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-xs mb-1">
            <MapPin className="w-4 h-4" />
            <span>Connected Field Workers</span>
          </div>
          <div className="text-xl font-bold text-slate-900">28 GPS-Tagged Para-Vets</div>
          <p className="text-xs text-slate-500 mt-1">
            Active geo-fenced reporting enabled across Salem and Erode administrative sectors.
          </p>
        </div>
      </div>
    </div>
  );
};
