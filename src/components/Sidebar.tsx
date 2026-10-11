import React from 'react';
import { useApp, AppView } from '../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  BellRing,
  Flame,
  FileCheck2,
  BookmarkCheck,
  FlaskConical,
  BarChart3,
  Store,
  ShieldCheck,
  Settings,
  Radio,
  UserCheck,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { currentView, setCurrentView, currentRole, activeAlerts } = useApp();

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    onCloseMobile();
  };

  const navItems: { id: AppView; label: string; icon: any; badge?: string | number; roleOnly?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'trend-feed', label: 'Trend Feed', icon: Compass, badge: '22 Signals' },
    { id: 'smart-alerts', label: 'Smart Alerts', icon: BellRing, badge: activeAlerts.length > 0 ? activeAlerts.length : undefined },
    { id: 'opportunities', label: 'Opportunities', icon: Flame },
    { id: 'action-plans', label: 'Action Plans', icon: FileCheck2 },
    { id: 'experiments', label: 'Experiments', icon: FlaskConical },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'business-profile', label: 'Business Profile', icon: Store },
    { id: 'expert-dashboard', label: 'Expert Reviews', icon: ShieldCheck, badge: 'Human Validated' },
    { id: 'trend-sources', label: 'Trend Sources', icon: Radio },
    { id: 'admin', label: 'Admin Panel', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-40 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="p-4 overflow-y-auto space-y-1">
          <div className="pb-2 px-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Trend To Action Loop
          </div>

          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-teal-400' : 'text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-teal-500/30 text-teal-300'
                        : typeof item.badge === 'number'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom card: Philosophy reminder */}
        <div className="p-4 border-t border-slate-200 space-y-3">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-left">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>The T→G Principle</span>
            </div>
            <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
              AI assists signal reasoning, but every high-impact plan requires <span className="font-semibold text-slate-900">Human Expert Validation</span> before execution.
            </p>
          </div>

          <div className="text-[10px] text-slate-600 flex items-center justify-between px-1">
            <span>T→G Platform v2.4</span>
            <span className="font-mono text-teal-700 font-semibold">Gemini Flash</span>
          </div>
        </div>
      </aside>
    </>
  );
};
