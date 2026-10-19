import React, { ReactNode } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

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
    // Spacious, modern, uncluttered SaaS layout
    return (
      <div className="w-full min-h-screen bg-[#eaf0f8] flex flex-col items-center">
        <div className="w-full max-w-5xl min-h-screen flex flex-col bg-[#eaf0f8] shadow-sm">
          {children}
        </div>
      </div>
    );
  }

  // Simulated Phone Chassis (optional preview mode for users testing mobile viewport)
  return (
    <div className="min-h-screen bg-[#e2eaf4] py-4 sm:py-6 px-2 flex flex-col items-center justify-center relative select-none">
      {/* Top minimal frame indicator */}
      <div className="hidden md:flex items-center gap-2 mb-3 px-3.5 py-1.5 nm-raised-sm rounded-full text-xs text-slate-700">
        <Smartphone className="w-3.5 h-3.5 text-blue-600" />
        <span className="font-bold text-slate-800">Phone Simulator Mode</span>
        <span className="text-slate-300">•</span>
        <button
          onClick={onTogglePhoneFrame}
          className="flex items-center gap-1 text-slate-600 hover:text-blue-700 font-semibold transition-colors cursor-pointer"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Switch to Spacious Desktop</span>
        </button>
      </div>

      {/* Phone Chassis */}
      <div className="relative w-full max-w-[420px] h-[870px] max-h-[94vh] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/60 flex flex-col shrink-0">
        {/* Screen container */}
        <div className="w-full h-full bg-[#eaf0f8] rounded-[38px] overflow-hidden flex flex-col relative pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};
