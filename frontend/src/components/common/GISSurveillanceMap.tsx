import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers } from 'lucide-react';

export interface MapCluster {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  casesCount: number;
  deathsCount: number;
  villages: string[];
  suspectedDisease: string;
}

export interface MapReportPin {
  id: string;
  lat: number;
  lng: number;
  species: string;
  tag: string;
  village: string;
  symptoms: string[];
  riskScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  createdAt: string;
}

const DEFAULT_CLUSTERS: MapCluster[] = [
  {
    id: 'CL-SLM-001',
    name: 'Attur-Omalur Corridor Cluster',
    lat: 11.5985,
    lng: 78.5991,
    radiusMeters: 5500,
    riskLevel: 'CRITICAL',
    casesCount: 9,
    deathsCount: 2,
    villages: ['Kallanur', 'Attur West', 'Manivilundan', 'Pethanaickenpalayam'],
    suspectedDisease: 'Foot-and-Mouth Disease (Vesicular)',
  },
  {
    id: 'CL-ERD-002',
    name: 'Bhavani River Basin Cluster',
    lat: 11.4501,
    lng: 77.6833,
    radiusMeters: 4200,
    riskLevel: 'HIGH',
    casesCount: 5,
    deathsCount: 0,
    villages: ['Bhavani Rural', 'Anthiyur', 'Appakudal'],
    suspectedDisease: 'Lumpy Skin Disease (Suspected)',
  },
];

const DEFAULT_REPORTS: MapReportPin[] = [
  {
    id: 'rep-9821',
    lat: 11.602,
    lng: 78.595,
    species: 'Cattle (Cow)',
    tag: '#IN-TN-9821',
    village: 'Kallanur',
    symptoms: ['High fever', 'Mouth vesicles', 'Salivation'],
    riskScore: 95,
    riskLevel: 'CRITICAL',
    createdAt: '2h ago',
  },
  {
    id: 'rep-7712',
    lat: 11.592,
    lng: 78.608,
    species: 'Buffalo',
    tag: '#IN-TN-7712',
    village: 'Attur West',
    symptoms: ['Foot lesions', 'Lameness', 'Milk drop'],
    riskScore: 78,
    riskLevel: 'HIGH',
    createdAt: '4h ago',
  },
  {
    id: 'rep-3319',
    lat: 11.615,
    lng: 78.582,
    species: 'Goat',
    tag: '#IN-TN-3319',
    village: 'Pethanaickenpalayam',
    symptoms: ['Nasal discharge', 'Pyrexia'],
    riskScore: 54,
    riskLevel: 'MODERATE',
    createdAt: '6h ago',
  },
  {
    id: 'rep-1102',
    lat: 11.448,
    lng: 77.679,
    species: 'Cattle (Bullock)',
    tag: '#IN-TN-1102',
    village: 'Bhavani Rural',
    symptoms: ['Skin nodules', 'Fever'],
    riskScore: 72,
    riskLevel: 'HIGH',
    createdAt: '1d ago',
  },
  {
    id: 'rep-0941',
    lat: 11.6643,
    lng: 78.146,
    species: 'Cattle (Calf)',
    tag: '#IN-TN-0941',
    village: 'Salem Central',
    symptoms: ['Mild anorexia', 'Normal temp'],
    riskScore: 22,
    riskLevel: 'LOW',
    createdAt: '1d ago',
  },
];

interface GISSurveillanceMapProps {
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  height?: string;
  showFilters?: boolean;
  onSelectCluster?: (cluster: MapCluster) => void;
  onSelectReport?: (report: MapReportPin) => void;
}

