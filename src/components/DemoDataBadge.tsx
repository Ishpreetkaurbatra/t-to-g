import React from 'react';
import { Database } from 'lucide-react';

export const DemoDataBadge: React.FC<{ compact?: boolean }> = ({ compact }) => {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold nm-inset-sm text-amber-900">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        DEMO SIGNALS
      </span>
    );
  }

  return (
    <div className="bg-[#eaf0f8] border-b border-[#d8e2ee] px-3.5 py-1 text-xs text-amber-900 flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-2 mx-auto w-full max-w-md">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-black nm-raised-xs text-amber-900 text-[10px] shrink-0">
          <Database className="w-3 h-3 text-amber-600" />
          DEMO SIGNALS
        </span>
        <span className="text-slate-600 text-[10px] font-medium leading-tight truncate">
          Simulated market signals. Data pipelines calibrated for live APIs.
        </span>
      </div>
    </div>
  );
};
