import React from 'react';
import { useApp } from '../context/AppContext';
import { supabaseInfo, getSupabaseConfig } from '../services/supabase';
import { DemoDataBadge } from '../components/DemoDataBadge';
import {
  Settings,
  ShieldCheck,
  Database,
  Lock,
  Cpu,
  RotateCcw,
  CheckCircle2,
  FileCode2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentRole, currentUser, resetJudgeDemo, showToast } = useApp();
  const config = getSupabaseConfig();

  const handleReset = async () => {
    await resetJudgeDemo();
    showToast('Platform environment reset to initial FreshBite baseline.');
  };

  return (
    <div className="space-y-6 pb-16 text-left">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Platform Settings & Architecture</span>
              <Settings className="w-5 h-5 text-teal-600" />
            </h1>
            <DemoDataBadge compact />
          </div>
          <p className="text-xs text-slate-500">
            Security policies, Supabase schema definitions, and model telemetry status.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
          <span>Reset Demo Environment</span>
        </button>
      </div>

      {/* Database & Supabase Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Supabase PostgreSQL Architecture
            </h3>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            RLS Active • 15 Tables
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The database schema is fully defined in <code className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-[11px]">supabase/schema.sql</code>. It includes UUID primary keys, strict Row Level Security (RLS) policies, and foreign key relations.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Schema Version</span>
            <span className="font-bold text-slate-900">{supabaseInfo.schemaVersion}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Client Mode</span>
            <span className="font-bold text-slate-900">
              {config.isConfigured ? 'Supabase Live' : 'Internal Express Store'}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Row Level Security</span>
            <span className="font-bold text-emerald-600">Enforced</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Tables Covered</span>
            <span className="font-bold text-slate-900">{supabaseInfo.tablesCovered.length} Tables</span>
          </div>
        </div>
      </div>

      {/* AI & Telemetry Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Gemini Flash Intelligence Layer
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
            gemini-3.8-flash
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          AI calls are strictly handled on the backend via <code className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-[11px]">/server/gemini.ts</code> using the official <code className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-[11px]">@google/genai</code> SDK with <code className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-[11px]">User-Agent: aistudio-build</code> telemetry. Keys are never exposed to the client.
        </p>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
          <span className="text-slate-700 font-medium">Server API Proxy:</span>
          <span className="font-mono text-teal-700 font-semibold">POST /api/trends/analyze</span>
        </div>
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Lock className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Role-Based Access Control (RBAC) Matrix
          </h3>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2">Capability</th>
                <th className="py-2">Business Owner</th>
                <th className="py-2">Human Expert</th>
                <th className="py-2">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2.5 font-medium">Browse Trend Signals & Alerts</td>
                <td className="py-2.5 text-emerald-600 font-bold">✓ Own & Public</td>
                <td className="py-2.5 text-emerald-600 font-bold">✓ Full</td>
                <td className="py-2.5 text-emerald-600 font-bold">✓ Full</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Generate AI Action Plan Proposal</td>
                <td className="py-2.5 text-emerald-600 font-bold">✓ Yes</td>
                <td className="py-2.5 text-slate-400">Read-only</td>
                <td className="py-2.5 text-emerald-600 font-bold">✓ Yes</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Approve / Reject Final Recommendations</td>
                <td className="py-2.5 text-slate-400">✕ Disallowed</td>
                <td className="py-2.5 text-emerald-600 font-bold">✓ Sole Authority</td>
                <td className="py-2.5 text-emerald-600 font-bold">✓ Override</td>
              </tr>
              <tr>
                <td className="py-2.5 font-medium">Execute Live Pilots / Experiments</td>
                <td className="py-2.5 text-emerald-600 font-bold">✓ Yes</td>
                <td className="py-2.5 text-slate-400">Read-only</td>
                <td className="py-2.5 text-emerald-600 font-bold">✓ Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
