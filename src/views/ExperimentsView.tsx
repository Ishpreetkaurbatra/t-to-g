import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Experiment } from '../types';
import { DemoDataBadge } from '../components/DemoDataBadge';
import {
  FlaskConical,
  PlayCircle,
  CheckCircle2,
  PauseCircle,
  Calendar,
  DollarSign,
  Target,
  Sparkles,
  PlusCircle,
  ArrowRight,
  RotateCcw,
  FileCheck2,
} from 'lucide-react';

export const ExperimentsView: React.FC = () => {
  const { showToast, businessProfile } = useApp();
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // Result logging state
  const [resultForm, setResultForm] = useState({
    whatHappened: 'Executed 14-day counter sampling. 320 customer tastings conducted with 264 sold units.',
    whatWorked: 'Spicy peri-peri millet crunch had 91% conversion after tasting. Students preferred the ₹85 price point.',
    whatFailed: 'Dark cocoa bites had lower afternoon demand (more suited for evening dessert hours).',
    whatShouldChange: 'Offer a sweetened iced tea bundle discount to drive ticket size above ₹150.',
    adaptAction: 'Incorporate peri-peri millet crunch into standard permanent menu & launch pre-packaged take-home jars.',
  });

  const fetchExperiments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getExperiments();
      setExperiments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  const handleSaveResult = async () => {
    if (!selectedExperiment) return;
    try {
      await api.recordExperimentResult(selectedExperiment.id, resultForm);
      showToast('Experiment results recorded! Learning cycle completed.');
      setShowResultModal(false);
      await fetchExperiments();
    } catch (err: any) {
      showToast(err.message || 'Failed to record results');
    }
  };

  const getStatusBadge = (status: Experiment['status']) => {
    switch (status) {
      case 'Running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
            Running Pilot
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Completed & Adapted
          </span>
        );
      case 'Planned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            Planned
          </span>
        );
      case 'Paused':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800">
            Paused
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16 text-left">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Business Experiments</span>
              <FlaskConical className="w-5 h-5 text-teal-600" />
            </h1>
            <DemoDataBadge compact />
          </div>
          <p className="text-xs text-slate-500">
            Turn expert-validated action plans into low-risk, measurable pilots. TEST → MEASURE → LEARN → ADAPT.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold">
            {experiments.filter((e) => e.status === 'Running').length} Active Experiments
          </span>
        </div>
      </div>

      {/* Experiments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-slate-400">Loading experiments...</p>
          </div>
        ) : (
          experiments.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-3">
                  {getStatusBadge(exp.status)}
                  <h3 className="text-base font-bold text-slate-900">{exp.name}</h3>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.startDate} to {exp.endDate}
                  </span>
                  <span>Budget: <strong className="text-slate-800">{exp.budget}</strong></span>
                </div>
              </div>

              {/* Hypothesis & Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-1">Objective & Hypothesis</span>
                  <p className="text-slate-600 font-medium">{exp.objective}</p>
                  <p className="text-slate-500 mt-1 italic">“{exp.hypothesis}”</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-1">Execution Action & Success Metric</span>
                  <p className="text-slate-600 font-medium">{exp.action}</p>
                  <p className="text-teal-700 font-bold mt-1">Goal: {exp.successMetric}</p>
                </div>
              </div>

              {/* Result Block if Completed (Section 15) */}
              {exp.result && (
                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-emerald-900 pb-1 border-b border-emerald-200/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>EXPERIMENT RESULTS & ADAPTATION PROTOCOL</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <strong className="block text-emerald-900">What Happened:</strong>
                      <p className="text-slate-700">{exp.result.whatHappened}</p>
                    </div>
                    <div>
                      <strong className="block text-emerald-900">What Worked:</strong>
                      <p className="text-slate-700">{exp.result.whatWorked}</p>
                    </div>
                    <div>
                      <strong className="block text-emerald-900">What Failed / Friction:</strong>
                      <p className="text-slate-700">{exp.result.whatFailed}</p>
                    </div>
                    <div>
                      <strong className="block text-emerald-900">What Should Change:</strong>
                      <p className="text-slate-700">{exp.result.whatShouldChange}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-emerald-200/60 font-medium">
                    <strong className="text-emerald-900">Final Adapted Action:</strong>{' '}
                    <span className="text-slate-800">{exp.result.adaptAction}</span>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {exp.status === 'Running' && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedExperiment(exp);
                      setShowResultModal(true);
                    }}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Record Experiment Results (Learn & Adapt)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Record Result Modal */}
      {showResultModal && selectedExperiment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Record Pilot Results for {selectedExperiment.name}
            </h3>
            <p className="text-xs text-slate-500">
              Close the learning loop: TEST → MEASURE → LEARN → ADAPT
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">What Happened?</label>
                <textarea
                  rows={2}
                  value={resultForm.whatHappened}
                  onChange={(e) => setResultForm({ ...resultForm, whatHappened: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">What Worked?</label>
                <input
                  type="text"
                  value={resultForm.whatWorked}
                  onChange={(e) => setResultForm({ ...resultForm, whatWorked: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">What Failed?</label>
                <input
                  type="text"
                  value={resultForm.whatFailed}
                  onChange={(e) => setResultForm({ ...resultForm, whatFailed: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">What Should Change?</label>
                <input
                  type="text"
                  value={resultForm.whatShouldChange}
                  onChange={(e) => setResultForm({ ...resultForm, whatShouldChange: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Final Adapt Action</label>
                <input
                  type="text"
                  value={resultForm.adaptAction}
                  onChange={(e) => setResultForm({ ...resultForm, adaptAction: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowResultModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveResult}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Save & Complete Experiment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
