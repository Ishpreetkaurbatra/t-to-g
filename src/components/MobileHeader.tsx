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
  Film,
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
    <header className="w-full bg-[#eaf0f8] px-3.5 py-2.5 flex items-center justify-between border-b border-[#cfd9e8] select-none shrink-0 relative z-30">
      {/* Brand logo & business name */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentView('process')}
          className="p-1 rounded-2xl nm-btn flex items-center justify-center cursor-pointer transition active:scale-95"
          title="Trend Process"
        >
          <TtoGLogo size="sm" showSubtitle={false} animated={true} />
        </button>

        {businessProfile?.name ? (
          <div className="text-left">
            <span className="text-xs font-bold text-slate-900 tracking-tight leading-none truncate max-w-[125px] block">
              {businessProfile.name}
            </span>
            {businessProfile.city && (
              <p className="text-[10px] text-slate-500 font-medium leading-none mt-1 truncate max-w-[125px]">
                {businessProfile.city}{businessProfile.state ? `, ${businessProfile.state}` : ''}
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Intro Video Graphic Launcher */}
        {onOpenVideoGraphic && (
          <button
            onClick={onOpenVideoGraphic}
            className="h-8 px-2 rounded-xl nm-btn text-[10px] font-bold text-blue-700 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition"
            title="Watch Video Graphic Intro"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Film className="w-3 h-3 text-blue-600" />
            <span className="hidden xs:inline">Intro</span>
          </button>
        )}

        {/* Search */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-8 h-8 rounded-xl nm-btn text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer"
          aria-label="Search"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="h-8 px-2 sm:px-2.5 rounded-xl nm-btn text-[11px] font-semibold text-slate-700 flex items-center gap-1 cursor-pointer"
          >
            {currentRole === 'business_owner' && (
              <>
                <Store className="w-3 h-3 text-emerald-600" />
                <span className="hidden xs:inline">Owner</span>
              </>
            )}
            {currentRole === 'expert' && (
              <>
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span className="hidden xs:inline">Expert</span>
              </>
            )}
            {currentRole === 'admin' && (
              <>
                <UserCheck className="w-3 h-3 text-rose-600" />
                <span className="hidden xs:inline">Admin</span>
              </>
            )}
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#eaf0f8] rounded-2xl nm-raised p-1.5 z-50 text-xs border border-white/60">
              <button
                onClick={() => handleRoleSelect('business_owner')}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left cursor-pointer transition-all ${
                  currentRole === 'business_owner' ? 'nm-inset-sm text-emerald-900 font-bold' : 'text-slate-700 hover:bg-white/40'
                }`}
              >
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                <span>Business Owner</span>
              </button>
              <button
                onClick={() => handleRoleSelect('expert')}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left cursor-pointer transition-all ${
                  currentRole === 'expert' ? 'nm-inset-sm text-blue-900 font-bold' : 'text-slate-700 hover:bg-white/40'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Human Expert</span>
              </button>
              <button
                onClick={() => handleRoleSelect('admin')}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left cursor-pointer transition-all ${
                  currentRole === 'admin' ? 'nm-inset-sm text-rose-900 font-bold' : 'text-slate-700 hover:bg-white/40'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>Platform Admin</span>
              </button>
            </div>
          )}
        </div>

        {/* Viewport Frame Toggle */}
        <button
          onClick={onTogglePhoneFrame}
          className="hidden md:flex w-8 h-8 rounded-xl nm-btn text-slate-600 hover:text-slate-900 items-center justify-center cursor-pointer"
          title={isPhoneFrameMode ? 'Wide View' : 'Phone Simulator'}
        >
          {isPhoneFrameMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5 text-blue-600" />}
        </button>
      </div>
    </header>
  );
};
