import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { TrendItem } from '../types';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  MapPin,
  Users,
} from 'lucide-react';

const CATEGORY_FILTERS = [
  'All',
  'Food & Beverage',
  'Retail',
  'Fashion',
  'Beauty',
  'Education',
  'Technology',
  'Local Services',
];

export const TrendFeedView: React.FC = () => {
  const { setSelectedTrendId, setCurrentView, showToast, businessProfile } = useApp();
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTrends = async () => {
      setIsLoading(true);
      try {
        const data = await api.getTrends({
          category: selectedCategory,
          search: searchQuery,
        });
        setTrends(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrends();
  }, [selectedCategory, searchQuery]);

  const handleToggleSave = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isSaved = await api.toggleSaveTrend(id);
    setTrends((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_saved: isSaved } : t))
    );
    showToast(isSaved ? 'Trend saved to watchlist' : 'Trend removed from watchlist');
  };

  const handleAnalyze = (id: string) => {
    setSelectedTrendId(id);
    setCurrentView('trend-detail');
  };

  const handleCreatePlan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTrendId(id);
    setCurrentView('action-plans');
  };

  return (
    <div className="space-y-4 pb-8 text-left select-none">
      {/* Header card with clean search */}
      <div className="nm-flat rounded-3xl p-4.5 space-y-3">
        <div>
          <h1 className="text-lg font-black text-slate-900 tracking-tight">
            Trend Signals Feed
          </h1>
          <p className="text-[11px] text-slate-600 mt-0.5">
            22 Signals calibrated for {businessProfile?.name || 'FreshBite Café'} ({businessProfile?.city})
          </p>
        </div>

        {/* Clean Neumorphic Search Input */}
        <div className="flex items-center px-3.5 py-2.5 rounded-2xl nm-inset-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, ingredients, concepts..."
            className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
          />
        </div>

        {/* Scrollable category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'nm-inset-sm text-teal-900 font-extrabold border border-teal-400/40'
                  : 'nm-btn text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Trends List */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full nm-btn-primary flex items-center justify-center mx-auto mb-2 nm-radar-pulse"></div>
          <p className="text-xs text-slate-500 font-medium">Hunting signals...</p>
        </div>
      ) : trends.length === 0 ? (
        <div className="nm-flat rounded-3xl p-8 text-center text-xs text-slate-500">
          No signals match your search query.
        </div>
      ) : (
        <div className="space-y-3">
          {trends.map((trend) => (
            <div
              key={trend.id}
              onClick={() => handleAnalyze(trend.id)}
              className="nm-flat rounded-3xl p-4.5 space-y-3 cursor-pointer hover:nm-raised transition-all"
            >
              {/* Top tag row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full nm-inset-sm text-[10px] font-bold text-slate-700">
                    {trend.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      trend.momentum === 'Rising'
                        ? 'text-teal-800 nm-raised-xs'
                        : 'text-amber-800 nm-raised-xs'
                    }`}
                  >
                    🔥 {trend.momentum} ({trend.growth_rate})
                  </span>
                </div>

                <button
                  onClick={(e) => handleToggleSave(trend.id, e)}
                  className="w-8 h-8 rounded-xl nm-btn flex items-center justify-center text-slate-600 cursor-pointer"
                >
                  {trend.is_saved ? (
                    <BookmarkCheck className="w-3.5 h-3.5 text-teal-600" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Title & Desc */}
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-snug">
                  {trend.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {trend.description}
                </p>
              </div>

              {/* Meta indicators */}
              <div className="p-2.5 rounded-2xl nm-inset-sm grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                <div className="flex items-center gap-1 truncate font-medium">
                  <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                  <span className="truncate">{trend.location}</span>
                </div>
                <div className="flex items-center gap-1 truncate font-medium">
                  <Users className="w-3 h-3 text-teal-600 shrink-0" />
                  <span className="truncate">{trend.audience}</span>
                </div>
              </div>

              {/* Relevance & CTA Row */}
              <div className="flex items-center justify-between pt-1 border-t border-[#d8e2ee]/60">
                <div className="text-left">
                  <span className="text-[10px] font-black text-teal-800">
                    {trend.business_relevance}% Business Fit
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleCreatePlan(trend.id, e)}
                    className="px-2.5 py-1 rounded-xl nm-btn text-[10px] font-bold text-slate-700 cursor-pointer"
                  >
                    Create Plan
                  </button>
                  <button
                    onClick={() => handleAnalyze(trend.id)}
                    className="px-3 py-1 rounded-xl nm-btn-primary text-white text-[10px] font-bold cursor-pointer"
                  >
                    Analyze →
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
