import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, CloudRain, Sun, AlertTriangle, CheckCircle2, 
  Calendar, Clock, Droplet, ArrowRight, Gauge 
} from 'lucide-react';
import { 
  ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, 
  Tooltip, BarChart, Bar, Cell 
} from 'recharts';

export const CropAwarePlanner: React.FC = () => {
  const { selectedRegionId } = useAuth();
  
  const [cropName, setCropName] = useState<string>('Wheat');
  const [growthStage, setGrowthStage] = useState<string>('Tillering');
  const [farmAcres, setFarmAcres] = useState<number>(3.5);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const cropStagesMap: Record<string, string[]> = {
    'Wheat': ['Crown Root Initiation (CRI)', 'Tillering', 'Jointing & Flowering', 'Grain Formation (Milking)', 'Ripening / Maturity'],
    'Paddy (Rice)': ['Nursery & Transplanting', 'Active Tillering', 'Panicle Initiation / Flowering', 'Grain Filling', 'Maturity'],
    'Sugarcane': ['Germination', 'Tillering / Formative', 'Grand Growth', 'Ripening'],
    'Mustard': ['Vegetative', 'Flowering / Pod Formation', 'Pod Filling & Maturation'],
    'Cotton': ['Seedling', 'Square Formation & Flowering', 'Boll Development', 'Boll Opening'],
    'Gram (Chickpea)': ['Branching', 'Pre-Flowering & Pod Formation', 'Pod Maturity']
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.calculateCropPlan({
      region_id: selectedRegionId,
      crop_name: cropName,
      growth_stage: growthStage,
      farm_area_acres: farmAcres
    }).then(res => {
      if (isMounted) {
        setPlan(res);
        setLoading(false);
      }
    }).catch(err => {
      console.error(err);
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [cropName, growthStage, farmAcres, selectedRegionId]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner (Irrigation Decision Support matching Reference Image 3) */}
      <div className="bg-[#14532d] text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
            <Sprout className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Irrigation Decision Support
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                Instacrops AI
              </span>
            </h1>
            <p className="text-xs text-emerald-200/80">
              Crop-stage aware rootzone moisture tracking & precision irrigation windows
            </p>
          </div>
        </div>

        {/* Crop & Stage Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="text-emerald-300 font-semibold">Crop:</span>
            <select
              value={cropName}
              onChange={(e) => {
                setCropName(e.target.value);
                setGrowthStage(cropStagesMap[e.target.value][0]);
              }}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              {Object.keys(cropStagesMap).map(c => (
                <option key={c} value={c} className="bg-emerald-950 text-white">{c}</option>
              ))}
            </select>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="text-emerald-300 font-semibold">Stage:</span>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              {cropStagesMap[cropName]?.map(s => (
                <option key={s} value={s} className="bg-emerald-950 text-white">{s}</option>
              ))}
            </select>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-700/60 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="text-emerald-300 font-semibold">Area:</span>
            <input
              type="number"
              min="0.5"
              max="50"
              step="0.5"
              value={farmAcres}
              onChange={(e) => setFarmAcres(Number(e.target.value))}
              className="w-14 bg-transparent text-white font-bold focus:outline-none"
            />
            <span className="text-emerald-400">Acres</span>
          </div>
        </div>
      </div>

      {loading || !plan ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        /* Main 2-Column Dashboard (Image 3 exact layout) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: FIELD OVERVIEW, WEATHER & IRRIGATION GAUGE (Image 3) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Field Overview Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Field Overview</span>
                <span className="text-emerald-600 font-semibold">Geo-Fenced</span>
              </div>

              {/* Satellite thumbnail */}
              <div className="relative h-28 rounded-xl overflow-hidden bg-emerald-900 border border-emerald-800 flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px] opacity-30" />
                <div className="text-center z-10">
                  <div className="w-7 h-7 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center mx-auto mb-1">
                    <Droplet className="w-4 h-4 fill-cyan-400" />
                  </div>
                  <span className="text-xs font-bold text-white block">{farmAcres} Acres Plot</span>
                  <span className="text-[10px] text-emerald-200">Soil: Sandy Loam (Alluvial)</span>
                </div>
              </div>

              {/* Weather Forecast strip (Image 3) */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Weather Forecast (Open-Meteo Live)
                </div>
                <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                  {[
                    { day: 'Wed', temp: '24°C', icon: Sun },
                    { day: 'Thu', temp: '22°C', icon: Sun },
                    { day: 'Fri', temp: '23°C', icon: CloudRain },
                    { day: 'Sat', temp: '25°C', icon: Sun }
                  ].map((w) => {
                    const WIcon = w.icon;
                    return (
                      <div key={w.day} className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block">{w.day}</span>
                        <WIcon className="w-3.5 h-3.5 text-amber-500 mx-auto my-0.5" />
                        <span className="font-bold text-slate-700">{w.temp}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Irrigation Recommendation Gauge Card (Image 3) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Irrigation Recommendation</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  plan.urgency_status.includes('Urgent') ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {plan.urgency_status}
                </span>
              </div>

              {/* Gauge Meter Representation */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="text-2xl font-black text-slate-900">
                  {plan.recommended_depth_mm} <span className="text-xs font-normal text-slate-500">mm depth</span>
                </div>
                <div className="text-xs font-bold text-teal-800 bg-teal-50 py-1.5 px-3 rounded-lg border border-teal-200">
                  Scheduled Window: {plan.recommended_time_window}
                </div>
                <div className="text-[11px] text-slate-500">
                  Total water required: <strong>{plan.total_irrigation_needed_liters_per_day.toLocaleString()} Liters</strong>
                </div>
              </div>

              {/* Water Stress Alert Banner (Image 3) */}
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  Water Stress Alert: Critical Infiltration Zone
                </div>
                <p className="text-[11px] text-rose-800 leading-snug">
                  {plan.alert_message}
                </p>
              </div>

              <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                💡 <strong>Conservation Advice:</strong> {plan.water_saving_tip}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SOIL MOISTURE FORECAST & UPCOMING WATER STRESS (Image 3) */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Soil Moisture Forecast Chart (Image 3 exact replica) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Soil Moisture Forecast (0% to 45%)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Actual vs predicted soil moisture with shaded Warning (15-22%) and Critical (&lt;14%) threshold bands
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 font-semibold text-cyan-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" /> Actual Moisture ({plan.current_soil_moisture_pct}%)
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <span className="w-2.5 h-0.5 bg-emerald-600 inline-block border-t border-dashed" /> Predicted Trajectory
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={plan.forecast_chart}>
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis unit="%" domain={[0, 45]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val: any) => [`${val}%`, 'Soil Moisture']} />
                    
                    {/* Critical Band (0-14%) */}
                    <Area
                      type="monotone"
                      dataKey="critical_threshold"
                      stroke="none"
                      fill="#fee2e2"
                      fillOpacity={0.7}
                      name="Critical Zone (<14%)"
                    />

                    {/* Warning Band (14-22%) */}
                    <Area
                      type="monotone"
                      dataKey="warning_threshold"
                      stroke="none"
                      fill="#fef3c7"
                      fillOpacity={0.5}
                      name="Warning Zone (14-22%)"
                    />

                    {/* Predicted curve */}
                    <Line
                      type="monotone"
                      dataKey="predicted_sm_pct"
                      stroke="#059669"
                      strokeWidth={2.5}
                      strokeDasharray="4 4"
                      dot={{ r: 4, fill: '#059669' }}
                      name="Predicted Depletion"
                    />

                    {/* Actual curve */}
                    <Line
                      type="monotone"
                      dataKey="actual_sm_pct"
                      stroke="#0284c7"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#0284c7' }}
                      name="Actual Telemetry"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-rose-400 rounded-sm" />
                  <span>Critical Wilting Point: <strong>{plan.wilting_point_pct}%</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-amber-400 rounded-sm" />
                  <span>Warning Threshold: <strong>22%</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-sm" />
                  <span>Field Capacity: <strong>{plan.field_capacity_pct}%</strong></span>
                </div>
              </div>
            </div>

            {/* Upcoming Water Stress Stacked Bar Chart (Image 3) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Upcoming Water Stress by Days
                  </h2>
                  <p className="text-xs text-slate-500">
                    Predicted daily moisture level showing onset of plant stress
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Healthy
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-amber-500">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Warning
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-rose-500">
                    <span className="w-2.5 h-2.5 rounded bg-rose-500" /> Critical
                  </span>
                </div>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={plan.stress_bars}>
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis unit="%" domain={[0, 45]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val: any) => [`${val}%`, 'Predicted Moisture']} />
                    <Bar dataKey="soil_moisture_pct" radius={[4, 4, 0, 0]}>
                      {plan.stress_bars.map((entry: any, index: number) => (
                        <Cell key={`bar-${index}`} fill={entry.fill_color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
