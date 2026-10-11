import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { TrendItem, TrendAnalysis, ActionPlan } from '../types';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export const TrendDetailView: React.FC = () => {
  const {
    selectedTrendId,
    setCurrentView,
    businessProfile,
    showToast,
  } = useApp();

  const [trend, setTrend] = useState<TrendItem | null>(null);
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);

  useEffect(() => {
    const loadTrend = async () => {
      if (!selectedTrendId) return;
      setIsLoading(true);
      try {
        const trendData = await api.getTrend(selectedTrendId);
        setTrend(trendData);

        setIsAnalyzing(true);
        const result = await api.analyzeTrend(selectedTrendId);
        setAnalysis(result.analysis);
      } catch (err) {
        console.error('Error fetching trend detail:', err);
      } finally {
        setIsLoading(false);
        setIsAnalyzing(false);
      }
    };

    loadTrend();
  }, [selectedTrendId]);

  const handleRunCustomAnalysis = async () => {
    if (!selectedTrendId) return;
    setIsAnalyzing(true);
    try {
      const result = await api.analyzeTrend(selectedTrendId);
      setAnalysis(result.analysis);
      showToast('Gemini reasoning refreshed with latest profile!');
    } catch (err: any) {
      showToast(err.message || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitForExpertReview = async () => {
    if (!trend || !analysis) return;
    setIsSubmittingPlan(true);
    try {
      const planPayload: Partial<ActionPlan> = {
        trendId: trend.id,
        trendName: trend.name,
        category: trend.category,
        objective: analysis.innovative_plan.objective,
        whyThisTrend: analysis.innovative_plan.why_this_trend,
        recommendedAction: analysis.innovative_plan.recommended_action,
        targetCustomer: analysis.innovative_plan.target_customer,
        productServiceIdea: analysis.innovative_plan.product_service_idea,
        marketingApproach: analysis.innovative_plan.marketing_approach,
        channel: analysis.innovative_plan.channel,
        pilot: analysis.innovative_plan.pilot,
        timeline: analysis.innovative_plan.timeline,
        estimatedEffort: analysis.innovative_plan.estimated_effort,
        expectedOpportunity: analysis.innovative_plan.expected_opportunity,
        risks: analysis.innovative_plan.risks,
        successMetrics: analysis.innovative_plan.success_metrics,
        testMeasureLearn: analysis.innovative_plan.test_measure_learn,
        validationStatus: 'PENDING EXPERT REVIEW',
      };

      await api.createActionPlan(planPayload);
      showToast('Action Plan dispatched to Human Expert Review queue!');
      setCurrentView('action-plans');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit plan');
    } finally {
      setIsSubmittingPlan(false);
    }
  };

  if (isLoading || !trend) {
    return (
      <div className="py-20 text-center">
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs text-slate-400">Loading analysis data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8 text-left select-none">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('trend-feed')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl nm-btn text-xs font-bold text-slate-700 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Signals Feed</span>
        </button>

        <button
          onClick={handleRunCustomAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-1 px-3 py-1.5 rounded-2xl nm-btn text-[11px] font-bold text-teal-800 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3 h-3 text-teal-600" />
          <span>{isAnalyzing ? 'Analyzing...' : 'Re-run Gemini'}</span>
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="nm-flat rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full nm-inset-sm text-[10px] font-bold text-teal-800">
            {trend.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full nm-raised-xs text-[10px] font-black text-slate-700">
            {trend.momentum}
          </span>
        </div>

        <h1 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
          {trend.name}
        </h1>

        <p className="text-xs text-slate-600 leading-relaxed">
          {trend.description}
        </p>

        {/* Quick metrics */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-[#d8e2ee]/60 text-center text-xs">
          <div className="p-2.5 rounded-2xl nm-inset-sm">
            <span className="text-[9px] text-slate-500 uppercase font-bold block">Fit</span>
            <span className="font-black text-teal-800 text-sm">{trend.business_relevance}%</span>
          </div>
          <div className="p-2.5 rounded-2xl nm-inset-sm">
            <span className="text-[9px] text-slate-500 uppercase font-bold block">Opp Score</span>
            <span className="font-black text-slate-900 text-sm">{trend.opportunity_score}</span>
          </div>
          <div className="p-2.5 rounded-2xl nm-inset-sm">
            <span className="text-[9px] text-slate-500 uppercase font-bold block">Confidence</span>
            <span className="font-black text-slate-800 text-sm">{trend.confidence}%</span>
          </div>
        </div>
      </div>

      {/* 10-POINT ANALYZER */}
      <div className="nm-flat rounded-3xl p-5 space-y-3.5">
        <div className="flex items-center gap-2 pb-2 border-b border-[#d8e2ee]/60">
          <Compass className="w-4 h-4 text-teal-700" />
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            10-Point Trend Analyzer
          </h2>
        </div>

        <div className="space-y-2.5 text-xs">
          {/* 1. What is Happening */}
          <div className="p-3 rounded-2xl nm-inset-sm">
            <span className="text-[10px] font-extrabold text-teal-800 uppercase block mb-0.5">
              01 • WHAT IS HAPPENING?
            </span>
            <p className="text-slate-700 leading-relaxed font-medium">
              {analysis?.trend_summary || trend.description}
            </p>
          </div>

          {/* 2. Drivers */}
          <div className="p-3 rounded-2xl nm-inset-sm">
            <span className="text-[10px] font-extrabold text-teal-800 uppercase block mb-1">
              02 • KEY DRIVERS
            </span>
            <ul className="space-y-1 text-slate-700 font-medium">
              {(analysis?.drivers || trend.drivers).map((d, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-teal-700 font-black">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Audience & Geography */}
          <div className="p-3 rounded-2xl nm-inset-sm grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-extrabold text-teal-800 uppercase block mb-0.5">
                03 • AUDIENCE
              </span>
              <p className="text-slate-700 font-semibold">{trend.audience}</p>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-teal-800 uppercase block mb-0.5">
                04 • LOCATION
              </span>
              <p className="text-slate-700 font-semibold">{trend.location}</p>
            </div>
          </div>

          {/* 4. Risk Analysis */}
          <div className="p-3 rounded-2xl nm-inset-sm">
            <span className="text-[10px] font-extrabold text-rose-800 uppercase block mb-1">
              08 • 4-DIMENSIONAL RISK ANALYSIS
            </span>
            <div className="space-y-1 text-[11px] text-slate-600 font-medium">
              <p>• <strong>Market:</strong> {analysis?.market_risk || 'Novelty risk'}</p>
              <p>• <strong>Competition:</strong> {analysis?.competition_risk || 'Local copies'}</p>
              <p>• <strong>Execution:</strong> {analysis?.execution_risk || 'Batch freshness'}</p>
            </div>
          </div>

          {/* 5. Business Opportunity */}
          <div className="p-3 rounded-2xl nm-inset-sm border border-teal-400/30">
            <span className="text-[10px] font-extrabold text-teal-900 uppercase block mb-0.5">
              09 • SPECIFIC OPPORTUNITY FOR {businessProfile?.name?.toUpperCase()}
            </span>
            <p className="text-slate-800 font-medium leading-relaxed">
              {analysis?.business_opportunity || `Differentiates ${businessProfile?.name} with high-margin items.`}
            </p>
          </div>
        </div>
      </div>

      {/* INNOVATIVE ACTIONABLE PLAN CARD */}
      {analysis && (
        <div className="nm-flat rounded-3xl p-5 space-y-3.5 border-l-4 border-l-teal-600">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full nm-inset-sm text-[9px] font-extrabold text-teal-900 uppercase">
              INNOVATIVE ACTION PLAN
            </span>
            <span className="text-[10px] font-bold text-amber-800 nm-raised-xs px-2 py-0.5 rounded-md">
              Awaiting Expert Review
            </span>
          </div>

          <h3 className="text-sm font-black text-slate-900 leading-snug">
            {analysis.innovative_plan.recommended_action}
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-2xl nm-inset-sm">
              <span className="font-extrabold text-slate-700 block">Objective:</span>
              <p className="text-slate-600 mt-0.5">{analysis.innovative_plan.objective}</p>
            </div>
            <div className="p-2.5 rounded-2xl nm-inset-sm">
              <span className="font-extrabold text-slate-700 block">Product Offering:</span>
              <p className="text-slate-600 mt-0.5">{analysis.innovative_plan.product_service_idea}</p>
            </div>
            <div className="p-2.5 rounded-2xl nm-inset-sm">
              <span className="font-extrabold text-slate-700 block">14-Day Pilot:</span>
              <p className="text-slate-600 mt-0.5">{analysis.innovative_plan.pilot}</p>
            </div>
          </div>

          {/* Test Measure Learn Adapt Loop */}
          <div className="p-3 rounded-2xl nm-inset-sm space-y-1.5 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">
              EXECUTION LOOP (TEST → MEASURE → LEARN → ADAPT)
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl nm-raised-xs">
                <strong className="block text-slate-900">TEST:</strong>
                <span className="text-slate-600">{analysis.innovative_plan.test_measure_learn.test}</span>
              </div>
              <div className="p-2 rounded-xl nm-raised-xs">
                <strong className="block text-slate-900">MEASURE:</strong>
                <span className="text-slate-600">{analysis.innovative_plan.test_measure_learn.measure}</span>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmitForExpertReview}
            disabled={isSubmittingPlan}
            className="w-full py-3 rounded-2xl nm-btn-primary text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmittingPlan ? 'Dispatching...' : 'Submit for Human Expert Review'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
