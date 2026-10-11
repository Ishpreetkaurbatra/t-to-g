-- ==============================================================================
-- T→G — TREND TO GROWTH
-- Production Supabase PostgreSQL Schema with Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES
CREATE TYPE user_role AS ENUM ('business_owner', 'expert', 'admin');

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE, -- References auth.users(id) in Supabase Auth
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'business_owner',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. BUSINESSES
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  local_market TEXT,
  business_size TEXT DEFAULT 'Small (1-10)',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. BUSINESS PROFILES
CREATE TABLE IF NOT EXISTS business_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
  target_customers TEXT NOT NULL,
  products_services TEXT NOT NULL,
  channels TEXT[] DEFAULT '{}',
  goals TEXT[] DEFAULT '{}',
  preferred_categories TEXT[] DEFAULT '{}',
  annual_revenue_bracket TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TREND SOURCES
CREATE TABLE IF NOT EXISTS trend_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_type TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  scan_frequency TEXT DEFAULT 'Daily',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TRENDS
CREATE TYPE trend_momentum AS ENUM ('Rising', 'Stable', 'Declining');

CREATE TABLE IF NOT EXISTS trends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES trend_sources(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category_name TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT,
  location TEXT NOT NULL,
  confidence INTEGER NOT NULL CHECK (confidence BETWEEN 0 AND 100),
  momentum trend_momentum NOT NULL DEFAULT 'Rising',
  growth_rate TEXT,
  audience TEXT,
  description TEXT NOT NULL,
  drivers TEXT[] DEFAULT '{}',
  is_demo_data BOOLEAN NOT NULL DEFAULT TRUE,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TREND ANALYSES (GEMINI REASONING LAYER)
CREATE TABLE IF NOT EXISTS trend_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trend_id UUID NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  drivers TEXT[] DEFAULT '{}',
  target_audience TEXT[] DEFAULT '{}',
  business_relevance INTEGER NOT NULL,
  opportunity_score INTEGER NOT NULL,
  market_risk TEXT,
  competition_risk TEXT,
  adoption_risk TEXT,
  execution_risk TEXT,
  business_opportunity TEXT,
  recommended_actions TEXT[] DEFAULT '{}',
  ai_model TEXT DEFAULT 'gemini-3.8-flash',
  confidence INTEGER DEFAULT 90,
  raw_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. BUSINESS MATCHES & OPPORTUNITY SCORES
CREATE TABLE IF NOT EXISTS business_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  trend_id UUID NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  relevance_score INTEGER NOT NULL,
  opportunity_score INTEGER NOT NULL,
  customer_match_score INTEGER NOT NULL,
  market_timing_score INTEGER NOT NULL,
  risk_penalty INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(business_id, trend_id)
);

-- 9. SMART TREND ALERTS
CREATE TABLE IF NOT EXISTS smart_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  trend_id UUID NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  urgency TEXT NOT NULL DEFAULT 'HIGH',
  business_fit INTEGER NOT NULL,
  potential TEXT NOT NULL DEFAULT 'HIGH',
  headline TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  recommended_next_step TEXT NOT NULL,
  dismissed BOOLEAN NOT NULL DEFAULT FALSE,
  saved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ACTION PLANS
CREATE TYPE plan_validation_status AS ENUM (
  'AI GENERATED',
  'PENDING EXPERT REVIEW',
  'APPROVED',
  'NEEDS REVISION',
  'REJECTED'
);

CREATE TABLE IF NOT EXISTS action_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  trend_id UUID REFERENCES trends(id) ON DELETE SET NULL,
  trend_name TEXT NOT NULL,
  category TEXT NOT NULL,
  objective TEXT NOT NULL,
  why_this_trend TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  target_customer TEXT NOT NULL,
  product_service_idea TEXT NOT NULL,
  marketing_approach TEXT NOT NULL,
  channel TEXT NOT NULL,
  pilot TEXT NOT NULL,
  timeline TEXT NOT NULL,
  estimated_effort TEXT NOT NULL DEFAULT 'Medium',
  expected_opportunity TEXT NOT NULL DEFAULT 'High',
  risks TEXT[] DEFAULT '{}',
  success_metrics TEXT[] DEFAULT '{}',
  test_hypothesis TEXT NOT NULL,
  measure_metrics TEXT NOT NULL,
  learn_protocol TEXT NOT NULL,
  adapt_strategy TEXT NOT NULL,
  validation_status plan_validation_status NOT NULL DEFAULT 'PENDING EXPERT REVIEW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. EXPERT REVIEWS
CREATE TABLE IF NOT EXISTS expert_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_plan_id UUID NOT NULL REFERENCES action_plans(id) ON DELETE CASCADE,
  expert_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  decision TEXT NOT NULL CHECK (decision IN ('APPROVED', 'NEEDS REVISION', 'REJECTED')),
  comment TEXT NOT NULL,
  risk_note TEXT,
  suggested_modification TEXT,
  confidence INTEGER NOT NULL CHECK (confidence BETWEEN 0 AND 100),
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. EXPERIMENTS (TEST → MEASURE → LEARN → ADAPT)
CREATE TYPE experiment_status AS ENUM ('Planned', 'Running', 'Completed', 'Paused');

CREATE TABLE IF NOT EXISTS experiments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  action_plan_id UUID REFERENCES action_plans(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  trend_name TEXT NOT NULL,
  objective TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  action TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget TEXT,
  success_metric TEXT NOT NULL,
  status experiment_status NOT NULL DEFAULT 'Planned',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. EXPERIMENT RESULTS
CREATE TABLE IF NOT EXISTS experiment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_id UUID NOT NULL UNIQUE REFERENCES experiments(id) ON DELETE CASCADE,
  what_happened TEXT NOT NULL,
  what_worked TEXT NOT NULL,
  what_failed TEXT NOT NULL,
  what_should_change TEXT NOT NULL,
  adapt_action TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. SAVED TRENDS
CREATE TABLE IF NOT EXISTS saved_trends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  trend_id UUID NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(business_id, trend_id)
);

-- 15. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'alert',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE trends ENABLE ROW LEVEL SECURITY;

-- Trends: Public read for all authenticated users
CREATE POLICY "Allow authenticated read trends" ON trends
  FOR SELECT TO authenticated USING (true);

-- Businesses: Owner can manage their business, Admins can view all
CREATE POLICY "Owners can manage own business" ON businesses
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE users.auth_user_id = auth.uid() AND users.role = 'admin'
  ));

-- Action plans: Business owners can read/create, Experts can read and update review status
CREATE POLICY "Owners manage action plans" ON action_plans
  FOR ALL TO authenticated
  USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM users WHERE users.auth_user_id = auth.uid() AND users.role IN ('expert', 'admin')
    )
  );

-- Expert reviews: Experts can insert/update, Owners can read their own
CREATE POLICY "Experts submit reviews" ON expert_reviews
  FOR ALL TO authenticated
  USING (
    expert_id IN (SELECT id FROM users WHERE auth_user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM users WHERE users.auth_user_id = auth.uid() AND users.role IN ('business_owner', 'admin')
    )
  );

-- Experiments: Business owners manage their experiments
CREATE POLICY "Owners manage experiments" ON experiments
  FOR ALL TO authenticated
  USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM users WHERE users.auth_user_id = auth.uid() AND users.role = 'admin'
    )
  );
