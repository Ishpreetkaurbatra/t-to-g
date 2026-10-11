import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { TrendItem, TrendAnalysis, ActionPlan } from '../types';
import { TtoGLogo } from '../components/TtoGLogo';
import {
  Compass,
  Store,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Activity,
  AlertTriangle,
  RotateCcw,
  Target,
  Users,
  MapPin,
  Calendar,
  Layers,
  FileCheck2,
  DollarSign,
  Share2,
  Lightbulb,
  Radio,
  Search,
  Check,
} from 'lucide-react';

export const TrendProcessView: React.FC = () => {
  const {
    businessProfile,
    setBusinessProfile,
    selectedTrendId,
    setSelectedTrendId,
    setCurrentView,
    processStep,
    setProcessStep,
    advanceProcessStep,
    prevProcessStep,
    showToast,
    refreshData,
  } = useApp();

  // Local Form State for Step 1 - Kept empty by default
  const [profileData, setProfileData] = useState({
    name: businessProfile?.name || '',
    category: businessProfile?.category || '',
    city: businessProfile?.city || '',
    state: businessProfile?.state || '',
    targetCustomers: businessProfile?.targetCustomers || '',
    productsServices: businessProfile?.productsServices || '',
    businessGoal: businessProfile?.goals?.[0] || '',
  });

  // State for Step 2 (Trend Finder)
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [isHunting, setIsHunting] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'high_match' | 'surging'>('all');
  const [finderSearch, setFinderSearch] = useState('');

  // State for Step 3 & 4 (Analyzer & Plan)
  const [selectedTrend, setSelectedTrend] = useState<TrendItem | null>(null);
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // State for Step 5 (Expert Validation)
  const [isExpertApproving, setIsExpertApproving] = useState(false);
  const [isExpertApproved, setIsExpertApproved] = useState(false);
  const [expertComment, setExpertComment] = useState(
    'Pricing adjusted to ₹149 counter price. Recommended clear acrylic display jar with visible protein callouts for 38% higher conversion.'
  );

  // Load trends on mount
  useEffect(() => {
    const loadTrends = async () => {
      try {
        const data = await api.getTrends();
        setTrends(data);
        if (data.length > 0 && !selectedTrendId) {
          setSelectedTrendId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadTrends();
  }, []);

  // Sync selected trend
  useEffect(() => {
    if (selectedTrendId && trends.length > 0) {
      const found = trends.find((t) => t.id === selectedTrendId) || trends[0];
      setSelectedTrend(found);
      loadAnalysisAndPlan(found.id);
    }
  }, [selectedTrendId, trends]);

  const loadAnalysisAndPlan = async (trendId: string) => {
    setIsAnalyzing(true);
    try {
      const res = await api.analyzeTrend(trendId);
      setAnalysis(res.analysis);
      // Also check if plan exists
      const plans = await api.getActionPlans();
      const matchPlan = plans.find((p) => p.trendId === trendId) || plans[0];
      if (matchPlan) {
        setActionPlan(matchPlan);
        setIsExpertApproved(matchPlan.validationStatus === 'APPROVED');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 1: Save Profile & Launch Trend Finder
  const handleSaveProfileAndHunt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateBusinessProfile({
        name: profileData.name,
        category: profileData.category,
        city: profileData.city,
        state: profileData.state,
        targetCustomers: profileData.targetCustomers,
        productsServices: profileData.productsServices,
        goals: [profileData.businessGoal],
      });
      setBusinessProfile(updated);
      showToast('Profile saved! Trend Finder calibrated.');

      // Trigger scanning simulation
      setIsHunting(true);
      setProcessStep(2);
      setTimeout(() => {
        setIsHunting(false);
      }, 1200);
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Error updating profile');
    }
  };

  // Quick Profile Presets
  const applyPreset = (preset: {
    name: string;
    category: string;
    city: string;
    state: string;
    targetCustomers: string;
    productsServices: string;
    businessGoal: string;
  }) => {
    setProfileData(preset);
    showToast(`Loaded ${preset.name} preset`);
  };

  // Step 2: Select Trend to Hunt & Analyze
  const handleSelectTrendForHunt = async (trend: TrendItem) => {
    setSelectedTrendId(trend.id);
    setSelectedTrend(trend);
    await loadAnalysisAndPlan(trend.id);
    showToast(`Locked target: ${trend.name}`);
    setProcessStep(3);
  };

  // Step 3 -> 4: Generate Action Plan
  const handleGeneratePlan = async () => {
    if (!selectedTrend) return;
    setIsGeneratingPlan(true);
    try {
      const plan = await api.createActionPlan({
        trendId: selectedTrend.id,
        trendName: selectedTrend.name,
        category: selectedTrend.category,
        objective: analysis?.innovative_plan?.objective || 'Launch high-protein pilot',
        whyThisTrend: analysis?.innovative_plan?.why_this_trend || selectedTrend.description,
        recommendedAction: analysis?.innovative_plan?.recommended_action || 'Introduce Power Bites counter snack',
        targetCustomer: analysis?.innovative_plan?.target_customer || profileData.targetCustomers,
        productServiceIdea: analysis?.innovative_plan?.product_service_idea || 'FreshBite Power Bites',
        marketingApproach: analysis?.innovative_plan?.marketing_approach || 'Counter display jar and Instagram stories',
        channel: analysis?.innovative_plan?.channel || 'Storefront & Instagram',
        pilot: analysis?.innovative_plan?.pilot || '14-Day pilot with 30 daily units',
        timeline: analysis?.innovative_plan?.timeline || '14 Days',
        estimatedEffort: 'Low',
        expectedOpportunity: 'High',
        risks: analysis?.innovative_plan?.risks || ['Execution risk'],
        successMetrics: analysis?.innovative_plan?.success_metrics || ['30 daily units sold'],
        testMeasureLearn: analysis?.innovative_plan?.test_measure_learn || {
          test: 'Offer 30 units daily',
          measure: 'Daily sell-through',
          learn: 'Flavor popularity',
          adapt: 'Adjust flavors',
        },
        validationStatus: 'PENDING EXPERT REVIEW',
      });
      setActionPlan(plan);
      setIsExpertApproved(false);
      showToast('Innovative Actionable Plan generated!');
      setProcessStep(4);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Step 4 -> 5: Submit to Expert Review
  const handleSubmitToExpert = () => {
    showToast('Plan submitted to Human Expert Validation portal');
    setProcessStep(5);
  };

  // Step 5: Validate by Human Expert
  const handleApproveByExpert = async () => {
    if (!actionPlan) return;
    setIsExpertApproving(true);
    try {
      const validated = await api.submitExpertReview({
        planId: actionPlan.id,
        decision: 'APPROVED',
        comment: expertComment,
        riskNote: 'Keep initial batch size to 30 units to avoid spoilage',
        suggestedModification: 'Use clear acrylic jars with prominent protein badges',
        confidence: 95,
        expertName: 'Chef Arjun Mehta',
        expertTitle: 'Senior Hospitality & F&B Advisor',
      });
      setActionPlan(validated);
      setIsExpertApproved(true);
      showToast('✓ Plan stamped & validated by Senior Expert!');
    } catch (err: any) {
      showToast('Failed to validate plan');
    } finally {
      setIsExpertApproving(false);
    }
  };

  // Filtered trends for Step 2
  const filteredTrends = trends.filter((t) => {
    if (finderSearch && !t.name.toLowerCase().includes(finderSearch.toLowerCase())) {
      return false;
    }
    if (filterMode === 'high_match') {
      return (t.business_relevance || 0) >= 88;
    }
    if (filterMode === 'surging') {
      return t.momentum === 'Rising';
    }
    return true;
  });

  const stepsList = [
    { num: 1, label: 'Profile', desc: 'Enter Details' },
    { num: 2, label: 'Finder', desc: 'Trend Finder' },
    { num: 3, label: 'Analyzer', desc: 'Trend Analyzer' },
    { num: 4, label: 'Plan', desc: 'Action Blueprint' },
    { num: 5, label: 'Expert', desc: 'Human Validation' },
    { num: 6, label: 'Growth', desc: 'Alerts & Test' },
  ];

  return (
    <div className="space-y-4 pb-12 text-left select-none">
      {/* Top Neumorphic Process Flow Stepper */}
      <div className="nm-flat rounded-3xl p-3 sm:p-4 space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <TtoGLogo size="xs" showSubtitle={false} />
            <span className="text-[11px] font-black tracking-tight text-slate-800">
              TREND PROCESS
            </span>
          </div>
          <span className="text-[10px] font-bold text-blue-900 bg-blue-50 nm-inset-sm px-2.5 py-0.5 rounded-full border border-blue-200/60">
            Step {processStep} of 6
          </span>
        </div>

        {/* Tactile Stepper Pills (Blue & Green Neumorphic) */}
        <div className="grid grid-cols-6 gap-1.5 pt-1">
          {stepsList.map((st) => {
            const isCurrent = processStep === st.num;
            const isCompleted = processStep > st.num;

            return (
              <button
                key={st.num}
                onClick={() => setProcessStep(st.num)}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'nm-inset-sm text-blue-950 font-extrabold border border-blue-500/50 bg-blue-50/50 shadow-inner'
                    : isCompleted
                    ? 'nm-raised-xs text-emerald-800 font-bold bg-emerald-50/30 border border-emerald-400/30'
                    : 'nm-flat text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span className={`text-[10px] font-black ${isCurrent ? 'text-blue-700' : 'text-slate-500'}`}>
                      0{st.num}
                    </span>
                  )}
                </div>
                <span className="text-[9px] tracking-tight leading-none mt-1 truncate">
                  {st.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: ENTER PROFILE & ADD MY DETAILS */}
      {/* ========================================================================= */}
      {processStep === 1 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Introduction Card */}
          <div className="nm-flat rounded-3xl p-4.5 space-y-2 border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-900 bg-blue-50 nm-inset-sm px-2.5 py-0.5 rounded-full border border-blue-200/50">
                Phase 1 • Business Identity
              </span>
              <Store className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Enter Your Profile & Business Details
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our intelligent engine starts directly from your local profile. Every market trend is matched against your real footfall, profit margin targets, and inventory capacity before recommendation.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveProfileAndHunt} className="nm-flat rounded-3xl p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
              <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                Business Details
              </span>
              <button
                type="button"
                onClick={() =>
                  setProfileData({
                    name: '',
                    category: '',
                    city: '',
                    state: '',
                    targetCustomers: '',
                    productsServices: '',
                    businessGoal: '',
                  })
                }
                className="text-[11px] font-bold text-slate-500 hover:text-rose-600 transition cursor-pointer"
              >
                Clear Fields
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Business / Brand Name
              </label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="Enter business or brand name"
                className="w-full nm-inset-sm px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 font-semibold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Category
                </label>
                <select
                  value={profileData.category}
                  onChange={(e) => setProfileData({ ...profileData, category: e.target.value })}
                  className="w-full nm-inset-sm px-3 py-2.5 rounded-2xl text-xs text-slate-900 font-semibold focus:outline-none bg-[#e6eef7]"
                >
                  <option value="">Select Category...</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Retail">Retail</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Education">Education</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Local Services">Local Services</option>
                  <option value="D2C">D2C</option>
                  <option value="Hospitality">Hospitality</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Location (City, State)
                </label>
                <input
                  type="text"
                  required
                  value={
                    profileData.city && profileData.state
                      ? `${profileData.city}, ${profileData.state}`
                      : profileData.city || profileData.state || ''
                  }
                  onChange={(e) => {
                    const parts = e.target.value.split(',');
                    setProfileData({
                      ...profileData,
                      city: parts[0]?.trim() || '',
                      state: parts[1]?.trim() || '',
                    });
                  }}
                  placeholder="City, State"
                  className="w-full nm-inset-sm px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Target Customers
              </label>
              <input
                type="text"
                required
                value={profileData.targetCustomers}
                onChange={(e) => setProfileData({ ...profileData, targetCustomers: e.target.value })}
                placeholder="Describe your ideal customers (e.g. college youth, working parents)"
                className="w-full nm-inset-sm px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Products & Offerings
              </label>
              <textarea
                rows={2}
                value={profileData.productsServices}
                onChange={(e) => setProfileData({ ...profileData, productsServices: e.target.value })}
                placeholder="Key items, specialties, or services you offer"
                className="w-full nm-inset-sm px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 font-semibold focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Primary Business Goal
              </label>
              <input
                type="text"
                value={profileData.businessGoal}
                onChange={(e) => setProfileData({ ...profileData, businessGoal: e.target.value })}
                placeholder="e.g. Boost afternoon sales, introduce high-margin options"
                className="w-full nm-inset-sm px-3.5 py-2.5 rounded-2xl text-xs text-slate-900 font-semibold focus:outline-none"
              />
            </div>

            {/* Launch Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full nm-btn-primary py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Save Profile & Launch Trend Finder</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: TREND FINDER & SIGNAL DISCOVERY */}
      {/* ========================================================================= */}
      {processStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Finder Header */}
          <div className="nm-flat rounded-3xl p-4.5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 nm-radar-pulse"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 nm-inset-sm px-2 py-0.5 rounded-full">
                  Phase 2 • Trend Finder Active
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                11 Data Pipelines
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Trend Finder
              </h2>
              <p className="text-xs text-slate-600">
                Scanning emerging signals matched to <strong className="text-teal-900 font-bold">{businessProfile?.name || profileData.name}</strong> ({profileData.city}, {profileData.state})
              </p>
            </div>

            {/* Search and filters */}
            <div className="flex items-center px-3 py-2 rounded-2xl nm-inset-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={finderSearch}
                onChange={(e) => setFinderSearch(e.target.value)}
                placeholder="Find trend keywords, ingredients, concepts..."
                className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  filterMode === 'all' ? 'nm-inset-sm text-teal-900' : 'nm-btn text-slate-600'
                }`}
              >
                All Signals ({trends.length})
              </button>
              <button
                onClick={() => setFilterMode('high_match')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  filterMode === 'high_match' ? 'nm-inset-sm text-teal-900' : 'nm-btn text-slate-600'
                }`}
              >
                High Fit ≥ 88%
              </button>
              <button
                onClick={() => setFilterMode('surging')}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  filterMode === 'surging' ? 'nm-inset-sm text-teal-900' : 'nm-btn text-slate-600'
                }`}
              >
                🔥 Surging Momentum
              </button>
            </div>
          </div>

          {/* Radar Scanning indicator if active */}
          {isHunting && (
            <div className="nm-inset rounded-3xl p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full nm-btn-primary flex items-center justify-center mx-auto nm-radar-pulse">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Calibrating signals for {profileData.name}...
              </p>
              <p className="text-[11px] text-slate-500">
                Cross-referencing Swiggy/Zomato, Google Trends, and Regional Social Mentions
              </p>
            </div>
          )}

          {/* Trend Signals Radar Cards List */}
          <div className="space-y-3">
            {filteredTrends.map((trend) => {
              const isSelected = selectedTrendId === trend.id;

              return (
                <div
                  key={trend.id}
                  onClick={() => handleSelectTrendForHunt(trend)}
                  className={`nm-flat rounded-3xl p-4 space-y-3 transition-all cursor-pointer hover:nm-raised ${
                    isSelected ? 'ring-2 ring-teal-500/60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full nm-inset-sm text-teal-800">
                          {trend.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full nm-raised-xs text-amber-900">
                          🔥 {trend.growth_rate}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                        {trend.name}
                      </h3>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right shrink-0">
                      <div className="nm-inset-sm px-2.5 py-1 rounded-2xl inline-block text-center">
                        <span className="text-xs font-black text-teal-800">
                          {trend.business_relevance || 90}%
                        </span>
                        <span className="text-[9px] block text-slate-500 font-bold leading-none mt-0.5">
                          Fit Score
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {trend.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-[#d8e2ee]/60">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-teal-700" />
                      {trend.location}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-teal-800">
                      <span>Analyze Signal</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={prevProcessStep}
              className="nm-btn px-4 py-2 rounded-2xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Profile</span>
            </button>
            <button
              onClick={() => setProcessStep(3)}
              className="nm-btn-primary px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next: Trend Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: 10-POINT TREND ANALYZER */}
      {/* ========================================================================= */}
      {processStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header */}
          <div className="nm-flat rounded-3xl p-4.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 nm-inset-sm px-2.5 py-0.5 rounded-full">
                Phase 3 • Trend Analyzer & Matching
              </span>
              <span className="text-xs font-black text-slate-900">
                10-Point Analysis
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Trend: {selectedTrend?.name || 'Plant-Based Snacks'}
            </h2>
            <p className="text-xs text-slate-600">
              In-depth reasoning matched against <strong className="text-teal-900">{profileData.name}</strong>
            </p>
          </div>

          {/* Scorecards */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="nm-flat rounded-2xl p-3">
              <span className="text-[10px] font-bold text-slate-500 block">Momentum</span>
              <span className="text-xs font-black text-teal-800 mt-1 block">
                {selectedTrend?.momentum || 'Rising'}
              </span>
            </div>
            <div className="nm-flat rounded-2xl p-3">
              <span className="text-[10px] font-bold text-slate-500 block">Business Fit</span>
              <span className="text-xs font-black text-emerald-800 mt-1 block">
                {analysis?.business_relevance || selectedTrend?.business_relevance || 92}%
              </span>
            </div>
            <div className="nm-flat rounded-2xl p-3">
              <span className="text-[10px] font-bold text-slate-500 block">Opportunity</span>
              <span className="text-xs font-black text-indigo-800 mt-1 block">
                {analysis?.opportunity_score || selectedTrend?.opportunity_score || 88}/100
              </span>
            </div>
          </div>

          {/* 10 Analysis Points */}
          <div className="nm-flat rounded-3xl p-4.5 space-y-3.5">
            <div>
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full nm-inset-sm text-teal-800 flex items-center justify-center text-[10px] font-black">1</span>
                What Is Happening?
              </h4>
              <p className="text-xs text-slate-600 pl-5">
                {analysis?.trend_summary || 'Surge in young consumers seeking quick, clean-label plant and protein-dense snacks with transparent ingredient sourcing.'}
              </p>
            </div>

            <div className="pt-2 border-t border-[#d8e2ee]/60">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full nm-inset-sm text-teal-800 flex items-center justify-center text-[10px] font-black">2</span>
                Why Is It Rising?
              </h4>
              <p className="text-xs text-slate-600 pl-5">
                {(analysis?.drivers && analysis.drivers.join(', ')) || 'Post-gym routines, busy exam schedules, and increasing awareness of clean energy without mid-day sugar crashes.'}
              </p>
            </div>

            <div className="pt-2 border-t border-[#d8e2ee]/60">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full nm-inset-sm text-teal-800 flex items-center justify-center text-[10px] font-black">3</span>
                Who Is Interested?
              </h4>
              <p className="text-xs text-slate-600 pl-5">
                {(analysis?.target_audience && analysis.target_audience.join(', ')) || selectedTrend?.audience || 'College students and active professionals aged 18–32 years looking for affordable, grab-and-go snack boxes.'}
              </p>
            </div>

            <div className="pt-2 border-t border-[#d8e2ee]/60">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full nm-inset-sm text-teal-800 flex items-center justify-center text-[10px] font-black">4</span>
                Where Is It Growing?
              </h4>
              <p className="text-xs text-slate-600 pl-5">
                {selectedTrend?.location || `Maharashtra Tier-2 cities including ${profileData.city}, Pune, and Nashik with 44% uptick in college-adjacent zones.`}
              </p>
            </div>

            <div className="pt-2 border-t border-[#d8e2ee]/60">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full nm-inset-sm text-teal-800 flex items-center justify-center text-[10px] font-black">5</span>
                Business Opportunity for {profileData.name}
              </h4>
              <p className="text-xs text-slate-600 pl-5">
                {analysis?.business_opportunity || `Introduce a signature high-protein breakfast snack trio at the counter. Fits existing prep line with 68% estimated gross margin.`}
              </p>
            </div>

            {/* Risk Breakdown Pill */}
            <div className="pt-2 border-t border-[#d8e2ee]/60">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full nm-inset-sm text-teal-800 flex items-center justify-center text-[10px] font-black">6</span>
                Risk Analysis
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] pl-5">
                <div className="nm-inset-sm p-2 rounded-xl">
                  <span className="font-bold text-slate-700 block">Market Risk:</span>
                  <span className="text-slate-500">{analysis?.market_risk || 'Low (Demand sustained)'}</span>
                </div>
                <div className="nm-inset-sm p-2 rounded-xl">
                  <span className="font-bold text-slate-700 block">Execution Risk:</span>
                  <span className="text-slate-500">{analysis?.execution_risk || 'Low (Uses existing pantry)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
              className="w-full nm-btn-primary py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <span>{isGeneratingPlan ? 'Generating Plan...' : 'Generate Innovative Actionable Plan →'}</span>
            </button>
          </div>

          {/* Bottom Nav */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={prevProcessStep}
              className="nm-btn px-4 py-2 rounded-2xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Trend Finder</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: INNOVATIVE ACTIONABLE PLAN */}
      {/* ========================================================================= */}
      {processStep === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header */}
          <div className="nm-flat rounded-3xl p-4.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 nm-inset-sm px-2.5 py-0.5 rounded-full">
                Phase 4 • Innovative Actionable Plan
              </span>
              <span className="text-[10px] font-bold text-amber-800 nm-raised-xs px-2 py-0.5 rounded-md">
                Pending Expert Review
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Action Plan: {selectedTrend?.name || 'Plant-Based Snacks'}
            </h2>
            <p className="text-xs text-slate-600">
              Custom proposal for <strong className="text-teal-900">{profileData.name}</strong>. Not generic advice.
            </p>
          </div>

          {/* Plan Details Card */}
          <div className="nm-flat rounded-3xl p-5 space-y-3.5">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Plan Objective
              </span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {actionPlan?.objective || `Launch a 14-day high-protein morning snack pilot to increase 8:00 AM–11:30 AM counter tickets.`}
              </p>
            </div>

            <div className="pt-2 border-t border-[#d8e2ee]/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Recommended Action
              </span>
              <p className="text-xs text-slate-700 mt-0.5">
                {actionPlan?.recommendedAction || `Introduce "FreshBite Power Bites" (roasted chickpeas, peanut flax butter, and chia dates) in sealed grab-and-go jars.`}
              </p>
            </div>

            <div className="pt-2 border-t border-[#d8e2ee]/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                14-Day Pilot Scope
              </span>
              <p className="text-xs text-slate-700 mt-0.5">
                {actionPlan?.pilot || 'Test 30 sample jars daily for 14 days at ₹149 introductory price. Track sell-through and repeat purchases.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#d8e2ee]/60 text-xs">
              <div className="nm-inset-sm p-2.5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 block">Primary Channel</span>
                <span className="font-extrabold text-teal-900">
                  {actionPlan?.channel || 'Counter + Instagram Story'}
                </span>
              </div>
              <div className="nm-inset-sm p-2.5 rounded-2xl">
                <span className="text-[10px] font-bold text-slate-500 block">Timeline & Effort</span>
                <span className="font-extrabold text-slate-800">
                  {actionPlan?.timeline || '14 Days (Low Effort)'}
                </span>
              </div>
            </div>

            {/* Crucial Position Notice */}
            <div className="nm-inset-sm p-3 rounded-2xl text-[11px] text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 font-bold block">Human Expert Validation Gate:</strong>
                T→G never presents raw AI advice as final. This plan must be validated and certified by a human industry veteran before execution.
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-1">
            <button
              onClick={handleSubmitToExpert}
              className="w-full nm-btn-primary py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Submit to Human Expert for Review →</span>
            </button>
          </div>

          {/* Bottom Nav */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={prevProcessStep}
              className="nm-btn px-4 py-2 rounded-2xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Analyzer</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: HUMAN EXPERT VALIDATION */}
      {/* ========================================================================= */}
      {processStep === 5 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header */}
          <div className="nm-flat rounded-3xl p-4.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-800 nm-inset-sm px-2.5 py-0.5 rounded-full">
                Phase 5 • Human Expert Review
              </span>
              <ShieldCheck className="w-4 h-4 text-indigo-700" />
            </div>

            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Human Expert Validation Portal
            </h2>
            <p className="text-xs text-slate-600">
              Industry veterans review feasibility, margin safety, and localized execution risks before final approval.
            </p>
          </div>

          {/* Expert Profile Card */}
          <div className="nm-flat rounded-3xl p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl nm-inset-sm flex items-center justify-center text-indigo-700 font-black text-sm shrink-0">
              AM
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900">
                Chef Arjun Mehta
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold">
                Senior Hospitality & F&B Advisor • 18+ yrs experience
              </p>
              <span className="inline-block mt-0.5 text-[9px] font-bold text-emerald-800 nm-inset-sm px-2 py-0.2 rounded-full">
                Assigned Validator
              </span>
            </div>
          </div>

          {/* Validation Checklist Card */}
          <div className="nm-flat rounded-3xl p-5 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Expert Verification Checklist
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Unit economics verified: ₹149 price delivers 68% margin.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Supply chain checked: Local Sangamner vendors have raw ingredients.</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Operational load: 15-minute morning prep time fits staff schedule.</span>
              </div>
            </div>

            {/* Expert Commentary Field */}
            <div className="pt-2 border-t border-[#d8e2ee]/60">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Expert Modification Notes:
              </label>
              <textarea
                rows={3}
                value={expertComment}
                onChange={(e) => setExpertComment(e.target.value)}
                className="w-full nm-inset-sm px-3 py-2 rounded-2xl text-xs text-slate-800 font-medium focus:outline-none resize-none"
              />
            </div>

            {/* Validation Stamp status */}
            {isExpertApproved ? (
              <div className="nm-inset p-3 rounded-2xl text-center space-y-1 bg-emerald-50/50 border border-emerald-300/40">
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-900 uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>✓ HUMAN EXPERT VALIDATED</span>
                </div>
                <p className="text-[10px] text-slate-600">
                  Certified by Chef Arjun Mehta on {new Date().toLocaleDateString()}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleApproveByExpert}
                disabled={isExpertApproving}
                className="w-full nm-btn-primary py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isExpertApproving ? 'Validating...' : 'Approve & Certify Action Plan ✓'}</span>
              </button>
            )}
          </div>

          {/* Next Button */}
          {isExpertApproved && (
            <div className="pt-1">
              <button
                onClick={advanceProcessStep}
                className="w-full nm-btn-primary py-3 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Move to Growth & Alerts →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Bottom Nav */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={prevProcessStep}
              className="nm-btn px-4 py-2 rounded-2xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Plan</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 6: GROWTH TRACKER & SMART ALERTS */}
      {/* ========================================================================= */}
      {processStep === 6 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header */}
          <div className="nm-flat rounded-3xl p-4.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 nm-inset-sm px-2.5 py-0.5 rounded-full">
                Phase 6 • Test → Measure → Adapt
              </span>
              <Activity className="w-4 h-4 text-teal-700" />
            </div>

            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Growth Tracker & Active Alerts
            </h2>
            <p className="text-xs text-slate-600">
              Track live experiments and receive smart trend alerts when regional demand spikes.
            </p>
          </div>

          {/* Validated Plan Status Card */}
          <div className="nm-flat rounded-3xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900">
                Active Execution Pilot
              </span>
              <span className="text-[10px] font-black text-emerald-800 nm-inset-sm px-2 py-0.5 rounded-full">
                ✓ Certified
              </span>
            </div>

            <div className="nm-inset-sm p-3 rounded-2xl space-y-1">
              <h4 className="text-xs font-bold text-slate-800">
                14-Day Power Bite Pilot ({profileData.name})
              </h4>
              <p className="text-[11px] text-slate-600">
                Hypothesis: 30 daily units @ ₹149 will generate ₹62,580 monthly incremental revenue.
              </p>
              <div className="flex items-center justify-between text-[10px] font-bold text-teal-800 pt-1">
                <span>Budget: ₹4,500</span>
                <span>Day 4 of 14 • 84% Sell-Through</span>
              </div>
            </div>
          </div>

          {/* Smart Alerts Snapshot */}
          <div className="nm-flat rounded-3xl p-4.5 space-y-3">
            <span className="text-xs font-extrabold text-slate-900 block">
              Smart Trend Alert for {profileData.city}
            </span>

            <div className="nm-inset-sm p-3 rounded-2xl space-y-1.5 border-l-3 border-teal-500">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-teal-900 uppercase">HIGH RELEVANCE (89%)</span>
                <span className="text-slate-500">2h ago</span>
              </div>
              <p className="text-xs text-slate-800 font-semibold">
                “Plant-based snacks gaining 142% search volume among college students in your district.”
              </p>
            </div>
          </div>

          {/* Complete Actions */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => {
                setProcessStep(1);
                showToast('Started new Trend Process journey!');
              }}
              className="nm-btn py-3 px-3 rounded-2xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              <span>Restart Process</span>
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="nm-btn-primary py-3 px-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Full Dashboard →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
