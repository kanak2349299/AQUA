import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Droplet, MapPin, FileText, LogOut, RefreshCw, 
  User as UserIcon, Sparkles, Bell 
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onNavigateToReports: () => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onNavigateToReports }) => {
  const { user, selectedRegionId, setSelectedRegionId, logout } = useAuth();

  const regions = [
    { id: 'yamuna', label: 'Yamuna River Basin (Delhi - Haryana - UP)' },
    { id: 'haridwar', label: 'Haridwar, UK (Upper Ganga Basin)' },
    { id: 'ludhiana', label: 'Ludhiana, PB (Sutlej Basin)' },
    { id: 'dehradun', label: 'Dehradun, UK (Yamuna/Dun Basin)' },
    { id: 'latur', label: 'Latur, MH (Manjra Basin)' },
    { id: 'jaipur', label: 'Jaipur, RJ (Banganga Basin)' },
    { id: 'anantapur', label: 'Anantapur, AP (Penna Basin)' },
    { id: 'thanjavur', label: 'Thanjavur, TN (Cauvery Delta)' },
    { id: 'bundelkhand', label: 'Bundelkhand, UP (Betwa Interfluve)' }
  ];

  const displayName = user?.name || 'Himangi';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/25">
            <Droplet className="w-5 h-5 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">AQUA</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                Digital Twin
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Aquifer Quantification & Understanding through AI
            </p>
          </div>
        </div>

        {/* Center: District & Watershed Switcher */}
        <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 backdrop-blur-sm">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-400 font-medium hidden md:inline">Region:</span>
          <select
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer pr-1"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                {r.label}
              </option>
            ))}
          </select>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" title="Live Telemetry Connected" />
        </div>

        {/* Right Section: Telemetry Indicator, Role Badge, Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Live Telemetry Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-medium text-emerald-300">
            <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin [animation-duration:8s]" />
            <span>Open-Meteo & CGWB Live</span>
          </div>

          {/* Quick PDF Report button */}
          <button
            onClick={onNavigateToReports}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dossier PDF</span>
          </button>

          {/* User Profile / Role Pill showing Himangi by default */}
          <div className="flex items-center space-x-2">
            <div 
              onClick={onOpenAuth}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-teal-500/50 cursor-pointer transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-teal-400 text-slate-950 flex items-center justify-center font-extrabold text-xs shadow-sm">
                {displayName.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-100 max-w-[120px] truncate">
                  {displayName}
                </div>
                <div className="text-[10px] text-teal-400 capitalize font-medium">
                  {user?.role || 'Guest'} View
                </div>
              </div>
            </div>

            {user && (
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
