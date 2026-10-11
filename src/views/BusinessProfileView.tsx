import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { DemoDataBadge } from '../components/DemoDataBadge';
import {
  Store,
  MapPin,
  Target,
  Sparkles,
  Save,
  CheckCircle2,
  Users,
  Compass,
  Building2,
  Tags,
} from 'lucide-react';

export const BusinessProfileView: React.FC = () => {
  const { businessProfile, setBusinessProfile, showToast, refreshData, setCurrentView } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(
    businessProfile || {
      name: '',
      category: '',
      country: '',
      state: '',
      city: '',
      localMarket: '',
      targetCustomers: '',
      productsServices: '',
      businessSize: '',
      channels: [],
      goals: [],
      preferredCategories: [],
    }
  );

  React.useEffect(() => {
    if (businessProfile) {
      setFormData(businessProfile);
    }
  }, [businessProfile]);

  const [isSaving, setIsSaving] = useState(false);

  const handleClear = () => {
    setFormData({
      name: '',
      category: '',
      country: '',
      state: '',
      city: '',
      localMarket: '',
      targetCustomers: '',
      productsServices: '',
      businessSize: '',
      channels: [],
      goals: [],
      preferredCategories: [],
    });
    showToast('All profile details emptied');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await api.updateBusinessProfile(formData);
      setBusinessProfile(updated);
      setIsEditing(false);
      showToast('Business Profile updated! Trend relevance scores recalculated.');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 pb-12 text-left select-none">
      {/* Top Banner */}
      <div className="nm-flat rounded-3xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Business Profile Context</span>
              <Store className="w-5 h-5 text-teal-600" />
            </h1>
            <DemoDataBadge compact />
          </div>
          <p className="text-xs text-slate-600">
            This profile is the permanent context engine. Every trend signal is filtered against these parameters.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
            isEditing
              ? 'nm-inset-sm text-slate-800'
              : 'nm-btn text-teal-900 hover:nm-raised-sm'
          }`}
        >
          {isEditing ? 'Cancel Editing' : 'Edit Profile Details'}
        </button>
      </div>

      {/* Form or View */}
      <form onSubmit={handleSave} className="nm-flat rounded-3xl p-5 sm:p-6 space-y-5">
        {/* Core Identity */}
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-[#d8e2ee]/60 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            Core Enterprise Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Business Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl nm-inset-sm text-xs font-semibold focus:outline-none"
                />
              ) : (
                <p className="text-sm font-black text-slate-900">{formData.name}</p>
              )}
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Primary Industry Category</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl nm-inset-sm text-xs font-semibold focus:outline-none"
                />
              ) : (
                <p className="text-sm font-extrabold text-teal-800">{formData.category}</p>
              )}
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Scale / Team Size</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.businessSize}
                  onChange={(e) => setFormData({ ...formData, businessSize: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl nm-inset-sm text-xs font-semibold focus:outline-none"
                />
              ) : (
                <p className="text-sm text-slate-700 font-medium">{formData.businessSize}</p>
              )}
            </div>
          </div>
        </div>

        {/* Location Intelligence (Section 18) */}
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 pb-2 border-b border-[#d8e2ee]/60 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            Location Intelligence Parameters (Demo Simulated)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Country</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              ) : (
                <p className="font-bold text-slate-800">{formData.country}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">State</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              ) : (
                <p className="font-bold text-slate-800">{formData.state}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">City / Municipality</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              ) : (
                <p className="font-bold text-slate-800">{formData.city}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Local Trade Corridor</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.localMarket}
                  onChange={(e) => setFormData({ ...formData, localMarket: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              ) : (
                <p className="font-bold text-teal-700">{formData.localMarket}</p>
              )}
            </div>
          </div>
        </div>

        {/* Audience & Products */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Target className="w-4 h-4 text-teal-600" />
            Target Customers & Core Offerings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Customer Profile</label>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={formData.targetCustomers}
                  onChange={(e) => setFormData({ ...formData, targetCustomers: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              ) : (
                <p className="text-slate-700 leading-relaxed font-medium">{formData.targetCustomers}</p>
              )}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Current Products & Services</label>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={formData.productsServices}
                  onChange={(e) => setFormData({ ...formData, productsServices: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              ) : (
                <p className="text-slate-700 leading-relaxed font-medium">{formData.productsServices}</p>
              )}
            </div>
          </div>
        </div>

        {/* Goals & Channels */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            Strategic Goals & Marketing Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Primary Growth Goals</label>
              <ul className="space-y-1.5">
                {formData.goals.map((g, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">Active Channels</label>
              <div className="flex flex-wrap gap-1.5">
                {formData.channels.map((ch, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-800 font-semibold rounded-lg text-xs">
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#d8e2ee]/60 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setCurrentView('process')}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl nm-btn text-teal-900 text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-teal-600" />
              <span>Launch Trend Journey →</span>
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3.5 py-2.5 rounded-2xl nm-btn text-rose-700 hover:text-rose-900 text-xs font-bold cursor-pointer"
              >
                Clear All Fields
              </button>
            )}
          </div>

          {isEditing && (
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 nm-btn-primary rounded-2xl text-xs font-extrabold cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Recalculating Models...' : 'Save & Update Context'}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
