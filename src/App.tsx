import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';
import { MobileHeader } from './components/MobileHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { JudgeDemoBanner } from './components/JudgeDemoBanner';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { OnboardingModal } from './components/OnboardingModal';
import { LandingPage } from './views/LandingPage';
import { TrendProcessView } from './views/TrendProcessView';
import { DashboardView } from './views/DashboardView';
import { TrendFeedView } from './views/TrendFeedView';
import { TrendDetailView } from './views/TrendDetailView';
import { ActionPlansView } from './views/ActionPlansView';
import { ExpertDashboardView } from './views/ExpertDashboardView';
import { SmartAlertsView } from './views/SmartAlertsView';
import { OpportunitiesView } from './views/OpportunitiesView';
import { ExperimentsView } from './views/ExperimentsView';
import { AnalyticsView } from './views/AnalyticsView';
import { BusinessProfileView } from './views/BusinessProfileView';
import { TrendSourcesView } from './views/TrendSourcesView';
import { AdminView } from './views/AdminView';
import { SettingsView } from './views/SettingsView';
import { GrowthTransformationIntro } from './components/GrowthTransformationIntro';
import { CheckCircle2, Compass, LayoutDashboard, Radio } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, toastMessage } = useApp();
  
  // Default to spacious uncrowded desktop view; phone frame available via toggle
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState<boolean>(false);

  // Growth transformation intro animation plays at start of website
  const [showGrowthIntro, setShowGrowthIntro] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('ttog_intro_seen');
  });

  const handleFinishGrowthIntro = () => {
    try {
      sessionStorage.setItem('ttog_intro_seen', 'true');
    } catch {
      // ignore
    }
    setShowGrowthIntro(false);
    if (currentView !== 'process') {
      setCurrentView('process');
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsPhoneFrameMode(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Landing Page view
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#eaf0f8] text-slate-900 flex flex-col font-sans select-none">
        <LandingPage />
        <GlobalSearchModal />
        <OnboardingModal />

        {/* Growth Transformation Video Animation Modal */}
        <GrowthTransformationIntro
          isOpen={showGrowthIntro}
          onComplete={handleFinishGrowthIntro}
          onSkip={handleFinishGrowthIntro}
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="bg-[#eaf0f8] text-slate-900 px-4 py-2.5 rounded-2xl nm-raised text-xs font-bold flex items-center gap-2 border border-emerald-400/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Application Shell
  return (
    <MobileDeviceFrame
      isPhoneFrameMode={isPhoneFrameMode}
      onTogglePhoneFrame={() => setIsPhoneFrameMode(!isPhoneFrameMode)}
    >
      {/* Golden Arrow Growth Transformation Animation at start */}
      <GrowthTransformationIntro
        isOpen={showGrowthIntro}
        onComplete={handleFinishGrowthIntro}
        onSkip={handleFinishGrowthIntro}
      />

      {/* Uncrowded Top Navigation Header */}
      <MobileHeader
        isPhoneFrameMode={isPhoneFrameMode}
        onTogglePhoneFrame={() => setIsPhoneFrameMode(!isPhoneFrameMode)}
        onOpenVideoGraphic={() => setShowGrowthIntro(true)}
      />

      {/* Floating Judge Walkthrough Control (Unobtrusive floating pill) */}
      <JudgeDemoBanner />

      {/* Mobile-only Segment Switcher (Hidden on desktop to avoid duplicate header clutter) */}
      <div className="lg:hidden px-3.5 pt-2 pb-1 shrink-0 bg-[#eaf0f8] select-none">
        <div className="nm-flat rounded-2xl p-1 flex items-center gap-1">
          <button
            onClick={() => setCurrentView('process')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'process'
                ? 'nm-inset-sm text-blue-900 font-extrabold border border-blue-400/50 bg-blue-50/40'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Process</span>
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'dashboard'
                ? 'nm-inset-sm text-emerald-900 font-extrabold border border-emerald-400/50 bg-emerald-50/40'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pulse</span>
          </button>

          <button
            onClick={() => setCurrentView('trend-feed')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'trend-feed'
                ? 'nm-inset-sm text-cyan-900 font-extrabold border border-cyan-400/50 bg-cyan-50/40'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-600" />
            <span>Signals</span>
          </button>
        </div>
      </div>

      {/* Main Spacious Viewport (Uncluttered, comfortable padding & breathing room) */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 space-y-6 bg-[#eaf0f8]">
        {currentView === 'process' && <TrendProcessView />}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'trend-feed' && <TrendFeedView />}
        {currentView === 'trend-detail' && <TrendDetailView />}
        {currentView === 'action-plans' && <ActionPlansView />}
        {currentView === 'expert-dashboard' && <ExpertDashboardView />}
        {currentView === 'smart-alerts' && <SmartAlertsView />}
        {currentView === 'opportunities' && <OpportunitiesView />}
        {currentView === 'experiments' && <ExperimentsView />}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'business-profile' && <BusinessProfileView />}
        {currentView === 'trend-sources' && <TrendSourcesView />}
        {currentView === 'admin' && <AdminView />}
        {currentView === 'settings' && <SettingsView />}
      </main>

      {/* Bottom Navigation for Mobile */}
      <MobileBottomNav />

      {/* Modals */}
      <GlobalSearchModal />
      <OnboardingModal />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none">
          <div className="bg-[#eaf0f8] text-slate-900 px-4 py-2.5 rounded-2xl nm-raised text-xs font-bold flex items-center gap-2 border border-emerald-400/30 shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </MobileDeviceFrame>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
