import React, { useState } from 'react';
import { useApp, JUDGE_STEPS } from '../context/AppContext';
import { ChevronRight, ChevronLeft, RotateCcw, Sparkles, X } from 'lucide-react';

export const JudgeDemoBanner: React.FC = () => {
  const {
    isJudgeModeActive,
    setIsJudgeModeActive,
    currentJudgeStepIndex,
    advanceJudgeStep,
    prevJudgeStep,
    resetJudgeDemo,
  } = useApp();

  const [isMinimized, setIsMinimized] = useState(false);

  if (!isJudgeModeActive) {
    return (
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setIsJudgeModeActive(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 nm-btn-primary rounded-full text-[11px] font-extrabold shadow-md cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Judge Walkthrough</span>
        </button>
      </div>
    );
  }

  const currentStep = JUDGE_STEPS[currentJudgeStepIndex];
  const progressPercent = Math.round(((currentJudgeStepIndex + 1) / JUDGE_STEPS.length) * 100);

  if (isMinimized) {
    return (
      <div className="fixed bottom-20 right-4 z-40">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#eaf0f8] nm-raised text-slate-800 rounded-full text-[11px] shadow-md">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
          <span className="font-bold text-slate-900">Step {currentStep.step}/{JUDGE_STEPS.length}</span>
          <button
            onClick={() => setIsMinimized(false)}
            className="px-2 py-0.5 nm-btn text-teal-800 font-bold rounded-md cursor-pointer"
          >
            Open
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#eaf0f8] border-b border-[#cfd9e8] px-3 py-2 text-slate-800 shrink-0 z-30 select-none">
      <div className="flex items-center justify-between gap-2">
        {/* Step indicator */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="px-2 py-0.5 rounded-full nm-inset-sm text-[10px] font-extrabold text-blue-900 bg-blue-50/50 border border-blue-200/40 shrink-0">
            {currentStep.step}/{JUDGE_STEPS.length}
          </span>
          <span className="text-[11px] font-bold text-slate-900 truncate">
            {currentStep.title}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={prevJudgeStep}
            disabled={currentJudgeStepIndex === 0}
            className="w-6 h-6 rounded-md nm-btn flex items-center justify-center text-slate-600 disabled:opacity-40 cursor-pointer"
            title="Prev"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={advanceJudgeStep}
            className="h-6 px-2.5 rounded-xl nm-btn-primary text-white flex items-center gap-1 text-[10px] font-bold cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          <button
            onClick={resetJudgeDemo}
            className="w-6 h-6 rounded-md nm-btn flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            className="w-6 h-6 rounded-md nm-btn flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
            title="Minimize"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Clean progress line with Blue to Emerald gradient */}
      <div className="w-full nm-inset-sm h-1 mt-1.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
};
