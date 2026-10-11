import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { SmartAlert } from '../types';
import { DemoDataBadge } from '../components/DemoDataBadge';
import {
  BellRing,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  Bookmark,
  X,
  Compass,
  CheckCircle2,
  FileCheck2,
  Zap,
} from 'lucide-react';

export const SmartAlertsView: React.FC = () => {
  const { setSelectedTrendId, setCurrentView, showToast, dismissAlert } = useApp();
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleDismiss = async (id: string) => {
    await dismissAlert(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleExplore = (trendId: string) => {
    setSelectedTrendId(trendId);
    setCurrentView('trend-detail');
  };

  const handleCreatePlan = (trendId: string) => {
    setSelectedTrendId(trendId);
    setCurrentView('action-plans');
  };

  const handleSave = async (trendId: string, alertId: string) => {
    const isSaved = await api.toggleSaveTrend(trendId);
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, saved: isSaved } : a))
    );
    showToast(isSaved ? 'Alert trend saved to watchlist' : 'Alert trend unsaved');
  };

  return (
    <div className="space-y-6 pb-16 text-left">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Smart Trend Alerts</span>
              <BellRing className="w-5 h-5 text-teal-600" />
            </h1>
            <DemoDataBadge compact />
          </div>
          <p className="text-xs text-slate-500">
            Real-time proactive triggers dispatched when regional momentum surges and crosses your 85%+ business fit threshold.
          </p>
        </div>

        <span className="text-xs font-bold bg-teal-50 text-teal-800 px-3 py-1.5 rounded-full border border-teal-200">
          {alerts.length} Active High-Fit Signals
        </span>
      </div>

      {/* Alerts Grid */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Loading smart trend alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-sm font-bold text-slate-700">No active alerts</p>
          <p className="text-xs text-slate-400 mt-1">All current notifications have been addressed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-2xl border-2 border-teal-500/40 p-5 sm:p-6 shadow-xs relative transition-all hover:border-teal-500"
            >
              {/* Dismiss button */}
              <button
                onClick={() => handleDismiss(alert.id)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                title="Dismiss Alert"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="max-w-4xl space-y-3">
                {/* Header tag */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded uppercase tracking-wider">
                    SMART TREND ALERT • EMERGING SIGNAL DETECTED
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    Category: {alert.category} • Detected {alert.detectedAt}
                  </span>
                </div>

                {/* Headline & Why it matters */}
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    “{alert.headline}”
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    <strong>Why it matters:</strong> {alert.whyItMatters}
                  </p>
                </div>

                {/* Recommended next step box */}
                <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl text-xs text-teal-950 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[11px] uppercase tracking-wider text-teal-800">
                      Recommended Next Step
                    </span>
                    <p className="font-medium mt-0.5">{alert.recommendedNextStep}</p>
                  </div>
                </div>

                {/* Score indicators */}
                <div className="grid grid-cols-3 gap-2 py-1 max-w-sm text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Relevance</span>
                    <span className="font-bold text-slate-800">{alert.urgency}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Business Fit</span>
                    <span className="font-black text-teal-700">{alert.businessFit}%</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Potential</span>
                    <span className="font-bold text-emerald-700">{alert.potential}</span>
                  </div>
                </div>

                {/* Action buttons (Section 13) */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={() => handleExplore(alert.trendId)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Explore Insight
                  </button>
                  <button
                    onClick={() => handleCreatePlan(alert.trendId)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Create Action Plan
                  </button>
                  <button
                    onClick={() => handleSave(alert.trendId, alert.id)}
                    className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1"
                  >
                    {alert.saved ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" /> : <Bookmark className="w-3.5 h-3.5" />}
                    <span>{alert.saved ? 'Saved' : 'Save'}</span>
                  </button>
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-medium cursor-pointer ml-auto"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
