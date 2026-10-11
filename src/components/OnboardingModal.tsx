import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { BusinessProfile } from '../types';
import {
  X,
  Store,
  MapPin,
  Target,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Building2,
  Users,
  Compass,
} from 'lucide-react';

const CATEGORIES = [
  'Food & Beverage',
  'Retail',
  'Fashion',
  'Beauty',
  'Education',
  'Technology',
  'Healthcare',
  'Local Services',
  'D2C',
  'E-commerce',
  'Hospitality',
  'Other',
];

const CHANNELS_OPTIONS = [
  'Instagram',
  'WhatsApp VIP Club',
  'Storefront Footfall',
  'Google Maps / Local SEO',
  'Facebook',
  'YouTube / Short Video',
  'Flyers / Campus Outreach',
  'Email Newsletter',
];

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, setBusinessProfile, showToast, setCurrentView } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: User
    ownerName: 'Rohit Deshmukh',
    email: 'rohit@freshbitecafe.in',
    password: '••••••••••••',
    // Step 2: Business Core
    name: 'FreshBite Café',
    category: 'Food & Beverage',
    country: 'India',
    state: 'Maharashtra',
    city: 'Sangamner',
    localMarket: 'College Road & Commercial Hub',
    businessSize: 'Small (6 team members)',
    // Target & Offering
    targetCustomers: 'Students and young professionals (18–32 yrs)',
    productsServices: 'Artisan sandwiches, specialty teas, cold brews, healthy bowls, bakery pastries',
    channels: ['Instagram', 'WhatsApp VIP Club', 'Storefront Footfall'],
    goals: [
      'Increase customer visits during afternoon & evening hours',
      'Introduce high-margin healthy product options',
      'Improve localized digital marketing and customer retention',
    ],
    preferredCategories: ['Food & Beverage', 'Retail', 'Local Services', 'D2C'],
  });

  const [newGoal, setNewGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOnboardingOpen) return null;

  const handleChannelToggle = (channel: string) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const handleCategoryToggle = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(cat)
        ? prev.preferredCategories.filter((c) => c !== cat)
        : [...prev.preferredCategories, cat],
    }));
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setFormData((prev) => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()],
      }));
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      const updated = await api.updateBusinessProfile({
        name: formData.name,
        category: formData.category,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        localMarket: formData.localMarket,
        businessSize: formData.businessSize,
        targetCustomers: formData.targetCustomers,
        productsServices: formData.productsServices,
        channels: formData.channels,
        goals: formData.goals,
        preferredCategories: formData.preferredCategories,
      });
      setBusinessProfile(updated);
      showToast('Business Profile created & connected to Trend Intelligence Engine!');
      setIsOnboardingOpen(false);
      setCurrentView('dashboard');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-left my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-extrabold text-xs">
              T→G
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Business Context Setup
              </h3>
              <p className="text-xs text-slate-400">
                Ground the Trend Intelligence Engine in your real-world business constraints
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className={`font-semibold flex items-center gap-1.5 ${step === 1 ? 'text-teal-700' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${step === 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'}`}>1</span>
              Account
            </span>
            <span className="text-slate-300">→</span>
            <span className={`font-semibold flex items-center gap-1.5 ${step === 2 ? 'text-teal-700' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${step === 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'}`}>2</span>
              Business Details
            </span>
            <span className="text-slate-300">→</span>
            <span className={`font-semibold flex items-center gap-1.5 ${step === 3 ? 'text-teal-700' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${step === 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'}`}>3</span>
              Goals & Context
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">Step {step} of 3</span>
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-4">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="text-sm font-bold text-slate-800">Step 1: Account Credentials</h4>
              <p className="text-xs text-slate-500">
                Create or manage your secure business login. Integrated with Supabase Auth.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name / Founder
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  Demo Mode has pre-loaded <strong>FreshBite Café</strong> (Sangamner, Maharashtra). You can customize it or keep defaults.
                </span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="text-sm font-bold text-slate-800">Step 2: Business Information</h4>
              <p className="text-xs text-slate-500">
                This data forms the primary context for the Trend-Business matching algorithms.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Team Size</label>
                  <input
                    type="text"
                    value={formData.businessSize}
                    onChange={(e) => setFormData({ ...formData, businessSize: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Local Market / Neighborhood
                </label>
                <input
                  type="text"
                  value={formData.localMarket}
                  onChange={(e) => setFormData({ ...formData, localMarket: e.target.value })}
                  placeholder="e.g. College Road & Commercial Hub"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Customers
                </label>
                <input
                  type="text"
                  value={formData.targetCustomers}
                  onChange={(e) => setFormData({ ...formData, targetCustomers: e.target.value })}
                  placeholder="e.g. Students and young professionals (18–32 yrs)"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Core Products & Services Offered
                </label>
                <textarea
                  value={formData.productsServices}
                  onChange={(e) => setFormData({ ...formData, productsServices: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="text-sm font-bold text-slate-800">Step 3: Marketing Channels & Goals</h4>
              <p className="text-xs text-slate-500">
                Actionable plans will leverage these channels and address your stated objectives.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Current Marketing Channels
                </label>
                <div className="flex flex-wrap gap-2">
                  {CHANNELS_OPTIONS.map((ch) => {
                    const isSelected = formData.channels.includes(ch);
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => handleChannelToggle(ch)}
                        className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-700 font-semibold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {ch}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Business Goals
                </label>
                <div className="space-y-2 mb-2">
                  {formData.goals.map((g, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-slate-800">{g}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(idx)}
                        className="text-slate-400 hover:text-rose-600 text-xs font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Add a business goal (e.g. Increase repeat frequency)"
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddGoal();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddGoal}
                    className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Preferred Trend Discovery Categories
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const isPref = formData.preferredCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryToggle(cat)}
                        className={`px-2 py-0.5 text-[11px] rounded-md border transition-colors cursor-pointer ${
                          isPref
                            ? 'bg-slate-900 text-teal-400 border-slate-900 font-semibold'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg bg-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((prev) => (prev + 1) as any)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-teal-200" />
              <span>{isSubmitting ? 'Connecting...' : 'Activate Business Profile'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
