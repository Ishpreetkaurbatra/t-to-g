import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';
import { MobileStatusBar } from './components/MobileStatusBar';
import { MobileHeader } from './components/MobileHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DemoDataBadge } from './components/DemoDataBadge';
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
import { IntroVideoGraphic } from './components/IntroVideoGraphic';
import { CheckCircle2, Compass, LayoutDashboard, Radio } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, toastMessage } = useApp();
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 768 : false;
  });

  // Video Graphic at the start of the application
  const [showVideoGraphic, setShowVideoGraphic] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('ttog_video_seen');
  });

  const handleFinishVideoGraphic = () => {
    try {
      sessionStorage.setItem('ttog_video_seen', 'true');
    } catch {
      // ignore
    }
    setShowVideoGraphic(false);
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
        <DemoDataBadge />
        <JudgeDemoBanner />
        <LandingPage />
        <GlobalSearchModal />
        <OnboardingModal />

        {/* Video Graphic Modal */}
        <IntroVideoGraphic
          isOpen={showVideoGraphic}
          onComplete={handleFinishVideoGraphic}
          onSkip={handleFinishVideoGraphic}
        />

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="bg-[#eaf0f8] text-slate-900 px-4 py-2.5 rounded-2xl nm-raised text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile Application Shell with Neumorphism Theme
  return (
    <MobileDeviceFrame
      isPhoneFrameMode={isPhoneFrameMode}
      onTogglePhoneFrame={() => setIsPhoneFrameMode(!isPhoneFrameMode)}
    >
      {/* Intro Video Graphic at the start of the application */}
      <IntroVideoGraphic
        isOpen={showVideoGraphic}
        onComplete={handleFinishVideoGraphic}
        onSkip={handleFinishVideoGraphic}
      />

      {/* Phone Status Bar */}
      <MobileStatusBar />

      {/* Demo Signal Notice Pill */}
      <DemoDataBadge />

      {/* Judge Walkthrough Banner */}
      <JudgeDemoBanner />

      {/* Mobile Header with T-to-G Logo and Video graphic trigger */}
      <MobileHeader
        isPhoneFrameMode={isPhoneFrameMode}
        onTogglePhoneFrame={() => setIsPhoneFrameMode(!isPhoneFrameMode)}
        onOpenVideoGraphic={() => setShowVideoGraphic(true)}
      />

      {/* Neumorphic Mode Segment Pill Bar (Blue & Green Accents) */}
      <div className="px-3.5 pt-2 pb-1 shrink-0 bg-[#eaf0f8] select-none">
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
            <span>Trend Process</span>
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

      {/* Main Screen Content Viewport (Scrollable with clean neumorphic canvas) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-4 space-y-4 bg-[#eaf0f8]">
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
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Overlays & Modals */}
      <GlobalSearchModal />
      <OnboardingModal />

      {/* Mobile Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 w-11/12 max-w-sm">
          <div className="bg-[#eaf0f8] text-slate-900 px-4 py-2.5 rounded-2xl nm-raised text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </div>
        </div>
      )}
    </MobileDeviceFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
