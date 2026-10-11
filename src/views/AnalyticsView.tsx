import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { DemoDataBadge } from '../components/DemoDataBadge';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  ShieldCheck,
  FlaskConical,
  Compass,
  FileCheck2,
  Bookmark,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { businessProfile } = useApp();
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await api.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading || !analytics) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-400">Loading business analytics data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 text-left">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Business Growth & Validation Analytics</span>
              <BarChart3 className="w-5 h-5 text-teal-600" />
            </h1>
            <DemoDataBadge compact />
          </div>
          <p className="text-xs text-slate-500">
            Performance metrics for {businessProfile?.name || 'FreshBite Café'} across signal discovery, human validation, and pilot execution.
          </p>
        </div>

        <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200">
          Validation Success Rate: {analytics.validationRate}%
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Trends Scanned
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{analytics.trendsAnalyzed}</p>
          <p className="text-[10px] text-teal-600 font-semibold mt-0.5">22 Regional demo signals</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Saved Watchlist
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{analytics.savedTrendsCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Flagged for strategic review</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Action Plans Created
          </span>
          <p className="text-2xl font-black text-teal-600 mt-1">{analytics.totalActionPlans}</p>
          <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            {analytics.approvedPlans} Expert Validated
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Live Experiments
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{analytics.activeExperiments}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {analytics.completedExperiments} Completed pilots
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Most Relevant Signal Categories
            </h3>
            <span className="text-xs text-slate-400">Share of local signals</span>
          </div>

          <div className="space-y-3 pt-2">
            {analytics.categoryDistribution.map((item: any) => (
              <div key={item.category}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">{item.category}</span>
                  <span className="text-slate-900 font-bold">{item.percentage}% ({item.count} trends)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-2.5 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel: Signal → AI Plan → Expert Review → Live Pilot */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              Trend-to-Growth Conversion Funnel
            </h3>
            <span className="text-xs text-slate-400">Execution velocity</span>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-700">1. Regional Trend Signals Detected</span>
              <span className="font-black text-slate-900">22 Signals (100%)</span>
            </div>

            <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center justify-between">
              <span className="font-semibold text-teal-900">2. High Relevance Business Matches (&gt;80%)</span>
              <span className="font-black text-teal-800">11 Signals (50%)</span>
            </div>

            <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex items-center justify-between">
              <span className="font-semibold text-sky-900">3. Action Plans Synthesized</span>
              <span className="font-black text-sky-800">{analytics.totalActionPlans} Plans (14%)</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                4. Human Expert Validated
              </span>
              <span className="font-black text-emerald-800">{analytics.approvedPlans} Validated ({analytics.validationRate}%)</span>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between">
              <span className="font-semibold text-purple-950">5. Active / Completed Experiments</span>
              <span className="font-black text-purple-800">{analytics.activeExperiments + analytics.completedExperiments} Pilots Launched</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
