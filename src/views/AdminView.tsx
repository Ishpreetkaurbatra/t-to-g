import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { DemoDataBadge } from '../components/DemoDataBadge';
import {
  UserCheck,
  Building2,
  ShieldCheck,
  Radio,
  FileCheck2,
  Sparkles,
  RotateCcw,
  BarChart3,
  CheckCircle2,
  Layers,
  Database,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { showToast, resetJudgeDemo, businessProfile } = useApp();
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'businesses' | 'experts' | 'ai-outputs'>('overview');

  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

  return (
    <div className="space-y-6 pb-16 text-left">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-rose-400 bg-rose-500/20 px-2.5 py-0.5 rounded uppercase tracking-wider border border-rose-500/30">
              Platform Admin Console
            </span>
            <span className="text-xs text-slate-400">• Full System Governance</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>T→G Platform Administration</span>
            <UserCheck className="w-5 h-5 text-teal-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Oversight of businesses, vetted human experts, AI reasoning logs, and data pipelines.
          </p>
        </div>

        <button
          onClick={resetJudgeDemo}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Database</span>
        </button>
      </div>

      {/* Admin Analytics Overview (Section 10) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Users</span>
          <p className="text-xl font-black text-slate-900 mt-1">142</p>
          <span className="text-[10px] text-teal-600 font-semibold">+18 this week</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Businesses</span>
          <p className="text-xl font-black text-slate-900 mt-1">28</p>
          <span className="text-[10px] text-slate-500">Tier 2/3 Pilots</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Trends Analyzed</span>
          <p className="text-xl font-black text-slate-900 mt-1">22</p>
          <span className="text-[10px] text-slate-500">Demo Active</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Plans Created</span>
          <p className="text-xl font-black text-slate-900 mt-1">19</p>
          <span className="text-[10px] text-teal-600 font-semibold">Gemini Flash</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Validation Rate</span>
          <p className="text-xl font-black text-emerald-600 mt-1">84%</p>
          <span className="text-[10px] text-slate-500">Sign-off SLA</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Certified Experts</span>
          <p className="text-xl font-black text-indigo-600 mt-1">12</p>
          <span className="text-[10px] text-slate-500">Across 6 Sectors</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">System Health</span>
          <p className="text-xl font-black text-teal-700 mt-1">100%</p>
          <span className="text-[10px] text-teal-600 font-semibold">Postgres / RLS</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeAdminTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Platform Health & Telemetry
        </button>
        <button
          onClick={() => setActiveAdminTab('businesses')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeAdminTab === 'businesses' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Managed Businesses
        </button>
        <button
          onClick={() => setActiveAdminTab('experts')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeAdminTab === 'experts' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Expert Council Registry
        </button>
        <button
          onClick={() => setActiveAdminTab('ai-outputs')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeAdminTab === 'ai-outputs' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          AI Reasoning Audit Logs
        </button>
      </div>

      {/* Tab Contents */}
      {activeAdminTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Active Industry Distribution
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700">Food & Beverage (Cafés, Bakeries, QSR)</span>
                <span className="font-bold text-slate-900">38% (11 businesses)</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-700">Retail & Lifestyle Goods</span>
                <span className="font-bold text-slate-900">24% (7 businesses)</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-700">Local Experiential & Services</span>
                <span className="font-bold text-slate-900">18% (5 businesses)</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-700">Fashion & D2C Apparel</span>
                <span className="font-bold text-slate-900">14% (4 businesses)</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-700">Beauty & Wellness</span>
                <span className="font-bold text-slate-900">6% (2 businesses)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Top Active Pilot Merchants
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{businessProfile?.name || 'FreshBite Café'}</span>
                  <span className="text-slate-500">{businessProfile?.city}, {businessProfile?.state}</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Active Pilot
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Velvet & Oak Apparel</span>
                  <span className="text-slate-500">Nashik, Maharashtra</span>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  Watchlist Active
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">RootBio Skincare Studio</span>
                  <span className="text-slate-500">Pune, Maharashtra</span>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  Pending Review
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'experts' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Certified Human Expert Advisors
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Chef Arjun Mehta</p>
                <p className="text-slate-500">Hospitality & F&B Advisory (15 yrs exp) • 96% Review SLA</p>
              </div>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded font-bold">Active Reviewer</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Neha Joshi</p>
                <p className="text-slate-500">Retail Brand Strategy & Pricing (Director, GrowthScale) • 92% Review SLA</p>
              </div>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded font-bold">Active Reviewer</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Dr. Vikram Malhotra</p>
                <p className="text-slate-500">D2C Supply Chain & Unit Economics (Partner, Apex Advisory)</p>
              </div>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded font-bold">Standby</span>
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'ai-outputs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">
            Gemini Reasoning Audits
          </h3>
          <p className="text-xs text-slate-500">
            All AI outputs are logged in JSON structure matching the schema before human dispatch.
          </p>
          <div className="p-3 bg-slate-900 text-teal-300 rounded-xl font-mono text-[11px] overflow-x-auto">
            <pre>
{`{
  "engine": "gemini-3.8-flash",
  "telemetry": "aistudio-build",
  "temperature": 0.3,
  "last_audit_status": "VALIDATED_BY_EXPERT",
  "schema_compliance": "100%",
  "hallucination_penalty": 0
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
