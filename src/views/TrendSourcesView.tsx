import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TrendSource } from '../types';
import { DemoDataBadge } from '../components/DemoDataBadge';
import {
  Radio,
  CheckCircle2,
  ExternalLink,
  Layers,
  Database,
  Cpu,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const TrendSourcesView: React.FC = () => {
  const [sources, setSources] = useState<TrendSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSources = async () => {
      setIsLoading(true);
      try {
        const data = await api.getSources();
        setSources(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSources();
  }, []);

  return (
    <div className="space-y-6 pb-16 text-left">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Trend Sources & API Connectors</span>
              <Radio className="w-5 h-5 text-teal-600" />
            </h1>
            <DemoDataBadge compact />
          </div>
          <p className="text-xs text-slate-500">
            Modular ingestion pipelines designed to connect external live query APIs, NLP crawlers, and merchant networks.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          11 Connector Interfaces Ready
        </span>
      </div>

      {/* Honest Architecture Disclosure Card (Section 11 & 12) */}
      <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-5 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <Database className="w-4 h-4 text-amber-800" />
          <span>Product Integrity Notice: Demo Data Mode Active</span>
        </div>
        <p className="leading-relaxed text-amber-900/90">
          In strict compliance with product truth principles, all 22 trends currently presented in the T→G interface are realistically simulated signals. We do not falsify live API access. Once production credentials (e.g. Google Trends, Meta Graph API, Zepto Scrapers) are authenticated, the pipeline operates seamlessly with identical schemas.
        </p>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="py-20 text-center col-span-3">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-400">Loading pipeline connectors...</p>
          </div>
        ) : (
          sources.map((src) => (
            <div
              key={src.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs text-left flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {src.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      src.status === 'API Ready'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {src.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-3 leading-snug">
                  {src.name}
                </h3>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {src.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Sampling: <strong>{src.sampleFrequency}</strong></span>
                <span className="text-teal-600 font-semibold">Normalized Ingestion</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
