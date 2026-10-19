import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { TtoGLogo } from './TtoGLogo';
import {
  Search,
  Store,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  Maximize2,
  Smartphone,
  Play,
  Compass,
  LayoutDashboard,
  Radio,
  FileCheck2,
} from 'lucide-react';

interface MobileHeaderProps {
  isPhoneFrameMode: boolean;
  onTogglePhoneFrame: () => void;
  onOpenVideoGraphic?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  isPhoneFrameMode,
  onTogglePhoneFrame,
  onOpenVideoGraphic,
}) => {
  const {
    currentRole,
    setCurrentRole,
    businessProfile,
    setIsSearchOpen,
    currentView,
    setCurrentView,
    showToast,
  } = useApp();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    setIsRoleMenuOpen(false);
    if (role === 'expert') {
      setCurrentView('expert-dashboard');
      showToast('Switched to Human Expert Mode');
    } else if (role === 'admin') {
      setCurrentView('admin');
      showToast('Switched to Admin Console');
    } else {
      if (currentView === 'expert-dashboard' || currentView === 'admin') {
        setCurrentView('dashboard');
      }
      showToast('Switched to Business Owner Mode');
    }
  };

  return (
    <header className="w-full bg-[#eaf0f8]/95 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between border-b border-[#cfd9e8] select-none shrink-0 relative z-30">
      {/* Zone 1: Brand & Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentView('process')}
          className="flex items-center gap-2.5 cursor-pointer transition active:scale-95 text-left"
          title="Trend to Growth"
        >
          <TtoGLogo size="sm" showSubtitle={false} animated={true} />
          <div className="hidden sm:block">
            <span className="text-sm font-black text-slate-900 tracking-tight block leading-none">
              Trend to Growth
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Market Signals → High Growth
            </span>
          </div>
        </button>

        {businessProfile?.name ? (
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-300">
            <span className="text-xs font-bold text-slate-800 truncate max-w-[140px]">
              {businessProfile.name}
            </span>
            {businessProfile.city && (
              <span className="text-[11px] text-slate-500 font-medium">
                • {businessProfile.city}
              </span>
            )}
          </div>
        ) : null}
      </div>

      {/* Zone 2: Navigation Links for Desktop (Uncluttered) */}
      <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-[#dce5f2]/60 rounded-2xl">
        <button
          onClick={() => setCurrentView('process')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            currentView === 'process'
              ? 'nm-inset-sm text-blue-900 bg-blue-50/60 shadow-inner'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>Trend Process</span>
        </button>

        <button
          onClick={() => setCurrentView('dashboard')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            currentView === 'dashboard'
              ? 'nm-inset-sm text-emerald-900 bg-emerald-50/60 shadow-inner'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-emerald-600" />
          <span>Growth Pulse</span>
        </button>

        <button
          onClick={() => setCurrentView('trend-feed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            currentView === 'trend-feed'
              ? 'nm-inset-sm text-cyan-900 bg-cyan-50/60 shadow-inner'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-cyan-600" />
          <span>Market Signals</span>
        </button>

        <button
          onClick={() => setCurrentView('expert-dashboard')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            currentView === 'expert-dashboard'
              ? 'nm-inset-sm text-indigo-900 bg-indigo-50/60 shadow-inner'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span>Expert Validation</span>
        </button>
      </nav>

      {/* Zone 3: Actions & Controls */}
      <div className="flex items-center gap-2">
        {/* Play Transformation Animation Button */}
        {onOpenVideoGraphic && (
          <button
            onClick={onOpenVideoGraphic}
            className="h-8.5 px-3 rounded-xl nm-btn text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50/40 border border-amber-300/40 flex items-center gap-1.5 cursor-pointer transition active:scale-95 shadow-sm"
            title="Watch the Golden Arrow Growth Transformation Animation"
          >
            <Play className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            <span className="hidden sm:inline">Growth Animation</span>
            <span className="sm:hidden">Animation</span>
          </button>
        )}

        {/* Global Search */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-8.5 h-8.5 rounded-xl nm-btn text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer transition"
          aria-label="Search"
          title="Search Trends & Actions"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="h-8.5 px-2.5 rounded-xl nm-btn text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer transition"
          >
            {currentRole === 'business_owner' && (
              <>
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline">Business Owner</span>
              </>
            )}
            {currentRole === 'expert' && (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden md:inline">Human Expert</span>
              </>
            )}
            {currentRole === 'admin' && (
              <>
                <UserCheck className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden md:inline">Platform Admin</span>
              </>
            )}
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#eaf0f8] rounded-2xl nm-raised p-2 z-50 text-xs border border-white/60 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => handleRoleSelect('business_owner')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left cursor-pointer transition-all ${
                  currentRole === 'business_owner' ? 'nm-inset-sm text-emerald-900 font-bold bg-emerald-50/50' : 'text-slate-700 hover:bg-white/50'
                }`}
              >
                <Store className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="font-bold">Business Owner</div>
                  <div className="text-[10px] text-slate-500">Discover & act on trends</div>
                </div>
              </button>
              <button
                onClick={() => handleRoleSelect('expert')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left cursor-pointer transition-all ${
                  currentRole === 'expert' ? 'nm-inset-sm text-blue-900 font-bold bg-blue-50/50' : 'text-slate-700 hover:bg-white/50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-bold">Human Expert</div>
                  <div className="text-[10px] text-slate-500">Validate AI blueprints</div>
                </div>
              </button>
              <button
                onClick={() => handleRoleSelect('admin')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left cursor-pointer transition-all ${
                  currentRole === 'admin' ? 'nm-inset-sm text-rose-900 font-bold bg-rose-50/50' : 'text-slate-700 hover:bg-white/50'
                }`}
              >
                <UserCheck className="w-4 h-4 text-rose-600" />
                <div>
                  <div className="font-bold">Platform Admin</div>
                  <div className="text-[10px] text-slate-500">Pipeline & audit status</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Viewport Frame Toggle for Desktop */}
        <button
          onClick={onTogglePhoneFrame}
          className="hidden md:flex w-8.5 h-8.5 rounded-xl nm-btn text-slate-600 hover:text-slate-900 items-center justify-center cursor-pointer transition"
          title={isPhoneFrameMode ? 'Switch to Spacious Desktop' : 'Simulate Phone Screen'}
        >
          {isPhoneFrameMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5 text-blue-600" />}
        </button>
      </div>
    </header>
  );
};
