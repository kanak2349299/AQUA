import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CommandCenter } from './pages/CommandCenter';
import { DigitalTwinMap } from './pages/DigitalTwinMap';
import { GroundwaterPredictor } from './pages/GroundwaterPredictor';
import { DroughtIntelligence } from './pages/DroughtIntelligence';
import { DecisionSupportSystem } from './pages/DecisionSupportSystem';
import { WhatIfSimulationLab } from './pages/WhatIfSimulationLab';
import { RechargeSiteIntelligence } from './pages/RechargeSiteIntelligence';
import { CropAwarePlanner } from './pages/CropAwarePlanner';
import { SatelliteWaterIntelligence } from './pages/SatelliteWaterIntelligence';
import { ConservationTracker } from './pages/ConservationTracker';
import { AquaCopilot } from './pages/AquaCopilot';
import { ReportGenerator } from './pages/ReportGenerator';

import { Bot } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('command-center');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isViewingLanding, setIsViewingLanding] = useState<boolean>(false);
  const [inspectedWellId, setInspectedWellId] = useState<string | undefined>(undefined);

  const handleInspectWell = (wellId: string) => {
    setInspectedWellId(wellId);
    setActiveTab('groundwater-ml');
  };

  if (isViewingLanding) {
    return (
      <LandingPage
        onEnterApp={() => setIsViewingLanding(false)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-900">
      
      {/* Top Navigation */}
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onNavigateToReports={() => setActiveTab('reports')}
        activeTab={activeTab}
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsViewingLanding(false);
          }}
          onOpenLanding={() => setIsViewingLanding(true)}
        />

        {/* Dynamic Main Workspace */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          {activeTab === 'command-center' && <CommandCenter onNavigate={(tab) => setActiveTab(tab)} />}
          {activeTab === 'digital-twin' && <DigitalTwinMap onInspectWell={handleInspectWell} />}
          {activeTab === 'groundwater-ml' && <GroundwaterPredictor initialStationId={inspectedWellId} />}
          {activeTab === 'drought-warning' && <DroughtIntelligence />}
          {activeTab === 'decision-support' && <DecisionSupportSystem />}
          {activeTab === 'simulation-lab' && <WhatIfSimulationLab />}
          {activeTab === 'recharge-ahp' && <RechargeSiteIntelligence />}
          {activeTab === 'crop-planner' && <CropAwarePlanner />}
          {activeTab === 'satellite-ndwi' && <SatelliteWaterIntelligence />}
          {activeTab === 'conservation-tracker' && <ConservationTracker />}
          {activeTab === 'copilot' && <AquaCopilot />}
          {activeTab === 'reports' && <ReportGenerator />}
        </main>
      </div>

      {/* Floating Copilot Shortcut Button (when not on copilot tab) */}
      {activeTab !== 'copilot' && (
        <button
          onClick={() => setActiveTab('copilot')}
          className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-tr from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-slate-950 font-bold rounded-2xl shadow-xl shadow-teal-500/30 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
        >
          <Bot className="w-5 h-5 fill-slate-950" />
          <span className="text-xs font-bold hidden sm:inline">Ask AQUA AI</span>
        </button>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
