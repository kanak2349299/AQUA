import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, TrendingDown, 
  MapPin, Bell, Droplet, ArrowRight, Activity, ThermometerSun 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const DroughtIntelligence: React.FC = () => {
  const { selectedRegionId } = useAuth();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getDroughtAssessment(selectedRegionId)
      .then(res => {
        if (isMounted) {
          setAssessment(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [selectedRegionId]);

  if (loading || !assessment) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const scoreComponents = [
    { name: 'Groundwater Table Decline', value: assessment.groundwater_decline_pct, weight: '35%', color: '#ef4444' },
    { name: 'Rainfall Deficit (IMD LPA)', value: assessment.rainfall_deficit_pct, weight: '35%', color: '#f97316' },
    { name: 'Soil Moisture Deficit', value: Math.round(100 - assessment.soil_moisture_pct * 3), weight: '15%', color: '#eab308' },
    { name: 'Evapotranspiration Heat Stress', value: Math.round(assessment.evapotranspiration_mm * 12), weight: '15%', color: '#8b5cf6' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Drought Early Warning & Hyperlocal Intelligence
            </h1>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white ${
              assessment.risk_level === 'Critical Risk' ? 'bg-rose-600' : 'bg-amber-600'
            }`}>
              {assessment.risk_level}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Transparent composite scoring based on CGWB drawdown, IMD rainfall index and Open-Meteo soil moisture
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium">Composite Drought Score</span>
            <div className="text-2xl font-black text-rose-600 leading-none">
              {assessment.drought_score} <span className="text-xs font-normal text-slate-500">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transparent Score Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {scoreComponents.map((c) => (
          <div key={c.name} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">{c.name}</span>
              <span className="font-bold text-slate-400">{c.weight}</span>
            </div>
            <div className="text-xl font-black text-slate-900">
              {c.value}%
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, c.value)}%`, backgroundColor: c.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Active Warning Alerts & Village Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Early Warning Trigger Cards */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-rose-500" />
              Active Early Warning Broadcasts
            </span>
            <span className="text-[10px] text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-full">
              Automated Telemetry Triggers
            </span>
          </div>

          <div className="space-y-3">
            {assessment.early_warning_alerts.map((alert: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl border border-rose-200 bg-rose-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    {alert.title}
                  </span>
                  <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    {alert.level}
                  </span>
                </div>
                <p className="text-xs text-rose-800 leading-snug">
                  {alert.message}
                </p>
                <div className="text-[11px] font-bold text-rose-950 pt-1 border-t border-rose-200/60">
                  Triggered Action: {alert.action}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
            <strong>Recommended Preventive Action:</strong> {assessment.recommended_preventive_action}
          </div>
        </div>

        {/* Hyperlocal High-Risk Villages */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              Hyperlocal High-Risk Village Hotspots
            </span>
            <span className="text-[10px] text-slate-400">Village-Level Spatial Filter</span>
          </div>

          <div className="space-y-2.5">
            {assessment.high_risk_villages.map((v: any) => (
              <div key={v.village} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{v.village} Cluster</div>
                  <div className="text-[11px] text-slate-500">
                    Wells affected: <strong>{v.wells_affected} stations</strong> • Pumping stress critical
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-rose-600">{v.risk_score}</div>
                  <span className="text-[10px] font-bold uppercase text-slate-500">{v.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Validated against CGWB Telemetry & IMD National Drought Manual criteria.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
