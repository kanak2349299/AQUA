import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Satellite, Layers, Calendar, Eye, AlertOctagon, 
  CheckCircle2, Droplet, ArrowRight, Sparkles 
} from 'lucide-react';

export const SatelliteWaterIntelligence: React.FC = () => {
  const { selectedRegionId } = useAuth();
  const [indexType, setIndexType] = useState<'NDWI' | 'MNDWI'>('NDWI');
  const [comparisonDate, setComparisonDate] = useState<'pre_monsoon' | 'post_monsoon'>('post_monsoon');

  const satelliteMetrics = {
    surface_water_area_sq_km: selectedRegionId === 'ludhiana' ? 142.5 : 88.4,
    water_body_change_pct: selectedRegionId === 'ludhiana' ? -18.2 : +6.4,
    cloud_cover_pct: 1.4,
    sensor: 'Sentinel-2 MSI Level-2A (ESA / Copernicus)',
    gee_dataset: 'COPERNICUS/S2_SR_HARMONIZED',
    last_pass_date: '2026-10-28',
    ndwi_threshold: 0.15
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Satellite Water Intelligence (Sentinel-2 & GEE)
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
              Copernicus Open Access
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Surface waterbody delineation, NDWI/MNDWI indices and seasonal reservoir extent tracking
          </p>
        </div>

        {/* Index Selector */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIndexType('NDWI')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              indexType === 'NDWI'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            NDWI (Green - NIR)
          </button>
          <button
            onClick={() => setIndexType('MNDWI')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              indexType === 'MNDWI'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            MNDWI (Green - SWIR)
          </button>
        </div>
      </div>

      {/* Satellite Telemetry Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Delineated Surface Water</div>
          <div className="text-2xl font-black text-cyan-600">
            {satelliteMetrics.surface_water_area_sq_km} <span className="text-xs font-normal text-slate-500">km²</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Lakes, ponds & river reaches</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Seasonal Waterbody Shift</div>
          <div className={`text-2xl font-black ${
            satelliteMetrics.water_body_change_pct < 0 ? 'text-rose-600' : 'text-emerald-600'
          }`}>
            {satelliteMetrics.water_body_change_pct}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Relative to 5-year post-monsoon normal</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Cloud Cover Quality Mask</div>
          <div className="text-2xl font-black text-emerald-600">
            {satelliteMetrics.cloud_cover_pct}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">QA60 band cirrus / cloud masked</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-1">Sensor & Platform</div>
          <div className="text-sm font-bold text-slate-800 leading-tight">
            Sentinel-2 MSI
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Last overpass: {satelliteMetrics.last_pass_date}</p>
        </div>

      </div>

      {/* Visual Sentinel Water Extent Container */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Sentinel-2 Surface Water Extent & NDWI False-Color Composite
            </h2>
            <p className="text-xs text-slate-500">
              High-reflectance water bodies highlighted in deep turquoise (#06b6d4) over NIR background
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setComparisonDate('pre_monsoon')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                comparisonDate === 'pre_monsoon' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Pre-Monsoon May
            </button>
            <button
              onClick={() => setComparisonDate('post_monsoon')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                comparisonDate === 'post_monsoon' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Post-Monsoon Oct
            </button>
          </div>
        </div>

        {/* Satellite Imagery Canvas Simulation */}
        <div className="relative h-80 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#0369a1_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-40" />
          
          {/* Simulated River & Waterbody Polygons */}
          <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 800 400">
            {/* Meandering river course */}
            <path
              d="M 50 180 Q 220 80 400 210 T 750 190"
              fill="none"
              stroke="#06b6d4"
              strokeWidth={comparisonDate === 'post_monsoon' ? '28' : '16'}
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Water body reservoir 1 */}
            <ellipse cx="260" cy="130" rx={comparisonDate === 'post_monsoon' ? "48" : "32"} ry={comparisonDate === 'post_monsoon' ? "32" : "20"} fill="#0284c7" opacity="0.9" />
            {/* Water body reservoir 2 */}
            <ellipse cx="580" cy="240" rx={comparisonDate === 'post_monsoon' ? "64" : "42"} ry={comparisonDate === 'post_monsoon' ? "38" : "24"} fill="#0d9488" opacity="0.9" />
          </svg>

          <div className="relative z-10 bg-slate-900/80 p-4 rounded-xl border border-slate-700/80 backdrop-blur-md max-w-sm text-center space-y-2">
            <span className="text-xs font-bold text-cyan-300 block">
              {indexType} Classification Active
            </span>
            <div className="text-[11px] text-slate-300 leading-snug">
              Calculated using formula: <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-200">(Band 3 - Band 8) / (Band 3 + Band 8)</code>.
              Pixels &gt; 0.15 classified as open surface water.
            </div>
            <div className="text-[10px] text-slate-400">
              Resolved at 10m Ground Sample Distance (GSD)
            </div>
          </div>
        </div>

        {/* Scientific Integrity Disclaimer (Mandatory) */}
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-950">
              Scientific Boundary Condition & Remote Sensing Truth
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Optical and multi-spectral satellite imagery (Sentinel-2, Landsat) directly quantifies <strong>surface water bodies</strong> (reservoirs, lakes, river channels) and vegetative vigor (NDVI). <strong>Optical imagery does not directly penetrate into subsurface aquifers</strong>. Subsurface groundwater dynamics are independently tracked through the Central Ground Water Board (CGWB) telemetry network and calibrated hydrological balance models.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
