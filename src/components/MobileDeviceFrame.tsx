import React, { ReactNode } from 'react';
import { Smartphone, Maximize2 } from 'lucide-react';

interface MobileDeviceFrameProps {
  children: ReactNode;
  isPhoneFrameMode: boolean;
  onTogglePhoneFrame: () => void;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  children,
  isPhoneFrameMode,
  onTogglePhoneFrame,
}) => {
  if (!isPhoneFrameMode) {
    // Edge-to-edge clean layout
    return (
      <div className="w-full min-h-screen bg-[#eaf0f8] flex flex-col items-center">
        <div className="w-full max-w-xl min-h-screen flex flex-col bg-[#eaf0f8] border-x border-[#dce4f0]">
          {children}
        </div>
      </div>
    );
  }

  // Centered Phone Chassis on clean soft neumorphic studio background
  return (
    <div className="min-h-screen bg-[#e2eaf4] py-4 sm:py-6 px-2 flex flex-col items-center justify-center relative select-none">
      {/* Top minimal toggle */}
      <div className="hidden md:flex items-center gap-2 mb-3 px-3.5 py-1.5 nm-raised-sm rounded-full text-xs text-slate-700">
        <Smartphone className="w-3.5 h-3.5 text-teal-600" />
        <span className="font-bold text-slate-800">T→G Mobile App</span>
        <span className="text-slate-300">•</span>
        <button
          onClick={onTogglePhoneFrame}
          className="flex items-center gap-1 text-slate-600 hover:text-teal-700 font-semibold transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Full Width</span>
        </button>
      </div>

      {/* Sleek Neumorphic Phone Chassis */}
      <div className="relative w-full max-w-[420px] h-[870px] max-h-[94vh] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/60 flex flex-col shrink-0">
        {/* Dynamic Island / Earpiece pill */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2 border border-slate-800"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-teal-500/70"></div>
        </div>

        {/* Screen container */}
        <div className="w-full h-full bg-[#eaf0f8] rounded-[38px] overflow-hidden flex flex-col relative pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};
