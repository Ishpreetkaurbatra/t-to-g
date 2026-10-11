import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { ActionPlan } from '../types';
import {
  FileCheck2,
  ShieldCheck,
  Clock,
  AlertCircle,
  FlaskConical,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const ActionPlansView: React.FC = () => {
  const { setCurrentView, showToast, setCurrentRole } = useApp();
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>('plan-01');

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const data = await api.getActionPlans(filterStatus === 'All' ? undefined : filterStatus);
        setPlans(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, [filterStatus]);

  const handleLaunchExperiment = (plan: ActionPlan) => {
    setCurrentView('experiments');
    showToast(`Converted "${plan.trendName}" plan into an active experiment.`);
  };

  const handleSwitchToExpert = () => {
    setCurrentRole('expert');
    setCurrentView('expert-dashboard');
    showToast('Switched to Human Expert Mode.');
  };

  return (
    <div className="space-y-4 pb-8 text-left select-none">
      {/* Header card */}
      <div className="nm-flat rounded-3xl p-4.5 space-y-2">
        <h1 className="text-lg font-black text-slate-900 tracking-tight">
          Action Plans & Validation
        </h1>
        <p className="text-[11px] text-slate-600">
          AI generated proposals require verified human sign-off before becoming final recommendations.
        </p>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs pt-1">
          {['All', 'APPROVED', 'PENDING EXPERT REVIEW', 'NEEDS REVISION'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === status
                  ? 'nm-inset-sm text-teal-900 font-extrabold border border-teal-400/40'
                  : 'nm-btn text-slate-600'
              }`}
            >
              {status === 'APPROVED' ? '✓ Validated' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Plans list */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full nm-btn-primary flex items-center justify-center mx-auto mb-2 nm-radar-pulse"></div>
          <p className="text-xs text-slate-500 font-medium">Loading plans...</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="nm-flat rounded-3xl p-8 text-center text-xs text-slate-500">
          No action plans matching filter.
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((plan) => {
            const isExpanded = expandedPlanId === plan.id;
            const isApproved = plan.validationStatus === 'APPROVED';
            const isPending = plan.validationStatus === 'PENDING EXPERT REVIEW';
            const isNeedsRevision = plan.validationStatus === 'NEEDS REVISION';

            return (
              <div
                key={plan.id}
                className={`nm-flat rounded-3xl p-4.5 transition-all ${
                  isApproved ? 'border-l-4 border-l-emerald-600' : isPending ? 'border-l-4 border-l-amber-500' : ''
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                  className="cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full nm-inset-sm text-[10px] font-bold text-slate-700">
                      {plan.category}
                    </span>

                    {isApproved && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 px-2.5 py-0.5 rounded-full nm-raised-xs">
                        <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                        HUMAN VALIDATED
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 px-2.5 py-0.5 rounded-full nm-raised-xs">
                        <Clock className="w-3 h-3 text-amber-600" />
                        PENDING REVIEW
                      </span>
                    )}
                    {isNeedsRevision && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-800 px-2.5 py-0.5 rounded-full nm-raised-xs">
                        <AlertCircle className="w-3 h-3 text-indigo-600" />
                        NEEDS REVISION
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-black text-slate-900 leading-snug">
                    {plan.recommendedAction}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate font-medium">Trend: <strong className="text-slate-800 font-bold">{plan.trendName}</strong></span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-3 mt-3 border-t border-slate-100 space-y-3 text-xs">
                    {/* Expert review note */}
                    {plan.expertReview && (
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1">
                        <div className="flex items-center justify-between font-bold text-[11px]">
                          <span>Verified by {plan.expertReview.expertName}</span>
                          <span className="text-emerald-700">{plan.expertReview.confidence}% Conf.</span>
                        </div>
                        <p className="text-[11px] text-slate-700">
                          “{plan.expertReview.comment}”
                        </p>
                        {plan.expertReview.suggestedModification && (
                          <p className="text-[11px] text-slate-800 font-medium">
                            <strong>Note:</strong> {plan.expertReview.suggestedModification}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="font-bold text-slate-700 block text-[11px]">Objective:</span>
                      <p className="text-slate-600">{plan.objective}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="font-bold text-slate-700 block text-[11px]">14-Day Pilot:</span>
                      <p className="text-slate-600">{plan.pilot}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {isApproved && (
                        <button
                          onClick={() => handleLaunchExperiment(plan)}
                          className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <FlaskConical className="w-3.5 h-3.5" />
                          <span>Launch Pilot as Live Experiment</span>
                        </button>
                      )}

                      {isPending && (
                        <button
                          onClick={handleSwitchToExpert}
                          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                          <span>Switch to Expert Review Mode</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
