import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { TrendItem, OpportunityItem, SmartAlert, ActionPlan } from '../types';
import {
  Activity,
  Flame,
  ShieldCheck,
  Compass,
  BookmarkCheck,
  Zap,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    businessProfile,
    setSelectedTrendId,
    setCurrentView,
    activeAlerts,
    showToast,
  } = useApp();

  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const [trendsData, oppsData, plansData] = await Promise.all([
          api.getTrends(),
          api.getOpportunities(),
          api.getActionPlans(),
        ]);
        setTrends(trendsData);
        setOpportunities(oppsData);
        setActionPlans(plansData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const approvedPlans = actionPlans.filter((p) => p.validationStatus === 'APPROVED');
  const risingTrends = trends.filter((t) => t.momentum === 'Rising');
  const stableTrends = trends.filter((t) => t.momentum === 'Stable');

  const handleSelectTrend = (trendId: string) => {
    setSelectedTrendId(trendId);
    setCurrentView('trend-detail');
  };

  const handleSaveTrend = async (trendId: string) => {
    const isSaved = await api.toggleSaveTrend(trendId);
    setTrends((prev) =>
      prev.map((t) => (t.id === trendId ? { ...t, is_saved: isSaved } : t))
    );
    showToast(isSaved ? 'Trend saved to watchlist' : 'Trend removed from watchlist');
  };

  return (
    <div className="space-y-4 pb-8 text-left select-none">
      {/* Top Mobile Business Hero Card - Clean Neumorphic Surface */}
      <div className="nm-flat rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full nm-inset-sm text-[10px] font-extrabold text-teal-800 uppercase tracking-wide">
            {businessProfile?.category ? `${businessProfile.category} Intelligence` : 'Trend Intelligence'}
          </span>
          {approvedPlans.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 px-2.5 py-0.5 rounded-full nm-raised-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {approvedPlans.length} Validated
            </span>
          )}
        </div>

        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            {businessProfile?.name || 'Your Business'}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {businessProfile?.city
              ? `${businessProfile.city}${businessProfile.state ? `, ${businessProfile.state}` : ''}${
                  businessProfile.targetCustomers ? ` • ${businessProfile.targetCustomers}` : ''
                }`
              : 'Add your business profile details in the Trend Journey to calibrate trends.'}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setCurrentView('process')}
            className="flex-1 py-2.5 px-3 rounded-2xl nm-btn-primary text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Compass className="w-3.5 h-3.5 text-white" />
            <span>Launch Trend Process</span>
          </button>
          <button
            onClick={() => setCurrentView('smart-alerts')}
            className="py-2.5 px-3 rounded-2xl nm-btn text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <span>Alerts</span>
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* SECTION A: MARKET PULSE */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-teal-700" />
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Market Pulse Signals
            </h2>
          </div>
          <span className="text-[10px] font-bold text-teal-800 nm-inset-sm px-2 py-0.2 rounded-full">Live Velocity</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {/* Card 1 */}
          <div className="nm-flat rounded-2xl p-3 min-w-[125px] shrink-0">
            <span className="text-[9px] font-bold text-slate-500 uppercase block">Emerging</span>
            <p className="text-xl font-black text-slate-900 mt-0.5">{risingTrends.length}</p>
            <span className="text-[10px] font-bold text-teal-700">↑ +42% MoM</span>
          </div>

          {/* Card 2 */}
          <div className="nm-flat rounded-2xl p-3 min-w-[140px] shrink-0">
            <span className="text-[9px] font-bold text-slate-500 uppercase block">Rising Demand</span>
            <p className="text-xs font-black text-slate-900 mt-1 truncate">Plant-Protein</p>
            <span className="text-[10px] font-bold text-teal-700">+46% Queries</span>
          </div>

          {/* Card 3 */}
          <div className="nm-flat rounded-2xl p-3 min-w-[140px] shrink-0">
            <span className="text-[9px] font-bold text-slate-500 uppercase block">Local Signal</span>
            <p className="text-xs font-black text-slate-900 mt-1 truncate">Late Study Bites</p>
            <span className="text-[10px] font-bold text-slate-600">Exam season</span>
          </div>

          {/* Card 4 */}
          <div className="nm-flat rounded-2xl p-3 min-w-[140px] shrink-0">
            <span className="text-[9px] font-bold text-slate-500 uppercase block">Seasonal</span>
            <p className="text-xs font-black text-slate-900 mt-1 truncate">Millet Breakfast</p>
            <span className="text-[10px] font-bold text-emerald-700">Prime timing</span>
          </div>
        </div>
      </div>

      {/* SECTION B: SMART TREND ALERTS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Smart Trend Alert
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('smart-alerts')}
            className="text-[10px] font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
          >
            View All ({activeAlerts.length}) →
          </button>
        </div>

        {activeAlerts.slice(0, 1).map((alert) => (
          <div
            key={alert.id}
            className="nm-flat rounded-3xl p-5 space-y-3 relative border-l-4 border-l-teal-600"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full nm-inset-sm text-[9px] font-extrabold text-teal-900 uppercase">
                EMERGING SIGNAL
              </span>
              <span className="text-[10px] font-black text-teal-800 nm-raised-xs px-2 py-0.5 rounded-full">
                {alert.businessFit}% Business Fit
              </span>
            </div>

            <h3 className="text-sm font-black text-slate-900 leading-snug">
              “{alert.headline}”
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
              {alert.whyItMatters}
            </p>

            <div className="grid grid-cols-3 gap-2 p-2 rounded-2xl nm-inset-sm text-center text-xs">
              <div>
                <span className="text-[9px] text-slate-500 font-bold block uppercase">Relevance</span>
                <span className="font-extrabold text-slate-900 text-xs">{alert.urgency}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold block uppercase">Fit</span>
                <span className="font-extrabold text-teal-700 text-xs">{alert.businessFit}%</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-bold block uppercase">Potential</span>
                <span className="font-extrabold text-emerald-700 text-xs">{alert.potential}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleSelectTrend(alert.trendId)}
                className="flex-1 py-2.5 rounded-2xl nm-btn text-slate-800 text-xs font-bold text-center cursor-pointer"
              >
                View Insight
              </button>
              <button
                onClick={() => {
                  handleSelectTrend(alert.trendId);
                  setCurrentView('action-plans');
                }}
                className="flex-1 py-2.5 rounded-2xl nm-btn-primary text-xs font-bold text-center cursor-pointer shadow-md"
              >
                Create Plan
              </button>
              <button
                onClick={() => handleSaveTrend(alert.trendId)}
                className="w-10 h-10 rounded-2xl nm-btn flex items-center justify-center text-slate-700 cursor-pointer"
                title="Save"
              >
                <BookmarkCheck className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION C: TOP OPPORTUNITIES */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Top Matched Opportunities
            </h2>
          </div>
          <button
            onClick={() => setCurrentView('opportunities')}
            className="text-[10px] font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
          >
            Formula Details →
          </button>
        </div>

        <div className="space-y-2.5">
          {opportunities.slice(0, 3).map((opp, idx) => (
            <div
              key={opp.trendId}
              onClick={() => handleSelectTrend(opp.trendId)}
              className="nm-flat rounded-2xl p-4 flex items-center justify-between gap-3 hover:nm-raised transition-all cursor-pointer"
            >
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full nm-inset-sm text-slate-700 text-[10px] font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">{opp.category}</span>
                </div>
                <h4 className="text-xs font-black text-slate-900 truncate">{opp.trendName}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-1">{opp.potentialAction}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-black text-teal-800 block">
                  Score {opp.opportunityScore}/100
                </span>
                <span className="text-[10px] text-slate-500 font-bold">
                  {opp.businessRelevance}% Fit
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION D: TREND MOMENTUM */}
      <div className="nm-flat rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Signal Velocity Distribution
          </h3>
          <span className="text-[10px] text-slate-500 font-bold nm-inset-sm px-2 py-0.5 rounded-full">22 Tracked</span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div>
            <div className="flex justify-between text-[11px] font-bold mb-1">
              <span className="text-slate-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span> Rising Signals
              </span>
              <span className="text-teal-800 font-extrabold">{risingTrends.length} trends</span>
            </div>
            <div className="w-full h-2 rounded-full nm-inset-sm overflow-hidden p-0.5">
              <div
                className="bg-teal-600 h-full rounded-full"
                style={{ width: `${(risingTrends.length / (trends.length || 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-bold mb-1">
              <span className="text-slate-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Stable Signals
              </span>
              <span className="text-amber-800 font-extrabold">{stableTrends.length} trends</span>
            </div>
            <div className="w-full h-2 rounded-full nm-inset-sm overflow-hidden p-0.5">
              <div
                className="bg-amber-500 h-full rounded-full"
                style={{ width: `${(stableTrends.length / (trends.length || 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Validated Plan Callout */}
        <div className="p-3.5 rounded-2xl nm-inset-sm flex items-center justify-between gap-2 mt-2 border border-emerald-400/30">
          <div className="min-w-0">
            <span className="text-[10px] font-black text-emerald-900 block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              ✓ HUMAN EXPERT VALIDATED
            </span>
            <p className="text-[11px] text-slate-700 truncate mt-0.5">
              Roasted Millet Protein Box certified by Chef Arjun Mehta
            </p>
          </div>
          <button
            onClick={() => setCurrentView('action-plans')}
            className="px-3 py-1.5 rounded-xl nm-btn-primary text-white text-[10px] font-bold shrink-0 cursor-pointer"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};
