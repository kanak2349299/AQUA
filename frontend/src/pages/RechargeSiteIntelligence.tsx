import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Compass, MapPin, CheckCircle2, AlertTriangle, Layers, 
  Droplet, ArrowRight, ShieldCheck, Download, Sparkles 
} from 'lucide-react';

export const RechargeSiteIntelligence: React.FC = () => {
  const { selectedRegionId } = useAuth();
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getRechargeZones(selectedRegionId === 'ludhiana' ? 'ludhiana' : 'haridwar')
      .then(res => {
        if (isMounted) {
          setZones(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [selectedRegionId]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner (Frontiers Haridwar AHP Study matching Reference Image 2) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Recharge Site Intelligence (Geospatial AHP)
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-900 text-white">
              Frontiers Study Calibrated
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Multi-Criteria Decision Analysis (AHP) for Artificial Groundwater Recharge in Haridwar & Monitored Basins
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            {zones.length} Prioritized Recharge Zones
          </span>
        </div>
      </div>

      {/* AHP Criteria Weights Strip (Image 2 scientific background) */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AHP Analytic Hierarchy Multi-Criteria Layer Weights
          </span>
          <span className="text-[10px] text-slate-400">Consistency Ratio CR &lt; 0.10</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs pt-1">
          <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
            <div className="text-slate-400 text-[10px]">Slope (DEM)</div>
            <div className="text-sm font-bold text-white">28% Weight</div>
          </div>
          <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
            <div className="text-slate-400 text-[10px]">Geology / Lithology</div>
            <div className="text-sm font-bold text-white">22% Weight</div>
          </div>
          <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
            <div className="text-slate-400 text-[10px]">Soil Permeability</div>
            <div className="text-sm font-bold text-white">18% Weight</div>
          </div>
          <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
            <div className="text-slate-400 text-[10px]">Drainage Density</div>
            <div className="text-sm font-bold text-white">16% Weight</div>
          </div>
          <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
            <div className="text-slate-400 text-[10px]">Rainfall Normal</div>
            <div className="text-sm font-bold text-white">16% Weight</div>
          </div>
        </div>
      </div>

      {/* Recharge Zones Cards (Image 2 Color Scale: Very High Maroon, High Green, Mod Yellow, Low Red) */}
      {loading ? (
        <div className="h-48 flex items-center justify-center bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((z) => (
            <div
              key={z.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3 hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Category Color Bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: z.color_hex }}
              />

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">{z.id}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{z.zone_name}</h3>
                </div>
                <div className="text-right">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: z.color_hex }}
                  >
                    {z.suitability_category}
                  </span>
                  <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    Score: <strong>{z.score}/100</strong>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Slope Angle</span>
                  <strong className="text-slate-900">{z.slope_pct}% (Flat / Gentle)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Drainage Density</span>
                  <strong className="text-slate-900">{z.drainage_density}</strong>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">Hydro-Lithology</span>
                  <strong className="text-slate-900">{z.lithology}</strong>
                </div>
              </div>

              <div className="bg-teal-50 p-3 rounded-xl border border-teal-200 text-xs text-teal-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-teal-600" />
                  Recommended Conservation Structure:
                </div>
                <p className="font-semibold text-teal-900">{z.recommended_structure}</p>
                <div className="text-[11px] text-teal-800">
                  Estimated Infiltration Potential: <strong>{z.estimated_annual_recharge_potential_mcm} MCM / year</strong>
                </div>
              </div>

              {z.priority_box && (
                <div className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 inline-block">
                  Priority Action Box {z.priority_box} (From Haridwar Frontiers Spatial Study)
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
