import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  LineChart as LineChartIcon, CheckCircle2, AlertTriangle, 
  HelpCircle, Sparkles, TrendingDown, ArrowDownRight, Layers, Sliders 
} from 'lucide-react';
import { 
  ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, 
  Tooltip, Legend, BarChart, Bar, Cell 
} from 'recharts';

export const GroundwaterPredictor: React.FC<{ initialStationId?: string }> = ({ initialStationId }) => {
  const { selectedRegionId } = useAuth();
  const [stationId, setStationId] = useState<string>(initialStationId || 'W-LDH-01');
  const [horizonDays, setHorizonDays] = useState<number>(30);
  const [prediction, setPrediction] = useState<any>(null);
  const [wells, setWells] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    api.getWells().then(w => {
      if (isMounted) {
        setWells(w);
        if (!initialStationId && w.length > 0) {
          const match = w.find((item: any) => item.district.toLowerCase().includes(selectedRegionId.toLowerCase()));
          if (match) setStationId(match.id);
        }
      }
    });
    return () => { isMounted = false; };
  }, [selectedRegionId, initialStationId]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getPrediction(stationId, horizonDays, selectedRegionId)
      .then(res => {
        if (isMounted) {
          setPrediction(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [stationId, horizonDays, selectedRegionId]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              AI Groundwater Prediction Engine
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
              Random Forest & Chronological Split
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Time-series forecasting with 95% Confidence Uncertainty Intervals & SHAP-based feature attributions
          </p>
        </div>

        {/* Horizon Pills (7d, 15d, 30d) */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 mr-1">Forecast Horizon:</span>
          {[7, 15, 30].map(days => (
            <button
              key={days}
              onClick={() => setHorizonDays(days)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                horizonDays === days
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Station Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Select Monitoring Telemetry Station:</span>
          <select
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {wells.map(w => (
              <option key={w.id} value={w.id}>
                {w.name} — {w.village} ({w.district}, {w.status})
              </option>
            ))}
          </select>
        </div>

        {prediction && (
          <div className="flex items-center gap-4 text-slate-600">
            <div>
              Current Level: <strong className="text-slate-900">{prediction.current_depth_m} m bgl</strong>
            </div>
            <div>
              Projected Level ({horizonDays}d): <strong className="text-rose-600">{prediction.predicted_depth_m} m bgl</strong>
            </div>
          </div>
        )}
      </div>

      {loading || !prediction ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Executing Scikit-Learn Model & Temporal Validation...</p>
          </div>
        </div>
      ) : (
        <>
          {/* 4 Performance Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-medium text-slate-500 mb-1">Model Accuracy (R² Score)</div>
              <div className="text-2xl font-black text-teal-600">
                {prediction.metrics.r2_score}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Chronological out-of-time test split</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-medium text-slate-500 mb-1">Root Mean Square Error</div>
              <div className="text-2xl font-black text-slate-800">
                {prediction.metrics.rmse_m} <span className="text-xs font-normal text-slate-500">meters</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Root mean squared prediction error</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-medium text-slate-500 mb-1">Mean Absolute Error (MAE)</div>
              <div className="text-2xl font-black text-slate-800">
                {prediction.metrics.mae_m} <span className="text-xs font-normal text-slate-500">meters</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Average residual deviation</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="text-xs font-medium text-slate-500 mb-1">Depletion Stress Probability</div>
              <div className="text-2xl font-black text-rose-600">
                {prediction.depletion_probability_pct}%
              </div>
              <p className="text-[10px] text-rose-500 font-semibold mt-1">
                95% CI: [{prediction.confidence_interval_low}m – {prediction.confidence_interval_high}m]
              </p>
            </div>

          </div>

          {/* Actual vs Predicted Graph with 95% Confidence Interval */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {horizonDays}-Day Trajectory Forecast: Depth Below Ground Level (m bgl)
                </h2>
                <p className="text-xs text-slate-500">
                  Note: Higher values indicate deeper water table (greater depletion). Shaded area indicates 95% uncertainty.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-cyan-600">
                  <span className="w-3 h-0.5 bg-cyan-600 inline-block" /> Actual / Observation
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-rose-500">
                  <span className="w-3 h-0.5 bg-rose-500 inline-block border-t border-dashed" /> Predicted Level
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={prediction.time_series}>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 11 }}
                    unit="m"
                  />
                  <Tooltip
                    formatter={(val: any) => [`${val} m bgl`, 'Water Table']}
                    contentStyle={{ borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="upper_ci_95"
                    stroke="none"
                    fill="#fee2e2"
                    fillOpacity={0.6}
                    name="95% CI Range"
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted_m"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#ef4444' }}
                    name="Predicted Depth"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual_m"
                    stroke="#0284c7"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0284c7' }}
                    name="Actual Telemetry"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SHAP Explainable AI Waterfall / Importance Breakdown (Reference from PPT) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  SHAP Explainable AI: Feature Attributions to Depletion
                </h2>
                <p className="text-xs text-slate-500">
                  Quantifies which hydrological factors drive water table drop in this aquifer system
                </p>
              </div>
              <span className="text-[11px] text-slate-400">Additive Feature Attribution</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prediction.shap_feature_importance} layout="vertical">
                    <XAxis type="number" unit="%" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="feature" type="category" width={170} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val: any) => [`${val}%`, 'Contribution']} />
                    <Bar dataKey="contribution_pct" radius={[0, 4, 4, 0]}>
                      {prediction.shap_feature_importance.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.impact_color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 text-xs flex flex-col justify-center">
                {prediction.shap_feature_importance.map((f: any) => (
                  <div key={f.feature} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">{f.feature}</span>
                      <span className="text-[10px] text-slate-500 block">{f.direction}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-sm" style={{ color: f.impact_color }}>
                        {f.contribution_pct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>Scientific Integrity Guarantee:</strong> Models are trained with temporal chronological splits to prevent test-set leakage. Uncalibrated extrapolations are explicitly tagged with widened confidence boundaries.
              </span>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
