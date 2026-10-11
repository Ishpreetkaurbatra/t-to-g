import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { OpportunityItem, TrendItem } from '../types';
import { DemoDataBadge } from '../components/DemoDataBadge';
import {
  Flame,
  Calculator,
  Compass,
  ArrowRight,
  TrendingUp,
  Target,
  Clock,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const OpportunitiesView: React.FC = () => {
  const { setSelectedTrendId, setCurrentView, businessProfile } = useApp();
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOpps = async () => {
      setIsLoading(true);
      try {
        const data = await api.getOpportunities();
        setOpportunities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOpps();
  }, []);

  const getTier = (score: number) => {
    if (score >= 81) return { label: 'Very High', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 61) return { label: 'High', color: 'text-teal-700 bg-teal-50 border-teal-200' };
    if (score >= 31) return { label: 'Moderate', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Low', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  return (
    <div className="space-y-6 pb-16 text-left">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>T→G Opportunity Engine</span>
              <Flame className="w-5 h-5 text-amber-500" />
            </h1>
            <DemoDataBadge compact />
          </div>
          <p className="text-xs text-slate-500">
            Algorithmic ranking scoring trends by business fit, customer overlap, velocity, and downside friction.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">Normalized Scale:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">81-100 Very High</span>
          <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">61-80 High</span>
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">31-60 Moderate</span>
        </div>
      </div>

      {/* Scoring Formula Explainer Card (Section 14) */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-teal-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Modular Opportunity Formula (0–100 Scale)
          </h3>
        </div>

        <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 font-mono text-xs text-teal-300 flex items-center justify-between overflow-x-auto">
          <code>
            Opportunity Score = (Trend Momentum × 0.25) + (Business Relevance × 0.35) + (Customer Overlap × 0.25) + (Market Timing × 0.15) - Risk Penalty
          </code>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="font-bold text-white block">Trend Momentum</span>
            <span className="text-[11px] text-slate-400">Search query velocity & social mentions</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="font-bold text-white block">Business Relevance</span>
            <span className="text-[11px] text-slate-400">Category match with {businessProfile?.name}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="font-bold text-white block">Customer Match</span>
            <span className="text-[11px] text-slate-400">Demographic alignment (18–32 students)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="font-bold text-white block">Risk Penalty</span>
            <span className="text-[11px] text-slate-400">Execution, supply, and price sensitivity</span>
          </div>
        </div>
      </div>

      {/* Opportunity Cards List */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900">
          Current Ranked Business Opportunities
        </h2>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-400">Calculating opportunity models...</p>
          </div>
        ) : (
          opportunities.map((opp, idx) => {
            const tier = getTier(opp.opportunityScore);

            return (
              <div
                key={opp.trendId}
                onClick={() => {
                  setSelectedTrendId(opp.trendId);
                  setCurrentView('trend-detail');
                }}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {opp.category}
                    </span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {opp.momentum} Momentum
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${tier.color}`}>
                      Tier: {tier.label}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {opp.trendName}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {opp.whyItMatters}
                  </p>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs inline-block">
                    <strong className="text-slate-800">Potential Action:</strong>{' '}
                    <span className="text-slate-600">{opp.potentialAction}</span>
                  </div>
                </div>

                {/* Score badge & button */}
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Opportunity Score
                    </span>
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {opp.opportunityScore}
                      <span className="text-sm font-semibold text-slate-400">/100</span>
                    </span>
                    <span className="text-[11px] font-bold text-teal-700 block mt-0.5">
                      {opp.businessRelevance}% Business Fit
                    </span>
                  </div>

                  <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5">
                    <span>Inspect Plan</span>
                    <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
