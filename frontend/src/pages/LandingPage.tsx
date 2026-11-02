import React from 'react';
import { 
  Droplet, ArrowRight, Sparkles, ShieldCheck, Database, 
  MapPin, LineChart, AlertTriangle, Lightbulb, Compass, 
  Sprout, Satellite, CheckCircle2, Play 
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenAuth }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-teal-500 selection:text-white">
      
      {/* Top Navigation */}
      <nav className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Droplet className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white">A.Q.U.A.</span>
              <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                AQUA
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenAuth}
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onEnterApp}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Launch Live Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section (Honoring PPT Problem Statement) */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-semibold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hack The Circle • Water Resources Division</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Predict groundwater stress <br />
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
              before it becomes a water crisis.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            <strong>A.Q.U.A. (Aquifer Quantification & Understanding through AI)</strong> fuses real CGWB groundwater observation wells, live Open-Meteo telemetry, and Sentinel-2 satellite data into a predictive digital twin and multi-stakeholder Decision Support System.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onEnterApp}
              className="px-6 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Explore Live Watershed Twin</span>
            </button>
            <button
              onClick={onOpenAuth}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm rounded-xl transition-all"
            >
              Sign In with Role (Farmer / Govt / Hydrologist)
            </button>
          </div>

          {/* Workflow Sequence from PPT: ACQUIRE -> PREPARE -> PREDICT -> PRESENT & ACT */}
          <div className="pt-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              {[
                { step: '01 ACQUIRE', title: 'Real Ingestion', desc: 'CGWB observation wells, IMD rainfall, live Open-Meteo' },
                { step: '02 PREPARE', title: 'Spatial Alignment', desc: 'GeoPandas unit alignment, missing value imputation' },
                { step: '03 ANALYSE', title: 'AI & Scikit-Learn', desc: 'Random Forest, XGBoost & temporal validation' },
                { step: '04 PRESENT & ACT', title: 'Decision Support', desc: 'Tailored 7-point DSS interventions for stakeholders' }
              ].map((s) => (
                <div key={s.step} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
                  <div className="text-[10px] font-mono font-bold text-teal-400">{s.step}</div>
                  <div className="text-xs font-bold text-white mt-1">{s.title}</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Top 5 Innovations Grid (Explicitly matching user's additions) */}
      <section className="py-16 border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Top 5 Core Innovations</h2>
            <p className="text-xs text-slate-400">Engineered to scientific standards with verified data connectors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Recharge Site Intelligence */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">1. Recharge Site Intelligence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Geospatial & AHP-based identification of potential zones for artificial recharge and check dam cascading in Haridwar, Ludhiana, and drought-prone basins.
              </p>
            </div>

            {/* 2. Crop-Aware Water Planner */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">2. Crop-Aware Water Planner</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instacrops-style dynamic rootzone ETc calculation ($ET_c = K_c \times ET_0$) for Wheat, Paddy, Sugarcane, and Cotton to cut farm water waste by 30%.
              </p>
            </div>

            {/* 3. Climate Shock Simulator */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center">
                <Droplet className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">3. Climate Shock Simulator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                WaterSim Arizona-calibrated water balance engine simulating rainfall shocks ($\pm 30\%$), tubewell pumping stress, and temperature heat waves.
              </p>
            </div>

            {/* 4. Explainable AI (SHAP) */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">4. Explainable AI Risk Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                SHAP feature attributions decomposing exactly which factors (pumping rate, rainfall deficit, ET0) contribute to localized aquifer depletion.
              </p>
            </div>

            {/* 5. Hyperlocal Early Warning */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">5. Hyperlocal Early Warning</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-tier village alerts linking telemetry cone drawdown to actionable emergency water conservation orders before tubewell dry-out.
              </p>
            </div>

            {/* 6. Gemini Copilot */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">6. AQUA AI Copilot</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Structured tool execution powered by Google Gemini 1.5 Flash grounded in actual project telemetry, never inventing unverified numbers.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <div>A.Q.U.A. • Aquifer Quantification & Understanding through AI</div>
        <div className="text-slate-600 mt-1">Built with pride by National Water Intelligence Initiative 2026</div>
      </footer>

    </div>
  );
};
