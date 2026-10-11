import React, { useState } from 'react';
import { useApp, AppView } from '../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  BellRing,
  FileCheck2,
  ShieldCheck,
  Grid,
  Flame,
  FlaskConical,
  BarChart3,
  Store,
  Radio,
  UserCheck,
  Settings,
  X,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, activeAlerts } = useApp();
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const mainTabs: { id: AppView; label: string; icon: any; badge?: number | string }[] = [
    { id: 'process', label: 'Process', icon: Compass, badge: '⚡' },
    { id: 'dashboard', label: 'Pulse', icon: LayoutDashboard },
    { id: 'trend-feed', label: 'Signals', icon: Radio, badge: '22' },
    { id: 'action-plans', label: 'Plans', icon: FileCheck2 },
    { id: 'expert-dashboard', label: 'Experts', icon: ShieldCheck, badge: '✓' },
  ];

  const moreItems: { id: AppView; label: string; icon: any; desc: string }[] = [
    { id: 'opportunities', label: 'Opportunity Engine', icon: Flame, desc: 'Algorithmic formula ranking' },
    { id: 'experiments', label: 'Live Experiments', icon: FlaskConical, desc: 'Test-Measure-Learn-Adapt' },
    { id: 'analytics', label: 'Growth Analytics', icon: BarChart3, desc: 'Conversion funnel & trends' },
    { id: 'business-profile', label: 'Business Profile', icon: Store, desc: 'Location intelligence' },
    { id: 'trend-sources', label: 'Trend Sources', icon: Radio, desc: '11 Ingestion connectors' },
    { id: 'admin', label: 'Admin Console', icon: UserCheck, desc: 'System oversight & reset' },
    { id: 'settings', label: 'Settings & RLS', icon: Settings, desc: 'Supabase & telemetry' },
  ];

  const handleTabClick = (view: AppView) => {
    setCurrentView(view);
    setIsMoreSheetOpen(false);
  };

  return (
    <>
      {/* More Drawer */}
      {isMoreSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/25 backdrop-blur-xs flex items-end justify-center p-0 animate-in fade-in duration-150"
          onClick={() => setIsMoreSheetOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#eaf0f8] rounded-t-3xl p-5 space-y-4 shadow-2xl border-t border-white/80 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Handle */}
            <div className="w-12 h-1.5 bg-[#cbd5e1] rounded-full mx-auto"></div>

            <div className="flex items-center justify-between pb-2 border-b border-[#d8e2ee]">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-800">All Modules & Tools</h3>
              </div>
              <button
                onClick={() => setIsMoreSheetOpen(false)}
                className="w-7 h-7 rounded-full nm-btn flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of secondary actions */}
            <div className="grid grid-cols-2 gap-2.5 max-h-[55vh] overflow-y-auto p-1">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`p-3 rounded-2xl text-left transition-all cursor-pointer ${
                      isActive ? 'nm-inset text-teal-900 font-bold border border-teal-300/50' : 'nm-flat text-slate-700 hover:nm-raised-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-1.5 rounded-xl ${isActive ? 'nm-btn-primary text-white' : 'nm-inset-sm text-teal-700'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold leading-tight line-clamp-1">{item.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Clean Neumorphic Mobile Bottom Navigation Dock */}
      <nav className="w-full bg-[#eaf0f8] border-t border-[#d8e2ee] shrink-0 z-40 select-none px-2.5 pt-2 pb-1.5">
        <div className="max-w-md mx-auto flex items-center justify-around gap-1.5">
          {mainTabs.map((tab) => {
            const isActive = currentView === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex-1 py-1.5 px-1 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative ${
                  isActive
                    ? 'nm-inset-sm text-blue-950 font-extrabold border border-blue-400/50 bg-blue-50/40'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-blue-600 stroke-[2.5]' : 'text-slate-500'
                    }`}
                  />
                  {tab.badge && (
                    <span
                      className={`absolute -top-1.5 -right-2.5 text-[8px] font-black px-1.5 py-0.2 rounded-full shadow-xs ${
                        typeof tab.badge === 'number'
                          ? 'bg-rose-500 text-white'
                          : 'bg-gradient-to-r from-blue-600 to-emerald-500 text-white'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] tracking-tight leading-none ${isActive ? 'font-extrabold text-blue-950' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* More Sheet Trigger */}
          <button
            onClick={() => setIsMoreSheetOpen(!isMoreSheetOpen)}
            className={`py-1.5 px-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              isMoreSheetOpen || moreItems.some((m) => m.id === currentView)
                ? 'nm-inset-sm text-teal-800 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span className="text-[10px] font-medium leading-none">More</span>
          </button>
        </div>

        {/* Minimal home indicator */}
        <div className="w-24 h-1 bg-[#cbd5e1] rounded-full mx-auto mt-2"></div>
      </nav>
    </>
  );
};
