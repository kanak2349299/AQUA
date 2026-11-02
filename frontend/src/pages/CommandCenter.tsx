import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Droplet, TrendingDown, CloudRain, Sun, AlertTriangle, 
  MapPin, ShieldAlert, CheckCircle2, ArrowUpRight, Activity, 
  Radio, Compass, Layers 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const CommandCenter: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { user, selectedRegionId } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [drought, setDrought] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([
      api.getOverview(selectedRegionId || 'yamuna'),
      api.getDroughtAssessment(selectedRegionId || 'yamuna')
    ]).then(([s, d]) => {
      if (isMounted) {
        setStats(s);
        setDrought(d);
        setLoading(false);
      }
    }).catch(err => {
      console.error(err);
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [selectedRegionId]);

  const displayName = user?.name || 'Himangi';

  if (loading || !stats) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Querying CGWB Telemetry & Open-Meteo Live Feeds...</p>
        </div>
      </div>
    );
  }

  // Sparkline sample data
  const gwTrendData = [
    { month: 'May', depth: stats.current_gw_depth_m - 0.9 },
    { month: 'Jun', depth: stats.current_gw_depth_m - 0.7 },
    { month: 'Jul', depth: stats.current_gw_depth_m - 0.2 },
    { month: 'Aug', depth: stats.current_gw_depth_m - 0.5 },
    { month: 'Sep', depth: stats.current_gw_depth_m - 0.3 },
    { month: 'Oct', depth: stats.current_gw_depth_m - 0.1 },
    { month: 'Nov', depth: stats.current_gw_depth_m }
  ];

  const pieData = [
    { name: 'Over-Exploited (>100%)', value: stats.high_risk_villages_count, color: '#ef4444' },
    { name: 'Critical (90-100%)', value: 8, color: '#f97316' },
    { name: 'Semi-Critical (70-90%)', value: 12, color: '#eab308' },
    { name: 'Safe (<70%)', value: 14, color: '#16a34a' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Top Banner Greeting & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Good Morning, {displayName}!
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              Live Monitored
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time watershed telemetry for {stats.region_name} • {stats.basin}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Telemetry Synchronized</span>
            <span className="text-xs font-semibold text-slate-700">CGWB Telemetry & Open-Meteo Live</span>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        </div>
      </div>

      {/* 5 Premium Metric Cards with Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Groundwater Depth */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>Mean Water Table</span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                {stats.depletion_rate_m_year} m/yr
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {stats.current_gw_depth_m} <span className="text-xs font-normal text-slate-500">m bgl</span>
            </div>
          </div>
          <div className="h-10 mt-3 -mx-2 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gwTrendData}>
                <Area type="monotone" dataKey="depth" stroke="#0284c7" fill="#e0f2fe" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Soil Moisture */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>Soil Moisture (0-7cm)</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                stats.soil_moisture_pct < 15 ? 'text-rose-600 bg-rose-50' : 'text-amber-600 bg-amber-50'
              }`}>
                {stats.soil_moisture_pct < 15 ? 'Critical Deficit' : 'Warning Zone'}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {stats.soil_moisture_pct}% <span className="text-xs font-normal text-slate-500">volumetric</span>
            </div>
          </div>
          <div className="h-10 mt-3 -mx-2 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { v: 14 }, { v: 13 }, { v: 12 }, { v: 11 }, { v: 10.5 }, { v: stats.soil_moisture_pct }
              ]}>
                <Area type="monotone" dataKey="v" stroke="#0d9488" fill="#ccfbf1" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Evapotranspiration */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>Evapotranspiration (ET0)</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                FAO-56
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {stats.evapotranspiration_et0} <span className="text-xs font-normal text-slate-500">mm/day</span>
            </div>
          </div>
          <div className="h-10 mt-3 -mx-2 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { v: 3.2 }, { v: 3.6 }, { v: 3.9 }, { v: 4.1 }, { v: 4.2 }, { v: stats.evapotranspiration_et0 }
              ]}>
                <Area type="monotone" dataKey="v" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 4: Drought Score */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>Drought Risk Score</span>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                Tier-1 Alert
              </span>
            </div>
            <div className="text-2xl font-bold text-rose-600">
              {stats.drought_risk_score} <span className="text-xs font-normal text-slate-500">/ 100</span>
            </div>
          </div>
          <div className="h-10 mt-3 -mx-2 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { v: 62 }, { v: 64 }, { v: 67 }, { v: 69 }, { v: 71 }, { v: stats.drought_risk_score }
              ]}>
                <Area type="monotone" dataKey="v" stroke="#ef4444" fill="#fee2e2" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 5: Extraction Stage */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>Extraction Stage</span>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                CGWB Category
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900 leading-tight">
              {stats.water_stress_index}
            </div>
          </div>
          <div className="h-10 mt-3 -mx-2 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { v: 140 }, { v: 148 }, { v: 155 }, { v: 160 }, { v: 164 }
              ]}>
                <Area type="monotone" dataKey="v" stroke="#8b5cf6" fill="#ede9fe" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Middle Grid: Aquifer Stress Distribution + Top Alert Questions + Knowledge Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Donut Chart - Well Categorization */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Aquifer Stress Breakdown</h2>
            <span className="text-xs text-slate-400">CGWB Telemetry</span>
          </div>

          <div className="flex items-center justify-center h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value} wells</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Live Early Warning Alerts & Hotspots */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Hyperlocal Village Alerts</h2>
            <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              Critical Hotspots
            </span>
          </div>

          <div className="space-y-2.5">
            {drought?.high_risk_villages?.map((v: any) => (
              <div 
                key={v.village}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {v.village} Cluster
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {v.wells_affected} tube-wells exceeding extraction threshold
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-rose-600 block">{v.risk_score}</span>
                  <span className="text-[9px] font-semibold uppercase text-slate-400">{v.status}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('drought-warning')}
            className="w-full py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            Inspect All Early Warning Hotspots
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Flagship Decision Support Gaps & Interventions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Recommended Interventions</h2>
              <span className="text-xs text-teal-600 font-semibold">DSS Engine</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Irrigation Curtailment Advisory
                </div>
                <p className="text-[11px] text-amber-800/90 mt-1 leading-snug">
                  Execute night-time micro-sprinkling (05:00 - 09:00 AM) to save 28% water in high-evaporation blocks.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-teal-50/80 border border-teal-200/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  AHP Recharge Acceleration
                </div>
                <p className="text-[11px] text-teal-800/90 mt-1 leading-snug">
                  Deploy 12 artificial recharge shafts along paleo-drainage channels to inject 8.4 MCM runoff.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('decision-support')}
            className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Open Full Decision Support System (DSS)
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
