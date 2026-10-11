import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { ActionPlan } from '../types';
import {
  ShieldCheck,
  Award,
  Send,
} from 'lucide-react';

export const ExpertDashboardView: React.FC = () => {
  const { showToast, currentUser, setCurrentRole, setCurrentView } = useApp();
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'revision'>('pending');
  const [selectedPlanForReview, setSelectedPlanForReview] = useState<ActionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Review Form state
  const [decision, setDecision] = useState<'APPROVED' | 'NEEDS REVISION' | 'REJECTED'>('APPROVED');
  const [comment, setComment] = useState('');
  const [riskNote, setRiskNote] = useState('');
  const [suggestedModification, setSuggestedModification] = useState('');
  const [confidence, setConfidence] = useState(95);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const allPlans = await api.getActionPlans();
      setPlans(allPlans);

      const pending = allPlans.find((p) => p.validationStatus === 'PENDING EXPERT REVIEW');
      if (pending) {
        setSelectedPlanForReview(pending);
        setComment('Strong concept. College students in Sangamner want guilt-free fuel between lectures. Pricing is viable with 65%+ gross margin.');
        setRiskNote('Ensure dry storage so seed crunch does not soften during monsoon moisture.');
        setSuggestedModification('Present in a transparent glass counter display with a small "taste one free" sampling spoon.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const pendingPlans = plans.filter((p) => p.validationStatus === 'PENDING EXPERT REVIEW');
  const approvedPlans = plans.filter((p) => p.validationStatus === 'APPROVED');
  const revisionPlans = plans.filter((p) => p.validationStatus === 'NEEDS REVISION');

  const handleOpenReview = (plan: ActionPlan) => {
    setSelectedPlanForReview(plan);
    setDecision('APPROVED');
    setComment('Strategy aligns well with store layout and student traffic.');
    setRiskNote('Keep initial batch size to 25 units to prevent stale inventory.');
    setSuggestedModification('Offer a combo pairing with iced latte for ₹20 off.');
    setConfidence(94);
  };

  const handleSubmitReview = async () => {
    if (!selectedPlanForReview) return;
    setIsSubmitting(true);
    try {
      await api.submitExpertReview({
        planId: selectedPlanForReview.id,
        decision,
        comment,
        riskNote,
        suggestedModification,
        confidence,
        expertName: currentUser.name || 'Chef Arjun Mehta',
        expertTitle: currentUser.title || 'Senior Hospitality & F&B Advisor',
      });
      showToast(`Expert review submitted! Plan marked as ${decision}.`);
      await fetchPlans();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pb-8 text-left select-none">
      {/* Header card */}
      <div className="nm-flat rounded-3xl p-5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full nm-inset-sm text-[10px] font-extrabold text-indigo-900 uppercase">
            HUMAN IN THE LOOP
          </span>
          <button
            onClick={() => {
              setCurrentRole('business_owner');
              setCurrentView('dashboard');
              showToast('Switched to Business Owner Mode');
            }}
            className="text-[10px] font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
          >
            Owner View →
          </button>
        </div>

        <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Expert Validation Queue</span>
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
        </h1>
        <p className="text-[11px] text-slate-600">
          Reviewing as <strong>{currentUser.name}</strong> ({currentUser.title})
        </p>

        {/* Tab pills */}
        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === 'pending' ? 'nm-inset-sm text-teal-900 font-extrabold border border-teal-400/40' : 'nm-btn text-slate-600'
            }`}
          >
            Pending ({pendingPlans.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === 'approved' ? 'nm-inset-sm text-teal-900 font-extrabold border border-teal-400/40' : 'nm-btn text-slate-600'
            }`}
          >
            Approved ({approvedPlans.length})
          </button>
          <button
            onClick={() => setActiveTab('revision')}
            className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              activeTab === 'revision' ? 'nm-inset-sm text-teal-900 font-extrabold border border-teal-400/40' : 'nm-btn text-slate-600'
            }`}
          >
            Revision ({revisionPlans.length})
          </button>
        </div>
      </div>

      {/* Plans selector */}
      <div className="space-y-2.5">
        {((activeTab === 'pending' ? pendingPlans : activeTab === 'approved' ? approvedPlans : revisionPlans)).map((p) => {
          const isSelected = selectedPlanForReview?.id === p.id;
          return (
            <div
              key={p.id}
              onClick={() => handleOpenReview(p)}
              className={`p-4 rounded-3xl transition-all cursor-pointer ${
                isSelected
                  ? 'nm-inset border border-indigo-400/50 text-indigo-950 font-bold'
                  : 'nm-flat text-slate-800 hover:nm-raised'
              }`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-500">{p.category}</span>
                <span className="font-extrabold text-indigo-800 nm-raised-xs px-2 py-0.5 rounded-full">{p.validationStatus}</span>
              </div>
              <h4 className="text-xs font-black mt-1 line-clamp-1">{p.recommendedAction}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">Trend: {p.trendName}</p>
            </div>
          );
        })}
      </div>

      {/* Review Form */}
      {selectedPlanForReview && (
        <div className="nm-flat rounded-3xl p-5 space-y-3.5 border-l-4 border-l-indigo-600">
          <div className="flex items-center justify-between pb-2 border-b border-[#d8e2ee]/60">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" />
              Expert Sign-Off Interface
            </h3>
            <span className="text-[10px] font-bold text-slate-400 font-mono">
              {selectedPlanForReview.id}
            </span>
          </div>

          <h4 className="text-sm font-black text-slate-900">
            {selectedPlanForReview.recommendedAction}
          </h4>

          {/* Decision Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDecision('APPROVED')}
              className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                decision === 'APPROVED' ? 'nm-btn-primary text-white' : 'nm-btn text-slate-700'
              }`}
            >
              Approve ✓
            </button>
            <button
              type="button"
              onClick={() => setDecision('NEEDS REVISION')}
              className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                decision === 'NEEDS REVISION' ? 'nm-inset-sm text-indigo-900' : 'nm-btn text-slate-700'
              }`}
            >
              Changes
            </button>
            <button
              type="button"
              onClick={() => setDecision('REJECTED')}
              className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                decision === 'REJECTED' ? 'nm-inset-sm text-rose-900' : 'nm-btn text-slate-700'
              }`}
            >
              Reject
            </button>
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 block">Expert Commentary:</label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs text-slate-800 p-3 rounded-2xl nm-inset-sm focus:outline-none resize-none"
            />
          </div>

          {/* Risk Note */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 block">Risk Guardrail:</label>
            <input
              type="text"
              value={riskNote}
              onChange={(e) => setRiskNote(e.target.value)}
              className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-2xl nm-inset-sm focus:outline-none"
            />
          </div>

          {/* Modification */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 block">Tactical Modification:</label>
            <input
              type="text"
              value={suggestedModification}
              onChange={(e) => setSuggestedModification(e.target.value)}
              className="w-full text-xs text-slate-800 px-3.5 py-2.5 rounded-2xl nm-inset-sm focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl nm-btn-primary text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
          >
            <Send className="w-3.5 h-3.5 text-white" />
            <span>{isSubmitting ? 'Signing off...' : `Submit Expert Decision (${decision})`}</span>
          </button>
        </div>
      )}
    </div>
  );
};
