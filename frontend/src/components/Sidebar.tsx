import React from 'react';
import { 
  LayoutDashboard, Map, LineChart, AlertTriangle, Lightbulb, 
  Sliders, Compass, Sprout, Satellite, CheckSquare, Bot, 
  FileText, Droplet, UserCheck, LogIn 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLanding?: () => void;
  onOpenAuth: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenLanding, onOpenAuth }) => {
  const menuItems = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard, badge: 'Live' },
    { id: 'digital-twin', label: 'Watershed Twin Map', icon: Map, badge: 'GIS' },
    { id: 'groundwater-ml', label: 'Groundwater ML Predictor', icon: LineChart, badge: 'AI' },
    { id: 'drought-warning', label: 'Drought Early Warning', icon: AlertTriangle, badge: 'Alerts' },
    { id: 'decision-support', label: 'Decision Support (DSS)', icon: Lightbulb, highlight: true },
    { id: 'simulation-lab', label: 'What-If Simulation Lab', icon: Sliders },
    { id: 'recharge-ahp', label: 'Recharge Site Intelligence', icon: Compass, badge: 'AHP' },
    { id: 'crop-planner', label: 'Crop-Aware Water Planner', icon: Sprout },
    { id: 'satellite-ndwi', label: 'Satellite Intelligence', icon: Satellite },
    { id: 'conservation-tracker', label: 'Conservation Tracker', icon: CheckSquare },
    { id: 'copilot', label: 'AQUA AI Copilot', icon: Bot, badge: 'Gemini' },
    { id: 'reports', label: 'Dossier PDF Reports', icon: FileText }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between py-4 shadow-sm z-30 shrink-0 select-none">
      <div className="px-3 space-y-1">
        
        {/* Brand header in sidebar */}
        <div 
          onClick={onOpenLanding}
          className="flex items-center space-x-2.5 px-3 py-2 mb-3 cursor-pointer group rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-teal-500 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Droplet className="w-4 h-4 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              AQUA
              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded">DSS</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Watershed Digital Twin
            </div>
          </div>
        </div>

        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Intelligence Modules
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                isActive
                  ? 'bg-teal-50 text-teal-900 shadow-xs border border-teal-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              } ${item.highlight ? 'ring-1 ring-teal-400/30' : ''}`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sign In / Role Selection Quick Action */}
      <div className="px-3 pt-2">
        <button
          onClick={onOpenAuth}
          className="w-full py-2.5 px-3 bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 border border-teal-200 rounded-xl text-teal-800 text-xs font-bold transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogIn className="w-4 h-4 text-teal-600 group-hover:translate-x-0.5 transition-transform" />
            <span>Sign In / Register</span>
          </div>
          <span className="text-[9px] bg-teal-600 text-white font-bold px-1.5 py-0.5 rounded">
            Roles
          </span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="px-4 pt-3 border-t border-slate-100">
        <div className="text-[10px] text-slate-400 text-center font-medium">
          National Water Intelligence System • 2026
        </div>
      </div>
    </aside>
  );
};
