import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { TrendItem, OpportunityItem } from '../types';
import { Search, X, TrendingUp, Sparkles, ArrowRight, Store, Compass } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setCurrentView, setSelectedTrendId } = useApp();
  const [query, setQuery] = useState('');
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
      return;
    }
    const load = async () => {
      setIsLoading(true);
      try {
        const [allTrends, opps] = await Promise.all([
          api.getTrends(),
          api.getOpportunities(),
        ]);
        setTrends(allTrends);
        setOpportunities(opps);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredTrends = query.trim()
    ? trends.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.location.toLowerCase().includes(query.toLowerCase())
      )
    : trends.slice(0, 6);

  const filteredOpps = query.trim()
    ? opportunities.filter(
        (o) =>
          o.trendName.toLowerCase().includes(query.toLowerCase()) ||
          o.category.toLowerCase().includes(query.toLowerCase()) ||
          o.whyItMatters.toLowerCase().includes(query.toLowerCase())
      )
    : opportunities.slice(0, 3);

  const handleSelectTrend = (trendId: string) => {
    setSelectedTrendId(trendId);
    setCurrentView('trend-detail');
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-[#e8edf5] w-full max-w-lg rounded-3xl nm-raised border border-white overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150 shadow-2xl">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-300/60">
          <div className="flex items-center px-3.5 py-2.5 rounded-2xl nm-inset bg-[#e8edf5]">
            <Search className="w-4 h-4 text-slate-500 mr-2.5 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search trends, categories, opportunities..."
              className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="ml-2 text-[10px] font-bold text-slate-500 px-2 py-0.5 rounded-lg nm-raised-xs cursor-pointer"
            >
              ESC
            </button>
          </div>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {/* Trends Section */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-teal-600" />
                Trends & Signals ({filteredTrends.length})
              </span>
              <span className="text-[11px] text-slate-400">Match score & momentum</span>
            </div>

            {filteredTrends.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No trends matching "{query}"</p>
            ) : (
              <div className="space-y-1.5">
                {filteredTrends.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTrend(t.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer text-left"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700">
                          {t.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {t.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-teal-700">
                          {t.business_relevance}% Fit
                        </span>
                        <p className="text-[10px] text-slate-400">{t.momentum}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Business Opportunities Section */}
          {filteredOpps.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Matched Business Opportunities
                </span>
              </div>
              <div className="space-y-2">
                {filteredOpps.map((opp) => (
                  <div
                    key={opp.trendId}
                    onClick={() => handleSelectTrend(opp.trendId)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer border border-slate-200/60"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800">{opp.trendName}</h4>
                      <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                        Score {opp.opportunityScore}/100
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">{opp.potentialAction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Search spans 22 demo trends, location signals & opportunities</span>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">ESC</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
