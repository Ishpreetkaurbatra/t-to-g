import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, User, BusinessProfile, SmartAlert } from '../types';
import { api } from '../services/api';

export type AppView =
  | 'landing'
  | 'process'
  | 'dashboard'
  | 'trend-feed'
  | 'trend-detail'
  | 'smart-alerts'
  | 'opportunities'
  | 'action-plans'
  | 'expert-dashboard'
  | 'experiments'
  | 'analytics'
  | 'business-profile'
  | 'trend-sources'
  | 'admin'
  | 'settings';

export interface JudgeStep {
  step: number;
  title: string;
  description: string;
  actionText: string;
  targetView: AppView;
  targetRole?: UserRole;
  meta?: any;
}

export const JUDGE_STEPS: JudgeStep[] = [
  {
    step: 1,
    title: 'Select Demo Business: FreshBite Café',
    description: 'Start with FreshBite Café — a vibrant local café in Sangamner, Maharashtra catering to college students & young professionals.',
    actionText: 'View Business Profile',
    targetView: 'business-profile',
    targetRole: 'business_owner',
  },
  {
    step: 2,
    title: 'Examine Business Context & Constraints',
    description: 'The T→G Intelligence Engine anchors every trend against this specific location, target customer, and business goals.',
    actionText: 'Explore Trend Feed',
    targetView: 'trend-feed',
    targetRole: 'business_owner',
  },
  {
    step: 3,
    title: 'Review Curated Trend Feed',
    description: 'Browse 22+ emerging signals across F&B, Retail, and Local Services with real momentum and geo-relevance metrics.',
    actionText: 'Select Top Trend (Plant-Based Snacks)',
    targetView: 'trend-detail',
    targetRole: 'business_owner',
    meta: { trendId: 'tr-01' },
  },
  {
    step: 4,
    title: '10-Point Trend Analyzer Engine',
    description: 'See the deep breakdown: What is happening, why it is rising, audience breakdown, and local growth trajectory.',
    actionText: 'Analyze Business Fit',
    targetView: 'trend-detail',
    targetRole: 'business_owner',
    meta: { trendId: 'tr-01' },
  },
  {
    step: 5,
    title: 'Business Relevance & Risk Matrix',
    description: 'Compare trend with FreshBite Café: 92% fit, risk analysis across market, competition, adoption, and execution.',
    actionText: 'Review Action Plan',
    targetView: 'trend-detail',
    targetRole: 'business_owner',
    meta: { trendId: 'tr-01' },
  },
  {
    step: 6,
    title: 'Innovative Actionable Plan Generation',
    description: 'Structured proposal: 14-day small pilot, counter pricing, specific marketing hook, and Test-Measure-Learn-Adapt loop.',
    actionText: 'Submit for Human Expert Review',
    targetView: 'action-plans',
    targetRole: 'business_owner',
  },
  {
    step: 7,
    title: 'AI Generated → Pending Expert Validation',
    description: 'T→G never presents raw AI outputs as final advice. The plan enters the Human Expert Validation queue.',
    actionText: 'Switch to Expert Dashboard',
    targetView: 'expert-dashboard',
    targetRole: 'expert',
  },
  {
    step: 8,
    title: 'Human Expert Review Portal',
    description: 'Industry veterans review the business context, risk notes, and modify unit economics before sign-off.',
    actionText: 'Validate & Approve Plan',
    targetView: 'expert-dashboard',
    targetRole: 'expert',
  },
  {
    step: 9,
    title: 'Approved with Expert Commentary',
    description: 'Chef Arjun Mehta validates margins, adds transparent jar display advice, and certifies the strategy.',
    actionText: 'Return to Business Owner Dashboard',
    targetView: 'dashboard',
    targetRole: 'business_owner',
  },
  {
    step: 10,
    title: 'Business Dashboard with Validated Badge',
    description: 'Observe the certified "✓ HUMAN EXPERT VALIDATED" badge, smart alerts, and opportunity rankings.',
    actionText: 'Inspect Smart Trend Alerts',
    targetView: 'smart-alerts',
    targetRole: 'business_owner',
  },
  {
    step: 11,
    title: 'Smart Trend Alerts Engine',
    description: 'Proactive alerts notify the owner when regional momentum spikes and crosses the 85%+ relevance threshold.',
    actionText: 'Review Opportunities & Scoring',
    targetView: 'opportunities',
    targetRole: 'business_owner',
  },
  {
    step: 12,
    title: 'Opportunity Scoring Engine',
    description: 'Mathematical formula: Momentum + Business Relevance + Customer Match + Market Timing - Risk Penalty.',
    actionText: 'Launch Live Experiment',
    targetView: 'experiments',
    targetRole: 'business_owner',
  },
  {
    step: 13,
    title: 'Test → Measure → Learn → Adapt Loop',
    description: 'Track the 14-day pilot: hypothesis, budget (₹4,500), sell-through metrics, and iterative learning results.',
    actionText: 'View Growth Analytics',
    targetView: 'analytics',
    targetRole: 'business_owner',
  },
  {
    step: 14,
    title: 'Complete Growth & Validation Analytics',
    description: 'Monitor validation rates, category distribution, experiment ROI, and business transformation over time.',
    actionText: 'Finish Judge Walkthrough',
    targetView: 'dashboard',
    targetRole: 'business_owner',
  },
];

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;
  businessProfile: BusinessProfile | null;
  setBusinessProfile: (profile: BusinessProfile) => void;
  selectedTrendId: string | null;
  setSelectedTrendId: (id: string | null) => void;
  activeAlerts: SmartAlert[];
  dismissAlert: (id: string) => Promise<void>;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isJudgeModeActive: boolean;
  setIsJudgeModeActive: (active: boolean) => void;
  currentJudgeStepIndex: number;
  advanceJudgeStep: () => void;
  prevJudgeStep: () => void;
  resetJudgeDemo: () => Promise<void>;
  jumpToJudgeStep: (stepNumber: number) => void;
  // Process / Trend Journey Mode
  isProcessMode: boolean;
  setIsProcessMode: (active: boolean) => void;
  processStep: number;
  setProcessStep: (step: number) => void;
  advanceProcessStep: () => void;
  prevProcessStep: () => void;
  resetProcessJourney: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('process');
  const [currentRole, setCurrentRole] = useState<UserRole>('business_owner');
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [selectedTrendId, setSelectedTrendId] = useState<string | null>('tr-01');
  const [activeAlerts, setActiveAlerts] = useState<SmartAlert[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isJudgeModeActive, setIsJudgeModeActive] = useState<boolean>(false);
  const [currentJudgeStepIndex, setCurrentJudgeStepIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Guided Process Journey Mode (Starts with profile details then trend discovery)
  const [isProcessMode, setIsProcessMode] = useState<boolean>(true);
  const [processStep, setProcessStep] = useState<number>(1);

  const currentUser: User = {
    id: currentRole === 'business_owner' ? 'usr-rohit' : currentRole === 'expert' ? 'usr-chef-arjun' : 'usr-admin-tg',
    name: currentRole === 'business_owner' ? 'Rohit Deshmukh (FreshBite Café)' : currentRole === 'expert' ? 'Chef Arjun Mehta' : 'T→G Admin Console',
    email: currentRole === 'business_owner' ? 'rohit@freshbitecafe.in' : currentRole === 'expert' ? 'arjun@hospitalitygrowth.com' : 'admin@trendtogrowth.com',
    role: currentRole,
    title: currentRole === 'business_owner' ? 'Founder & Managing Partner' : currentRole === 'expert' ? 'Senior Hospitality & F&B Advisor' : 'Platform Operations Director',
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const refreshData = async () => {
    try {
      const [profile, alerts] = await Promise.all([
        api.getBusinessProfile(),
        api.getAlerts(),
      ]);
      setBusinessProfile(profile);
      setActiveAlerts(alerts);
    } catch (e) {
      console.warn('Error refreshing initial data:', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const dismissAlert = async (id: string) => {
    await api.dismissAlert(id);
    setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Alert dismissed');
  };

  const jumpToJudgeStep = (stepNumber: number) => {
    const idx = stepNumber - 1;
    if (idx >= 0 && idx < JUDGE_STEPS.length) {
      setCurrentJudgeStepIndex(idx);
      const step = JUDGE_STEPS[idx];
      setCurrentView(step.targetView);
      if (step.targetRole) {
        setCurrentRole(step.targetRole);
      }
      if (step.meta?.trendId) {
        setSelectedTrendId(step.meta.trendId);
      }
    }
  };

  const advanceJudgeStep = () => {
    if (currentJudgeStepIndex < JUDGE_STEPS.length - 1) {
      jumpToJudgeStep(currentJudgeStepIndex + 2);
    } else {
      showToast('Judge Walkthrough completed! You can reset or explore freely.');
    }
  };

  const prevJudgeStep = () => {
    if (currentJudgeStepIndex > 0) {
      jumpToJudgeStep(currentJudgeStepIndex);
    }
  };

  const resetJudgeDemo = async () => {
    await api.resetDemo();
    await refreshData();
    setCurrentJudgeStepIndex(0);
    setCurrentRole('business_owner');
    setSelectedTrendId('tr-01');
    setCurrentView('dashboard');
    showToast('Demo environment reset to FreshBite Café baseline.');
  };

  const advanceProcessStep = () => {
    if (processStep < 5) {
      setProcessStep(processStep + 1);
    } else {
      showToast('Process completed! You can explore all modules or start a new hunt.');
    }
  };

  const prevProcessStep = () => {
    if (processStep > 1) {
      setProcessStep(processStep - 1);
    }
  };

  const resetProcessJourney = async () => {
    await api.resetDemo();
    await refreshData();
    setProcessStep(1);
    setIsProcessMode(true);
    setCurrentRole('business_owner');
    setSelectedTrendId('tr-01');
    showToast('Reset to Step 1: Profile Details.');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentRole,
        setCurrentRole,
        currentUser,
        businessProfile,
        setBusinessProfile,
        selectedTrendId,
        setSelectedTrendId,
        activeAlerts,
        dismissAlert,
        isSearchOpen,
        setIsSearchOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isJudgeModeActive,
        setIsJudgeModeActive,
        currentJudgeStepIndex,
        advanceJudgeStep,
        prevJudgeStep,
        resetJudgeDemo,
        jumpToJudgeStep,
        isProcessMode,
        setIsProcessMode,
        processStep,
        setProcessStep,
        advanceProcessStep,
        prevProcessStep,
        resetProcessJourney,
        toastMessage,
        showToast,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
