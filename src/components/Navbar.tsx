import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { TtoGLogo } from './TtoGLogo';
import {
  TrendingUp,
  Search,
  Bell,
  Store,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  Sparkles,
  ExternalLink,
  PlusCircle,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export const Navbar: React.FC<{ onToggleMobileSidebar: () => void }> = ({ onToggleMobileSidebar }) => {
  const {
    currentRole,
    setCurrentRole,
    businessProfile,
    activeAlerts,
    setIsSearchOpen,
    setIsOnboardingOpen,
    currentView,
    setCurrentView,
    currentUser,
    setSelectedTrendId,
    showToast,
  } = useApp();

  const [isAlertsDropdownOpen, setIsAlertsDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setIsRoleDropdownOpen(false);
    if (role === 'expert') {
      setCurrentView('expert-dashboard');
      showToast('Switched to Expert Portal — Human validation queue active');
    } else if (role === 'admin') {
      setCurrentView('admin');
      showToast('Switched to Admin Console');
    } else {
      if (currentView === 'expert-dashboard' || currentView === 'admin') {
        setCurrentView('dashboard');
      }
      showToast('Switched to Business Owner Portal');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center p-1 rounded-2xl hover:opacity-90 transition cursor-pointer"
            title="Trend to Growth"
          >
            <TtoGLogo size="md" />
          </button>

          {/* Active Business Badge */}
          {businessProfile && businessProfile.name && (
            <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
              <div className="p-1 rounded-md bg-slate-100 text-slate-700">
                <Store className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {businessProfile.name}
                </p>
                <p className="text-[10px] text-slate-500">
                  {businessProfile.city}{businessProfile.state ? `, ${businessProfile.state}` : ''}{businessProfile.category ? ` • ${businessProfile.category}` : ''}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Center: Search trigger bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-50 hover:bg-slate-100/80 text-slate-500 rounded-lg border border-slate-200 text-xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search trends, categories, markets, opportunities...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Role Selector & Notifications */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Landing Page link */}
          <button
            onClick={() => setCurrentView(currentView === 'landing' ? 'dashboard' : 'landing')}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentView === 'landing' ? 'Back to App' : 'Landing'}</span>
          </button>

          {/* Search button mobile */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800"
            >
              {currentRole === 'business_owner' && (
                <>
                  <Store className="w-3.5 h-3.5 text-teal-600" />
                  <span className="font-semibold hidden sm:inline">Owner</span>
                  <span className="text-[10px] text-teal-700 bg-teal-100/60 px-1 rounded sm:hidden">Biz</span>
                </>
              )}
              {currentRole === 'expert' && (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-semibold hidden sm:inline">Expert</span>
                  <span className="text-[10px] text-indigo-700 bg-indigo-100/60 px-1 rounded sm:hidden">Exp</span>
                </>
              )}
              {currentRole === 'admin' && (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-rose-600" />
                  <span className="font-semibold hidden sm:inline">Admin</span>
                  <span className="text-[10px] text-rose-700 bg-rose-100/60 px-1 rounded sm:hidden">Adm</span>
                </>
              )}
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role
                </div>
                <button
                  onClick={() => handleRoleChange('business_owner')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 cursor-pointer ${
                    currentRole === 'business_owner' ? 'bg-teal-50/50 text-teal-900 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <Store className="w-4 h-4 text-teal-600" />
                  <div>
                    <p className="font-medium">Business Owner</p>
                    <p className="text-[10px] text-slate-400">FreshBite Café (Sangamner)</p>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleChange('expert')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 cursor-pointer ${
                    currentRole === 'expert' ? 'bg-indigo-50/50 text-indigo-900 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <div>
                    <p className="font-medium">Human Expert</p>
                    <p className="text-[10px] text-slate-400">Chef Arjun Mehta (Hospitality)</p>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleChange('admin')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-slate-50 cursor-pointer ${
                    currentRole === 'admin' ? 'bg-rose-50/50 text-rose-900 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-rose-600" />
                  <div>
                    <p className="font-medium">Platform Admin</p>
                    <p className="text-[10px] text-slate-400">System oversight & telemetry</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Smart Alerts Bell Notification */}
          <div className="relative">
            <button
              onClick={() => setIsAlertsDropdownOpen(!isAlertsDropdownOpen)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors"
              aria-label="Smart Alerts"
            >
              <Bell className="w-4 h-4" />
              {activeAlerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white"></span>
              )}
            </button>

            {isAlertsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span className="font-bold text-xs text-slate-900">Smart Trend Alerts</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                    {activeAlerts.length} Active Signals
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto my-1">
                  {activeAlerts.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No active alerts right now.
                    </div>
                  ) : (
                    activeAlerts.map((alert) => (
                      <div key={alert.id} className="py-2.5 text-left group">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-teal-700">
                            {alert.headline}
                          </h4>
                          <span className="text-[10px] font-bold text-teal-600 shrink-0">
                            {alert.businessFit}% Fit
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {alert.whyItMatters}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <button
                            onClick={() => {
                              setSelectedTrendId(alert.trendId);
                              setCurrentView('trend-detail');
                              setIsAlertsDropdownOpen(false);
                            }}
                            className="text-[11px] font-medium text-teal-700 hover:text-teal-900 cursor-pointer"
                          >
                            Explore Signal →
                          </button>
                          <span className="text-[10px] text-slate-400">{alert.detectedAt}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setCurrentView('smart-alerts');
                      setIsAlertsDropdownOpen(false);
                    }}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                  >
                    View All Smart Alerts
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Onboarding trigger */}
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
            <span>New Business</span>
          </button>
        </div>
      </div>
    </header>
  );
};
