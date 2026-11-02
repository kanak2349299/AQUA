import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Lightbulb, AlertOctagon, CheckCircle2, TrendingUp, IndianRupee, 
  ShieldCheck, AlertTriangle, ArrowRight, Filter, Users, Building, 
  Sprout, Microscope, Compass 
} from 'lucide-react';

export const DecisionSupportSystem: React.FC = () => {
  const { selectedRegionId, user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getDSSRecommendations(selectedRegionId, selectedCategory)
      .then(res => {
        if (isMounted) {
          setRecommendations(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [selectedRegionId, selectedCategory]);

  const filtered = recommendations.filter(r => {
    if (selectedPriority !== 'all' && r.priority_level.toLowerCase() !== selectedPriority.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner (Central Differentiator Flagship) */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-cyan-950 text-white p-6 rounded-2xl border border-teal-800/50 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 tracking-wider">
                Flagship Module
              </span>
              <span className="text-xs text-cyan-300 font-semibold">
                Decision Support System (DSS)
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Actionable Intelligence & Conservation Engine
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Moving beyond passive dashboards: Generating evidence-linked, costed interventions tailored for district authorities, agricultural communities, and basin hydrologists.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 text-center">
              <div className="text-xl font-bold text-cyan-300">{recommendations.length}</div>
              <div className="text-[10px] text-slate-300 font-medium">Active Proposals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Role & Priority Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Stakeholder Tabs */}
        <div className="flex items-center space-x-1.5">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Stakeholder:
          </span>
          {[
            { id: 'all', label: 'All Stakeholders', icon: Compass },
            { id: 'farmer', label: 'Farmers', icon: Sprout },
            { id: 'officer', label: 'District Admin', icon: Building },
            { id: 'researcher', label: 'Hydrologists', icon: Microscope }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-semibold">Priority:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 font-semibold text-slate-800 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical Only</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
          </select>
        </div>

      </div>

      {/* Recommendations Cards Grid (Each with 7 Mandatory Fields) */}
      {loading ? (
        <div className="h-48 flex items-center justify-center bg-white rounded-2xl border border-slate-200">
          <div className="w-7 h-7 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const isCritical = item.priority_level === 'Critical';
            const isHigh = item.priority_level === 'High';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Top strip badge */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                  isCritical ? 'bg-rose-500' : isHigh ? 'bg-amber-500' : 'bg-teal-500'
                }`} />

                {/* Header: ID, Category, Priority, Confidence */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{item.id}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Target: {item.category}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isCritical
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : isHigh
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-teal-100 text-teal-800 border border-teal-200'
                    }`}>
                      {item.priority_level} Priority
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Scientific Confidence: <strong>{item.confidence_score_pct}%</strong></span>
                  </div>
                </div>

                {/* 1. Identified Problem */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${isCritical ? 'text-rose-600' : 'text-amber-600'}`} />
                    1. Problem: {item.identified_problem}
                  </h3>
                </div>

                {/* 2. Supporting Data */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                    2. Supporting Field & Telemetry Data:
                  </div>
                  <p className="leading-relaxed pl-5 font-mono text-[11px] text-slate-600">
                    {item.supporting_data}
                  </p>
                </div>

                {/* 3. Recommended Action (Hero) */}
                <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200 text-xs text-teal-950 space-y-1">
                  <div className="font-bold text-teal-900 flex items-center gap-1.5 text-sm">
                    <Lightbulb className="w-4 h-4 text-teal-600" />
                    3. Recommended Action:
                  </div>
                  <p className="leading-relaxed text-teal-900 font-medium pl-5 text-[12px]">
                    {item.recommended_action}
                  </p>
                </div>

                {/* 4 & 5. Expected Benefit & Estimated Cost */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-950">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      4. Expected Hydrological & Economic Benefit:
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-snug">{item.expected_benefit}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-950">
                    <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                      <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                      5. Estimated Cost / Budget Scheme:
                    </div>
                    <p className="text-[11px] text-blue-800 font-semibold leading-snug">{item.estimated_cost_inr}</p>
                  </div>
                </div>

                {/* 6 & 7. Scientific Limitations */}
                <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
                  <AlertOctagon className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>7. Scientific Confidence & Boundary Limitations:</strong> {item.scientific_limitations}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
