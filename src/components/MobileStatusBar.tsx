import React, { useState, useEffect } from 'react';
import { Wifi, Signal } from 'lucide-react';

export const MobileStatusBar: React.FC = () => {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full pt-2.5 pb-2 px-6 flex items-center justify-between text-slate-800 bg-[#eaf0f8] border-b border-[#d8e2ee] select-none shrink-0 z-30">
      {/* Time */}
      <div className="text-[12px] font-bold font-mono tracking-tight text-slate-900">
        {time}
      </div>

      {/* Subtle Speaker / Island */}
      <div className="w-20 h-3.5 bg-slate-900/90 rounded-full flex items-center justify-end px-1.5 shadow-inner">
        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse mr-1"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
      </div>

      {/* Cellular, Wi-Fi, Battery */}
      <div className="flex items-center gap-1.5 text-slate-700">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-bold font-mono">100%</span>
          <div className="w-4.5 h-2.5 rounded-xs border border-slate-700 p-0.5 flex items-center">
            <div className="w-full h-full bg-slate-800 rounded-2xs"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
