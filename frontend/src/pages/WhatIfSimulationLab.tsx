import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Sliders, Play, RefreshCw, CheckCircle2, AlertTriangle, 
  TrendingDown, TrendingUp, Droplet, ArrowRight, Gauge 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const WhatIfSimulationLab: React.FC = () => {
  const { selectedRegionId } = useAuth();
  
  // Interactive Simulation Controls
  const [rainfallChange, setRainfallChange] = useState<number>(-20);
  const [pumpingChange, setPumpingChange] = useState<number>(15);
  const [tempIncrease, setTempIncrease] = useState<number>(1.5);
  const [rechargeCount, setRechargeCount] = useState<number>(12);
  const [dripAdoption, setDripAdoption] = useState<number>(25);

  const [result, setResult] = useState<any>(null);
  const [running, setRunning] = useState<boolean>(false);

  const executeSimulation = () => {
    setRunning(true);
    api.runSimulation({
      region_id: selectedRegionId,
      rainfall_change_pct: rainfallChange,
      pumping_change_pct: pumpingChange,
      temp_increase_c: tempIncrease,
      recharge_interventions_count: rechargeCount,
      drip_irrigation_adoption_pct: dripAdoption
    }).then(res => {
      setResult(res);
      setRunning(false);
    }).catch(err => {
      console.error(err);
      setRunning(false);
    });
  };

  useEffect(() => {
    executeSimulation();
  }, [selectedRegionId]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner (WaterSim Arizona style matching Reference Image 4) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              A.Q.U.A. Climate Shock & What-If Simulation Lab
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              WaterSim Calibrated
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate future climatic deficits, extraction stress, and conservation interventions on aquifer storage
          </p>
        </div>

        <button
          onClick={executeSimulation}
          disabled={running}
          className="px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {running ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
          <span>Run Simulation Model</span>
        </button>
      </div>

      {/* Main Grid: Left Controls & Right Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: INTERACTIVE CONTROLS (WaterSim Arizona Style) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-teal-600" />
              Scenario Control Parameters
            </span>
            <span className="text-[10px] text-slate-400">Policy & Climate</span>
          </div>

          {/* 1. Rainfall Deficit / Surplus Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700">Monsoon Rainfall Variability:</label>
              <span className={`font-bold ${rainfallChange < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {rainfallChange > 0 ? `+${rainfallChange}%` : `${rainfallChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="5"
              value={rainfallChange}
              onChange={(e) => setRainfallChange(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-30% (Severe Drought)</span>
              <span>0% (Normal)</span>
              <span>+30% (Surplus)</span>
            </div>
          </div>

          {/* 2. Pumping Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700">Groundwater Tubewell Pumping:</label>
              <span className={`font-bold ${pumpingChange > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {pumpingChange > 0 ? `+${pumpingChange}%` : `${pumpingChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="5"
              value={pumpingChange}
              onChange={(e) => setPumpingChange(Number(e.target.value))}
              className="w-full accent-cyan-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-30% (Rationed Draft)</span>
              <span>0% (Status Quo)</span>
              <span>+30% (Unregulated)</span>
            </div>
          </div>

          {/* 3. Heatwave / Temperature Shock */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700">Climate Warming / Heat Shock:</label>
              <span className="font-bold text-amber-600">+{tempIncrease}°C</span>
            </div>
            <input
              type="range"
              min="0"
              max="3.0"
              step="0.5"
              value={tempIncrease}
              onChange={(e) => setTempIncrease(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0°C (Baseline)</span>
              <span>+1.5°C (IPCC Mid)</span>
              <span>+3.0°C (Extreme Heat)</span>
            </div>
          </div>

          {/* 4. Artificial Recharge Structures */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700">Recharge Shafts & Check Dams:</label>
              <span className="font-bold text-teal-600">{rechargeCount} units</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="2"
              value={rechargeCount}
              onChange={(e) => setRechargeCount(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 units</span>
              <span>20 units</span>
              <span>40 units</span>
            </div>
          </div>

          {/* 5. Drip Irrigation Adoption */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-slate-700">Drip / Micro-Irrigation Adoption:</label>
              <span className="font-bold text-emerald-600">{dripAdoption}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="5"
              value={dripAdoption}
              onChange={(e) => setDripAdoption(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Flood only)</span>
              <span>40% (Target)</span>
              <span>80% (High Precision)</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SIMULATION RESULTS & SUSTAINABILITY GAUGES (Reference Image 4) */}
        <div className="lg:col-span-7 space-y-5">
          {result && (
            <>
              {/* Sustainability Indicators (Image 4 exact style) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Sustainability Indicators
                  </span>
                  <span className="text-[10px] text-slate-400">Calibrated Index (0-100)</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-500 mb-1">Economy</div>
                    <div className="text-xl font-black text-slate-900">
                      {result.sustainability_indicators.agricultural_economy}%
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${result.sustainability_indicators.agricultural_economy}%` }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-500 mb-1">Environment</div>
                    <div className="text-xl font-black text-slate-900">
                      {result.sustainability_indicators.environmental_flow}%
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${result.sustainability_indicators.environmental_flow}%` }} />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-500 mb-1">Groundwater Health</div>
                    <div className={`text-xl font-black ${
                      result.sustainability_indicators.groundwater_health < 50 ? 'text-rose-600' : 'text-teal-600'
                    }`}>
                      {result.sustainability_indicators.groundwater_health}%
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className={`h-full rounded-full ${
                        result.sustainability_indicators.groundwater_health < 50 ? 'bg-rose-500' : 'bg-teal-500'
                      }`} style={{ width: `${result.sustainability_indicators.groundwater_health}%` }} />
                    </div>
                  </div>
                </div>

                {/* Narrative Assessment (Image 4) */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    Hydrological Impact Assessment:
                  </div>
                  {result.assessment_narrative}
                </div>
              </div>

              {/* Water Balance Breakdown: Sources vs Consumers (Image 4) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Simulated Water Balance: Sources vs Consumers (MCM/yr)
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Net Storage Shift: <strong className={result.net_storage_change_mcm < 0 ? 'text-rose-600' : 'text-emerald-600'}>
                      {result.net_storage_change_mcm > 0 ? `+${result.net_storage_change_mcm}` : result.net_storage_change_mcm} MCM
                    </strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  {/* Sources */}
                  <div className="space-y-2">
                    <div className="font-bold text-slate-700">Sources of Water:</div>
                    {result.sources.map((s: any) => (
                      <div key={s.name} className="p-2 rounded-lg bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                          <span className="text-slate-700 font-medium">{s.name}</span>
                        </div>
                        <span className="font-bold text-slate-900">{s.value} MCM</span>
                      </div>
                    ))}
                  </div>

                  {/* Consumers */}
                  <div className="space-y-2">
                    <div className="font-bold text-slate-700">Consumers of Water:</div>
                    {result.consumers.map((c: any) => (
                      <div key={c.name} className="p-2 rounded-lg bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                          <span className="text-slate-700 font-medium">{c.name}</span>
                        </div>
                        <span className="font-bold text-slate-900">{c.value} MCM</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
};