export const GISSurveillanceMap: React.FC<GISSurveillanceMapProps> = ({
  centerLat = 11.5985,
  centerLng = 78.5991,
  zoom = 11,
  height = '500px',
  showFilters = true,
  onSelectCluster,
  onSelectReport,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CLUSTERS' | 'REPORTS'>('ALL');
  const [selectedCluster, setSelectedCluster] = useState<MapCluster | null>(null);
  const [selectedPin, setSelectedPin] = useState<MapReportPin | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Prevent double initialization
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: zoom,
        zoomControl: false,
      });

      // Standard OpenStreetMap base layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Add zoom control to top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [centerLat, centerLng, zoom]);

  // Re-render layers when filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // Render Clusters (Circles + Buffer Zones)
    if (activeFilter === 'ALL' || activeFilter === 'CLUSTERS') {
      DEFAULT_CLUSTERS.forEach((c) => {
        // Red / Amber translucent buffer circle
        const circle = L.circle([c.lat, c.lng], {
          radius: c.radiusMeters,
          color: c.riskLevel === 'CRITICAL' ? '#e11d48' : '#f59e0b',
          fillColor: c.riskLevel === 'CRITICAL' ? '#f43f5e' : '#fbbf24',
          fillOpacity: 0.18,
          weight: 2,
          dashArray: '5, 8',
        }).addTo(layerGroup);

        circle.bindTooltip(
          `<strong>${c.name}</strong><br/>${c.suspectedDisease} (${(c.radiusMeters / 1000).toFixed(1)} km quarantine buffer)`,
          { sticky: true }
        );

        circle.on('click', () => {
          setSelectedCluster(c);
          setSelectedPin(null);
          if (onSelectCluster) onSelectCluster(c);
        });

        // Center cluster icon marker
        const clusterIcon = L.divIcon({
          className: 'custom-cluster-marker',
          html: `
            <div style="background-color: ${c.riskLevel === 'CRITICAL' ? '#e11d48' : '#f59e0b'}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; box-shadow: 0 0 12px ${c.riskLevel === 'CRITICAL' ? 'rgba(225,29,72,0.6)' : 'rgba(245,158,11,0.6)'}; border: 2px solid white;">
              ${c.casesCount}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const clusterMarker = L.marker([c.lat, c.lng], { icon: clusterIcon }).addTo(layerGroup);
        clusterMarker.on('click', () => {
          setSelectedCluster(c);
          setSelectedPin(null);
          if (onSelectCluster) onSelectCluster(c);
        });
      });
    }

    // Render Individual Health Reports
    if (activeFilter === 'ALL' || activeFilter === 'REPORTS') {
      DEFAULT_REPORTS.forEach((r) => {
        const pinColor =
          r.riskLevel === 'CRITICAL'
            ? '#e11d48'
            : r.riskLevel === 'HIGH'
            ? '#ea580c'
            : r.riskLevel === 'MODERATE'
            ? '#d97706'
            : '#059669';

        const pinIcon = L.divIcon({
          className: 'custom-pin-marker',
          html: `
            <div style="background-color: ${pinColor}; width: 18px; height: 18px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
          `,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });

        const marker = L.marker([r.lat, r.lng], { icon: pinIcon }).addTo(layerGroup);
        marker.bindTooltip(
          `<strong>${r.tag}</strong> (${r.species})<br/>Score: ${r.riskScore}/100 [${r.riskLevel}]<br/>${r.village}`,
          { sticky: true }
        );

        marker.on('click', () => {
          setSelectedPin(r);
          setSelectedCluster(null);
          if (onSelectReport) onSelectReport(r);
        });
      });
    }
  }, [activeFilter, onSelectCluster, onSelectReport]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
      {/* Map Control Bar */}
      {showFilters && (
        <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs p-1.5 rounded-xl border border-slate-200/90 shadow-md flex items-center gap-1 text-xs">
          <div className="px-2 font-bold text-slate-700 flex items-center gap-1.5 border-r border-slate-200">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">GIS Layers:</span>
          </div>
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              activeFilter === 'ALL'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Hotspots
          </button>
          <button
            onClick={() => setActiveFilter('CLUSTERS')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
              activeFilter === 'CLUSTERS'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>Clusters</span>
          </button>
          <button
            onClick={() => setActiveFilter('REPORTS')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
              activeFilter === 'REPORTS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Reports</span>
          </button>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />

      {/* Legend Card on Bottom-Right */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200/90 shadow-md text-[11px] space-y-1.5">
        <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-100">
          GIS Spatio-Temporal Legend
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-3 h-3 rounded-full bg-rose-500 border border-white shrink-0"></span>
          <span>Critical Cluster (5km Ring)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shrink-0"></span>
          <span>High-Risk Cluster</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shrink-0"></span>
          <span>Verified Low Risk / Vaccinated</span>
        </div>
      </div>

      {/* Selected Item Detail Popup Drawer (Bottom-Left) */}
      {(selectedCluster || selectedPin) && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-white p-4 rounded-xl border border-slate-200 shadow-xl max-w-sm text-xs space-y-2 animate-in fade-in">
          {selectedCluster && (
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{selectedCluster.name}</span>
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-rose-100 text-rose-800">
                  {selectedCluster.riskLevel}
                </span>
              </div>
              <p className="text-slate-600 mt-1">
                Disease: <strong>{selectedCluster.suspectedDisease}</strong> &bull; Radius: {(selectedCluster.radiusMeters / 1000).toFixed(1)} km
              </p>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 mt-1 text-[11px]">
                Affected Villages: {selectedCluster.villages.join(', ')}
              </div>
              <div className="pt-2 flex justify-between items-center text-[11px]">
                <span className="text-rose-700 font-bold">{selectedCluster.casesCount} Cases, {selectedCluster.deathsCount} Deaths</span>
                <button
                  onClick={() => setSelectedCluster(null)}
                  className="text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {selectedPin && (
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{selectedPin.tag} ({selectedPin.species})</span>
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-rose-100 text-rose-800">
                  Risk: {selectedPin.riskScore}/100
                </span>
              </div>
              <div className="text-slate-600 mt-1">
                Village: <strong>{selectedPin.village}</strong> &bull; Reported: {selectedPin.createdAt}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Symptoms: {selectedPin.symptoms.join(', ')}
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedPin(null)}
                  className="text-slate-400 hover:text-slate-600 font-semibold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
