import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Compass,
  Store,
  Layers,
  Activity,
  AlertTriangle,
  Lightbulb,
  Zap,
  Check,
  Clock,
  Award,
  ChevronRight,
  Target,
  RefreshCw,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setIsOnboardingOpen, jumpToJudgeStep } = useApp();

  return (
    <div className="min-h-screen bg-[#e8edf5] text-slate-900 selection:bg-teal-500 selection:text-white pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full nm-raised-xs text-slate-800 text-xs font-bold mb-5 border border-white">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span>T→G — TREND TO GROWTH</span>
              <span className="text-slate-400">|</span>
              <span className="text-teal-700 font-extrabold">Trend Intelligence & Action</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Find the trends that matter to your business —{' '}
              <span className="text-teal-700">
                and know what to do next.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed mb-6 max-w-xl mx-auto">
              Turn emerging signals into innovative, actionable business opportunities — with{' '}
              <span className="font-bold text-slate-900 underline decoration-teal-500 decoration-2 underline-offset-4">
                human expert validation
              </span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="w-full sm:w-auto px-6 py-3 nm-btn-dark rounded-2xl text-xs font-black shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Launch Mobile Platform</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </button>

              <button
                onClick={() => jumpToJudgeStep(1)}
                className="w-full sm:w-auto px-6 py-3 nm-raised rounded-2xl text-slate-900 text-xs font-bold border border-white flex items-center justify-center gap-2 active:nm-inset transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>14-Step Judge Demo</span>
              </button>
            </div>

            {/* Trust Callout */}
            <div className="inline-flex items-center gap-2 text-xs text-slate-600 nm-inset-sm px-4 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>Not just AI — Every recommendation requires Human Expert Sign-Off</span>
            </div>
          </div>

          {/* HERO VISUAL: Neumorphic Stage Architecture */}
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="nm-raised rounded-3xl p-5 sm:p-6 border border-white/80 space-y-4">
              <div className="text-center pb-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  The T→G Mobile Intelligence Architecture
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-left">
                <div className="p-3 rounded-2xl nm-inset-sm">
                  <span className="text-[10px] font-black text-teal-800 block">01 • SIGNAL</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">Emerging Shift</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">+46% regional snacks</p>
                </div>
                <div className="p-3 rounded-2xl nm-inset-sm">
                  <span className="text-[10px] font-black text-sky-800 block">02 • CONTEXT</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">FreshBite Profile</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Sangamner students</p>
                </div>
                <div className="p-3 rounded-2xl nm-inset-sm bg-slate-900 text-white">
                  <span className="text-[10px] font-black text-teal-400 block">03 • GEMINI</span>
                  <p className="text-xs font-bold text-white mt-0.5">AI Synthesis</p>
                  <p className="text-[10px] text-slate-300 mt-0.5">92% Fit & Prototype</p>
                </div>
                <div className="p-3 rounded-2xl nm-inset-sm bg-emerald-50/60 border border-emerald-300">
                  <span className="text-[10px] font-black text-emerald-800 block">04 • EXPERT</span>
                  <p className="text-xs font-bold text-emerald-950 mt-0.5">Human Validated</p>
                  <p className="text-[10px] text-emerald-800 mt-0.5">Chef Arjun Mehta sign-off</p>
                </div>
                <div className="p-3 rounded-2xl nm-inset-sm">
                  <span className="text-[10px] font-black text-purple-800 block">05 • PILOT</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">14-Day Test</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Measure & Adapt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: THE PROBLEM */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              The Reality of Small Business Growth
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Why most businesses fail to capitalize on trends
            </h2>
            <p className="text-sm text-slate-500 mt-3">
              Traditional trend reports are abstract. Generic AI tools spit out irrelevant fluff. Small businesses need practical answers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Too Much Information</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thousands of hashtags, viral reels, and news headlines create paralyzing noise without clear signals for your neighborhood.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Zero Time to Research</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Business owners manage staff, inventory, and daily operations. Spending 20 hours a week analyzing market shifts is impossible.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Trends ≠ Action</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Knowing that "millets are trending" doesn't tell a cafe owner what recipe to make, what price to charge, or how to market it.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Marketing Connection Gap</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Disconnect between high-level trend spotting and actual localized execution on Instagram, WhatsApp, and in-store counters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: HOW T→G WORKS */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              The 5-Stage System
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              From raw market signal to validated growth
            </h2>
            <p className="text-sm text-slate-500 mt-3">
              DETECT → ANALYZE → MATCH → CREATE PLAN → EXPERT VALIDATE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                num: '1',
                title: 'DETECT',
                subtitle: 'Continuous Signals',
                desc: 'Scans 11+ source categories including search queries, social NLP, POS shifts, and localized consumer chatter.',
              },
              {
                num: '2',
                title: 'ANALYZE',
                subtitle: '10-Point Intelligence',
                desc: 'Evaluates drivers, momentum, demographic brackets, regional velocity, and risk parameters.',
              },
              {
                num: '3',
                title: 'MATCH',
                subtitle: 'Business Context Fit',
                desc: 'Compares trend against your exact location, target customer age, current channels, and growth goals.',
              },
              {
                num: '4',
                title: 'CREATE PLAN',
                subtitle: 'Innovative Action Plan',
                desc: 'Generates non-generic 14-day pilots, product/service prototypes, channel strategies, and metric loops.',
              },
              {
                num: '5',
                title: 'EXPERT VALIDATE',
                subtitle: 'Human Sign-off',
                desc: 'Domain experts audit unit economics, add execution guardrails, and approve final recommendations.',
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-teal-400 font-extrabold flex items-center justify-center text-xs mb-3 font-mono">
                    {s.num}
                  </div>
                  <h3 className="text-sm font-black text-slate-900">{s.title}</h3>
                  <p className="text-xs font-semibold text-teal-700 mb-2">{s.subtitle}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: SMART TREND ALERTS DEMO */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                Proactive Intelligence
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                Smart Trend Alerts
              </h2>
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                You don't need to check dashboards every day. When a regional trend crosses your business relevance threshold and gains rapid momentum, T→G alerts you with an immediate, high-fit opportunity.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Filtered strictly for your geographic trade corridor</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Calculated Business Fit percentage (e.g. 87%+)</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>One-click conversion into an Innovative Action Plan</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setCurrentView('smart-alerts')}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-2"
                >
                  <span>View Live Demo Alerts</span>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                </button>
              </div>
            </div>

            {/* Realistic Alert Card Mockup */}
            <div className="bg-slate-50 border-2 border-teal-500/40 rounded-2xl p-6 shadow-xl text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping"></span>
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    SMART TREND ALERT
                  </span>
                </div>
                <span className="text-[11px] font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full">
                  Urgency: HIGH
                </span>
              </div>

              <div className="my-4">
                <h3 className="text-base font-bold text-slate-900">
                  “Plant-based snacks are gaining popularity among young consumers in your region.”
                </h3>
                <p className="text-xs text-slate-600 mt-2">
                  Regional query surge of +46% across Maharashtra tier 2/3 educational hubs. High overlap with FreshBite Café patrons seeking healthier study bites.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-xl border border-slate-200 mb-4 text-center">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Relevance</p>
                  <p className="text-xs font-bold text-slate-900">HIGH</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Business Fit</p>
                  <p className="text-xs font-black text-teal-700">87%</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Potential</p>
                  <p className="text-xs font-bold text-emerald-700">HIGH</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('trend-detail')}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer text-center"
                >
                  View Insight
                </button>
                <button
                  onClick={() => setCurrentView('action-plans')}
                  className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold cursor-pointer text-center"
                >
                  Create Action Plan
                </button>
                <button
                  onClick={() => setCurrentView('trend-feed')}
                  className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: INNOVATIVE ACTIONABLE PLANS */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              No Generic Advice
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Innovative Actionable Plans
            </h2>
            <p className="text-sm text-slate-500 mt-3">
              We never say "post more on social media". Every plan is engineered around your exact store layout, ticket size, and testing budget.
            </p>
          </div>

          {/* Action plan sample card */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 text-left">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  FOOD & BEVERAGE STRATEGY
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  14-Day Roasted Millet Protein Box Pilot
                </h3>
                <p className="text-xs text-slate-500">
                  Tailored for FreshBite Café • Target: College Students & Remote Freelancers
                </p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  ✓ HUMAN EXPERT VALIDATED
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 text-xs">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Objective</span>
                <p className="text-slate-600">Capture ₹25,000 incremental revenue from afternoon student footfall.</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 block mb-1">Product Offering</span>
                <p className="text-slate-600">Zesty Peri-Peri Sprouted Millet Crunch (₹85) & Cocoa Bites (₹95).</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 block mb-1">Channel Strategy</span>
                <p className="text-slate-600">Checkout counter display + WhatsApp VIP Club member announcement.</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 block mb-1">Pilot Timeline & Effort</span>
                <p className="text-slate-600">14 Days test (25 units/day) • Effort: Low • Opportunity: High.</p>
              </div>
            </div>

            {/* Test Measure Learn Adapt Loop */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Execution Framework: TEST → MEASURE → LEARN → ADAPT
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                  <span className="font-bold text-slate-900 block text-[11px]">TEST</span>
                  <p className="text-[11px] text-slate-600 mt-1">Launch 2 snack options at counter for 14 days.</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                  <span className="font-bold text-slate-900 block text-[11px]">MEASURE</span>
                  <p className="text-[11px] text-slate-600 mt-1">Track units sold daily and tasting survey scores.</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                  <span className="font-bold text-slate-900 block text-[11px]">LEARN</span>
                  <p className="text-[11px] text-slate-600 mt-1">Determine preference for savory vs cocoa.</p>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                  <span className="font-bold text-slate-900 block text-[11px]">ADAPT</span>
                  <p className="text-[11px] text-slate-600 mt-1">Scale winner into permanent breakfast pass bundle.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: HUMAN EXPERT VALIDATION */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Expert Sign-Off Record</h4>
                  <p className="text-[11px] text-slate-400">Chef Arjun Mehta (Hospitality Strategy Advisor)</p>
                </div>
              </div>

              <div className="space-y-3 text-xs bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 mb-4">
                <div>
                  <span className="text-teal-400 font-bold block mb-0.5">Expert Verdict:</span>
                  <p className="text-slate-200 font-medium">APPROVED WITH SUGGESTED DISPLAY MODIFICATION</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Expert Commentary:</span>
                  <p className="text-slate-300">
                    “Great alignment with FreshBite’s counter flow. College students want guilt-free fuel between classes. ₹85 gives healthy 68% margin.”
                  </p>
                </div>
                <div>
                  <span className="text-amber-400 font-semibold block mb-0.5">Execution Guardrail:</span>
                  <p className="text-slate-300">
                    “Add transparent glass jar at the register so customers see the roasted texture immediately.”
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Confidence Rating: 96%</span>
                <span className="text-emerald-400 font-bold">✓ VERIFIED FOR LIVE LAUNCH</span>
              </div>
            </div>

            <div className="order-1 lg:order-2 text-left">
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                The Trust Foundation
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                Why Human Expert Validation Matters
              </h2>
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                Raw AI models can hallucinate unrealistic margins, ignore local supply constraints, or propose promotions that damage your brand.
              </p>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                T→G couples Gemini reasoning with experienced industry professionals who review every plan before it becomes a final recommendation.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 text-xs text-slate-700">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Unit Economics Audit:</strong> Validates ingredient cost, staffing feasibility, and margin safety.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-700">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Risk Mitigation:</strong> Identifies potential supply chain bottlenecks before money is spent.</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-slate-700">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>Suggested Modifications:</strong> Tailors the pilot with real-world practitioner wisdom.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: BUSINESS CATEGORIES */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Diverse Industry Coverage
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Built for businesses across sectors
            </h2>
            <p className="text-sm text-slate-500 mt-3">
              Calibrated intelligence models trained for physical merchants and digital brands.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { title: 'Food & Beverage', desc: 'Cafés, QSR, cloud kitchens, bakeries' },
              { title: 'Retail & Merch', desc: 'Lifestyle, gifts, grocers, eco-goods' },
              { title: 'Fashion & Apparel', desc: 'Streetwear, thrift, sustainable labels' },
              { title: 'Beauty & Wellness', desc: 'Salons, skincare, Ayurvedic formats' },
              { title: 'Local Services', desc: 'Coworking, workshops, vehicle care' },
              { title: 'D2C & E-Commerce', desc: 'Packaged foods, creator merchandise' },
            ].map((cat, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-left hover:border-teal-500 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs mb-2">
                  ✓
                </div>
                <h4 className="text-xs font-bold text-slate-900">{cat.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: PRICING */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Transparent Investment
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Proposed Pilot Pricing
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Designed for high return on investment. 1 successful trend pilot covers the entire year.
            </p>
            <div className="inline-block mt-3 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] text-amber-800 font-semibold">
              Early Access & Regional Pilot Pricing
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-left flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Starter</h3>
                <p className="text-xs text-slate-500 mt-1">For single-store discovery</p>
                <div className="my-5">
                  <span className="text-3xl font-black text-slate-900">₹0</span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-600" /> 10 Trend signals/month</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-600" /> Basic category matching</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-600" /> 1 AI Action Plan preview</li>
                  <li className="flex items-center gap-2 text-slate-400">✕ Human Expert Review</li>
                </ul>
              </div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="w-full mt-6 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-xs font-semibold border border-slate-300 cursor-pointer"
              >
                Start Free
              </button>
            </div>

            {/* Small Business - Featured */}
            <div className="bg-slate-900 text-white rounded-2xl border-2 border-teal-500 p-6 text-left flex flex-col justify-between relative shadow-xl">
              <span className="absolute -top-3 right-6 bg-teal-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
              <div>
                <h3 className="text-base font-bold text-white">Small Business</h3>
                <p className="text-xs text-slate-300 mt-1">Cafés, retail shops, boutiques</p>
                <div className="my-5">
                  <span className="text-3xl font-black text-white">₹499</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Unlimited regional signals</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Smart Trend Alerts (WhatsApp/App)</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Tailored Action Plans</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> <strong>2 Expert Validations / mo</strong></li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-400" /> Experiment Tracker</li>
                </ul>
              </div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="w-full mt-6 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs font-bold cursor-pointer"
              >
                Join Pilot
              </button>
            </div>

            {/* Large Business */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-left flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Large Business</h3>
                <p className="text-xs text-slate-500 mt-1">Multi-location & D2C brands</p>
                <div className="my-5">
                  <span className="text-3xl font-black text-slate-900">₹999</span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-600" /> Multi-outlet geo clustering</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-600" /> Priority Expert Validation queue</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-600" /> 6 Expert Reviews / mo</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-600" /> Custom POS API integration</li>
                </ul>
              </div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="w-full mt-6 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-xs font-semibold border border-slate-300 cursor-pointer"
              >
                Choose Plan
              </button>
            </div>

            {/* Mystery Plan */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-left flex flex-col justify-between border-dashed">
              <div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">Dynamic Plan</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">Mystery Enterprise</h3>
                <p className="text-xs text-slate-500 mt-1">Chain franchises & trade associations</p>
                <div className="my-5">
                  <span className="text-2xl font-black text-slate-900">Custom</span>
                  <span className="text-xs text-slate-500"> / dynamic pricing</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-600" /> Dedicated Industry Council</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-600" /> Proprietary NLP crawl rules</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-teal-600" /> SLA Guaranteed Reviews &lt; 4h</li>
                </ul>
              </div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="w-full mt-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FINAL CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            “Stop chasing every trend.{' '}
            <span className="text-teal-400">Start acting on the ones that matter.”</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Experience the complete trend-to-growth workflow with FreshBite Café or configure your own business profile in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-sm shadow-lg transition-colors cursor-pointer"
            >
              Enter T→G Platform
            </button>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm border border-slate-700 transition-colors cursor-pointer"
            >
              Create New Business Profile
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
